import { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import OrbitalVehicles3D from "@/components/OrbitalVehicles3D";

export default function HeroOrb() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        
        if (event.results[current].isFinal) {
          // Send to Leiah AI
          console.log('Final transcript:', transcriptText);
          // TODO: Connect to Leiah/Yoda AI agents via Supabase
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start(); // Restart if still in listening mode
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript("");
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Simulate audio level for waveform animation
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isListening]);

  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden py-12">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container relative z-10">
        <div className="flex flex-col items-center justify-center gap-8 md:gap-12">
          {/* Interactive Orb with Logo */}
          <div className="relative group">
            {/* Orbiting Luxury Vehicles - 3D Animation */}
            <OrbitalVehicles3D />
            
            {/* Outer pulsating glow - EPIC */}
            <div 
              className="absolute inset-0 rounded-full blur-3xl transition-all duration-1000"
              style={{
                background: isListening 
                  ? 'radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.5) 30%, rgba(59, 130, 246, 0.3) 50%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.4) 30%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
                transform: `scale(${isListening ? 1.4 : 1.3})`,
                animation: isListening ? 'epicPulse 1.5s ease-in-out infinite' : 'epicPulse 2.5s ease-in-out infinite',
              }}
            />
            
            {/* Secondary glow layer */}
            <div 
              className="absolute inset-0 rounded-full blur-2xl transition-all duration-1000"
              style={{
                background: 'radial-gradient(circle, rgba(96, 165, 250, 0.4) 0%, rgba(59, 130, 246, 0.2) 40%, transparent 60%)',
                transform: 'scale(1.15)',
                animation: 'epicPulse 3s ease-in-out infinite 0.5s',
              }}
            />

            {/* Audio waveform rings (when listening) */}
            {isListening && (
              <>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    style={{
                      animation: `ripple 2s ease-out infinite ${i * 0.5}s`,
                      transform: `scale(${1 + audioLevel / 200})`,
                    }}
                  />
                ))}
              </>
            )}

            {/* Main orb container with breathing */}
            <div 
              className="relative w-64 h-64 md:w-80 md:h-80 cursor-pointer"
              style={{
                animation: 'orbBreathe 5s ease-in-out infinite',
              }}
              onClick={toggleVoice}
            >
              {/* Rotating planet surface layer */}
              <div 
                className="absolute inset-0 rounded-full border-4"
                style={{
                  borderColor: isListening ? 'rgba(59, 130, 246, 1)' : 'rgba(59, 130, 246, 0.6)',
                  borderWidth: '3px',
                  background: `
                    radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.3), transparent 40%),
                    radial-gradient(circle at 70% 60%, rgba(96, 165, 250, 0.2), transparent 35%),
                    radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.25), transparent 30%),
                    radial-gradient(circle at 20% 70%, rgba(96, 165, 250, 0.15), transparent 25%),
                    linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 20, 0.6) 100%)
                  `,
                  boxShadow: isListening 
                    ? '0 0 100px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.6), inset 0 0 80px rgba(59, 130, 246, 0.3)'
                    : '0 0 80px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.4), inset 0 0 60px rgba(59, 130, 246, 0.2)',
                  animation: 'orbRotate 30s linear infinite',
                }}
              />
              {/* BluebirdX Logo with glow - STATIONARY */}
              <div className="absolute inset-0 flex items-center justify-center p-4" style={{ animation: 'none' }}>
                <div className="relative w-full h-full">
                  {/* Glow layer behind logo */}
                  <div 
                    className="absolute inset-0 rounded-full blur-xl transition-all duration-500"
                    style={{
                      background: 'radial-gradient(circle, rgba(96, 165, 250, 0.4) 0%, transparent 70%)',
                      animation: 'epicPulse 2s ease-in-out infinite',
                    }}
                  />
                  
                  <img 
                    src="/bluebirdx-logo-cropped.png" 
                    alt="BluebirdX" 
                    className="relative w-full h-full object-contain transition-all duration-500"
                    style={{
                      filter: isListening 
                        ? 'brightness(1.3) drop-shadow(0 0 30px rgba(96, 165, 250, 1)) drop-shadow(0 0 15px rgba(96, 165, 250, 0.8))' 
                        : 'brightness(1.2) drop-shadow(0 0 20px rgba(96, 165, 250, 0.7)) drop-shadow(0 0 10px rgba(96, 165, 250, 0.5))',
                      transform: isListening ? 'scale(1.08)' : 'scale(1)',
                      animation: 'logoGlow 3s ease-in-out infinite',
                    }}
                  />
                </div>
              </div>


            </div>

            {/* Futuristic Glowing Microphone Icon - Positioned INSIDE Orb at Bottom Edge */}
            <div 
              className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 cursor-pointer group/mic z-20"
              onClick={(e) => {
                e.stopPropagation(); // Prevent orb click
                toggleVoice();
                console.log('Microphone clicked!', isListening ? 'Stopping...' : 'Starting...');
              }}
            >
              {/* Outer pulsating glow rings - MEDIUM BLUE */}
              <div 
                className="absolute inset-0 rounded-full transition-all duration-500"
                style={{
                  width: '100px',
                  height: '100px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: isListening 
                    ? 'radial-gradient(circle, rgba(37, 99, 235, 0.7) 0%, rgba(37, 99, 235, 0.4) 50%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(37, 99, 235, 0.25) 50%, transparent 70%)',
                  animation: isListening ? 'epicPulse 1.2s ease-in-out infinite' : 'epicPulse 2.5s ease-in-out infinite',
                  filter: 'blur(10px)',
                }}
              />
              
              {/* Middle glow ring - extra layer for depth - MEDIUM BLUE */}
              <div 
                className="absolute inset-0 rounded-full transition-all duration-500 opacity-0 group-hover/mic:opacity-100"
                style={{
                  width: '80px',
                  height: '80px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(37, 99, 235, 0.4) 50%, transparent 70%)',
                  animation: 'epicPulse 1.8s ease-in-out infinite 0.3s',
                  filter: 'blur(8px)',
                }}
              />

              {/* Active state - intense pulsing rings - MEDIUM BLUE */}
              {isListening && (
                <>
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      width: '120px',
                      height: '120px',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(37, 99, 235, 0.3) 50%, transparent 70%)',
                      animation: 'epicPulse 1s ease-in-out infinite 0.2s',
                      filter: 'blur(15px)',
                    }}
                  />
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      width: '140px',
                      height: '140px',
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, transparent 60%)',
                      animation: 'ripple 2s ease-out infinite',
                      filter: 'blur(20px)',
                    }}
                  />
                </>
              )}
              
              {/* Microphone Container with Circular Background - MEDIUM BLUE */}
              <div 
                className="relative transition-all duration-500"
                style={{
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: isListening ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {/* Circular glass background - MEDIUM BLUE */}
                <div 
                  className="absolute inset-0 rounded-full transition-all duration-500"
                  style={{
                    background: isListening 
                      ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.35), rgba(59, 130, 246, 0.25))'
                      : 'linear-gradient(135deg, rgba(29, 78, 216, 0.25), rgba(37, 99, 235, 0.15))',
                    backdropFilter: 'blur(20px)',
                    border: isListening 
                      ? '2px solid rgba(59, 130, 246, 0.6)'
                      : '2px solid rgba(37, 99, 235, 0.4)',
                    boxShadow: isListening 
                      ? '0 0 40px rgba(37, 99, 235, 0.7), inset 0 0 20px rgba(59, 130, 246, 0.25)'
                      : '0 0 20px rgba(37, 99, 235, 0.4), inset 0 0 10px rgba(59, 130, 246, 0.15)',
                  }}
                />
                
                {/* New Futuristic Microphone Image - MEDIUM BLUE FILTER */}
                <img 
                  src="/microphone-futuristic.png" 
                  alt="Microphone" 
                  className="relative w-10 h-10 transition-all duration-500 group-hover/mic:scale-110 object-contain"
                  style={{
                    filter: isListening 
                      ? 'hue-rotate(-15deg) saturate(1.2) brightness(1.4) drop-shadow(0 0 25px rgba(59, 130, 246, 1)) drop-shadow(0 0 15px rgba(37, 99, 235, 0.9))'
                      : 'hue-rotate(-15deg) saturate(1.1) brightness(1.2) drop-shadow(0 0 12px rgba(37, 99, 235, 0.8)) drop-shadow(0 0 6px rgba(59, 130, 246, 0.6))',
                    animation: isListening ? 'micPulse 0.8s ease-in-out infinite' : 'micGlow 3s ease-in-out infinite',
                  }}
                />
              </div>
              
              {/* Listening indicator with extra glow - MEDIUM BLUE */}
              {isListening && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span 
                    className="text-xs font-semibold text-primary animate-pulse"
                    style={{
                      textShadow: '0 0 15px rgba(59, 130, 246, 1), 0 0 25px rgba(37, 99, 235, 0.9)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    LISTENING...
                  </span>
                </div>
              )}

              {/* Hover tooltip - MEDIUM BLUE */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/mic:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
                <div 
                  className="glass-strong px-4 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
                  }}
                >
                  {isListening ? 'Stop listening' : 'Start voice chat'}
                </div>
              </div>
            </div>

            {/* Hover hint for orb */}
            {!isListening && (
              <div className="absolute -bottom-16 md:-bottom-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="glass-strong px-6 py-2 rounded-full whitespace-nowrap text-sm">
                  Tap to speak with Leiah
                </div>
              </div>
            )}
          </div>

          {/* Transcript display (when listening) */}
          {isListening && transcript && (
            <div className="glass-strong px-6 py-4 rounded-2xl max-w-2xl text-center animate-slide-in">
              <p className="text-lg text-foreground/90">{transcript}</p>
            </div>
          )}

          {/* Title */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(to right, #60a5fa, #93c5fd)',
                }}
              >
                Bluebird
              </span>
              <span className="text-white" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}>X</span>
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(to right, #60a5fa, #93c5fd)',
                }}
              >
                {' '}Intelligence
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Your Personal Luxury Transportation AI
            </p>
          </div>

          {/* Interaction hint */}
          <div className="flex items-center gap-2 text-sm text-primary/80">
            <Mic className="w-4 h-4" />
            <span>Tap the orb to speak, or use the chat bubble for text</span>
          </div>
        </div>
      </div>
    </section>
  );
}
