import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  style_preferences: string[] | null;
  body_measurements: Json | null;
  created_at: string;
  updated_at: string;
}

export interface BodyMeasurements {
  weight?: number;
  height?: number;
}

interface ProfileUpdate {
  full_name?: string;
  avatar_url?: string;
  style_preferences?: string[];
  body_measurements?: BodyMeasurements;
}

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!user?.id,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      // Cast body_measurements to Json type for Supabase
      const supabaseUpdates: Record<string, any> = { ...updates };
      if (updates.body_measurements) {
        supabaseUpdates.body_measurements = updates.body_measurements as unknown as Json;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(supabaseUpdates)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      toast.error('Failed to update profile: ' + error.message);
    },
  });

  return {
    profile,
    isLoading,
    updateProfile,
  };
};
