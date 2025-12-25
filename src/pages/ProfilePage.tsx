import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, BodyMeasurements } from "@/hooks/useProfile";
import { User, Loader2, Scale } from "lucide-react";

const ProfilePage = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
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
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ProfilePage;
