import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowUp, Sparkles, Zap, DollarSign, HelpCircle, MessageCircle, X, Minimize2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to BluebirdX Intelligence. I'm Leiah, your AI concierge. Ask me anything about rides, drivers, or pricing.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isExpanded]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Keep input focused to maintain keyboard open
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Processing with Leiah and Yoda AI agents. In production, this connects to your Supabase Edge Functions for intelligent responses tailored to your luxury transportation needs.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
      // Re-focus after AI response to keep keyboard ready
      inputRef.current?.focus();
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { icon: Sparkles, text: "Book a ride", action: "booking" },
    { icon: Zap, text: "View drivers", action: "drivers" },
    { icon: DollarSign, text: "Pricing", action: "pricing" },
    { icon: HelpCircle, text: "Help", action: "help" },
  ];

  return (
    <>
      {/* Floating Chat Bubble - Collapsed State */}
      {!isExpanded && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
          <Button
            onClick={() => setIsExpanded(true)}
            className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-2xl p-0 relative group"
            style={{
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.4), 0 0 80px rgba(59, 130, 246, 0.2)',
            }}
          >
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
            
            {/* Icon */}
            <MessageCircle className="w-7 h-7 relative z-10" />
            
            {/* Notification badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center text-xs font-bold">
              {messages.filter(m => m.role === 'assistant').length}
            </div>
          </Button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="glass-strong px-4 py-2 rounded-full whitespace-nowrap text-sm">
              Ask Leiah anything
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Panel - Expanded State */}
      {isExpanded && (
        <div 
          className="fixed bottom-0 left-0 right-0 md:bottom-6 md:right-6 md:left-auto md:w-[420px] z-50 animate-slide-in"
          style={{
            maxHeight: '85vh',
          }}
        >
          {/* Chat Container */}
          <div className="glass-strong rounded-t-3xl md:rounded-3xl border-2 border-primary/30 shadow-2xl flex flex-col overflow-hidden"
            style={{
              boxShadow: '0 0 60px rgba(59, 130, 246, 0.3), 0 0 120px rgba(59, 130, 246, 0.1)',
              height: '85vh',
              maxHeight: '700px',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Leiah AI</h3>
                  <p className="text-xs text-muted-foreground">Your luxury concierge</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(false)}
                  className="h-8 w-8 rounded-full hover:bg-primary/10"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto scroll-smooth px-4 py-4"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(59, 130, 246, 0.3) transparent'
              }}
            >
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className="animate-slide-in"
                  >
                    {message.role === "user" ? (
                      /* User Message */
                      <div className="flex justify-end">
                        <div className="max-w-[80%]">
                          <div className="relative px-4 py-3 rounded-2xl rounded-tr-sm bg-gradient-to-r from-accent/30 to-accent/20 border border-accent/30">
                            <div className="text-sm text-foreground leading-relaxed">
                              {message.content}
                            </div>
                          </div>
                          <div className="text-right mt-1">
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Leiah's Response - Flowing Text */
                      <div className="flex justify-start">
                        <div className="max-w-[85%]">
                          <div className="space-y-2">
                            {message.content.split('. ').map((sentence, idx) => (
                              <p
                                key={idx}
                                className="text-sm text-foreground/90 font-light leading-relaxed"
                                style={{
                                  animation: `flowIn 0.6s ease-out ${idx * 0.2}s both`,
                                  textShadow: '0 0 15px rgba(59, 130, 246, 0.2)',
                                }}
                              >
                                {sentence.trim()}{sentence.trim() && '.'}
                              </p>
                            ))}
                          </div>
                          <div className="text-left mt-1">
                            <span className="text-xs text-muted-foreground/60">
                              Leiah • {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start animate-slide-in">
                    <div className="glass px-4 py-3 rounded-2xl">
                      <div className="flex gap-2 items-center">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        </div>
                        <span className="text-xs text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-primary/10">
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(action.text)}
                    className="glass text-xs h-7 px-3 rounded-full hover:bg-primary/10 hover:border-primary/40 transition-all"
                  >
                    <action.icon className="w-3 h-3 mr-1.5" />
                    {action.text}
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-primary/20 bg-background/50 backdrop-blur-sm">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur opacity-50" />
                
                <div className="relative glass rounded-full border border-primary/30 p-2">
                  <div className="flex items-center gap-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask Leiah..."
                      className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-9 px-4"
                      disabled={isLoading}
                    />
                    
                    <Button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90 p-0 flex-shrink-0"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowUp className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom animations */}
      <style>{`
        @keyframes flowIn {
          from {
            opacity: 0;
            transform: translateY(8px);
            filter: blur(3px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }
      `}</style>
    </>
  );
}
