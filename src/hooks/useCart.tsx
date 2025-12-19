import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  size: string;
  color: string | null;
  quantity: number;
  created_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    images: string[] | null;
    brand: string | null;
  };
}

export const useCart = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(id, name, price, images, brand)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as CartItem[];
    },
    enabled: !!user,
  });

  const addToCart = useMutation({
    mutationFn: async ({ productId, size, color, quantity = 1 }: { 
      productId: string; 
      size: string; 
      color?: string;
      quantity?: number;
    }) => {
      if (!user) throw new Error('Please sign in to add items to cart');

      // Check if item already exists in cart
      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('size', size)
        .maybeSingle();

      if (existing) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            size,
            color,
            quantity,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Added to cart!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateQuantity = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (quantity <= 0) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeFromCart = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Removed from cart');
    },
  });

  const cartTotal = cartQuery.data?.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + (price * item.quantity);
  }, 0) || 0;

  const cartCount = cartQuery.data?.reduce((count, item) => count + item.quantity, 0) || 0;

  return {
    items: cartQuery.data || [],
    isLoading: cartQuery.isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
  };
};
