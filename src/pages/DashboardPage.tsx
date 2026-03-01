import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { Loader2, ExternalLink, Globe, EyeOff, LogOut } from 'lucide-react';
import DashboardEditor from '../components/DashboardEditor';
import DashboardPreview from '../components/DashboardPreview';
import { SchemaCheck } from '../components/SchemaCheck';
import { Link as LinkType } from '../types/link';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // Profile doesn't exist, redirect to onboarding
          navigate('/onboarding');
          return;
        }
        throw profileError;
      }
      setProfile(profileData);

      // Fetch links
      const { data: linksData, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', user!.id)
        .order('position', { ascending: true });

      if (linksError) throw linksError;
      setLinks(linksData || []);
    } catch (error: any) {
      toast.error('Error loading dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (updates: Partial<any>) => {
    // Optimistic update
    setProfile((prev: any) => ({ ...prev, ...updates }));

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user!.id);

      if (error) throw error;
    } catch (error: any) {
      toast.error('Failed to update profile');
      // Revert on error (optional, for now just log)
      console.error(error);
    }
  };

  const handleUpdateLinks = async (newLinks: LinkType[]) => {
    // Optimistic update
    setLinks(newLinks);

    try {
      // Update positions in DB if reordered
      const updates = newLinks.map((link, index) => ({
        id: link.id,
        position: index,
        ...link
      }));

      const { error } = await supabase
        .from('links')
        .upsert(updates);

      if (error) throw error;
    } catch (error: any) {
      toast.error('Failed to update links');
      console.error(error);
    }
  };

  const handleAddLink = async () => {
    const newLink = {
      user_id: user!.id,
      title: 'New Link',
      url: '',
      position: links.length,
      is_active: true,
    };

    // Optimistic add
    const tempId = Math.random().toString(36).substr(2, 9);
    // @ts-ignore
    setLinks([...links, { ...newLink, id: tempId, created_at: new Date().toISOString(), click_count: 0 } as LinkType]);

    try {
      const { data, error } = await supabase
        .from('links')
        .insert(newLink)
        .select()
        .single();

      if (error) throw error;
      
      // Replace temp link with real one
      setLinks(prev => prev.map(l => l.id === tempId ? data : l));
      toast.success('Link added');
    } catch (error: any) {
      toast.error('Failed to add link');
      setLinks(prev => prev.filter(l => l.id !== tempId));
    }
  };

  const handleDeleteLink = async (id: string) => {
    // Optimistic delete
    const previousLinks = [...links];
    setLinks(links.filter(l => l.id !== id));

    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Link deleted');
    } catch (error: any) {
      toast.error('Failed to delete link');
      setLinks(previousLinks);
    }
  };

  const handlePublishToggle = async () => {
    if (!profile) return;
    
    // Toggle logic
    const newStatus = !profile.is_published;
    setIsPublishing(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({ is_published: newStatus })
        .eq('id', user!.id);

      if (error) throw error;

      setProfile({ ...profile, is_published: newStatus });
      toast.success(newStatus ? 'Your page is now LIVE!' : 'Your page is unpublished');
    } catch (error: any) {
      toast.error('Failed to update status');
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-vybe-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-vybe-accent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-vybe-dark flex flex-col items-center justify-center p-4">
        <SchemaCheck />
        <h2 className="text-xl font-bold mb-2">Failed to load profile</h2>
        <p className="text-white/60 mb-4">There was an error loading your data. Please check your connection.</p>
        <Button onClick={fetchData} variant="outline">Retry</Button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-vybe-dark flex flex-col overflow-hidden">
      <SchemaCheck />
      {/* Header */}
      <header className="h-16 border-b border-white/10 bg-vybe-darker/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tighter">VYBE<span className="text-vybe-accent">.</span></span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-medium text-white/60">Free Plan</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4">
            <span className={`w-2 h-2 rounded-full ${profile?.is_published ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-yellow-500'}`} />
            <span className="text-sm text-white/60">{profile?.is_published ? 'Live' : 'Draft'}</span>
          </div>

          <Button 
            variant={profile?.is_published ? "outline" : "neon"} 
            size="sm" 
            onClick={handlePublishToggle}
            disabled={isPublishing}
            className="min-w-[100px]"
          >
            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              profile?.is_published ? (
                <><EyeOff className="w-4 h-4 mr-2" /> Unpublish</>
              ) : (
                <><Globe className="w-4 h-4 mr-2" /> Go Live</>
              )
            )}
          </Button>

          {profile?.is_published && (
            <Button variant="ghost" size="sm" asChild>
              <a href={`/${profile.username}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}

          <div className="h-6 w-px bg-white/10 mx-2" />
          
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-2" /> Log out
          </Button>
        </div>
      </header>

      {/* Main Content - Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Editor */}
        <div className="flex-1 overflow-hidden flex flex-col relative z-10 border-r border-white/10">
          <DashboardEditor 
            user={profile} 
            links={links} 
            onUpdateUser={handleUpdateUser}
            onUpdateLinks={handleUpdateLinks}
            onAddLink={handleAddLink}
            onDeleteLink={handleDeleteLink}
          />
        </div>

        {/* Right: Preview (Desktop only) */}
        <div className="w-[400px] xl:w-[480px] hidden lg:block relative z-20 bg-black/20">
          <DashboardPreview user={profile} links={links} />
        </div>
      </div>
    </div>
  );
}
