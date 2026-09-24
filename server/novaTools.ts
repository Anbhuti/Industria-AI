import { dbService, DbMachine, DbPlant, DbInvestigation, DbReport } from './db.ts';

export interface IndustrialToolContext {
  workspaceId: string;
  userId: string;
  plantId?: string;
  currentPage?: string;
  selectedMachineId?: string;
  selectedIncidentId?: string;
  selectedInvestigationId?: string;
  selectedTimeRange?: string;
  userContext?: any;
}

/**
 * Normalizes machine identifiers (e.g., "c204", "c-204", "compressor c-204", "cmp-hp-204a")
 */
export function resolveMachineId(identifier: string | undefined, machines: DbMachine[]): DbMachine | undefined {
  if (!identifier) return undefined;
  const clean = identifier.toLowerCase().replace(/[\s_-]/g, '');

  return machines.find(m => {
    const mId = m.id.toLowerCase().replace(/[\s_-]/g, '');
    const mTag = m.tag.toLowerCase().replace(/[\s_-]/g, '');
    const mName = m.name.toLowerCase().replace(/[\s_-]/g, '');
    return mId === clean || mTag === clean || mName.includes(clean) || clean.includes(mId);
  });
}

/**
 * Server-Side Industrial Function Execution Registry
 * Directly connected to the persistent database and live SCADA telemetry state
 */
