import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: {
    id: string;
    name: string;
    price: number;
    images: string[] | null;
    brand: string | null;
    sizes: string[];
    colors: string[] | null;
  };
}

export const useWishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          *,
          product:products(id, name, price, images, brand, sizes, colors)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as WishlistItem[];
    },
    enabled: !!user,
  });

  const addToWishlist = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('Please sign in to add items to wishlist');

      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          user_id: user.id,
          product_id: productId,
        });
      
      if (error) {
        if (error.code === '23505') {
          throw new Error('Item already in wishlist');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('Please sign in');

      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
    },
  });

  const isInWishlist = (productId: string) => {
    return wishlistQuery.data?.some(item => item.product_id === productId) || false;
  };

  const toggleWishlist = async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist.mutateAsync(productId);
    } else {
      await addToWishlist.mutateAsync(productId);
    }
  };

  return {
    items: wishlistQuery.data || [],
    isLoading: wishlistQuery.isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    wishlistCount: wishlistQuery.data?.length || 0,
  };
};
