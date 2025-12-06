import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Car,
  Search,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

// Booking form schema
const bookingSchema = z.object({
  pickupAddress: z.string().min(5, "Please enter a valid pickup address"),
  dropoffAddress: z.string().min(5, "Please enter a valid drop-off address"),
  bookingType: z.enum(["asap", "scheduled"]),
  scheduledDate: z.date().optional(),
  scheduledTime: z.string().optional(),
  passengerCount: z.string().min(1, "Please select number of passengers"),
  vehicleType: z.string().optional(),
}).refine(
  (data) => {
    if (data.bookingType === "scheduled") {
      return data.scheduledDate && data.scheduledTime;
    }
    return true;
  },
  {
    message: "Date and time are required for scheduled bookings",
    path: ["scheduledDate"],
  }
);

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void;
  isLoading?: boolean;
}

// Vehicle types
const vehicleTypes = [
  { value: "sedan", label: "Luxury Sedan", icon: "🚗" },
  { value: "suv", label: "SUV/Escalade", icon: "🚙" },
  { value: "sprinter", label: "Sprinter Van", icon: "🚐" },
  { value: "any", label: "Any Available", icon: "✨" },
];

export default function BookingForm({ onSubmit, isLoading = false }: BookingFormProps) {
  const [bookingType, setBookingType] = useState<"asap" | "scheduled">("asap");
  const [pickupSuggestions, setPickupSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDropoffSuggestions, setShowDropoffSuggestions] = useState(false);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);

  const pickupInputRef = useRef<HTMLInputElement>(null);
  const dropoffInputRef = useRef<HTMLInputElement>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);

  // Load Google Maps API
  const { isLoaded: isMapsLoaded, loadError: mapsLoadError } = useGoogleMaps();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      bookingType: "asap",
      passengerCount: "1",
      vehicleType: "any",
    },
  });

  const selectedDate = watch("scheduledDate");
  const watchedBookingType = watch("bookingType");

  // Initialize Google Places Autocomplete Service
  useEffect(() => {
    if (isMapsLoaded && window.google && window.google.maps && window.google.maps.places) {
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
    }
  }, [isMapsLoaded]);

  // Handle pickup address change
  const handlePickupChange = async (value: string) => {
    setValue("pickupAddress", value);
    
    if (value.length < 3) {
      setPickupSuggestions([]);
      setShowPickupSuggestions(false);
      return;
    }

    if (autocompleteServiceRef.current) {
      setIsLoadingPlaces(true);
      try {
        const results = await autocompleteServiceRef.current.getPlacePredictions({
          input: value,
          componentRestrictions: { country: "us" }, // Restrict to US
        });
        setPickupSuggestions(results.predictions || []);
        setShowPickupSuggestions(true);
      } catch (error) {
        console.error("Error fetching place suggestions:", error);
      } finally {
        setIsLoadingPlaces(false);
      }
    }
  };

  // Handle dropoff address change
  const handleDropoffChange = async (value: string) => {
    setValue("dropoffAddress", value);
    
    if (value.length < 3) {
      setDropoffSuggestions([]);
      setShowDropoffSuggestions(false);
      return;
    }

    if (autocompleteServiceRef.current) {
      setIsLoadingPlaces(true);
      try {
        const results = await autocompleteServiceRef.current.getPlacePredictions({
          input: value,
          componentRestrictions: { country: "us" },
        });
        setDropoffSuggestions(results.predictions || []);
        setShowDropoffSuggestions(true);
      } catch (error) {
        console.error("Error fetching place suggestions:", error);
      } finally {
        setIsLoadingPlaces(false);
      }
    }
  };

  // Generate time slots (15-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const displayTime = format(new Date().setHours(hour, minute), "h:mm a");
        slots.push({ value: timeString, label: displayTime });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleFormSubmit = (data: BookingFormData) => {
    onSubmit(data);
  };

  return (
    <div className="w-full py-20 px-4 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-purple-950/20 to-blue-950/20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            Book Your Ride
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-lg text-gray-300"
          >
            Experience luxury transportation at your fingertips
          </motion.p>
        </div>

        {/* Glassmorphism Form Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative backdrop-blur-xl bg-white/5 rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* Booking Type Tabs */}
            <div>
              <Tabs
                value={bookingType}
                onValueChange={(value) => {
                  setBookingType(value as "asap" | "scheduled");
                  setValue("bookingType", value as "asap" | "scheduled");
                }}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-sm border border-white/10 p-1 h-14">
                  <TabsTrigger
                    value="asap"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-300 font-semibold rounded-lg transition-all duration-300 h-12"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    ASAP
                  </TabsTrigger>
                  <TabsTrigger
                    value="scheduled"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300 font-semibold rounded-lg transition-all duration-300 h-12"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Scheduled
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Address Inputs */}
            <div className="space-y-6">
              {/* Pickup Address */}
              <div className="relative">
                <Label htmlFor="pickup" className="text-gray-200 font-semibold mb-2 block flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                  Pickup Location
                </Label>
                <div className="relative">
                  <Input
                    {...register("pickupAddress")}
                    ref={pickupInputRef}
                    id="pickup"
                    placeholder="Enter pickup address"
                    onChange={(e) => handlePickupChange(e.target.value)}
                    onFocus={() => pickupSuggestions.length > 0 && setShowPickupSuggestions(true)}
                    className={cn(
                      "h-14 pl-12 pr-4 bg-white/5 border-white/10 text-white placeholder:text-gray-500",
                      "focus:bg-white/10 focus:border-blue-500/50 transition-all duration-300",
                      "backdrop-blur-sm rounded-xl",
                      errors.pickupAddress && "border-red-500/50"
                    )}
                  />
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                  {isLoadingPlaces && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 animate-spin" />
                  )}
                </div>
                {errors.pickupAddress && (
                  <p className="text-red-400 text-sm mt-1">{errors.pickupAddress.message}</p>
                )}
                
                {/* Pickup Suggestions Dropdown */}
                {showPickupSuggestions && pickupSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                  >
                    {pickupSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.place_id}
                        type="button"
                        onClick={() => {
                          setValue("pickupAddress", suggestion.description);
                          setShowPickupSuggestions(false);
                          setPickupSuggestions([]);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-blue-500/20 transition-colors duration-200 border-b border-white/5 last:border-b-0 flex items-start gap-3"
                      >
                        <MapPin className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                        <span className="text-gray-200 text-sm">{suggestion.description}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Dropoff Address */}
              <div className="relative">
                <Label htmlFor="dropoff" className="text-gray-200 font-semibold mb-2 block flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-purple-400" />
                  Drop-off Location
                </Label>
                <div className="relative">
                  <Input
                    {...register("dropoffAddress")}
                    ref={dropoffInputRef}
                    id="dropoff"
                    placeholder="Enter drop-off address"
                    onChange={(e) => handleDropoffChange(e.target.value)}
                    onFocus={() => dropoffSuggestions.length > 0 && setShowDropoffSuggestions(true)}
                    className={cn(
                      "h-14 pl-12 pr-4 bg-white/5 border-white/10 text-white placeholder:text-gray-500",
                      "focus:bg-white/10 focus:border-purple-500/50 transition-all duration-300",
                      "backdrop-blur-sm rounded-xl",
                      errors.dropoffAddress && "border-red-500/50"
                    )}
                  />
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                  {isLoadingPlaces && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 animate-spin" />
                  )}
                </div>
                {errors.dropoffAddress && (
                  <p className="text-red-400 text-sm mt-1">{errors.dropoffAddress.message}</p>
                )}
                
                {/* Dropoff Suggestions Dropdown */}
                {showDropoffSuggestions && dropoffSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                  >
                    {dropoffSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.place_id}
                        type="button"
                        onClick={() => {
                          setValue("dropoffAddress", suggestion.description);
                          setShowDropoffSuggestions(false);
                          setDropoffSuggestions([]);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-purple-500/20 transition-colors duration-200 border-b border-white/5 last:border-b-0 flex items-start gap-3"
                      >
                        <MapPin className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                        <span className="text-gray-200 text-sm">{suggestion.description}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Scheduled Date & Time */}
            {bookingType === "scheduled" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Date Picker */}
                <div>
                  <Label className="text-gray-200 font-semibold mb-2 block flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-2 text-purple-400" />
                    Date
                  </Label>
                  <Controller
                    control={control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-14 justify-start text-left font-normal",
                              "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white",
                              "backdrop-blur-sm rounded-xl",
                              !field.value && "text-gray-500",
                              errors.scheduledDate && "border-red-500/50"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-purple-400" />
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-900/95 backdrop-blur-xl border-white/10" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="rounded-xl"
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.scheduledDate && (
                    <p className="text-red-400 text-sm mt-1">{errors.scheduledDate.message as string}</p>
                  )}
                </div>

                {/* Time Picker */}
                <div>
                  <Label htmlFor="time" className="text-gray-200 font-semibold mb-2 block flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-purple-400" />
                    Time
                  </Label>
                  <Controller
                    control={control}
                    name="scheduledTime"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger
                          className={cn(
                            "h-14 bg-white/5 border-white/10 text-white",
                            "focus:bg-white/10 focus:border-purple-500/50",
                            "backdrop-blur-sm rounded-xl",
                            errors.scheduledTime && "border-red-500/50"
                          )}
                        >
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/10 max-h-60">
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot.value} value={slot.value} className="text-white hover:bg-purple-500/20">
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.scheduledTime && (
                    <p className="text-red-400 text-sm mt-1">{errors.scheduledTime.message}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Passenger Count & Vehicle Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Passenger Count */}
              <div>
                <Label htmlFor="passengers" className="text-gray-200 font-semibold mb-2 block flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-400" />
                  Passengers
                </Label>
                <Controller
                  control={control}
                  name="passengerCount"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={cn(
                          "h-14 bg-white/5 border-white/10 text-white",
                          "focus:bg-white/10 focus:border-blue-500/50",
                          "backdrop-blur-sm rounded-xl",
                          errors.passengerCount && "border-red-500/50"
                        )}
                      >
                        <SelectValue placeholder="Select passengers" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/10">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()} className="text-white hover:bg-blue-500/20">
                            {num} {num === 1 ? "Passenger" : "Passengers"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.passengerCount && (
                  <p className="text-red-400 text-sm mt-1">{errors.passengerCount.message}</p>
                )}
              </div>

              {/* Vehicle Type */}
              <div>
                <Label htmlFor="vehicle" className="text-gray-200 font-semibold mb-2 block flex items-center">
                  <Car className="w-4 h-4 mr-2 text-blue-400" />
                  Vehicle Type
                </Label>
                <Controller
                  control={control}
                  name="vehicleType"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className="h-14 bg-white/5 border-white/10 text-white focus:bg-white/10 focus:border-blue-500/50 backdrop-blur-sm rounded-xl"
                      >
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900/95 backdrop-blur-xl border-white/10">
                        {vehicleTypes.map((vehicle) => (
                          <SelectItem key={vehicle.value} value={vehicle.value} className="text-white hover:bg-blue-500/20">
                            <span className="flex items-center gap-2">
                              <span>{vehicle.icon}</span>
                              <span>{vehicle.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-4"
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-500 hover:via-purple-500 hover:to-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Finding Drivers...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Find Available Drivers
                  </span>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
