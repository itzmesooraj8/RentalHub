import React, { useState } from 'react';
import { Bot, Send, X, Sparkles } from 'lucide-react';
import axios from 'axios';

export const GeminiChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: 'Hello! I am your RentalHub AI Assistant. Need help finding the right excavator, sound system, or camera drone? Ask me anything!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/assistant', {
        userQuery: userText,
        role: 'customer'
      });

      setMessages((prev) => [...prev, { role: 'assistant', text: res.data.answer || 'I can help locate machinery, camera kits, or check pricing!' }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I can help you browse equipment across construction, media, events, and agriculture, or check KYC verification status!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 rounded-full bg-[#F27D26] text-black font-bold shadow-2xl hover:bg-[#d96a1a] transition-transform cursor-pointer flex items-center gap-2 group ring-4 ring-[#F27D26]/20"
        >
          <Bot className="w-6 h-6" />
          <span className="hidden sm:inline font-bold text-xs pr-1 uppercase tracking-wider">Ask AI Concierge</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 h-[480px] bg-[#111111] rounded-3xl shadow-2xl border border-[#1F1F1F] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#050505] text-white p-4 flex items-center justify-between border-b border-[#1F1F1F]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[#F27D26]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif italic text-sm text-[#F27D26]">RentalHub AI Concierge</h4>
                <p className="text-[10px] text-[#888888] font-mono">Powered by Gemini AI</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#888888] hover:text-white p-1 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0A0A0A] text-xs font-mono">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-[#F27D26] text-black flex items-center justify-center shrink-0 text-[10px] font-bold mt-1">
                    AI
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#F27D26] text-black font-medium rounded-tr-none'
                      : 'bg-[#111111] text-[#E5E5E5] border border-[#222222] rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-[#888888] text-xs italic font-mono">
                <span className="w-2 h-2 bg-[#F27D26] rounded-full animate-ping"></span>
                RentalHub AI is thinking...
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-[#111111] border-t border-[#1F1F1F] flex items-center gap-2 font-mono">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for gear recommendations..."
              className="flex-1 px-3 py-2 rounded-xl bg-[#1A1A1A] border border-[#222222] text-xs text-white focus:outline-none focus:border-[#F27D26] placeholder-[#666666]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-[#F27D26] hover:bg-[#d96a1a] text-black transition disabled:opacity-50 cursor-pointer font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
