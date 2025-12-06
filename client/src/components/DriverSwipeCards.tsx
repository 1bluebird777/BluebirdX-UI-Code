import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Check, Info, Star, MapPin, Languages, Award, RefreshCw } from "lucide-react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";

interface Driver {
  id: number;
  name: string;
  rating: number;
  totalRides: number;
  vehicle: string;
  distance: string;
  languages: string[];
  yearsExperience: number;
  specialties: string[];
  imageUrl: string;
  isAvailable: boolean;
}

interface BookingData {
  pickupAddress: string;
  dropoffAddress: string;
  bookingType: "asap" | "scheduled";
  scheduledDate?: Date;
  scheduledTime?: string;
  passengerCount: string;
  vehicleType?: string;
}

// Sample driver data (will be replaced with real Supabase data)
const sampleDrivers: Driver[] = [
  {
    id: 1,
    name: "Michael Anderson",
    rating: 4.9,
    totalRides: 247,
    vehicle: "Mercedes S-Class",
    distance: "5 min away",
    languages: ["English", "Spanish"],
    yearsExperience: 7,
    specialties: ["Airport Expert", "Corporate", "VIP Events"],
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    isAvailable: true,
  },
  {
    id: 2,
    name: "Sophia Martinez",
    rating: 5.0,
    totalRides: 312,
    vehicle: "BMW 7 Series",
    distance: "8 min away",
    languages: ["English", "French"],
    yearsExperience: 5,
    specialties: ["Airport Expert", "VIP Events"],
    imageUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    isAvailable: true,
  },
  {
    id: 3,
    name: "James Chen",
    rating: 4.8,
    totalRides: 189,
    vehicle: "Audi A8",
    distance: "12 min away",
    languages: ["English", "Mandarin"],
    yearsExperience: 4,
    specialties: ["Corporate", "Late Night"],
    imageUrl: "https://randomuser.me/api/portraits/men/67.jpg",
    isAvailable: true,
  },
];

