import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { AlarmTemplate } from '../types';

export const useAlarmTemplates = () => {
  const [templates, setTemplates] = useState<AlarmTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('alarm_templates')
          .select('*')
          .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;
        setTemplates(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return { templates, loading, error };
};
