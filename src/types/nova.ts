export type NovaExpression = 
  | 'welcome'     // Friendly smile, warm confidence
  | 'analysis'    // Focused, concentrated analytical gaze
  | 'warning'     // Concerned but calm expression
  | 'critical'    // Serious professional crisis-response expression
  | 'success'     // Subtle pleased smile, verification confirmed
  | 'idle';       // Natural calm resting state

export type NovaPresenceMode = 'welcome' | 'investigation' | 'copilot';

export interface NovaVoiceConfig {
  provider: 'browser-speech' | 'gemini-tts' | 'elevenlabs' | 'azure';
  voiceName: string;
  rate: number;
  pitch: number;
  volume: number;
  autoSpeak: boolean;
  apiKey?: string;
}

export interface NovaSpeechState {
  isSpeaking: boolean;
  currentText: string;
  currentSentence: string;
  audioLevel: number;      // 0.0 to 1.0 for audio-reactive waveforms & mouth sync
  visemeOpenness: number;  // 0.0 to 1.0 for mouth deformation
  expression: NovaExpression;
}

export type NovaVoiceOption = {
  id: string;
  name: string;
  lang: string;
  gender: 'female' | 'male';
  quality: 'neural' | 'standard';
};

export type CopilotSpeechState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SPEAKING';

export interface AssistantState {
  currentPage: string;
  selectedMachine: string | null; // e.g. 'C-204' or full machine name
  selectedIncident: string | null; // e.g. 'INV-8841'
  selectedInvestigation?: string | null;
  selectedTimeRange?: string;
  conversationId?: string;
  currentInvestigation: {
    step: number;
    title: string;
    status: string;
    incidentId: string;
  };
  plantStatus: {
    name: string;
    oee: number;
    activeAlarms: number;
    unitsCount: number;
    isSimulated: boolean;
  };
  userName: string;
}

export interface CopilotActionOutput {
  spokenText: string;
  displayText: string;
  actionTaken?: 'navigate_machines' | 'open_machine_c204' | 'open_incident_alert' | 'start_investigation' | 'generate_report' | 'summarize_plant' | 'navigate_intelligence' | 'chat_answer' | 'open_machine' | 'navigate';
  targetRoute?: string;
  targetMachineId?: string;
  openReportModal?: boolean;
  conversationId?: string;
  messageId?: string;
  toolsUsed?: string[];
  dataSources?: any;
  source?: string;
  statusNotice?: string;
}

export interface NovaConversation {
  id: string;
  userId: string;
  workspaceId: string;
  plantId: string;
  title: string;
  selectedMachineId?: string;
  selectedIncidentId?: string;
  selectedInvestigationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NovaMessage {
  id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  intent?: string;
  toolsUsed?: string[];
  contextSnapshot?: any;
  metadata?: any;
}
