import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface OrderItem {
  product_id: string;
  product_name: string;
  size: string;
  color: string | null;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
  shipping_address: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export const useOrders = () => {
  const { user } = useAuth();

  const ordersQuery = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(order => ({
        ...order,
        items: order.items as unknown as OrderItem[],
        shipping_address: order.shipping_address as Record<string, any> | null,
      })) as Order[];
    },
    enabled: !!user,
  });

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
  };
};
