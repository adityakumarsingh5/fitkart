import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SellerProductForm from "@/components/SellerProductForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useUserRole } from "@/hooks/useUserRole";
import { User, Store, Package, Settings, Loader2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const ProfilePage = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
  const { userRole, isLoading: roleLoading, isSeller, updateRole } = useUserRole();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
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
    }
  }, [profile, user]);

  const handleSaveProfile = async () => {
    await updateProfile.mutateAsync({ full_name: fullName });
    setIsEditing(false);
  };

  const handleRoleChange = async (role: 'customer' | 'seller') => {
    await updateRole.mutateAsync(role);
  };

  if (authLoading || profileLoading || roleLoading) {
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
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-medium">My Profile</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your account and {isSeller ? 'products' : 'preferences'}
                </p>
              </div>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>

            <Tabs defaultValue="profile" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
                <TabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="role" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Account Type
                </TabsTrigger>
                {isSeller && (
                  <TabsTrigger value="products" className="gap-2">
                    <Package className="h-4 w-4" />
                    Add Product
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
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
              </TabsContent>

              {/* Role Tab */}
              <TabsContent value="role">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Account Type
                    </CardTitle>
                    <CardDescription>
                      Choose whether you want to shop or sell on our platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Customer Card */}
                      <button
                        onClick={() => handleRoleChange('customer')}
                        disabled={updateRole.isPending}
                        className={cn(
                          "p-6 rounded-2xl border-2 text-left transition-all hover:shadow-lg",
                          userRole === 'customer' 
                            ? "border-accent bg-accent/5" 
                            : "border-border hover:border-accent/50"
                        )}
                      >
                        <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                          <ShoppingBag className="h-7 w-7 text-accent" />
                        </div>
                        <h3 className="font-display text-xl font-medium mb-2">Customer</h3>
                        <p className="text-muted-foreground text-sm">
                          Browse and shop from our curated collection. Save favorites, 
                          use virtual try-on, and enjoy a seamless shopping experience.
                        </p>
                        {userRole === 'customer' && (
                          <span className="inline-block mt-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                            Current
                          </span>
                        )}
                      </button>

                      {/* Seller Card */}
                      <button
                        onClick={() => handleRoleChange('seller')}
                        disabled={updateRole.isPending}
                        className={cn(
                          "p-6 rounded-2xl border-2 text-left transition-all hover:shadow-lg",
                          userRole === 'seller' 
                            ? "border-accent bg-accent/5" 
                            : "border-border hover:border-accent/50"
                        )}
                      >
                        <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                          <Store className="h-7 w-7 text-accent" />
                        </div>
                        <h3 className="font-display text-xl font-medium mb-2">Seller</h3>
                        <p className="text-muted-foreground text-sm">
                          List your products on our marketplace. Upload images, 
                          set prices, and reach customers looking for quality fashion.
                        </p>
                        {userRole === 'seller' && (
                          <span className="inline-block mt-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                            Current
                          </span>
                        )}
                      </button>
                    </div>

                    {updateRole.isPending && (
                      <div className="flex items-center justify-center mt-6 text-muted-foreground">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating account type...
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Products Tab (Sellers Only) */}
              {isSeller && (
                <TabsContent value="products">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Add New Product
                      </CardTitle>
                      <CardDescription>
                        List a new product on the marketplace
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SellerProductForm />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ProfilePage;
