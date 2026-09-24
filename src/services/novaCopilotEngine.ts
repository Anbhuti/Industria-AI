import { AssistantState, CopilotActionOutput } from '../types/nova';
import { IndustrialMachine } from '../types/industrial';

/**
 * NOVA Copilot Intent & Command Processing Engine
 * 
 * Powered by Gemini and server-side industrial tool execution.
 * Maintains full multi-turn conversational context, live telemetry querying,
 * threshold validation, and operational action dispatching across INDUSTRIX AI.
 */
export class NovaCopilotEngine {
  /**
   * Main dispatch: Communicates with server-side Gemini function calling endpoint
   */
  public static async processCommand(
    rawInput: string,
    state: AssistantState,
    _machines: IndustrialMachine[] = []
  ): Promise<CopilotActionOutput> {
    const input = rawInput.trim();
    if (!input) {
      return {
        spokenText: 'How can I assist you with your industrial rotating equipment today?',
        displayText: 'Please enter an industrial inquiry, telemetry question, or diagnostic command.',
        actionTaken: 'chat_answer'
      };
    }

    try {
      const workspaceId = typeof window !== 'undefined'
        ? (localStorage.getItem('industrix_workspace_id') || 'ws-default')
        : 'ws-default';
      const token = typeof window !== 'undefined'
        ? (localStorage.getItem('industrix_auth_token') || '')
        : '';

      const response = await fetch('/api/nova/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-workspace-id': workspaceId,
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: input,
          conversationId: state.conversationId,
          context: {
            currentPage: state.currentPage,
            selectedMachine: state.selectedMachine,
            selectedIncident: state.selectedIncident,
            selectedInvestigation: state.selectedInvestigation || state.currentInvestigation?.incidentId,
            selectedTimeRange: state.selectedTimeRange || '1h',
            plantStatus: state.plantStatus,
            userName: state.userName,
            workspaceId
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.reply || 'Telemetry analysis complete.';
        const cleanSpoken = reply
          .replace(/[#*`_]/g, '')
          .replace(/\|.*?\|/g, '')
          .replace(/\n+/g, ' ')
          .slice(0, 320);

        return {
          spokenText: cleanSpoken,
          displayText: reply,
          actionTaken: data.actionTaken || 'chat_answer',
          targetRoute: data.targetRoute,
          targetMachineId: data.targetMachineId,
          openReportModal: data.openReportModal,
          conversationId: data.conversationId,
          messageId: data.messageId,
          toolsUsed: data.toolsUsed,
          dataSources: data.dataSources,
          source: data.source,
          statusNotice: data.statusNotice
        };
      } else {
        const errJson = await response.json().catch(() => ({}));
        const errText = errJson.error || 'NOVA is temporarily unable to process this request.';
        return {
          spokenText: errText,
          displayText: `⚠️ ${errText}`,
          actionTaken: 'chat_answer'
        };
      }
    } catch (e: any) {
      return {
        spokenText: 'I could not retrieve the required plant data right now.',
        displayText: '⚠️ I couldn\'t retrieve the required plant data right now.',
        actionTaken: 'chat_answer'
      };
    }
  }
}
