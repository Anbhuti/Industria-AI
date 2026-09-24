import { GoogleGenAI } from '@google/genai';
import { dbService, DbNovaConversation, DbNovaMessage } from './db.ts';
import { NovaToolsEngine, IndustrialToolContext, resolveMachineId } from './novaTools.ts';
import { novaFunctionDeclarations } from './geminiTools.ts';

// Configurable model selection with high-availability defaults
const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const SECONDARY_MODEL = process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.8-flash';

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

export interface ChatRequestPayload {
  message: string;
  conversationId?: string;
  context?: {
    currentPage?: string;
    selectedMachine?: string;
    selectedIncident?: string;
    selectedInvestigation?: string;
    selectedTimeRange?: string;
    plantStatus?: any;
    userName?: string;
    workspaceId?: string;
    currentPlant?: any;
  };
}

export interface ChatResponsePayload {
  reply: string;
  conversationId: string;
  messageId: string;
  toolsUsed: string[];
  dataSources?: any;
  actionTaken?: string;
  targetRoute?: string;
  targetMachineId?: string;
  openReportModal?: boolean;
  source: string;
  statusNotice?: string;
  geminiRetries?: number;
}

/**
 * Checks if a Gemini API failure is a transient outage (503, 429, 500, UNAVAILABLE, etc.)
 */
function isTransientGeminiError(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || '').toLowerCase();
  const status = err.status || err.statusCode || err.code;

  return (
    status === 503 ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 504 ||
    msg.includes('503') ||
    msg.includes('429') ||
    msg.includes('500') ||
    msg.includes('unavailable') ||
    msg.includes('resource_exhausted') ||
    msg.includes('high demand') ||
    msg.includes('rate limit') ||
    msg.includes('quota') ||
    msg.includes('overloaded') ||
    msg.includes('econnreset') ||
    msg.includes('etimedout')
  );
}

/**
 * Executes a Gemini model call with exponential backoff:
 * Attempt 1 -> 1s wait
 * Attempt 2 -> 2s wait
 * Attempt 3 -> 4s wait
 */
async function callGeminiWithRetry(
  client: GoogleGenAI,
  model: string,
  params: any,
  requestType = 'function_calling'
): Promise<{ response: any; attempts: number }> {
  const retryDelays = [1000, 2000, 4000];
  const maxRetries = 3;
  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await client.models.generateContent({
        ...params,
        model
      });
      return { response, attempts: attempt + 1 };
    } catch (err: any) {
      lastError = err;
      const statusCode = err.status || err.statusCode || (err.message?.match(/\b(503|429|500|502|504)\b/)?.[0]) || 'UNAVAILABLE';
      const reason = err.message || 'Gemini API Error';

      console.warn(`[NOVA GEMINI LOG] status=${statusCode} | model=${model} | request=${requestType} | attempt=${attempt + 1}/${maxRetries + 1} | reason=${reason}`);

      if (attempt < maxRetries && isTransientGeminiError(err)) {
        const delayMs = retryDelays[attempt] || 4000;
        console.log(`[NOVA BACKOFF] Retrying Gemini in ${delayMs}ms (Attempt ${attempt + 2})...`);
        await new Promise(res => setTimeout(res, delayMs));
      } else {
        break;
      }
    }
  }

  throw lastError;
}

