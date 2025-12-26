import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, BodyMeasurements } from "@/hooks/useProfile";
import { useOrders } from "@/hooks/useOrders";
import { User, Loader2, Scale, Package, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/formatCurrency";
import { format } from "date-fns";

const ProfilePage = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
  const { orders, isLoading: ordersLoading } = useOrders();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [weight, setWeight] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setEmail(profile.email || user?.email || "");
      const measurements = profile.body_measurements as BodyMeasurements | null;
      setWeight(measurements?.weight || "");
      setHeight(measurements?.height || "");
    }
  }, [profile, user]);

  const handleSaveProfile = async () => {
    await updateProfile.mutateAsync({ 
      full_name: fullName,
      body_measurements: {
        weight: weight === "" ? undefined : weight,
        height: height === "" ? undefined : height,
      }
    });
    setIsEditing(false);
  };

  if (authLoading || profileLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 md:pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-medium">My Profile</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your account details
                </p>
              </div>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>

            <div className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details here
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={!isEditing}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={email}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <Button 
                          variant="gold" 
                          onClick={handleSaveProfile}
                          disabled={updateProfile.isPending}
                        >
                          {updateProfile.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : null}
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Body Measurements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    Body Measurements
                  </CardTitle>
                  <CardDescription>
                    Used for size recommendations in virtual try-on
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")}
                        disabled={!isEditing}
                        placeholder="Enter your weight"
                        min={20}
                        max={250}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : "")}
                        disabled={!isEditing}
                        placeholder="Enter your height"
                        min={100}
                        max={250}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    These measurements help us provide accurate size recommendations when you use the virtual try-on feature.
                  </p>
                </CardContent>
              </Card>

              {/* Order History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order History
                  </CardTitle>
                  <CardDescription>
                    View your past orders and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">No orders yet</p>
                      <Button variant="outline" onClick={() => navigate('/shop')}>
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div 
                          key={order.id} 
                          className="border border-border rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Order #{order.id.slice(-8).toUpperCase()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(order.created_at), 'MMM dd, yyyy • h:mm a')}
                              </p>
                            </div>
                            <Badge 
                              variant={
                                order.status === 'completed' ? 'default' :
                                order.status === 'pending' ? 'secondary' :
                                order.status === 'cancelled' ? 'destructive' : 'outline'
                              }
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {item.product_name} × {item.quantity}
                                  <span className="ml-2 text-xs">
                                    (Size: {item.size}{item.color ? `, ${item.color}` : ''})
                                  </span>
                                </span>
                                <span>{formatPrice(item.price * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="border-t border-border pt-2 flex justify-between font-medium">
                            <span>Total</span>
                            <span>{formatPrice(order.total_amount)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ProfilePage;
