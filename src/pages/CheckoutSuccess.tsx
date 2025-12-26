import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Clear the cart after successful payment
    const clearCart = async () => {
      if (user) {
        await supabase.from('cart_items').delete().eq('user_id', user.id);
        queryClient.invalidateQueries({ queryKey: ['cart'] });
      }
    };
    clearCart();
  }, [user, queryClient]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
              <CardDescription>
                Thank you for your order. Your payment has been processed successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessionId && (
                <p className="text-sm text-muted-foreground">
                  Order Reference: {sessionId.slice(-8).toUpperCase()}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                You will receive an email confirmation shortly.
              </p>
              <div className="flex flex-col gap-2 pt-4">
                <Button onClick={() => navigate('/shop')}>
                  Continue Shopping
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
