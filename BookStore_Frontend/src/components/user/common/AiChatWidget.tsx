import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, BookOpen, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { aiService } from '../../../services/ai.service';
import type { AiChatMessage } from '../../../services/ai.service';

// Suggestions are now loaded from translations inside the component

const AiChatWidget = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<AiChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPulse, setShowPulse] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const SUGGESTIONS = [
        t('AiChat.suggestion1'),
        t('AiChat.suggestion2'),
        t('AiChat.suggestion3'),
        t('AiChat.suggestion4'),
    ];

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Hide pulse after first open
    useEffect(() => {
        if (isOpen) setShowPulse(false);
    }, [isOpen]);

    const handleSend = async (messageText?: string) => {
        const text = messageText || input.trim();
        if (!text || isLoading) return;

        const userMessage: AiChatMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await aiService.chat({
                message: text,
                history: messages.slice(-10), // Last 10 messages for context
            });

            const assistantMessage: AiChatMessage = {
                role: 'assistant',
                content: response.reply,
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch {
            const errorMessage: AiChatMessage = {
                role: 'assistant',
                content: t('AiChat.errorMessage'),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleClearChat = () => {
        setMessages([]);
    };

    const formatMessage = (content: string) => {
        // Simple formatting: convert newlines and basic markdown-like items
        return content.split('\n').map((line, i) => (
            <span key={i}>
                {line}
                {i < content.split('\n').length - 1 && <br />}
            </span>
        ));
    };

    return (
        <>
            {/* Chat Button */}
            <button
                id="ai-chat-toggle"
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 group ${
                    isOpen
                        ? 'bg-gradient-to-r from-red-500 to-red-600 rotate-0'
                        : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600'
                }`}
                style={{
                    boxShadow: isOpen
                        ? '0 4px 20px rgba(239, 68, 68, 0.4)'
                        : '0 4px 25px rgba(245, 158, 11, 0.5)',
                }}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <>
                        <MessageCircle className="w-6 h-6 text-white" />
                        {showPulse && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-400"></span>
                            </span>
                        )}
                    </>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    id="ai-chat-window"
                    className={`fixed z-[9998] transition-all duration-300 ease-out ${
                        isExpanded
                            ? 'bottom-4 right-4 w-[560px] h-[680px]'
                            : 'bottom-24 right-6 w-[400px] h-[560px]'
                    }`}
                    style={{
                        animation: 'slideUpFadeIn 0.3s ease-out',
                    }}
                >
                    <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,251,235,0.95))',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(245,158,11,0.1)',
                        }}
                    >
                        {/* Header */}
                        <div
                            className="px-5 py-4 flex items-center justify-between flex-shrink-0"
                            style={{
                                background: 'linear-gradient(135deg, #f59e0b, #d97706, #b45309)',
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-sm tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        BookStore AI
                                    </h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                        <span className="text-white/80 text-xs">{t('AiChat.readyStatus')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleClearChat}
                                    className="text-white/70 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition-all"
                                    title={t('AiChat.clearChatTitle')}
                                >
                                    {t('AiChat.clearChat')}
                                </button>
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all"
                                    title={isExpanded ? t('AiChat.shrink') : t('AiChat.expand')}
                                >
                                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
                            style={{ scrollBehavior: 'smooth' }}
                        >
                            {messages.length === 0 ? (
                                /* Welcome Screen */
                                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg"
                                        style={{ animation: 'float 3s ease-in-out infinite' }}
                                    >
                                        <BookOpen className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        {t('AiChat.hello')}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 leading-relaxed whitespace-pre-line">
                                        {t('AiChat.intro')}
                                    </p>

                                    <div className="w-full space-y-2">
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1 justify-center">
                                            <Sparkles className="w-3 h-3" />
                                            {t('AiChat.suggestionsTitle')}
                                        </p>
                                        {SUGGESTIONS.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSend(suggestion)}
                                                className="w-full text-left px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-800/50 rounded-xl border border-gray-200/60 dark:border-gray-700/50 hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-900/20 transition-all duration-200 hover:shadow-sm"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* Messages */
                                messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        style={{
                                            animation: `slideUpFadeIn 0.3s ease-out ${index * 0.05}s both`,
                                        }}
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                                                <Bot className="w-3.5 h-3.5 text-white" />
                                            </div>
                                        )}

                                        <div
                                            className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                                msg.role === 'user'
                                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-md shadow-md'
                                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-bl-md shadow-sm border border-gray-100 dark:border-gray-700'
                                            }`}
                                        >
                                            {formatMessage(msg.content)}
                                        </div>

                                        {msg.role === 'user' && (
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                                                <User className="w-3.5 h-3.5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}

                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="flex gap-2.5 justify-start">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                                        <Bot className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                                            <span className="text-sm text-gray-400">{t('AiChat.thinking')}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="flex-shrink-0 px-4 pb-4 pt-2">
                            <div className="flex items-end gap-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-2 shadow-sm focus-within:border-amber-400 focus-within:shadow-md transition-all duration-200">
                                <textarea
                                    ref={inputRef}
                                    id="ai-chat-input"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={t('AiChat.placeholder')}
                                    rows={1}
                                    className="flex-1 resize-none border-0 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-0 px-2 py-1.5 max-h-24"
                                    disabled={isLoading}
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                />
                                <button
                                    id="ai-chat-send"
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || isLoading}
                                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm hover:shadow-md disabled:hover:shadow-sm"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400 text-center mt-2">
                                Powered by Gemini AI • BookStore Assistant
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Inline styles for animations */}
            <style>{`
                @keyframes slideUpFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                }
            `}</style>
        </>
    );
};

export default AiChatWidget;
