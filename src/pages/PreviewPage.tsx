import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Link as LinkType } from '../types/link';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';
import ProfileRenderer from '../components/ProfileRenderer';

export default function PreviewPage() {
  const { token } = useParams<{ token: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  const validateToken = async () => {
    try {
      // 1. Check token validity
      const { data: tokenData, error: tokenError } = await supabase
        .from('preview_tokens')
        .select('user_id, expires_at')
        .eq('token', token)
        .single();

      if (tokenError || !tokenData) {
        setError('Invalid preview link');
        return;
      }

      if (new Date(tokenData.expires_at) < new Date()) {
        setError('Preview link expired');
        return;
      }

      // 2. Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', tokenData.user_id)
        .single();

      if (profileError || !profileData) {
        setError('User not found');
        return;
      }

      setProfile(profileData);

      // 3. Fetch links (even inactive ones for preview?) - usually preview shows what's live, but maybe draft state too?
      // Let's show all active links for now, matching public view but bypassing is_published check
      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', tokenData.user_id)
        .eq('is_active', true)
        .order('position', { ascending: true });
      
      if (linksError) throw linksError;
      
      setLinks(linksData as LinkType[]);
    } catch (error) {
      console.error(error);
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-vybe-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-vybe-accent" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-vybe-dark flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold mb-4">Preview Error</h1>
        <p className="text-xl text-white/60 mb-8">{error}</p>
        <Button variant="outline" asChild>
          <a href="/">Go Home</a>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-vybe-accent text-black text-center py-2 font-bold z-50">
        Preview Mode
      </div>
      <div className="pt-10">
        <ProfileRenderer user={profile} links={links} isPreview={true} />
      </div>
    </>
  );
}
