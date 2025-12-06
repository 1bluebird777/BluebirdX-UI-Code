import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, DollarSign, Star, TrendingUp, Clock } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Loader2 } from "lucide-react";

export default function DriverDashboard() {
  const { user, loading } = useAuth();
  const [isAvailable, setIsAvailable] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="glass-strong max-w-md">
          <CardHeader>
            <CardTitle>Driver Access Required</CardTitle>
            <CardDescription>Please log in to access the driver dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full glow-primary">
              <a href={getLoginUrl()}>Log In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mock driver data (will be replaced with real data from database)
  const driverStats = {
    rating: 4.9,
    totalRides: 247,
    earnings: 12450,
    activeRides: 2,
  };

  const upcomingRides = [
    {
      id: 1,
      pickup: "123 Main St, Downtown",
      dropoff: "Airport Terminal 2",
      time: "2:30 PM",
      fare: 45.00,
      status: "confirmed",
    },
    {
      id: 2,
      pickup: "Hotel Plaza",
      dropoff: "Convention Center",
      time: "5:00 PM",
      fare: 32.00,
      status: "pending",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient-primary">Driver Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name || "Driver"}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="availability" className="text-sm">
                {isAvailable ? "Available" : "Offline"}
              </Label>
              <Switch
                id="availability"
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-strong border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Star className="w-4 h-4 text-accent" />
                Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient-gold">{driverStats.rating}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on {driverStats.totalRides} rides
              </p>
            </CardContent>
          </Card>

          <Card className="glass-strong border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Total Rides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{driverStats.totalRides}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                +12 this week
              </p>
            </CardContent>
          </Card>

          <Card className="glass-strong border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-accent" />
                Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient-gold">
                ${driverStats.earnings.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="glass-strong border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Active Rides
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{driverStats.activeRides}</div>
              <p className="text-xs text-muted-foreground mt-1">In progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Rides */}
        <Card className="glass-strong border-border/30">
          <CardHeader>
            <CardTitle>Upcoming Rides</CardTitle>
            <CardDescription>Your scheduled bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingRides.map((ride) => (
                <div
                  key={ride.id}
                  className="glass rounded-lg p-4 flex items-center justify-between hover:bg-primary/5 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">{ride.pickup}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-6">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span className="text-sm text-muted-foreground">{ride.dropoff}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">{ride.time}</div>
                      <div className="text-lg font-bold text-gradient-gold">${ride.fare.toFixed(2)}</div>
                    </div>
                    <Badge
                      variant={ride.status === "confirmed" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {ride.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
