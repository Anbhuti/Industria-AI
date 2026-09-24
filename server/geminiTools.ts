import { FunctionDeclaration, Type } from '@google/genai';

export const novaFunctionDeclarations: FunctionDeclaration[] = [
  {
    name: 'getCurrentPlant',
    description: 'Retrieves current active industrial plant profile, name, location, and operating status.',
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: 'getPlantStatus',
    description: 'Retrieves overall plant operating status, active alarm counts, monitored sensor nodes, and equipment effectiveness (OEE).',
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: 'getPlantKPIs',
    description: 'Calculates real aggregate plant KPIs including total fleet machines, percentage of healthy machines, average health score, MTBF, and critical alarm count.',
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: 'getMachines',
    description: 'Retrieves all industrial machinery assets registered in the user workspace with current status, tags, and health scores.',
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: 'getMachine',
    description: 'Retrieves detailed record for a specific machine asset by machineId (e.g., "C-204", "P-118", "M-042") or tag.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        machineId: {
          type: Type.STRING,
          description: 'The identifier or tag of the machine (e.g. "C-204", "CMP-HP-204A").'
        }
      },
      required: ['machineId']
    }
  },
  {
    name: 'getMachineTelemetry',
    description: 'Retrieves full live sensor telemetry for a machine (vibration RMS, bearing metal temperature, suction pressure, motor current, etc.).',
    parameters: {
      type: Type.OBJECT,
      properties: {
        machineId: {
          type: Type.STRING,
          description: 'The machine identifier (e.g. "C-204").'
        }
      },
      required: ['machineId']
    }
  },
  {
    name: 'getLatestTelemetry',
    description: 'Retrieves the latest available telemetry snapshot and threshold configuration for a specific machine.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        machineId: {
          type: Type.STRING,
          description: 'The machine identifier (e.g. "C-204").'
        }
      },
      required: ['machineId']
    }
  },
  {
    name: 'getTelemetryHistory',
    description: 'Retrieves telemetry history for a machine over a specified time range (e.g. "1h", "24h") to analyze trends, trajectory, and past readings.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        machineId: {
          type: Type.STRING,
          description: 'The machine identifier (e.g. "C-204").'
        },
        timeRange: {
          type: Type.STRING,
          description: 'Time window to compare (e.g. "1h", "2h", "24h").'
        }
      },
      required: ['machineId']
    }
  },
  {
    name: 'getMachineHealth',
    description: 'Retrieves health score (0-100), remaining useful life (RUL), and sub-component conditions for an asset.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        machineId: {
          type: Type.STRING,
          description: 'The machine identifier (e.g. "C-204").'
        }
      },
      required: ['machineId']
    }
  },
  {
    name: 'getMachineRisk',
    description: 'Retrieves risk level (HIGH, MEDIUM, LOW), criticality tier, and probability indicators for a machine.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        machineId: {
          type: Type.STRING,
          description: 'The machine identifier (e.g. "C-204").'
        }
      },
      required: ['machineId']
    }
  },
  {
    name: 'getMachineThresholds',
    description: 'Retrieves configured warning and critical limits (vibration, bearing temperature, pressure) and checks current margin to trip.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        machineId: {
          type: Type.STRING,
          description: 'The machine identifier (e.g. "C-204").'
        }
      },
      required: ['machineId']
    }
  },
  {
    name: 'getHighRiskMachines',
    description: 'Returns all machines currently classified as HIGH risk, in critical state, or with active threshold excursions.',
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: 'getMachineAlerts',
    description: 'Retrieves active SCADA alerts, ISO threshold excursions, and advisory notifications for a specific asset.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        machineId: {
          type: Type.STRING,
          description: 'The machine identifier (e.g. "C-204").'
        }
      },
      required: ['machineId']
    }
  },
  {
    name: 'getMaintenanceStatus',
    description: 'Retrieves fleet maintenance status, machines requiring scheduled servicing, overhaul records, and maintenance backlogs.',
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: 'getIncidents',
    description: 'Retrieves recorded plant incident records and investigation cases.',
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: 'getActiveIncidents',
    description: 'Retrieves currently active and unresolved incident investigations.',
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: 'getIncident',
    description: 'Retrieves complete investigation details for an incident ID including 5-Whys causal tree, root cause, and CAPA work orders.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        incidentId: {
          type: Type.STRING,
          description: 'The incident identifier (e.g. "INC-7041").'
        }
      },
      required: ['incidentId']
    }
  },
  {
    name: 'getInvestigations',
    description: 'Retrieves list of all saved Root Cause Analyses (RCA) and investigations.',
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: 'getInvestigation',
    description: 'Retrieves full details of a specific investigation workflow and step progress.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        investigationId: {
          type: Type.STRING,
          description: 'The investigation ID (e.g. "INV-8841").'
        }
      },
      required: ['investigationId']
    }
  },
  {
    name: 'getMachineInvestigations',
    description: 'Retrieves investigations associated with a specific machine asset.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        machineId: {
          type: Type.STRING,
          description: 'The machine identifier (e.g. "C-204").'
        }
      },
      required: ['machineId']
    }
  },
  {
    name: 'getReports',
    description: 'Retrieves generated compliance reports, diagnostic dossiers, and ISO sheets.',
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: 'getNotifications',
    description: 'Retrieves latest telemetry alarm notifications and system events.',
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: 'compareMachines',
    description: 'Performs a side-by-side comparative telemetry and health analysis between two machines (e.g., "C-204" and "C-205").',
    parameters: {
      type: Type.OBJECT,
      properties: {
        machineA: {
          type: Type.STRING,
          description: 'First machine ID or tag.'
        },
        machineB: {
          type: Type.STRING,
          description: 'Second machine ID or tag.'
        }
      },
      required: ['machineA', 'machineB']
    }
  },
  {
    name: 'getConversationHistory',
    description: 'Retrieves previous messages in the current conversation to maintain conversational context and follow-up coherence.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        conversationId: {
          type: Type.STRING,
          description: 'The current conversation ID.'
        }
      }
    }
  },
  {
    name: 'getCurrentUserContext',
    description: 'Retrieves current active UI state, user role, selected machine, and viewing page.',
    parameters: {
      type: Type.OBJECT,
      properties: {}
    }
  },
  {
    name: 'navigateTo',
    description: 'Instructs the application interface to navigate to a target view (e.g. "/machines", "/investigations", "/intelligence", "/reports") or select an asset.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        page: {
          type: Type.STRING,
          description: 'Target route (e.g. "/machines", "/investigations", "/intelligence", "/reports").'
        },
        entityId: {
          type: Type.STRING,
          description: 'Optional ID of machine or incident to focus upon arrival.'
        }
      },
      required: ['page']
    }
  }
];
