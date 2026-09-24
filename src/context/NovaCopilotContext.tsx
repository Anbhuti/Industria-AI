import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AssistantState, CopilotSpeechState, CopilotActionOutput } from '../types/nova';
import { AppRoute, IndustrialMachine, IndustrialPlant, UserProfile } from '../types/industrial';
import { novaSpeechRecognition } from '../services/novaSpeechRecognition';
import { novaVoiceService } from '../services/novaVoiceService';
import { NovaCopilotEngine } from '../services/novaCopilotEngine';

interface NovaCopilotContextValue {
  assistantState: AssistantState;
  speechState: CopilotSpeechState;
  isMicAvailable: boolean;
  transcript: string;
  interimTranscript: string;
  latestOutput: CopilotActionOutput | null;
  errorMessage: string | null;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  startListening: () => void;
  stopListening: () => void;
  executeCommand: (query: string, voiceTriggered?: boolean) => Promise<CopilotActionOutput>;
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  updateCurrentPage: (route: string) => void;
  setSelectedMachine: (machineNameOrId: string | null) => void;
  setSelectedIncident: (incidentId: string | null) => void;
}

const NovaCopilotContext = createContext<NovaCopilotContextValue | undefined>(undefined);

interface NovaCopilotProviderProps {
  children: React.ReactNode;
  currentRoute: AppRoute;
  currentUser: UserProfile;
  currentPlant: IndustrialPlant;
  machines: IndustrialMachine[];
  onNavigate: (route: AppRoute) => void;
  onSelectMachineId?: (id: string) => void;
}

