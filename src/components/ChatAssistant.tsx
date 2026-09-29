import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  MessageSquare,
  Bot,
  User,
  Sparkles,
  BookOpen,
  AlertCircle,
  Copy,
  Check,
  CornerDownLeft,
  FileText
} from 'lucide-react';
import { ChatMessage, MaterialItem } from '../types';
import { api } from '../services/api';

interface ChatAssistantProps {
  activeMaterial: MaterialItem | null;
  onNavigateToUpload: () => void;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  activeMaterial,
  onNavigateToUpload
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello! I am **Ask EduFlex 🤖**, your grounded study companion.\n\nI answer questions strictly using your uploaded notes (**${
        activeMaterial?.title || 'Computer Networks Unit 3.pdf'
      }**). If a concept is not found in your material, I will inform you directly rather than making things up.\n\nTry asking or clicking one of the sample prompt suggestions below!`,
      sourceFound: true,
      timestamp: 'Just now',
      suggestedFollowUps: [
        'Explain CDMA in simple words.',
        'Give me an example of TDMA.',
        'Where is GSM explained in my uploaded notes?',
        'Give me 5 important questions from this PDF.',
        'Explain this topic like I am a beginner.'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptSuggestions = [
    'Explain CDMA in simple words.',
    'Give me an example of TDMA.',
    'Where is GSM explained in my uploaded notes?',
    'Give me 5 important questions from this PDF.',
    'Explain this topic like I am a beginner.'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue.trim();
    if (!query || isSending) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsSending(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await api.askChat({
        question: query,
        materialTitle: activeMaterial?.title || 'Computer Networks Unit 3.pdf',
        materialText: activeMaterial?.text_content || '',
        chatHistory: historyPayload
      });

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        role: 'assistant',
        content: res.answer,
        sourceFound: res.sourceFound,
        sourceReference: res.sourceReference,
        suggestedFollowUps: res.suggestedFollowUps,
        timestamp: 'Just now'
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: 'Sorry, I encountered a temporary connection issue. Please check your notes or retry.',
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 flex flex-col h-[calc(100vh-140px)] min-h-[600px]">
      {/* Chat Header */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">Ask EduFlex 🤖</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Grounded Mode
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate max-w-sm">
              Active Notes: <strong>{activeMaterial?.title || 'Computer Networks Unit 3.pdf'}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToUpload}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Switch Material</span>
        </button>
      </div>

      {/* Suggested Prompts Pill Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Try:</span>
        </span>
        {promptSuggestions.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 whitespace-nowrap border border-indigo-200/60 transition-colors shrink-0 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-xs ${
                  isUser ? 'bg-slate-800' : 'bg-gradient-to-tr from-indigo-600 to-purple-600'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-xs font-medium'
                    : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
                }`}
              >
                {/* Content formatting */}
                <div className="whitespace-pre-wrap font-sans text-[13px]">
                  {msg.content}
                </div>

                {/* Grounding Source Citation */}
                {!isUser && msg.sourceReference && (
                  <div className="p-2 rounded-lg bg-indigo-100/50 border border-indigo-200/70 text-[11px] text-indigo-900 flex items-center justify-between">
                    <span className="flex items-center space-x-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="font-semibold truncate">Source: {msg.sourceReference}</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="text-slate-500 hover:text-indigo-700 ml-2"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                )}

                {/* Warning if not found */}
                {!isUser && msg.sourceFound === false && (
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center space-x-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Information was not found in your uploaded study material.</span>
                  </div>
                )}

                {/* Follow up suggestions */}
                {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 mt-2 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Suggested Follow-Ups:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((follow, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(follow)}
                          className="text-[11px] px-2.5 py-1 rounded-md bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-700 transition-colors text-left cursor-pointer"
                        >
                          → {follow}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
              <span>Ask EduFlex is searching your uploaded material...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Ask anything about "${activeMaterial?.title || 'your uploaded notes'}"...`}
          className="w-full pr-12 pl-4 py-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-2xl shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isSending}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