function DriverCard({ driver, onSwipe, style }: { driver: Driver; onSwipe: (direction: "left" | "right") => void; style?: any }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipe(info.offset.x > 0 ? "right" : "left");
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity, ...style }}
      className="absolute inset-0"
    >
      <div className="glass-strong rounded-3xl overflow-hidden h-full shadow-2xl border-2 border-border/30">
        {/* Driver Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={driver.imageUrl}
            alt={driver.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          
          {/* Availability Badge */}
          {driver.isAvailable && (
            <div className="absolute top-4 right-4 flex items-center gap-1 glass px-3 py-1.5 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              AVAILABLE NOW
            </div>
          )}
        </div>

        {/* Driver Info */}
        <div className="p-6 space-y-4">
          {/* Name and Rating */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">{driver.name}</h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 text-accent">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-semibold">{driver.rating}</span>
              </div>
              <span className="text-muted-foreground">({driver.totalRides} rides)</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{driver.vehicle}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{driver.distance}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Languages className="w-4 h-4 text-primary" />
              <span>{driver.languages.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="w-4 h-4 text-primary" />
              <span>{driver.yearsExperience} years exp</span>
            </div>
          </div>

          {/* Specialties */}
          <div className="flex flex-wrap gap-2">
            {driver.specialties.map((specialty) => (
              <span
                key={specialty}
                className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Swipe Indicators */}
        <motion.div
          style={{ opacity: useTransform(x, [-200, -50], [1, 0]) }}
          className="absolute top-1/2 left-8 -translate-y-1/2 pointer-events-none"
        >
          <div className="w-20 h-20 rounded-full bg-destructive/20 border-4 border-destructive flex items-center justify-center">
            <X className="w-10 h-10 text-destructive" />
          </div>
        </motion.div>
        
        <motion.div
          style={{ opacity: useTransform(x, [50, 200], [0, 1]) }}
          className="absolute top-1/2 right-8 -translate-y-1/2 pointer-events-none"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center">
            <Check className="w-10 h-10 text-green-500" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function DriverSwipeCards({ bookingData }: { bookingData?: BookingData | null }) {
  const [drivers, setDrivers] = useState<Driver[]>(sampleDrivers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedDriver, setMatchedDriver] = useState<Driver | null>(null);

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right" && drivers[currentIndex]) {
      setMatchedDriver(drivers[currentIndex]);
      setShowMatch(true);
    }
    
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 300);
  };

  const handleSkip = () => handleSwipe("left");
  const handleSelect = () => handleSwipe("right");
  
  const handleRefresh = () => {
    setCurrentIndex(0);
    setDrivers([...sampleDrivers]);
  };

  const currentDriver = drivers[currentIndex];
  const hasMoreDrivers = currentIndex < drivers.length;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background/50 to-background" id="drivers-section">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          {/* Booking Info Display */}
          {bookingData && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong rounded-2xl p-6 mb-6 border border-primary/20"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Your Booking Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Pickup:</span>
                  <p className="text-foreground font-medium">{bookingData.pickupAddress}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Drop-off:</span>
                  <p className="text-foreground font-medium">{bookingData.dropoffAddress}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">When:</span>
                  <p className="text-foreground font-medium">
                    {bookingData.bookingType === "asap" 
                      ? "ASAP" 
                      : bookingData.scheduledDate 
                        ? `${bookingData.scheduledDate.toLocaleDateString()} at ${bookingData.scheduledTime}` 
                        : "Scheduled"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Passengers:</span>
                  <p className="text-foreground font-medium">{bookingData.passengerCount}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Available Drivers</h2>
            <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-muted-foreground">Live Availability</span>
            </div>
          </div>

          {/* Cards Stack */}
          {hasMoreDrivers ? (
            <div className="relative h-[500px] mb-6">
              {/* Background cards for depth effect */}
              {drivers.slice(currentIndex + 1, currentIndex + 3).map((driver, index) => (
                <div
                  key={driver.id}
                  className="absolute inset-0 glass-strong rounded-3xl"
                  style={{
                    transform: `scale(${1 - (index + 1) * 0.05}) translateY(${(index + 1) * 10}px)`,
                    opacity: 1 - (index + 1) * 0.3,
                    zIndex: 10 - index,
                  }}
                />
              ))}

              {/* Active card */}
              {currentDriver && (
                <DriverCard
                  key={currentDriver.id}
                  driver={currentDriver}
                  onSwipe={handleSwipe}
                  style={{ zIndex: 20 }}
                />
              )}
            </div>
          ) : (
            <div className="glass-strong rounded-3xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">You've viewed all available drivers</h3>
              <p className="text-muted-foreground">Refresh to see updated availability</p>
              <Button onClick={handleRefresh} className="glow-primary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Drivers
              </Button>
            </div>
          )}

          {/* Control Buttons */}
          {hasMoreDrivers && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleSkip}
                className="w-16 h-16 rounded-full glass border-destructive/30 hover:bg-destructive/10"
              >
                <X className="w-6 h-6 text-destructive" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="w-14 h-14 rounded-full glass"
              >
                <Info className="w-5 h-5 text-primary" />
              </Button>
              
              <Button
                size="lg"
                onClick={handleSelect}
                className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 glow-accent"
              >
                <Check className="w-6 h-6" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Match Celebration Overlay */}
      {showMatch && matchedDriver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 flex items-center justify-center"
          onClick={() => setShowMatch(false)}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="text-center space-y-6"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-accent via-primary to-accent flex items-center justify-center mx-auto glow-accent"
            >
              <Star className="w-16 h-16 text-background fill-current" />
            </motion.div>
            
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-gradient-gold">Perfect Match!</h2>
              <p className="text-2xl text-foreground">{matchedDriver.name}</p>
              <p className="text-muted-foreground">Your driver has been selected</p>
            </div>
            
            <Button
              size="lg"
              onClick={() => setShowMatch(false)}
              className="glow-primary text-lg px-8"
            >
              Continue to Booking
              <Check className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
