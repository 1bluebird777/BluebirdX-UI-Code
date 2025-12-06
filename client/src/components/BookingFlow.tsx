import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin, Calendar as CalendarIcon, Clock, DollarSign, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface BookingData {
  pickupLocation: string;
  dropoffLocation: string;
  date: Date | undefined;
  time: string;
  estimatedFare: number;
}

export default function BookingFlow({ driverId, driverName }: { driverId?: number; driverName?: string }) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    pickupLocation: "",
    dropoffLocation: "",
    date: undefined,
    time: "",
    estimatedFare: 0,
  });

  const calculateFare = () => {
    // Simple fare calculation (will be replaced with actual API call)
    const baseFare = 25;
    const perMile = 3.5;
    const estimatedMiles = Math.floor(Math.random() * 20) + 5;
    return baseFare + (perMile * estimatedMiles);
  };

  const handleLocationSubmit = () => {
    if (bookingData.pickupLocation && bookingData.dropoffLocation) {
      const fare = calculateFare();
      setBookingData({ ...bookingData, estimatedFare: fare });
      setStep(2);
    }
  };

  const handleDateTimeSubmit = () => {
    if (bookingData.date && bookingData.time) {
      setStep(3);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <Card className="glass-strong border-border/30">
          <CardHeader>
            <CardTitle className="text-2xl text-gradient-primary">Complete Your Booking</CardTitle>
            <CardDescription className="text-muted-foreground">
              {driverName && `Driver: ${driverName}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      s <= step
                        ? "bg-primary text-primary-foreground glow-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded transition-all ${
                        s < step ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Locations */}
            {step === 1 && (
              <div className="space-y-6 animate-slide-in">
                <div className="space-y-2">
                  <Label htmlFor="pickup" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Pickup Location
                  </Label>
                  <Input
                    id="pickup"
                    placeholder="Enter pickup address..."
                    value={bookingData.pickupLocation}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, pickupLocation: e.target.value })
                    }
                    className="glass"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dropoff" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    Dropoff Location
                  </Label>
                  <Input
                    id="dropoff"
                    placeholder="Enter dropoff address..."
                    value={bookingData.dropoffLocation}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, dropoffLocation: e.target.value })
                    }
                    className="glass"
                  />
                </div>

                {/* Map Placeholder */}
                <div className="glass rounded-lg h-64 flex items-center justify-center border border-border/30">
                  <p className="text-muted-foreground">Google Maps Integration (Coming Soon)</p>
                </div>

                <Button
                  onClick={handleLocationSubmit}
                  disabled={!bookingData.pickupLocation || !bookingData.dropoffLocation}
                  className="w-full glow-primary"
                  size="lg"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <div className="space-y-6 animate-slide-in">
                <div className="glass rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Estimated Fare</span>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-accent" />
                      <span className="text-2xl font-bold text-gradient-gold">
                        ${bookingData.estimatedFare.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    Select Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full glass justify-start">
                        {bookingData.date ? (
                          format(bookingData.date, "PPP")
                        ) : (
                          <span className="text-muted-foreground">Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 glass-strong">
                      <Calendar
                        mode="single"
                        selected={bookingData.date}
                        onSelect={(date) => setBookingData({ ...bookingData, date })}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Select Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={bookingData.time}
                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                    className="glass"
                  />
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 glass">
                    Back
                  </Button>
                  <Button
                    onClick={handleDateTimeSubmit}
                    disabled={!bookingData.date || !bookingData.time}
                    className="flex-1 glow-primary"
                  >
                    Continue to Payment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment (Placeholder) */}
            {step === 3 && (
              <div className="space-y-6 animate-slide-in">
                <div className="glass rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Booking Summary</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pickup:</span>
                      <span className="text-foreground">{bookingData.pickupLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dropoff:</span>
                      <span className="text-foreground">{bookingData.dropoffLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="text-foreground">
                        {bookingData.date && format(bookingData.date, "PPP")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="text-foreground">{bookingData.time}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/30 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Total Fare:</span>
                    <span className="text-2xl font-bold text-gradient-gold">
                      ${bookingData.estimatedFare.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="glass rounded-lg p-6 text-center space-y-4">
                  <p className="text-muted-foreground">
                    Stripe Payment Integration (Coming Soon)
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1 glass">
                    Back
                  </Button>
                  <Button className="flex-1 glow-primary" size="lg">
                    Confirm Booking
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
