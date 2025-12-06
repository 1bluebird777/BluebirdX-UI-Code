import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Car, DollarSign, TrendingUp, BarChart3, Loader2 } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function AdminPanel() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="glass-strong max-w-md">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>You need administrator privileges to access this page</CardDescription>
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

  // Mock admin data (will be replaced with real database queries)
  const systemStats = {
    totalUsers: 1247,
    totalDrivers: 45,
    totalBookings: 3892,
    revenue: 156780,
  };

  const recentDrivers = [
    { id: 1, name: "Michael Anderson", status: "active", rating: 4.9, rides: 247 },
    { id: 2, name: "Sophia Martinez", status: "active", rating: 5.0, rides: 312 },
    { id: 3, name: "James Chen", status: "offline", rating: 4.8, rides: 189 },
  ];

  const recentBookings = [
    { id: 1, user: "John Doe", driver: "Michael Anderson", fare: 45.00, status: "completed" },
    { id: 2, user: "Jane Smith", driver: "Sophia Martinez", fare: 62.50, status: "in_progress" },
    { id: 3, user: "Bob Johnson", driver: "James Chen", fare: 38.00, status: "confirmed" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Admin Panel</h1>
          <p className="text-muted-foreground">System overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-strong border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{systemStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                +15% this month
              </p>
            </CardContent>
          </Card>

          <Card className="glass-strong border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Car className="w-4 h-4 text-primary" />
                Active Drivers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{systemStats.totalDrivers}</div>
              <p className="text-xs text-muted-foreground mt-1">Verified drivers</p>
            </CardContent>
          </Card>

          <Card className="glass-strong border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Total Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{systemStats.totalBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card className="glass-strong border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-accent" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient-gold">
                ${systemStats.revenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">This year</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="drivers" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="drivers" className="space-y-4">
            <Card className="glass-strong border-border/30">
              <CardHeader>
                <CardTitle>Driver Management</CardTitle>
                <CardDescription>Manage and monitor all drivers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDrivers.map((driver) => (
                    <div
                      key={driver.id}
                      className="glass rounded-lg p-4 flex items-center justify-between hover:bg-primary/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <Car className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{driver.name}</div>
                          <div className="text-sm text-muted-foreground">{driver.rides} rides</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-accent">⭐ {driver.rating}</div>
                        </div>
                        <Badge variant={driver.status === "active" ? "default" : "secondary"}>
                          {driver.status}
                        </Badge>
                        <Button variant="outline" size="sm" className="glass">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card className="glass-strong border-border/30">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest ride bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="glass rounded-lg p-4 flex items-center justify-between hover:bg-primary/5 transition-colors"
                    >
                      <div>
                        <div className="font-medium text-foreground">{booking.user}</div>
                        <div className="text-sm text-muted-foreground">Driver: {booking.driver}</div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-lg font-bold text-gradient-gold">
                          ${booking.fare.toFixed(2)}
                        </div>
                        <Badge
                          variant={
                            booking.status === "completed"
                              ? "default"
                              : booking.status === "in_progress"
                              ? "secondary"
                              : "outline"
                          }
                          className="capitalize min-w-[100px] justify-center"
                        >
                          {booking.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card className="glass-strong border-border/30">
              <CardHeader>
                <CardTitle>System Analytics</CardTitle>
                <CardDescription>Performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="glass rounded-lg h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">Analytics Charts (Coming Soon)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
