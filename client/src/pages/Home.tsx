import { useEffect, useState } from "react";
import HeroOrb from "@/components/HeroOrb";
import AIChat from "@/components/AIChat";
import BookingForm from "@/components/BookingForm";
import DriverSwipeCards from "@/components/DriverSwipeCards";

// Type for booking data
interface BookingData {
  pickupAddress: string;
  dropoffAddress: string;
  bookingType: "asap" | "scheduled";
  scheduledDate?: Date;
  scheduledTime?: string;
  passengerCount: string;
  vehicleType?: string;
}

export default function Home() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);
  const [showDrivers, setShowDrivers] = useState(false);

  useEffect(() => {
    // Ensure page starts at top on load
    window.scrollTo(0, 0);
  }, []);

  const handleBookingSubmit = async (data: BookingData) => {
    console.log("Booking submitted:", data);
    setBookingData(data);
    setIsLoadingDrivers(true);

    // Simulate API call to fetch drivers
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoadingDrivers(false);
    setShowDrivers(true);

    // Scroll to drivers section smoothly
    setTimeout(() => {
      const driversSection = document.getElementById("drivers-section");
      if (driversSection) {
        driversSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen">
      {/* 1. Hero section with glowing orb, orbiting vehicles, and microphone */}
      <HeroOrb />
      
      {/* 2. BluebirdX Intelligence section (AI chat) */}
      <AIChat />
      
      {/* 3. Booking form */}
      <BookingForm 
        onSubmit={handleBookingSubmit} 
        isLoading={isLoadingDrivers}
      />
      
      {/* 4. Driver swipe cards - Always visible */}
      <div id="drivers-section">
        <DriverSwipeCards bookingData={bookingData} />
      </div>
    </div>
  );
}