export class NovaChatService {
  /**
   * Main entrypoint: Processes multi-turn user message with Gemini function calling and tool execution.
   * Resilient to 503/429/5xx temporary Gemini outages via exponential backoff and real data-engine fallback.
   */
  public static async processMessage(
    payload: ChatRequestPayload,
    userId: string,
    workspaceId: string
  ): Promise<ChatResponsePayload> {
    const rawMessage = payload.message?.trim() || '';
    if (!rawMessage) {
      throw new Error('Message cannot be empty.');
    }

    const clientContext = payload.context || {};
    const machines = dbService.getMachines(workspaceId);
    const plants = dbService.getPlants(workspaceId);
    const activePlant = plants.find(p => p.id === clientContext.currentPlant?.id) || plants[0];
    const plantId = activePlant?.id || 'lucknow-mf';

    // 1. Resolve or Create Conversation
    let conversation: DbNovaConversation | undefined;
    if (payload.conversationId) {
      conversation = dbService.getNovaConversation(payload.conversationId);
    }

    if (!conversation) {
      conversation = dbService.createNovaConversation({
        userId,
        workspaceId,
        plantId,
        title: rawMessage.slice(0, 48) + (rawMessage.length > 48 ? '...' : ''),
        selectedMachineId: clientContext.selectedMachine || 'C-204',
        selectedIncidentId: clientContext.selectedIncident || 'INC-7041',
        selectedInvestigationId: clientContext.selectedInvestigation || 'INV-2048'
      });
    }

    // 2. Save User Message
    dbService.addNovaMessage({
      conversationId: conversation.id,
      userId,
      role: 'user',
      content: rawMessage,
      contextSnapshot: {
        currentPage: clientContext.currentPage || '/nova',
        selectedMachine: clientContext.selectedMachine,
        selectedIncident: clientContext.selectedIncident,
        timestamp: new Date().toISOString()
      }
    });

    // 3. Build Tool Execution Context
    const toolContext: IndustrialToolContext = {
      workspaceId,
      userId,
      plantId,
      currentPage: clientContext.currentPage || '/nova',
      selectedMachineId: clientContext.selectedMachine || conversation.selectedMachineId || 'C-204',
      selectedIncidentId: clientContext.selectedIncident || conversation.selectedIncidentId || 'INC-7041',
      selectedInvestigationId: clientContext.selectedInvestigation || conversation.selectedInvestigationId || 'INV-2048',
      selectedTimeRange: clientContext.selectedTimeRange || '1h',
      userContext: {
        currentUser: { name: clientContext.userName || 'Lead Diagnostic Engineer' },
        currentPlant: activePlant
      }
    };

    // 4. Fetch Multi-Turn Message History
    const pastMessages = dbService.getNovaMessages(conversation.id);
    const historySlice = pastMessages.slice(-12);

    // 5. Build System Instruction
    const systemInstruction = `You are NOVA, the world-class Industrial Artificial Intelligence Copilot and Rotating Equipment Reliability Specialist deployed inside INDUSTRIX AI.
Your user is an industrial operations specialist / reliability engineer (${clientContext.userName || 'Lead Diagnostic Engineer'}).
Your user is currently at workspace "${dbService.getWorkspace(workspaceId)?.name || 'Default Workspace'}" on page "${clientContext.currentPage || '/nova'}".
The currently focused machine is "${toolContext.selectedMachineId}", and active incident is "${toolContext.selectedIncidentId}".

CRITICAL OPERATIONAL RULES:
1. REAL DATA RETRIEVAL (NO HALLUCINATIONS):
   - You MUST call application tools to retrieve plant status, machine telemetry, thresholds, health, risk, incidents, or investigations.
   - NEVER invent or guess telemetry values (e.g. vibration RMS, bearing temperatures, pressures), thresholds, health scores, or incident details.
   - If required data does not exist in the workspace, explicitly state: "I don't have enough data in the current workspace to answer that accurately."
2. FOLLOW-UP AND PRONOUN RESOLUTION:
   - When the user asks "Why?", "Is that dangerous?", "What was it one hour ago?", "Has it increased?", understand that pronouns ("it", "that", "this") refer to the machine, metric, or incident discussed in the immediate previous turn.
3. DATA CALCULATIONS:
   - Perform real calculations from application data (e.g. healthy machines percentage = healthy / total * 100, vibration delta = current - past, margin to trip = critical threshold - current reading).
4. ROOT CAUSE ANALYSIS STRUCTURE:
   When explaining an alert or investigation, structure the response clearly:
   - Current Situation
   - Evidence
   - Likely Cause
   - Evidence Strength
   - Recommended Next Step
5. SIMULATED SCADA NOTICE:
   - The application monitors simulated SCADA telemetry. Explicitly identify that telemetry values represent simulated industrial data.
6. GENERAL INDUSTRIAL KNOWLEDGE:
   - For general questions (e.g. "What is predictive maintenance?", "What is vibration RMS?", "How does condition monitoring work?"), answer with comprehensive industrial engineering rigor.
7. ACTION DIRECTIVES:
   - When appropriate, instruct navigation to pages using the navigateTo tool.`;

    const toolsUsed: string[] = [];
    const toolResults: Record<string, any> = {};
    let finalAnswer = '';
    let actionTaken: string | undefined;
    let targetRoute: string | undefined;
    let targetMachineId: string | undefined;
    let openReportModal: boolean | undefined;
    let usedGemini = false;
    let geminiRetriesCount = 0;
    let statusNotice: string | undefined;

    // 6. Attempt Gemini Function Calling Loop with Exponential Backoff
    const client = getGeminiClient();
    if (client) {
      const modelsToTry = [PRIMARY_MODEL];
      if (SECONDARY_MODEL && SECONDARY_MODEL !== PRIMARY_MODEL) {
        modelsToTry.push(SECONDARY_MODEL);
      }

      for (const currentModel of modelsToTry) {
        if (finalAnswer) break;

        try {
          // Build contents array
          const contents: any[] = [];
          for (const m of historySlice) {
            contents.push({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }]
            });
          }

          // Initial Gemini call with exponential retry
          const initialResult = await callGeminiWithRetry(
            client,
            currentModel,
            {
              contents,
              config: {
                systemInstruction,
                temperature: 0.2,
                tools: [{ functionDeclarations: novaFunctionDeclarations }]
              }
            },
            'initial_query'
          );

          geminiRetriesCount = initialResult.attempts;
          let currentResponse = initialResult.response;

          // Tool execution loop (up to 4 sequential tool turns)
          let iterations = 0;
          while (currentResponse.functionCalls && currentResponse.functionCalls.length > 0 && iterations < 4) {
            iterations++;
            const calls = currentResponse.functionCalls;

            if (currentResponse.candidates?.[0]?.content) {
              contents.push(currentResponse.candidates[0].content);
            }

            const responseParts: any[] = [];
            for (const call of calls) {
              const toolName = call.name || 'unknownTool';
              if (!toolsUsed.includes(toolName)) toolsUsed.push(toolName);
              const execResult = NovaToolsEngine.executeTool(toolName, (call.args as any) || {}, toolContext);
              toolResults[toolName] = execResult.data || execResult.error;

              if (toolName === 'navigateTo' && execResult.data) {
                actionTaken = 'navigate';
                targetRoute = execResult.data.targetRoute;
                targetMachineId = execResult.data.targetEntityId;
              }

              responseParts.push({
                functionResponse: {
                  name: toolName,
                  response: execResult.success ? execResult.data : { error: execResult.error },
                  id: call.id
                }
              });
            }

            contents.push({
              role: 'user',
              parts: responseParts
            });

            // Follow-up synthesis call with retry
            const nextResult = await callGeminiWithRetry(
              client,
              currentModel,
              {
                contents,
                config: {
                  systemInstruction,
                  temperature: 0.2,
                  tools: [{ functionDeclarations: novaFunctionDeclarations }]
                }
              },
              'tool_synthesis'
            );
            currentResponse = nextResult.response;
          }

          if (currentResponse.text) {
            finalAnswer = currentResponse.text;
            usedGemini = true;
            break;
          }
        } catch (err: any) {
          const code = err?.status || err?.statusCode || 'ERR';
          console.warn(`[NOVA FAILOVER] Model ${currentModel} exhausted retries (${code}): ${err?.message}. Evaluating next path...`);
        }
      }
    }

    // 7. Grounded Real Data Engine Fallback (when Gemini is 503/offline/exhausted)
    if (!finalAnswer) {
      statusNotice = 'Gemini is temporarily unavailable. NOVA can still answer supported data queries using the industrial data engine.';
      const synthesis = this.executeDirectToolSynthesis(rawMessage, toolContext, historySlice);
      finalAnswer = synthesis.answer;

      if (synthesis.toolsUsed) {
        for (const t of synthesis.toolsUsed) {
          if (!toolsUsed.includes(t)) toolsUsed.push(t);
        }
      }
      if (synthesis.toolResults) {
        Object.assign(toolResults, synthesis.toolResults);
      }
      if (synthesis.actionTaken) actionTaken = synthesis.actionTaken;
      if (synthesis.targetRoute) targetRoute = synthesis.targetRoute;
      if (synthesis.targetMachineId) targetMachineId = synthesis.targetMachineId;
      if (synthesis.openReportModal) openReportModal = synthesis.openReportModal;
    }

    // 8. Save Assistant Response to Persistent Database
    const assistantMsg = dbService.addNovaMessage({
      conversationId: conversation.id,
      userId,
      role: 'assistant',
      content: finalAnswer,
      toolsUsed,
      contextSnapshot: {
        toolsUsed,
        toolResultsSummary: Object.keys(toolResults),
        source: usedGemini ? PRIMARY_MODEL : 'industrix-data-engine',
        geminiRetriesCount,
        statusNotice
      },
      metadata: {
        actionTaken,
        targetRoute,
        targetMachineId,
        openReportModal
      }
    });

    // 9. Update Conversation context
    if (targetMachineId) {
      dbService.updateNovaConversation(conversation.id, { selectedMachineId: targetMachineId });
    }

    return {
      reply: finalAnswer,
      conversationId: conversation.id,
      messageId: assistantMsg.id,
      toolsUsed,
      dataSources: toolResults,
      actionTaken,
      targetRoute,
      targetMachineId,
      openReportModal,
      source: usedGemini ? PRIMARY_MODEL : 'industrix-data-engine',
      statusNotice,
      geminiRetries: geminiRetriesCount
    };
  }

  /**
   * Deterministic Real Data Engine:
   * Maps natural language questions and multi-turn follow-ups to exact application tools,
   * performs actual calculations from live database state, and formats structured responses.
   * If intent cannot be confidently determined, returns an honest unavailable response (never fakes reasoning).
   */
  public static executeDirectToolSynthesis(
    message: string,
    ctx: IndustrialToolContext,
    history: DbNovaMessage[]
  ): {
    answer: string;
    toolsUsed: string[];
    toolResults: Record<string, any>;
    actionTaken?: string;
    targetRoute?: string;
    targetMachineId?: string;
    openReportModal?: boolean;
    isConfidenceDetermined: boolean;
  } {
    const lower = message.toLowerCase().trim();
    const toolsUsed: string[] = [];
    const toolResults: Record<string, any> = {};

    // Check previous turns for follow-ups
    const lastUserMsg = history.filter(h => h.role === 'user').slice(-2, -1)[0]?.content.toLowerCase() || '';
    const lastAssistantMsg = history.filter(h => h.role === 'assistant').slice(-1)[0]?.content || '';

    const machines = dbService.getMachines(ctx.workspaceId);
    let targetMachine = resolveMachineId(lower, machines) || resolveMachineId(ctx.selectedMachineId, machines);

    // Follow-up resolution
    if (!resolveMachineId(lower, machines)) {
      const matchInHistory = resolveMachineId(lastUserMsg, machines) || resolveMachineId(lastAssistantMsg, machines);
      if (matchInHistory) targetMachine = matchInHistory;
    }

    // -------------------------------------------------------------
    // Intent 1: "How many machines are at risk?"
    // -------------------------------------------------------------
    if (
      lower.includes('how many machines are at risk') ||
      lower.includes('machines at risk') ||
      lower.includes('number of machines at risk') ||
      lower.includes('count of high risk') ||
      lower.includes('machines are high risk')
    ) {
      toolsUsed.push('getHighRiskMachines');
      const res = NovaToolsEngine.executeTool('getHighRiskMachines', {}, ctx);
      toolResults.getHighRiskMachines = res.data;
      const count = res.data.count;
      const list = res.data.machines.slice(0, 10).map((m: any) => 
        `• **${m.name} (${m.id})**: Health ${m.healthScore}/100, Vibration ${m.vibrationRMS || 'N/A'} mm/s, Status: ${m.status.toUpperCase()}`
      ).join('\n');

      return {
        answer: `Based on the simulated SCADA telemetry currently available in your workspace, **${count} machines** are currently classified as high risk:\n\n${list}${res.data.machines.length > 10 ? `\n• *...and ${res.data.machines.length - 10} additional units flagged.*` : ''}\n\nWould you like me to open the detail page for any of these units or begin a root cause investigation?`,
        toolsUsed,
        toolResults,
        isConfidenceDetermined: true
      };
    }

    // -------------------------------------------------------------
    // Intent 2: "Which machine has the highest vibration?"
    // -------------------------------------------------------------
    if (
      lower.includes('highest vibration') ||
      lower.includes('maximum vibration') ||
      lower.includes('max vibration') ||
      lower.includes('most vibration')
    ) {
      toolsUsed.push('getMachines');
      const res = NovaToolsEngine.executeTool('getMachines', {}, ctx);
      toolResults.getMachines = res.data;

      // Scan actual database machines for maximum vibrationRMS
      let maxVibMachine = machines[0];
      let maxVib = -1;

      for (const m of machines) {
        const v = m.metrics?.vibrationRMS ?? 0;
        if (v > maxVib) {
          maxVib = v;
          maxVibMachine = m;
        }
      }

      const crit = maxVibMachine.customThresholds?.vibCritical || 4.5;
      const warn = maxVibMachine.customThresholds?.vibWarning || 3.5;
      const overCritPct = maxVib >= crit ? ` (+${(((maxVib - crit) / crit) * 100).toFixed(0)}% above critical trip threshold)` : '';

      return {
        answer: `Based on live telemetry calculations across the fleet in your workspace, **${maxVibMachine.name} (${maxVibMachine.id})** currently has the **highest vibration velocity**:\n\n• **Current Vibration:** **${maxVib.toFixed(2)} mm/s RMS**${overCritPct}\n• **Configured Critical Limit:** ${crit.toFixed(2)} mm/s RMS (Warning: ${warn.toFixed(2)} mm/s)\n• **Plant Area:** ${maxVibMachine.plantArea}\n• **Current Status:** ${maxVibMachine.status.toUpperCase()} (Health: ${maxVibMachine.healthScore}/100)\n• **Bearing Metal Temp:** ${maxVibMachine.metrics.bearingTemp}°C\n\n*(Calculated from simulated SCADA telemetry across ${machines.length} fleet assets)*`,
        toolsUsed,
        toolResults,
        targetMachineId: maxVibMachine.id,
        isConfidenceDetermined: true
      };
    }

    // -------------------------------------------------------------
    // Intent 3: "What is C-204's current vibration?" (or any machine)
    // -------------------------------------------------------------
    if (
      (lower.includes('vibration') && (lower.includes('current') || lower.includes('what is') || lower.includes("what's"))) ||
      (lower.includes('what is') && lower.includes('vibration'))
    ) {
      const machine = targetMachine || machines[0];
      toolsUsed.push('getMachineTelemetry', 'getMachineThresholds');
      const telRes = NovaToolsEngine.executeTool('getMachineTelemetry', { machineId: machine.id }, ctx);
      const thrRes = NovaToolsEngine.executeTool('getMachineThresholds', { machineId: machine.id }, ctx);
      toolResults.getMachineTelemetry = telRes.data;
      toolResults.getMachineThresholds = thrRes.data;

      const vib = telRes.data.metrics.vibrationRMS;
      const crit = thrRes.data.thresholds.vibCritical;
      const warn = thrRes.data.thresholds.vibWarning;
      const status = vib >= crit ? 'exceeds the critical limit' : vib >= warn ? 'exceeds the warning threshold' : 'is within nominal limits';

      return {
        answer: `Based on the simulated SCADA telemetry currently available, **${machine.name} (${machine.id})** is reporting **${vib} mm/s RMS** vibration velocity.\n\nConfigured thresholds for this unit:\n• **Warning Limit:** ${warn} mm/s\n• **Critical Limit:** ${crit} mm/s\n\nThe current reading of **${vib} mm/s ${status}** (${vib >= crit ? `+${(((vib - crit) / crit) * 100).toFixed(0)}% over critical threshold` : 'normal operating range'}).`,
        toolsUsed,
        toolResults,
        targetMachineId: machine.id,
        isConfidenceDetermined: true
      };
    }

    // -------------------------------------------------------------
    // Intent 4: "Is that dangerous?" (Follow-up)
    // -------------------------------------------------------------
    if (
      lower.includes('is that dangerous') ||
      lower.includes('is it dangerous') ||
      lower.includes('is this dangerous') ||
      lower.includes('is that safe')
    ) {
      const machine = targetMachine || machines[0];
      toolsUsed.push('getMachineThresholds');
      const thrRes = NovaToolsEngine.executeTool('getMachineThresholds', { machineId: machine.id }, ctx);
      toolResults.getMachineThresholds = thrRes.data;

      const vib = thrRes.data.currentReadings.vibrationRMS;
      const crit = thrRes.data.thresholds.vibCritical;
      const warn = thrRes.data.thresholds.vibWarning;

      const isDangerous = vib >= crit;
      return {
        answer: isDangerous
          ? `Yes, this is considered **operationally hazardous**. For **${machine.name} (${machine.id})**, the current vibration velocity of **${vib} mm/s RMS** has breached your configured critical trip threshold of **${crit} mm/s RMS** by **+${(((vib - crit) / crit) * 100).toFixed(1)}%**.\n\nAccording to ISO 10816-3 Zone C/D guidelines, sustained operation at this amplitude risks hydrodynamic bearing wipe, fatigue cracking on shaft seals, and catastrophic unbalance. Immediate load reduction or shutdown is advised.`
          : `At **${vib} mm/s RMS**, the vibration is currently ${vib >= warn ? `in the **warning zone** (warning threshold: ${warn} mm/s), but below the critical trip threshold of ${crit} mm/s` : `operating safely within nominal ISO limits (below warning limit of ${warn} mm/s)`}. Continuous monitoring is advised.`,
        toolsUsed,
        toolResults,
        targetMachineId: machine.id,
        isConfidenceDetermined: true
      };
    }

    // -------------------------------------------------------------
    // Intent 5: "Which machines need maintenance?"
    // -------------------------------------------------------------
    if (
      lower.includes('need maintenance') ||
      lower.includes('needs maintenance') ||
      lower.includes('maintenance due') ||
      lower.includes('maintenance status')
    ) {
      toolsUsed.push('getMaintenanceStatus');
      const res = NovaToolsEngine.executeTool('getMaintenanceStatus', {}, ctx);
      toolResults.getMaintenanceStatus = res.data;
      const list = res.data.machinesNeedingService.slice(0, 8).map((m: any) => 
        `• **${m.name} (${m.id})**: Health ${m.healthScore}/100 | Next Service: ${m.nextScheduledService} | Action: ${m.recommendedAction}`
      ).join('\n');

      const workOrderSummary = res.data.activeWorkOrders?.length 
        ? `\n\n**Scheduled Work Orders in Queue (${res.data.activeWorkOrders.length}):**\n` + 
          res.data.activeWorkOrders.map((w: any) => `• [${w.workOrderNumber}] ${w.type} for ${w.machineId} — Due ${w.dueDate} (${w.technician})`).join('\n')
        : '';

      return {
        answer: `### Fleet Maintenance Diagnostics\n\nBased on simulated fleet records, **${res.data.totalDue} assets** currently require maintenance intervention:\n\n${list}${workOrderSummary}\n\nAll recommendations are calculated based on operational runtime hours, vibration severity, and ISO condition monitoring benchmarks.`,
        toolsUsed,
        toolResults,
        actionTaken: 'navigate_machines',
        targetRoute: '/machines',
        isConfidenceDetermined: true
      };
    }

    // -------------------------------------------------------------
    // Intent 6: "What incidents happened today?" / "Latest incident"
    // -------------------------------------------------------------
    if (
      lower.includes('incident') ||
      lower.includes('incidents happened today') ||
      lower.includes('latest incident') ||
      lower.includes('active incidents')
    ) {
      toolsUsed.push('getActiveIncidents');
      const res = NovaToolsEngine.executeTool('getActiveIncidents', {}, ctx);
      toolResults.getActiveIncidents = res.data;
      const list = res.data.incidents.map((i: any) =>
        `• **${i.incidentNumber || i.id} (${i.assetName || i.assetId})**: ${i.summary} (Severity: ${i.severity.toUpperCase()}, Status: ${i.status.toUpperCase()})`
      ).join('\n');

      return {
        answer: `### Plant Incident Ledger\n\nThere are currently **${res.data.count} active incident investigations** recorded in this plant's simulated SCADA system:\n\n${list}\n\nWould you like me to open the 5-Whys root cause console for incident **${res.data.incidents[0]?.id || 'INC-7041'}**?`,
        toolsUsed,
        toolResults,
        targetRoute: '/investigations',
        isConfidenceDetermined: true
      };
    }

    // -------------------------------------------------------------
    // Intent 7: "Compare C-204 and C-205" (or any two machines)
    // -------------------------------------------------------------
    if (lower.includes('compare') && (lower.includes('and') || lower.includes('vs'))) {
      const tokens = lower.match(/[a-z]-?\d+/g) || ['c-204', 'c-205'];
      const mA = tokens[0] || 'C-204';
      const mB = tokens[1] || 'C-205';

      toolsUsed.push('compareMachines');
      const compRes = NovaToolsEngine.executeTool('compareMachines', { machineA: mA, machineB: mB }, ctx);
      toolResults.compareMachines = compRes.data;

      if (!compRes.success) {
        return {
          answer: `I could not complete the comparison: ${compRes.error}`,
          toolsUsed,
          toolResults,
          isConfidenceDetermined: true
        };
      }

      const c = compRes.data.comparison;
      const noteHeader = compRes.data.resolutionNote ? `*${compRes.data.resolutionNote}*\n\n` : '';
      return {
        answer: `${noteHeader}### Asset Comparative Telemetry Dossier\n\n| Metric / Parameter | ${c.machineA.name} (${c.machineA.id}) | ${c.machineB.name} (${c.machineB.id}) | Variance |\n| :--- | :--- | :--- | :--- |\n| **Health Score** | **${c.machineA.healthScore}/100** | **${c.machineB.healthScore}/100** | Δ ${c.healthDelta > 0 ? `+${c.healthDelta}` : c.healthDelta} pts |\n| **Status** | ${c.machineA.status.toUpperCase()} | ${c.machineB.status.toUpperCase()} | — |\n| **Vibration RMS** | **${c.machineA.vibrationRMS} mm/s** | **${c.machineB.vibrationRMS} mm/s** | **${c.higherVibration} higher** |\n| **Bearing Temp** | ${c.machineA.bearingTemp}°C | ${c.machineB.bearingTemp}°C | Δ ${Number((c.machineA.bearingTemp - c.machineB.bearingTemp).toFixed(1))}°C |\n| **Critical Threshold** | ${c.machineA.thresholdVibCritical} mm/s | ${c.machineB.thresholdVibCritical} mm/s | — |\n| **Est. Remaining Life** | ${c.machineA.rulDays} days | ${c.machineB.rulDays} days | Δ ${c.machineA.rulDays - c.machineB.rulDays} days |\n\n**Analytical Conclusion:**\n${c.higherVibration} exhibits significantly more dynamic stress and elevated bearing temperature, placing it in an urgent maintenance priority tier compared to ${c.higherVibration === c.machineA.id ? c.machineB.id : c.machineA.id}.\n\n*(All metrics reflect simulated industrial data)*`,
        toolsUsed,
        toolResults,
        isConfidenceDetermined: true
      };
    }

    // -------------------------------------------------------------
    // Intent 8: "What was it one hour ago?" / "Has it increased?"
    // -------------------------------------------------------------
    if (
      lower.includes('one hour ago') ||
      lower.includes('1 hour ago') ||
      lower.includes('last hour') ||
      lower.includes('increased') ||
      lower.includes('trend') ||
      lower.includes('what changed')
    ) {
      const machine = targetMachine || machines[0];
      toolsUsed.push('getTelemetryHistory');
      const histRes = NovaToolsEngine.executeTool('getTelemetryHistory', { machineId: machine.id, timeRange: '1h' }, ctx);
      toolResults.getTelemetryHistory = histRes.data;

      const cur = histRes.data.current.vibrationRMS;
      const past = histRes.data.oneHourAgo.vibrationRMS;
      const delta = histRes.data.deltaVibration;
      const pct = histRes.data.percentChange;

      return {
        answer: `### Telemetry Trajectory Analysis // ${machine.name} (${machine.id})\n\nBased on historical SCADA telemetry logs:\n• **Current Vibration:** **${cur} mm/s RMS**\n• **One Hour Ago:** **${past} mm/s RMS**\n• **Trajectory Change:** **${delta > 0 ? `+${delta} mm/s (${pct}% increase)` : `${delta} mm/s (${pct}% decrease)`}**\n\nThe vibration velocity has **${delta > 0 ? 'increased significantly' : 'remained stable'}** over the past 60 minutes. Supporting telemetry shows bearing metal temperature simultaneously climbed from **${histRes.data.oneHourAgo.bearingTemp}°C** to **${histRes.data.current.bearingTemp}°C**.`,
        toolsUsed,
        toolResults,
        targetMachineId: machine.id,
        isConfidenceDetermined: true
      };
    }

    // -------------------------------------------------------------
    // Intent 9: Plant Status & KPIs
    // -------------------------------------------------------------
    if (
      lower.includes('plant status') ||
      lower.includes('status of the plant') ||
      lower.includes('happening in the plant') ||
      lower.includes('going on in the plant') ||
      lower.includes('plant summary') ||
      lower.includes('plant overview')
    ) {
      toolsUsed.push('getPlantStatus', 'getCurrentPlant');
      const statusRes = NovaToolsEngine.executeTool('getPlantStatus', {}, ctx);
      const plantRes = NovaToolsEngine.executeTool('getCurrentPlant', {}, ctx);
      toolResults.getPlantStatus = statusRes.data;
      toolResults.getCurrentPlant = plantRes.data;

      const p = statusRes.data;
      return {
        answer: `### Current Industrial Plant Status // ${p.plantName}\n\nBased on the simulated SCADA telemetry currently available:\n• **Overall Equipment Effectiveness (OEE):** **${p.oee}%** across **${p.totalUnits} operational units**\n• **Active Alarms:** **${p.activeAlarms} equipment alarms** (${p.criticalAlarms} critical, ${p.activeAlarms - p.criticalAlarms} warning)\n• **Nominal Units:** **${p.nominalUnits} assets operating normally**\n• **Active Electrical Load:** **${p.activeLoadMW} MW**\n• **Monitored Sensor Channels:** **${p.monitoredNodes.toLocaleString()} live OPC-UA/MQTT nodes**\n\n⚠️ *Notice: Operating on simulated SCADA telemetry.*`,
        toolsUsed,
        toolResults,
        actionTaken: 'summarize_plant',
        isConfidenceDetermined: true
      };
    }

    // -------------------------------------------------------------
    // Intent 10: General Industrial Knowledge (PdM, Vibration RMS)
    // -------------------------------------------------------------
    if (lower.includes('predictive maintenance')) {
      return {
        answer: `### General Industrial Knowledge: Predictive Maintenance (PdM)\n\n**Predictive Maintenance (PdM)** is a condition-driven maintenance strategy that leverages continuous telemetry monitoring (vibration, acoustics, motor current, lubricant spectrography, thermography) and analytical models to forecast equipment failures before functional degradation occurs.\n\n**Key Pillars in Rotating Machinery:**\n1. **Early Anomaly Detection:** Monitoring continuous vibration RMS, spectral harmonics (1X, 2X, sub-synchronous), and bearing metal temperatures to detect boundary wear weeks in advance.\n2. **Remaining Useful Life (RUL):** Estimating wear progression horizons using historical degradation curves and ISO 10816 velocity severity charts.\n3. **Contrast with Preventive vs Reactive:**\n   - *Reactive:* Run to catastrophic failure.\n   - *Preventive:* Fixed calendar maintenance regardless of actual machine health.\n   - *Predictive:* Maintenance performed only when condition degradation warrants intervention, minimizing unplanned downtime by 30-50%.\n\n*(Note: In INDUSTRIX AI, PdM algorithms operate on live simulated SCADA streams)*`,
        toolsUsed: [],
        toolResults: {},
        isConfidenceDetermined: true
      };
    }

    if (lower.includes('vibration rms')) {
      return {
        answer: `### General Industrial Knowledge: Vibration RMS (Root Mean Square)\n\n**Vibration Velocity RMS** (measured in mm/s or in/s) is the industry standard metric (defined in **ISO 10816-3** and **API 670**) for assessing the overall destructive vibrational energy transmitted through rotating machinery bearings and structural casings.\n\n**Why RMS is the Benchmark:**\n• **Energy Quantification:** Unlike Peak or Peak-to-Peak (which capture transient shock spikes), RMS calculates the root-mean-square continuous dynamic energy, directly proportional to fatigue wear on bearings and rotor shafts.\n• **ISO 10816 Severity Zones (Rigid Base Foundation):**\n  - **Zone A (< 2.3 mm/s):** Newly commissioned equipment in pristine condition.\n  - **Zone B (2.3 – 4.5 mm/s):** Acceptable for unrestricted continuous operation.\n  - **Zone C (4.5 – 7.1 mm/s):** Warning zone; restricted operation until maintenance.\n  - **Zone D (> 7.1 mm/s):** Critical trip zone; danger of imminent catastrophic failure.`,
        toolsUsed: [],
        toolResults: {},
        isConfidenceDetermined: true
      };
    }

    // -------------------------------------------------------------
    // Intent 11: Navigation commands ("Open C-204", "Show machines")
    // -------------------------------------------------------------
    if (lower.startsWith('open ') || lower.startsWith('go to ') || lower.startsWith('view ') || lower.startsWith('show ')) {
      const match = resolveMachineId(lower, machines);
      if (match) {
        toolsUsed.push('getMachine', 'navigateTo');
        toolResults.getMachine = match;
        return {
          answer: `Navigating to **${match.name} (${match.id})**. Live telemetry shows vibration velocity at **${match.metrics.vibrationRMS} mm/s RMS** and bearing temperature at **${match.metrics.bearingTemp}°C**.\n\n*(Notice: Simulated industrial data)*`,
          toolsUsed,
          toolResults,
          actionTaken: 'open_machine',
          targetRoute: '/machines',
          targetMachineId: match.id,
          isConfidenceDetermined: true
        };
      }
    }

    // -------------------------------------------------------------
    // UNRECOGNIZED INTENT FALLBACK (RULE 4: DO NOT FAKE AI REASONING)
    // -------------------------------------------------------------
    return {
      answer: "NOVA is temporarily unable to process this request because the AI reasoning service is unavailable. Please try again shortly.",
      toolsUsed: [],
      toolResults: {},
      isConfidenceDetermined: false
    };
  }
}
