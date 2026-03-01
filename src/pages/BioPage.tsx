import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Link as LinkType } from '../types/link';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';
import ProfileRenderer from '../components/ProfileRenderer';

export default function BioPage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const fetchProfile = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError || !profileData) {
        setNotFound(true);
        return;
      }

      // Check if published
      if (!profileData.is_published) {
        setNotFound(true);
        return;
      }

      setProfile(profileData);

      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', profileData.id)
        .eq('is_active', true)
        .order('position', { ascending: true });
      
      if (linksError) throw linksError;
      
      setLinks(linksData as LinkType[]);
    } catch (error) {
      console.error(error);
      setNotFound(true);
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

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-vybe-dark flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-6xl font-black mb-4">404</h1>
        <p className="text-xl text-white/60 mb-8">This VYBE doesn't exist yet.</p>
        <Button variant="neon" asChild>
          <a href="/">Claim this username</a>
        </Button>
      </div>
    );
  }

  return <ProfileRenderer user={profile} links={links} />;
}
