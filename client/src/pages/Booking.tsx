import { useState } from "react";
import BookingFlow from "@/components/BookingFlow";
import DriverSwipeCards from "@/components/DriverSwipeCards";

// Type for booking data to match DriverSwipeCards expected format
interface BookingData {
  pickupAddress: string;
  dropoffAddress: string;
  bookingType: "asap" | "scheduled";
  scheduledDate?: Date;
  scheduledTime?: string;
  passengerCount: string;
  vehicleType?: string;
}

export default function Booking() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  return (
    <div className="min-h-screen">
      <BookingFlow />
      <DriverSwipeCards bookingData={bookingData} />
    </div>
  );
}