export class NovaToolsEngine {
  public static executeTool(
    name: string,
    args: any = {},
    ctx: IndustrialToolContext
  ): { success: boolean; data?: any; error?: string } {
    const { workspaceId, plantId } = ctx;
    const machines = dbService.getMachines(workspaceId);
    const plants = dbService.getPlants(workspaceId);
    const targetPlant = plants.find(p => p.id === (plantId || ctx.userContext?.currentPlant?.id)) || plants[0];

    try {
      switch (name) {
        case 'getCurrentPlant': {
          if (!targetPlant) return { success: false, error: 'No active plant found in workspace' };
          return {
            success: true,
            data: {
              id: targetPlant.id,
              name: targetPlant.name,
              location: targetPlant.location,
              unitsCount: targetPlant.unitsCount || machines.length,
              overallOEE: targetPlant.overallOEE,
              activeLoadMW: targetPlant.activeLoadMW,
              status: targetPlant.status,
              isSimulated: true
            }
          };
        }

        case 'getPlantStatus': {
          const activeAlarms = machines.filter(m => m.status === 'warning' || m.status === 'critical').length;
          const criticalCount = machines.filter(m => m.status === 'critical').length;
          const nominalCount = machines.filter(m => m.status === 'nominal').length;

          return {
            success: true,
            data: {
              plantName: targetPlant?.name || 'Lucknow Manufacturing Facility',
              oee: targetPlant?.overallOEE || 91.2,
              activeAlarms,
              criticalAlarms: criticalCount,
              nominalUnits: nominalCount,
              totalUnits: machines.length,
              monitoredNodes: 14892,
              activeLoadMW: targetPlant?.activeLoadMW || 124.6,
              timestamp: new Date().toISOString(),
              isSimulated: true
            }
          };
        }

        case 'getPlantKPIs': {
          const total = machines.length || 1;
          const healthy = machines.filter(m => m.healthScore >= 80).length;
          const warning = machines.filter(m => m.status === 'warning').length;
          const critical = machines.filter(m => m.status === 'critical').length;
          const avgHealth = Number((machines.reduce((acc, m) => acc + m.healthScore, 0) / total).toFixed(1));
          const healthyPercentage = Number(((healthy / total) * 100).toFixed(1));

          return {
            success: true,
            data: {
              totalMachines: total,
              healthyMachines: healthy,
              healthyPercentage: healthyPercentage,
              averageHealthScore: avgHealth,
              warningCount: warning,
              criticalCount: critical,
              overallOEE: targetPlant?.overallOEE || 91.2,
              mtbfAverageHours: 4280,
              isSimulated: true
            }
          };
        }

        case 'getMachines': {
          const list = machines.map(m => ({
            id: m.id,
            name: m.name,
            tag: m.tag,
            type: m.type,
            plantArea: m.plantArea,
            risk: m.risk || (m.healthScore < 60 ? 'HIGH' : m.healthScore < 85 ? 'MEDIUM' : 'LOW'),
            healthScore: m.healthScore,
            status: m.status,
            vibrationRMS: m.metrics?.vibrationRMS,
            bearingTemp: m.metrics?.bearingTemp,
            alarm: m.alarm
          }));
          return { success: true, data: { count: list.length, machines: list } };
        }

        case 'getMachine': {
          const machineId = args.machineId || ctx.selectedMachineId;
          const machine = resolveMachineId(machineId, machines);
          if (!machine) {
            return { success: false, error: `Machine "${machineId}" not found in current fleet.` };
          }
          return { success: true, data: machine };
        }

        case 'getMachineTelemetry':
        case 'getLatestTelemetry': {
          const machineId = args.machineId || ctx.selectedMachineId;
          const machine = resolveMachineId(machineId, machines);
          if (!machine) {
            return { success: false, error: `Machine "${machineId}" not found.` };
          }
          return {
            success: true,
            data: {
              machineId: machine.id,
              name: machine.name,
              tag: machine.tag,
              status: machine.status,
              healthScore: machine.healthScore,
              metrics: machine.metrics,
              thresholds: machine.customThresholds || {
                vibCritical: 4.5,
                vibWarning: 3.5,
                tempCritical: 90,
                tempWarning: 80
              },
              timestamp: new Date().toISOString(),
              isSimulated: true
            }
          };
        }

        case 'getTelemetryHistory': {
          const machineId = args.machineId || ctx.selectedMachineId;
          const machine = resolveMachineId(machineId, machines);
          if (!machine) {
            return { success: false, error: `Machine "${machineId}" not found.` };
          }

          const currentVib = machine.metrics?.vibrationRMS ?? 4.12;
          const currentTemp = machine.metrics?.bearingTemp ?? 82.1;
          const timeRange = args.timeRange || '1h';

          // Historical points: 1h ago, 2h ago, 4h ago, 8h ago, 24h ago
          const history = [
            {
              timeAgo: '1h',
              timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
              vibrationRMS: Number((currentVib * 0.88).toFixed(2)),
              bearingTemp: Number((currentTemp - 4.2).toFixed(1)),
              status: currentVib * 0.88 > 4.5 ? 'critical' : currentVib * 0.88 > 3.5 ? 'warning' : 'nominal'
            },
            {
              timeAgo: '2h',
              timestamp: new Date(Date.now() - 7200 * 1000).toISOString(),
              vibrationRMS: Number((currentVib * 0.82).toFixed(2)),
              bearingTemp: Number((currentTemp - 6.8).toFixed(1)),
              status: 'nominal'
            },
            {
              timeAgo: '4h',
              timestamp: new Date(Date.now() - 14400 * 1000).toISOString(),
              vibrationRMS: Number((currentVib * 0.75).toFixed(2)),
              bearingTemp: Number((currentTemp - 8.5).toFixed(1)),
              status: 'nominal'
            },
            {
              timeAgo: '24h',
              timestamp: new Date(Date.now() - 86400 * 1000).toISOString(),
              vibrationRMS: Number((currentVib * 0.68).toFixed(2)),
              bearingTemp: Number((currentTemp - 11.2).toFixed(1)),
              status: 'nominal'
            }
          ];

          return {
            success: true,
            data: {
              machineId: machine.id,
              name: machine.name,
              current: { vibrationRMS: currentVib, bearingTemp: currentTemp },
              oneHourAgo: history[0],
              hasIncreased: currentVib > history[0].vibrationRMS,
              deltaVibration: Number((currentVib - history[0].vibrationRMS).toFixed(2)),
              percentChange: Number((((currentVib - history[0].vibrationRMS) / history[0].vibrationRMS) * 100).toFixed(1)),
              history,
              isSimulated: true
            }
          };
        }

        case 'getMachineHealth': {
          const machineId = args.machineId || ctx.selectedMachineId;
          const machine = resolveMachineId(machineId, machines);
          if (!machine) {
            return { success: false, error: `Machine "${machineId}" not found.` };
          }
          return {
            success: true,
            data: {
              machineId: machine.id,
              name: machine.name,
              healthScore: machine.healthScore,
              status: machine.status,
              rulDays: machine.rulDays,
              components: machine.components || [],
              criticality: machine.criticality,
              isSimulated: true
            }
          };
        }

        case 'getMachineRisk': {
          const machineId = args.machineId || ctx.selectedMachineId;
          const machine = resolveMachineId(machineId, machines);
          if (!machine) {
            return { success: false, error: `Machine "${machineId}" not found.` };
          }
          const riskLevel = machine.risk || (machine.healthScore < 60 ? 'HIGH' : machine.healthScore < 85 ? 'MEDIUM' : 'LOW');
          return {
            success: true,
            data: {
              machineId: machine.id,
              name: machine.name,
              risk: riskLevel,
              healthScore: machine.healthScore,
              criticality: machine.criticality,
              rulDays: machine.rulDays,
              mtbfHours: machine.mtbfHours,
              alarm: machine.alarm
            }
          };
        }

        case 'getMachineThresholds': {
          const machineId = args.machineId || ctx.selectedMachineId;
          const machine = resolveMachineId(machineId, machines);
          if (!machine) {
            return { success: false, error: `Machine "${machineId}" not found.` };
          }
          const thresh = machine.customThresholds || {
            vibWarning: 3.5,
            vibCritical: 4.5,
            tempWarning: 80,
            tempCritical: 90,
            pressWarning: 175,
            pressCritical: 190,
            rpmLimit: 3600,
            energyThreshold: 450
          };
          const currentVib = machine.metrics?.vibrationRMS ?? 4.12;
          const currentTemp = machine.metrics?.bearingTemp ?? 82.1;

          return {
            success: true,
            data: {
              machineId: machine.id,
              name: machine.name,
              thresholds: thresh,
              currentReadings: {
                vibrationRMS: currentVib,
                bearingTemp: currentTemp
              },
              vibrationStatus: currentVib >= thresh.vibCritical ? 'CRITICAL_BREACH' : currentVib >= thresh.vibWarning ? 'WARNING_EXCURSION' : 'NOMINAL',
              tempStatus: currentTemp >= thresh.tempCritical ? 'CRITICAL_BREACH' : currentTemp >= thresh.tempWarning ? 'WARNING_EXCURSION' : 'NOMINAL',
              marginToCriticalVibration: Number((thresh.vibCritical - currentVib).toFixed(2))
            }
          };
        }

        case 'getHighRiskMachines': {
          const highRisk = machines.filter(m => 
            m.risk === 'HIGH' || m.status === 'critical' || m.healthScore < 65 || (m.metrics?.vibrationRMS && m.metrics.vibrationRMS > 4.5)
          );
          return {
            success: true,
            data: {
              count: highRisk.length,
              machines: highRisk.map(m => ({
                id: m.id,
                name: m.name,
                tag: m.tag,
                plantArea: m.plantArea,
                healthScore: m.healthScore,
                risk: 'HIGH',
                status: m.status,
                vibrationRMS: m.metrics?.vibrationRMS,
                bearingTemp: m.metrics?.bearingTemp,
                alarm: m.alarm
              }))
            }
          };
        }

        case 'getMachineAlerts': {
          const machineId = args.machineId || ctx.selectedMachineId;
          const machine = resolveMachineId(machineId, machines);
          if (!machine) {
            return { success: false, error: `Machine "${machineId}" not found.` };
          }
          const alerts = [];
          if (machine.alarm) alerts.push({ type: 'alarm', text: machine.alarm, severity: machine.status });
          if (machine.metrics?.vibrationRMS && machine.metrics.vibrationRMS > (machine.customThresholds?.vibWarning || 3.5)) {
            alerts.push({
              type: 'telemetry_excursion',
              metric: 'vibrationRMS',
              value: `${machine.metrics.vibrationRMS} mm/s`,
              threshold: `${machine.customThresholds?.vibCritical || 4.5} mm/s`,
              severity: machine.metrics.vibrationRMS >= (machine.customThresholds?.vibCritical || 4.5) ? 'critical' : 'warning'
            });
          }
          return { success: true, data: { machineId: machine.id, count: alerts.length, alerts } };
        }

        case 'getMaintenanceStatus': {
          const workOrders = dbService.getMaintenanceRecords(workspaceId);
          const due = machines.filter(m => m.healthScore < 75 || m.status === 'warning' || m.status === 'critical');
          return {
            success: true,
            data: {
              activeWorkOrders: workOrders,
              totalDue: due.length,
              machinesNeedingService: due.map(m => ({
                id: m.id,
                name: m.name,
                status: m.status,
                healthScore: m.healthScore,
                nextScheduledService: m.nextScheduledService,
                lastOverhaul: m.lastOverhaul,
                recommendedAction: m.healthScore < 60 ? 'Immediate Diagnostic Overhaul' : 'Lubrication inspection and tilt-pad check'
              }))
            }
          };
        }

        case 'getIncidents':
        case 'getActiveIncidents': {
          const dbIncidents = dbService.getIncidents(workspaceId);
          const investigations = dbService.getInvestigations(workspaceId);
          const combined = [
            ...dbIncidents.map(inc => ({
              id: inc.id,
              incidentNumber: inc.incidentNumber,
              assetId: inc.machineId,
              assetName: machines.find(m => m.id === inc.machineId)?.name || inc.machineId,
              severity: inc.severity,
              status: inc.status,
              summary: inc.summary,
              reportedBy: inc.reportedBy,
              assignedEngineer: inc.assignedEngineer,
              timestamp: inc.openedAt
            })),
            ...investigations
              .filter(inv => !dbIncidents.some(d => d.id === inv.incidentId))
              .map(inv => ({
                id: inv.incidentId || inv.id,
                incidentNumber: inv.incidentId || inv.id,
                investigationId: inv.id,
                assetId: inv.assetId,
                assetName: inv.assetName,
                tag: inv.tag,
                severity: inv.severity,
                status: inv.status,
                summary: inv.summary,
                timestamp: inv.timestamp,
                rootCause: inv.rootCauseRoot
              }))
          ];
          return {
            success: true,
            data: {
              count: combined.length,
              incidents: name === 'getActiveIncidents' ? combined.filter(i => i.status !== 'resolved' && i.status !== 'closed') : combined
            }
          };
        }

        case 'getIncident': {
          const incidentId = args.incidentId || ctx.selectedIncidentId;
          const investigations = dbService.getInvestigations(workspaceId);
          const inv = investigations.find(i => 
            i.incidentId?.toLowerCase() === incidentId?.toLowerCase() || 
            i.id.toLowerCase() === incidentId?.toLowerCase()
          ) || investigations[0];

          if (!inv) return { success: false, error: `Incident "${incidentId}" not found.` };
          return {
            success: true,
            data: {
              incidentId: inv.incidentId || inv.id,
              asset: `${inv.assetName} (${inv.tag})`,
              severity: inv.severity,
              summary: inv.summary,
              fiveWhys: inv.fiveWhys,
              rootCauseDirect: inv.rootCauseDirect,
              rootCauseRoot: inv.rootCauseRoot,
              confidence: inv.confidence,
              capaActions: inv.capaActions
            }
          };
        }

        case 'getInvestigations': {
          const invs = dbService.getInvestigations(workspaceId);
          return {
            success: true,
            data: {
              count: invs.length,
              investigations: invs.map(i => ({
                id: i.id,
                title: i.title || `${i.assetName} Root Cause Investigation`,
                assetId: i.assetId,
                status: i.status,
                severity: i.severity,
                step: i.currentStep || 1
              }))
            }
          };
        }

        case 'getInvestigation': {
          const id = args.investigationId || ctx.selectedInvestigationId;
          const invs = dbService.getInvestigations(workspaceId);
          const inv = invs.find(i => i.id === id) || invs[0];
          if (!inv) return { success: false, error: 'No investigation found.' };
          return { success: true, data: inv };
        }

        case 'getMachineInvestigations': {
          const machineId = args.machineId || ctx.selectedMachineId;
          const machine = resolveMachineId(machineId, machines);
          const invs = dbService.getInvestigations(workspaceId).filter(i => 
            i.assetId.toLowerCase() === machine?.id.toLowerCase() || 
            i.tag.toLowerCase() === machine?.tag.toLowerCase()
          );
          return {
            success: true,
            data: {
              machineId: machine?.id || machineId,
              count: invs.length,
              investigations: invs
            }
          };
        }

        case 'getReports': {
          const reports = dbService.getReports(workspaceId);
          return {
            success: true,
            data: {
              count: reports.length,
              reports: reports.map(r => ({
                id: r.id,
                name: r.name,
                reportNumber: r.reportNumber,
                type: r.type,
                status: r.status,
                createdDate: r.createdDate,
                summary: r.summary
              }))
            }
          };
        }

        case 'getNotifications': {
          const notifs = dbService.getNotifications(workspaceId);
          return { success: true, data: { count: notifs.length, notifications: notifs } };
        }

        case 'compareMachines': {
          let machineA = resolveMachineId(args.machineA, machines);
          let machineB = resolveMachineId(args.machineB, machines);
          let resolutionNote = '';

          if (!machineA && machines.length > 0) machineA = machines[0];

          if (!machineB) {
            // Find companion machine from the same plant
            const fallbackCompanion = machines.find(m => m.id !== machineA?.id) || machines[1];
            if (fallbackCompanion) {
              resolutionNote = `Note: Machine "${args.machineB}" is not registered in the active plant fleet. Comparing with companion rotating unit ${fallbackCompanion.name} (${fallbackCompanion.id}).`;
              machineB = fallbackCompanion;
            } else {
              return { success: false, error: `I don't have enough data in the current workspace to answer that accurately: Machine "${args.machineB}" is not registered in the fleet.` };
            }
          }

          if (!machineA || !machineB) {
            return { success: false, error: `I don't have enough data in the current workspace to answer that accurately.` };
          }
          return {
            success: true,
            data: {
              resolutionNote,
              comparison: {
                machineA: {
                  id: machineA.id,
                  name: machineA.name,
                  tag: machineA.tag,
                  healthScore: machineA.healthScore,
                  status: machineA.status,
                  vibrationRMS: machineA.metrics?.vibrationRMS,
                  bearingTemp: machineA.metrics?.bearingTemp,
                  thresholdVibCritical: machineA.customThresholds?.vibCritical ?? 4.5,
                  rulDays: machineA.rulDays
                },
                machineB: {
                  id: machineB.id,
                  name: machineB.name,
                  tag: machineB.tag,
                  healthScore: machineB.healthScore,
                  status: machineB.status,
                  vibrationRMS: machineB.metrics?.vibrationRMS,
                  bearingTemp: machineB.metrics?.bearingTemp,
                  thresholdVibCritical: machineB.customThresholds?.vibCritical ?? 4.5,
                  rulDays: machineB.rulDays
                },
                healthDelta: machineA.healthScore - machineB.healthScore,
                higherVibration: (machineA.metrics?.vibrationRMS || 0) > (machineB.metrics?.vibrationRMS || 0) ? machineA.id : machineB.id,
                isSimulated: true
              }
            }
          };
        }

        case 'getConversationHistory': {
          const convId = args.conversationId;
          const messages = convId ? dbService.getNovaMessages(convId) : [];
          return {
            success: true,
            data: {
              conversationId: convId,
              messageCount: messages.length,
              messages: messages.slice(-10)
            }
          };
        }

        case 'getCurrentUserContext': {
          return {
            success: true,
            data: {
              currentUser: ctx.userContext?.currentUser || { name: 'Operations Specialist', role: 'Reliability Engineer' },
              currentWorkspace: ctx.workspaceId,
              currentPlant: targetPlant?.name || 'Lucknow Manufacturing Facility',
              currentPage: ctx.currentPage || '/nova',
              selectedMachine: ctx.selectedMachineId || 'C-204',
              selectedIncident: ctx.selectedIncidentId || 'INC-7041',
              selectedTimeRange: ctx.selectedTimeRange || '1h'
            }
          };
        }

        case 'navigateTo': {
          return {
            success: true,
            data: {
              action: 'navigate',
              targetRoute: args.page || '/machines',
              targetEntityId: args.entityId
            }
          };
        }

        default:
          return { success: false, error: `Unknown tool function: ${name}` };
      }
    } catch (err: any) {
      return { success: false, error: `Execution error in ${name}: ${err?.message || 'internal error'}` };
    }
  }
}
