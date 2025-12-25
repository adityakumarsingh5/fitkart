import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

type UserRole = 'customer' | 'seller';

export const useUserRole = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: userRole, isLoading } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data?.role as UserRole | null;
    },
    enabled: !!user?.id,
  });

  const updateRole = useMutation({
    mutationFn: async (newRole: UserRole) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      // Check if role exists
      const { data: existing } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: user.id, role: newRole });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
      toast.success('Role updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update role: ' + error.message);
    },
  });

  return {
    userRole,
    isLoading,
    isSeller: userRole === 'seller',
    isCustomer: userRole === 'customer',
    updateRole,
  };
};
