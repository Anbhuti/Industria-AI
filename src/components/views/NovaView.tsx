import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Send, 
  Cpu, 
  Activity, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  FileText, 
  Terminal, 
  Radio,
  Sliders,
  Play,
  Square,
  ShieldAlert,
  ArrowRight,
  Plus,
  Clock,
  Search,
  Trash2,
  X,
  Database,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';
import { IndustrialMachine, NovaChatMessage, AppRoute } from '../../types/industrial';
import { NovaExpression, NovaConversation } from '../../types/nova';
import { NovaAvatar } from '../nova/NovaAvatar';
import { novaVoiceService } from '../../services/novaVoiceService';
import { NovaVoiceSettingsModal } from '../nova/NovaVoiceSettingsModal';
import { useNovaCopilot } from '../../context/NovaCopilotContext';
import { NovaSpeechStateBadge } from '../nova/NovaSpeechStateBadge';
import { NovaMicrophoneButton } from '../nova/NovaMicrophoneButton';

interface NovaViewProps {
  machines: IndustrialMachine[];
  initialMachineContext?: IndustrialMachine | null;
  initialPrompt?: string;
  onNavigate?: (route: AppRoute) => void;
}

export const NovaView: React.FC<NovaViewProps> = ({
  machines,
  initialMachineContext,
  initialPrompt,
  onNavigate
}) => {
  const {
    assistantState,
    speechState,
    isMicAvailable,
    transcript,
    interimTranscript,
    latestOutput,
    errorMessage,
    startListening,
    stopListening,
    executeCommand,
    speak,
    stopSpeaking
  } = useNovaCopilot();

  const [selectedMachine, setSelectedMachine] = useState<IndustrialMachine | null>(
    initialMachineContext || machines.find(m => m.id === 'C-204') || machines[0] || null
  );

  const [expression, setExpression] = useState<NovaExpression>('welcome');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<NovaConversation[]>([]);
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [expandedDataMsgId, setExpandedDataMsgId] = useState<string | null>(null);
  const [lastUserQuery, setLastUserQuery] = useState<string>('');
  const [isRetryingNotice, setIsRetryingNotice] = useState(false);

  // Set retry notice timer when processing
  useEffect(() => {
    let timer: any;
    if (speechState === 'PROCESSING') {
      timer = setTimeout(() => {
        setIsRetryingNotice(true);
      }, 1500);
    } else {
      setIsRetryingNotice(false);
    }
    return () => clearTimeout(timer);
  }, [speechState]);

  const initialGreeting = `Welcome to INDUSTRIX AI. I am NOVA, your interactive industrial operations specialist and application copilot powered by Gemini.

I understand live plant context, asset telemetry, incident alerts, and root-cause workflows.

Currently bound to **${selectedMachine?.name || 'All Fleet Telemetry'}** (Tag: \`${selectedMachine?.tag || 'SCADA-GLOBAL'}\`).
Vibration Velocity: **${selectedMachine?.metrics.vibrationRMS || 5.76} mm/s RMS** | Bearing Metal: **${selectedMachine?.metrics.bearingTemp || 82.1}°C**.

Speak via the microphone or type below. Try commands like:
• *"Show me the machines."*
• *"Open compressor C-204."*
• *"Why is C-204 showing an alert?"*
• *"Investigate this."*
• *"Generate a report."*
• *"What is happening in the plant?"*`;

  const [messages, setMessages] = useState<NovaChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'nova',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata: {
        model: 'gemini-3.8-flash',
        confidence: 0.98
      }
    }
  ]);

  const [inputMessage, setInputMessage] = useState(initialPrompt || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync avatar expression with speech state
  useEffect(() => {
    if (speechState === 'LISTENING') {
      setExpression('welcome');
    } else if (speechState === 'PROCESSING') {
      setExpression('analysis');
    } else if (speechState === 'SPEAKING') {
      setExpression('analysis');
    } else {
      setExpression('idle');
    }
  }, [speechState]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, speechState]);

  // Load conversations on mount
  const fetchConversations = useCallback(async () => {
    try {
      const workspaceId = localStorage.getItem('industrix_workspace_id') || 'ws-default';
      const token = localStorage.getItem('industrix_auth_token') || '';
      const res = await fetch('/api/nova/conversations', {
        headers: {
          'x-workspace-id': workspaceId,
          'authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (e) {
      console.warn('Failed to load Nova conversations:', e);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Handle Starting a Fresh Conversation
  const handleNewConversation = () => {
    setActiveConversationId(null);
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'nova',
        text: initialGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          model: 'gemini-3.8-flash',
          confidence: 0.98
        }
      }
    ]);
    setIsHistoryOpen(false);
  };

  // Handle Reopening a Past Conversation
  const handleSelectConversation = async (conv: NovaConversation) => {
    try {
      const workspaceId = localStorage.getItem('industrix_workspace_id') || 'ws-default';
      const token = localStorage.getItem('industrix_auth_token') || '';
      const res = await fetch(`/api/nova/conversations/${conv.id}`, {
        headers: {
          'x-workspace-id': workspaceId,
          'authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setActiveConversationId(conv.id);

        if (conv.selectedMachineId) {
          const matched = machines.find(m => m.id.toLowerCase() === conv.selectedMachineId?.toLowerCase());
          if (matched) setSelectedMachine(matched);
        }

        const loadedMsgs: NovaChatMessage[] = (data.messages || []).map((m: any) => ({
          id: m.id,
          sender: m.role === 'user' ? 'user' : 'nova',
          text: m.content,
          timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          metadata: {
            model: m.contextSnapshot?.source || 'gemini-3.8-flash',
            confidence: 0.98,
            toolsUsed: m.toolsUsed || [],
            dataSources: m.contextSnapshot?.toolResultsSummary ? m.contextSnapshot : undefined
          }
        }));

        if (loadedMsgs.length > 0) {
          setMessages(loadedMsgs);
        } else {
          setMessages([
            {
              id: `msg-${Date.now()}`,
              sender: 'nova',
              text: `Reopened consultation "${conv.title}". How would you like to continue our diagnostic review?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              metadata: { model: 'gemini-3.8-flash', confidence: 0.98 }
            }
          ]);
        }
        setIsHistoryOpen(false);
      }
    } catch (e) {
      console.warn('Error loading conversation:', e);
    }
  };

  // Handle Deleting a Past Conversation
  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const workspaceId = localStorage.getItem('industrix_workspace_id') || 'ws-default';
      const token = localStorage.getItem('industrix_auth_token') || '';
      await fetch(`/api/nova/conversations/${id}`, {
        method: 'DELETE',
        headers: {
          'x-workspace-id': workspaceId,
          'authorization': `Bearer ${token}`
        }
      });
      setConversations(prev => prev.filter(c => c.id !== id));
      if (activeConversationId === id) {
        handleNewConversation();
      }
    } catch (err) {
      console.warn('Error deleting conversation:', err);
    }
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || speechState === 'PROCESSING') return;

    setLastUserQuery(query);
    const userMsg: NovaChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Execute via central copilot engine with active conversationId
    const output = await executeCommand(query, false);

    if (output.conversationId) {
      setActiveConversationId(output.conversationId);
      fetchConversations();
    }

    const novaReply: NovaChatMessage = {
      id: output.messageId || `nova-${Date.now()}`,
      sender: 'nova',
      text: output.displayText || output.spokenText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata: {
        model: output.source || (output.actionTaken ? `ACTION: ${output.actionTaken.toUpperCase()}` : 'gemini-2.5-flash'),
        confidence: 0.98,
        toolsUsed: output.toolsUsed,
        dataSources: output.dataSources,
        statusNotice: output.statusNotice
      }
    };

    setMessages(prev => [...prev, novaReply]);
  };

  const handleSpeakMessage = (text: string) => {
    setExpression('analysis');
    speak(text);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVocalizePlantStatus = () => {
    handleSendMessage('What is happening in the plant?');
  };

  // Group conversations into Today and Previous
  const isToday = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    return d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();
  };

  const filteredConversations = conversations.filter(c => {
    if (!historySearchQuery.trim()) return true;
    const q = historySearchQuery.toLowerCase();
    return c.title.toLowerCase().includes(q) ||
      (c.selectedMachineId && c.selectedMachineId.toLowerCase().includes(q)) ||
      (c.selectedIncidentId && c.selectedIncidentId.toLowerCase().includes(q));
  });

  const todayConversations = filteredConversations.filter(c => isToday(c.updatedAt));
  const previousConversations = filteredConversations.filter(c => !isToday(c.updatedAt));

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-[#090c10] text-[#e3e8ef] overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header Bar */}
      <div className="h-14 border-b border-white/[0.08] bg-[#0d1016] px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">
                NOVA Interactive Application Copilot
              </span>
              <NovaSpeechStateBadge state={speechState} size="sm" />
              {/* Mandatory Simulated Data Badge */}
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-tech bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                SIMULATED INDUSTRIAL DATA
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono-tech">
              Multi-Modal Voice & Text Supervisory AI // Connected to Live SCADA Context
            </div>
          </div>
        </div>

        {/* Controls: New Chat + History + Voice Briefing + Settings + Asset Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleNewConversation}
            className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="Start a new NOVA conversation thread"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">New Chat</span>
          </button>

          <button
            onClick={() => {
              setIsHistoryOpen(true);
              fetchConversations();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Open NOVA conversation history"
          >
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">History</span>
            {conversations.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono-tech">
                {conversations.length}
              </span>
            )}
          </button>

          <button
            onClick={handleVocalizePlantStatus}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            title="Listen to NOVA's plant status briefing"
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="hidden lg:inline">Vocalize Plant Briefing</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-400 hover:text-white transition-colors"
            title="Voice & Speech Settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Bound Asset Selector */}
          <div className="relative">
            <select
              value={selectedMachine?.id || ''}
              onChange={(e) => {
                const m = machines.find(x => x.id === e.target.value);
                if (m) setSelectedMachine(m);
              }}
              aria-label="Select asset for telemetry diagnostics"
              className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono-tech text-amber-300 focus:outline-none focus:border-amber-500/40"
            >
              {machines.map(m => (
                <option key={m.id} value={m.id} className="bg-[#12161f] text-white">
                  {m.id} — {m.name} ({m.metrics.vibrationRMS} mm/s)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Avatar Welcome Stage + Right Diagnostic Dialogue */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative">
        {/* Left Column: Digital Human Avatar Stage */}
        <div className="lg:col-span-4 bg-[#0a0d14] border-r border-white/[0.08] p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
              <span className="text-xs font-mono-tech uppercase text-zinc-400">
                Copilot Digital Twin
              </span>
              <NovaSpeechStateBadge state={speechState} size="sm" />
            </div>

            {/* Avatar Component */}
            <NovaAvatar
              mode="welcome"
              currentExpression={expression}
              onExpressionChange={setExpression}
              onVoiceSettingsClick={() => setIsSettingsOpen(true)}
              statusText={`Bound to ${selectedMachine?.name || 'Compressor C-204'}`}
            />

            {/* Assistant State Live Context Card */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2.5">
              <div className="text-[10px] font-mono-tech text-zinc-400 uppercase flex items-center justify-between">
                <span>Active Copilot State</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SYNCHRONIZED
                </span>
              </div>
              <div className="space-y-1.5 text-xs font-mono-tech">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Current Page:</span>
                  <span className="text-white font-semibold">{assistantState.currentPage}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Selected Asset:</span>
                  <span className="text-amber-300 font-semibold">{assistantState.selectedMachine || 'Compressor C-204'}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Plant Status:</span>
                  <span className="text-emerald-400 font-semibold">{assistantState.plantStatus.name}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Operator:</span>
                  <span className="text-zinc-200">{assistantState.userName}</span>
                </div>
              </div>
            </div>

            {/* Transparency Notice Box */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold font-mono-tech text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>SIMULATED INDUSTRIAL DATA</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                NOVA operates on simulated SCADA telemetry. Data models demonstrate rotating machinery anomalies and automated RCA.
              </p>
            </div>
          </div>

          {/* Asset Telemetry Live Card */}
          <div className="mt-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="text-[10px] font-mono-tech text-zinc-400 uppercase flex items-center justify-between">
              <span>Telemetry Node: {selectedMachine?.tag}</span>
              <span className="text-amber-400">{selectedMachine?.status.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04]">
                <div className="text-[9px] font-mono-tech text-zinc-500">Vibration RMS</div>
                <div className="text-sm font-bold font-mono-tech text-amber-300">
                  {selectedMachine?.metrics.vibrationRMS} mm/s
                </div>
              </div>
              <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04]">
                <div className="text-[9px] font-mono-tech text-zinc-500">Bearing Metal</div>
                <div className="text-sm font-bold font-mono-tech text-orange-300">
                  {selectedMachine?.metrics.bearingTemp}°C
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Intelligence Dialogue */}
        <div className="lg:col-span-8 flex flex-col h-full bg-[#090c10] overflow-hidden">
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {messages.map((msg, idx) => {
              const isNova = msg.sender === 'nova';
              const isLastNova = isNova && idx === messages.length - 1;
              const hasTools = msg.metadata?.toolsUsed && msg.metadata.toolsUsed.length > 0;
              const hasSources = !!msg.metadata?.dataSources;
              const isDataExpanded = expandedDataMsgId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${isNova ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  {/* Avatar Mini Icon */}
                  <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold overflow-hidden ${
                    isNova 
                      ? 'border border-amber-500/40 bg-amber-500/20' 
                      : 'bg-white/[0.1] border border-white/[0.15] text-zinc-200'
                  }`}>
                    {isNova ? (
                      <img 
                        src="/src/assets/images/nova_avatar_base_1789925716459.jpg" 
                        alt="NOVA" 
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      'ENG'
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed border ${
                    isNova
                      ? 'bg-[#11151e] border-white/[0.08] text-zinc-200'
                      : 'bg-amber-500/10 border-amber-500/30 text-white'
                  }`}>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-4 pb-2 mb-2 border-b border-white/[0.06] text-[10px] font-mono-tech text-zinc-400">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-zinc-300">
                          {isNova ? 'NOVA Industrial Copilot' : 'Operations Specialist'}
                        </span>
                        {msg.metadata?.model && (
                          <span className="text-amber-400/90 font-mono-tech bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            [{msg.metadata.model}]
                          </span>
                        )}
                        {hasTools && (
                          <span className="text-cyan-400 font-mono-tech bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                            tools: {msg.metadata?.toolsUsed?.join(', ')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span>{msg.timestamp}</span>

                        {isNova && (
                          <>
                            {/* Toggle Data Sources Button */}
                            {hasSources && (
                              <button
                                onClick={() => setExpandedDataMsgId(isDataExpanded ? null : msg.id)}
                                className="px-1.5 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-cyan-400 text-[10px] font-mono-tech flex items-center gap-1 transition-colors"
                                title="View underlying telemetry data"
                              >
                                <Database className="w-3 h-3" />
                                <span>{isDataExpanded ? 'Hide Data' : 'View Data'}</span>
                                {isDataExpanded ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                              </button>
                            )}

                            {/* Regenerate Button */}
                            {isLastNova && lastUserQuery && (
                              <button
                                onClick={() => handleSendMessage(lastUserQuery)}
                                className="hover:text-amber-400 transition-colors"
                                title="Regenerate this response"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-zinc-400 hover:text-amber-400" />
                              </button>
                            )}

                            {/* Read Aloud Button */}
                            <button
                              onClick={() => handleSpeakMessage(msg.text)}
                              className="hover:text-amber-400 transition-colors"
                              title="Listen to NOVA vocalize this answer"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-zinc-400 hover:text-amber-400" />
                            </button>

                            {/* Copy Button */}
                            <button
                              onClick={() => handleCopyText(msg.text, msg.id)}
                              className="hover:text-white transition-colors"
                              title="Copy diagnostic text"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status Notice for Degraded or Fallback Engine */}
                    {msg.metadata?.statusNotice && (
                      <div className="mb-2.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono-tech flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{msg.metadata.statusNotice}</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="space-y-3 font-normal whitespace-pre-line text-zinc-300">
                      {msg.text}
                    </div>

                    {/* Data Sources Inspection View */}
                    {isDataExpanded && msg.metadata?.dataSources && (
                      <div className="mt-3 pt-3 border-t border-white/[0.08] font-mono-tech text-[11px] bg-black/40 p-3 rounded-lg border border-cyan-500/20 text-cyan-300/90 overflow-x-auto max-h-48">
                        <div className="text-[10px] uppercase text-zinc-400 mb-1 flex items-center gap-1 font-bold">
                          <Database className="w-3 h-3 text-cyan-400" />
                          <span>Real Application Data Payload:</span>
                        </div>
                        <pre className="text-[10px] leading-tight text-zinc-300 whitespace-pre-wrap">
                          {JSON.stringify(msg.metadata.dataSources, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Live Speech Recognition Transcript Indicator */}
            {speechState === 'LISTENING' && (
              <div className="flex gap-3 max-w-2xl mr-auto animate-in fade-in duration-200">
                <div className="w-8 h-8 rounded-xl overflow-hidden border border-rose-500/40 bg-rose-500/10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                </div>
                <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-xs font-mono-tech text-rose-300 flex items-center gap-3">
                  <span>Listening... {interimTranscript ? `"${interimTranscript}"` : 'Speak into microphone'}</span>
                </div>
              </div>
            )}

            {speechState === 'PROCESSING' && (
              <div className="flex gap-3 max-w-2xl mr-auto animate-in fade-in duration-200">
                <div className="w-8 h-8 rounded-xl overflow-hidden border border-amber-500/40">
                  <img 
                    src="/src/assets/images/nova_focused_analysis_1789925751711.jpg" 
                    alt="Analyzing" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-[#11151e] border border-white/[0.08] text-xs font-mono-tech text-amber-300 flex items-center gap-3">
                  <Activity className="w-4 h-4 animate-pulse text-amber-400" />
                  <span>
                    {isRetryingNotice
                      ? 'AI reasoning service temporarily unavailable. Retrying...'
                      : 'Processing intent and executing application functions...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Voice / Copilot Command Shortcuts */}
          <div className="px-4 sm:px-6 py-2.5 border-t border-white/[0.06] bg-[#0c0f15] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono-tech uppercase text-zinc-400 shrink-0 flex items-center gap-1">
              <Terminal className="w-3 h-3 text-amber-400" />
              <span>Voice / Text Commands:</span>
            </span>
            <button
              onClick={() => handleSendMessage('What is the plant status?')}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-amber-500/15 border border-white/[0.06] hover:border-amber-500/40 text-[11px] text-zinc-300 hover:text-amber-300 shrink-0 transition-colors font-mono-tech"
            >
              "What is the plant status?"
            </button>
            <button
              onClick={() => handleSendMessage('How many machines are at risk?')}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-amber-500/15 border border-white/[0.06] hover:border-amber-500/40 text-[11px] text-zinc-300 hover:text-amber-300 shrink-0 transition-colors font-mono-tech"
            >
              "How many machines are at risk?"
            </button>
            <button
              onClick={() => handleSendMessage('What is C-204\'s vibration?')}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-amber-500/15 border border-white/[0.06] hover:border-amber-500/40 text-[11px] text-zinc-300 hover:text-amber-300 shrink-0 transition-colors font-mono-tech"
            >
              "What is C-204's vibration?"
            </button>
            <button
              onClick={() => handleSendMessage('Why is C-204 showing an alert?')}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-amber-500/15 border border-white/[0.06] hover:border-amber-500/40 text-[11px] text-zinc-300 hover:text-amber-300 shrink-0 transition-colors font-mono-tech"
            >
              "Why is C-204 showing an alert?"
            </button>
            <button
              onClick={() => handleSendMessage('Compare C-204 and C-205.')}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-amber-500/15 border border-white/[0.06] hover:border-amber-500/40 text-[11px] text-zinc-300 hover:text-amber-300 shrink-0 transition-colors font-mono-tech"
            >
              "Compare C-204 and C-205."
            </button>
            <button
              onClick={() => handleSendMessage('Which machines need maintenance?')}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-amber-500/15 border border-white/[0.06] hover:border-amber-500/40 text-[11px] text-zinc-300 hover:text-amber-300 shrink-0 transition-colors font-mono-tech"
            >
              "Which machines need maintenance?"
            </button>
            <button
              onClick={() => handleSendMessage('Explain predictive maintenance.')}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-amber-500/15 border border-white/[0.06] hover:border-amber-500/40 text-[11px] text-zinc-300 hover:text-amber-300 shrink-0 transition-colors font-mono-tech"
            >
              "Explain predictive maintenance."
            </button>
          </div>

          {/* Input Box: Microphone Button + Text Input */}
          <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#0d1016]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 max-w-4xl mx-auto"
            >
              {/* Dedicated Microphone Button */}
              <NovaMicrophoneButton
                state={speechState}
                isAvailable={isMicAvailable}
                onToggle={startListening}
                size="md"
              />

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    speechState === 'LISTENING'
                      ? 'Listening to microphone input...'
                      : `Ask NOVA or speak an inquiry (e.g. "How many machines are at risk?")...`
                  }
                  disabled={speechState === 'PROCESSING'}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.09] text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={speechState === 'PROCESSING' || !inputMessage.trim()}
                className="px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Ask NOVA</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Conversation History Slide-Over Drawer */}
        {isHistoryOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex justify-end animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#0e121a] border-l border-white/[0.1] h-full flex flex-col shadow-2xl">
              {/* Drawer Header */}
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#121622]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">NOVA History</h3>
                    <p className="text-[10px] text-zinc-400 font-mono-tech">Past Consultations & Telemetry Audits</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleNewConversation}
                    className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Start new consultation"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Chat</span>
                  </button>
                  <button
                    onClick={() => setIsHistoryOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-3 border-b border-white/[0.06] bg-[#0a0d14]">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    placeholder="Search history (e.g. C-204, maintenance)..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/40 font-mono-tech"
                  />
                  {historySearchQuery && (
                    <button
                      onClick={() => setHistorySearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Today Section */}
                {todayConversations.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold font-mono-tech uppercase text-amber-400/90 tracking-wider">
                      Today
                    </div>
                    <div className="space-y-1.5">
                      {todayConversations.map(conv => (
                        <div
                          key={conv.id}
                          onClick={() => handleSelectConversation(conv)}
                          className={`group p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            activeConversationId === conv.id
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                              : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06] text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <MessageSquare className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-400 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium truncate text-white group-hover:text-amber-200">
                                {conv.title}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] font-mono-tech text-zinc-500 mt-0.5">
                                <span>{new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                {conv.selectedMachineId && (
                                  <span className="text-amber-400/80">[{conv.selectedMachineId}]</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleDeleteConversation(conv.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 transition-all shrink-0 ml-2"
                            title="Delete conversation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Previous Section */}
                {previousConversations.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold font-mono-tech uppercase text-zinc-400 tracking-wider">
                      Previous
                    </div>
                    <div className="space-y-1.5">
                      {previousConversations.map(conv => (
                        <div
                          key={conv.id}
                          onClick={() => handleSelectConversation(conv)}
                          className={`group p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            activeConversationId === conv.id
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                              : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.06] text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <MessageSquare className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-400 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium truncate text-white group-hover:text-amber-200">
                                {conv.title}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] font-mono-tech text-zinc-500 mt-0.5">
                                <span>{new Date(conv.updatedAt).toLocaleDateString()}</span>
                                {conv.selectedMachineId && (
                                  <span className="text-amber-400/80">[{conv.selectedMachineId}]</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleDeleteConversation(conv.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 transition-all shrink-0 ml-2"
                            title="Delete conversation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredConversations.length === 0 && (
                  <div className="text-center py-12 text-zinc-500 text-xs font-mono-tech">
                    {historySearchQuery ? 'No conversations matched your search.' : 'No saved consultations yet. Start chatting below!'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Voice Settings Modal */}
      <NovaVoiceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