export const NovaCopilotProvider: React.FC<NovaCopilotProviderProps> = ({
  children,
  currentRoute,
  currentUser,
  currentPlant,
  machines,
  onNavigate,
  onSelectMachineId
}) => {
  const [speechState, setSpeechState] = useState<CopilotSpeechState>('IDLE');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [latestOutput, setLatestOutput] = useState<CopilotActionOutput | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMicAvailable, setIsMicAvailable] = useState(false);

  // Core Assistant State
  const [assistantState, setAssistantState] = useState<AssistantState>({
    currentPage: currentRoute,
    selectedMachine: 'Compressor C-204',
    selectedIncident: 'INC-7041 (INV-8841)',
    currentInvestigation: {
      step: 1,
      title: 'Incident Detection & Multi-Signal Excursion',
      status: 'Active Root Cause Investigation',
      incidentId: 'INC-7041'
    },
    plantStatus: {
      name: currentPlant.name,
      oee: currentPlant.overallOEE,
      activeAlarms: machines.filter(m => m.status === 'critical' || m.status === 'warning').length,
      unitsCount: currentPlant.unitsCount,
      isSimulated: true // Mandatory: Simulated industrial data notice
    },
    userName: currentUser.name
  });

  // Keep assistant state in sync with parent props
  useEffect(() => {
    setAssistantState(prev => ({
      ...prev,
      currentPage: currentRoute,
      userName: currentUser.name,
      plantStatus: {
        name: currentPlant.name,
        oee: currentPlant.overallOEE,
        activeAlarms: machines.filter(m => m.status === 'critical' || m.status === 'warning').length,
        unitsCount: currentPlant.unitsCount,
        isSimulated: true
      }
    }));
  }, [currentRoute, currentUser, currentPlant, machines]);

  // Check speech recognition support
  useEffect(() => {
    setIsMicAvailable(novaSpeechRecognition.isSupported());
  }, []);

  const updateCurrentPage = useCallback((route: string) => {
    setAssistantState(prev => ({ ...prev, currentPage: route }));
  }, []);

  const setSelectedMachine = useCallback((machineNameOrId: string | null) => {
    setAssistantState(prev => ({ ...prev, selectedMachine: machineNameOrId }));
  }, []);

  const setSelectedIncident = useCallback((incidentId: string | null) => {
    setAssistantState(prev => ({ ...prev, selectedIncident: incidentId }));
  }, []);

  // Stop current speech
  const stopSpeaking = useCallback(() => {
    novaVoiceService.stop();
    setSpeechState('IDLE');
  }, []);

  // Vocalize speech
  const speak = useCallback(async (text: string): Promise<void> => {
    if (!text.trim()) return;
    setSpeechState('SPEAKING');
    try {
      await novaVoiceService.speak(text);
    } finally {
      setSpeechState('IDLE');
    }
  }, []);

  // Dispatch Command Execution
  const executeCommand = useCallback(
    async (query: string, voiceTriggered = false): Promise<CopilotActionOutput> => {
      const trimmed = query.trim();
      if (!trimmed) {
        return {
          spokenText: '',
          displayText: ''
        };
      }

      setSpeechState('PROCESSING');
      setErrorMessage(null);
      setTranscript(trimmed);

      try {
        const output = await NovaCopilotEngine.processCommand(trimmed, assistantState, machines);
        setLatestOutput(output);

        // Apply physical UI side-effects dictated by the copilot command
        if (output.targetRoute) {
          onNavigate(output.targetRoute as AppRoute);
        }

        if (output.targetMachineId) {
          if (onSelectMachineId) {
            onSelectMachineId(output.targetMachineId);
          }
          setAssistantState(prev => ({
            ...prev,
            selectedMachine: output.targetMachineId === 'C-204' ? 'Compressor C-204' : output.targetMachineId!
          }));
        }

        if (output.actionTaken === 'start_investigation') {
          // Dispatch custom event to advance step in InvestigationsView
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('nova:start-investigation', { detail: { step: 3 } }));
          }, 150);
        }

        if (output.openReportModal) {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('nova:open-report'));
          }, 200);
        }

        // Vocalize response if voice was used or if autoSpeak is configured
        const config = novaVoiceService.getConfig();
        if (voiceTriggered || config.autoSpeak) {
          if (output.spokenText) {
            setSpeechState('SPEAKING');
            await novaVoiceService.speak(output.spokenText);
          }
        }

        setSpeechState('IDLE');
        return output;
      } catch (err: any) {
        const errorReply: CopilotActionOutput = {
          spokenText: 'I encountered an error executing your command against the telemetry matrix.',
          displayText: `⚠️ Error evaluating command: ${err?.message || 'Unknown error'}`
        };
        setLatestOutput(errorReply);
        setSpeechState('IDLE');
        return errorReply;
      }
    },
    [assistantState, machines, onNavigate, onSelectMachineId]
  );

  // Voice Input: Start Listening
  const startListening = useCallback(() => {
    if (speechState === 'LISTENING') {
      stopListening();
      return;
    }

    // Halt any ongoing speech first
    novaVoiceService.stop();
    setErrorMessage(null);
    setInterimTranscript('');
    setSpeechState('LISTENING');

    const started = novaSpeechRecognition.startListening(
      (text: string, isFinal: boolean) => {
        setInterimTranscript(text);
        if (isFinal && text.trim()) {
          setTranscript(text);
          setInterimTranscript('');
          // Automatically execute the recognized voice command
          executeCommand(text, true);
        }
      },
      (error: string) => {
        setErrorMessage(error);
        setSpeechState('IDLE');
      },
      () => {
        // onEnd
        setSpeechState(prev => (prev === 'LISTENING' ? 'IDLE' : prev));
      }
    );

    if (!started) {
      setSpeechState('IDLE');
    }
  }, [speechState, executeCommand]);

  // Voice Input: Stop Listening
  const stopListening = useCallback(() => {
    novaSpeechRecognition.stopListening();
    setSpeechState('IDLE');
  }, []);

  return (
    <NovaCopilotContext.Provider
      value={{
        assistantState,
        speechState,
        isMicAvailable,
        transcript,
        interimTranscript,
        latestOutput,
        errorMessage,
        isExpanded,
        setIsExpanded,
        startListening,
        stopListening,
        executeCommand,
        speak,
        stopSpeaking,
        updateCurrentPage,
        setSelectedMachine,
        setSelectedIncident
      }}
    >
      {children}
    </NovaCopilotContext.Provider>
  );
};

export const useNovaCopilot = () => {
  const context = useContext(NovaCopilotContext);
  if (!context) {
    throw new Error('useNovaCopilot must be used within a NovaCopilotProvider');
  }
  return context;
};
