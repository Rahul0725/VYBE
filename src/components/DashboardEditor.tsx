import { useState, useRef } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Link } from '../types/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Plus, Palette, Settings, Upload, Loader2, Trash2, Globe, ShieldAlert, Copy, Check } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableLink } from './SortableLink';
import ThemeSelector from './ThemeSelector';
import { TEMPLATES } from '../constants/templates';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

const STORAGE_SQL = `-- Create a storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Allow public access to view avatars
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload their own avatar
create policy "Users can upload their own avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

-- Allow users to update their own avatar
create policy "Users can update their own avatar."
  on storage.objects for update
  using ( bucket_id = 'avatars' );`;

interface DashboardEditorProps {
  user: any;
  links: Link[];
  onUpdateUser: (updates: Partial<any>) => void;
  onUpdateLinks: (links: Link[]) => void;
  onAddLink: () => void;
  onDeleteLink: (id: string) => void;
}

export default function DashboardEditor({ user, links, onUpdateUser, onUpdateLinks, onAddLink, onDeleteLink }: DashboardEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [showStorageError, setShowStorageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = links.findIndex((l) => l.id === active.id);
      const newIndex = links.findIndex((l) => l.id === over.id);
      onUpdateLinks(arrayMove(links, oldIndex, newIndex));
    }
  };

  const handleUpdateLink = (id: string, updates: Partial<Link>) => {
    const updatedLinks = links.map(l => l.id === id ? { ...l, ...updates } : l);
    onUpdateLinks(updatedLinks);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(STORAGE_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        // If bucket not found, try to create it (this might fail if RLS prevents it, but worth a try)
        if (uploadError.message.includes('Bucket not found') || (uploadError as any).statusCode === '404') {
          const { error: createError } = await supabase.storage.createBucket('avatars', {
            public: true,
            fileSizeLimit: 5242880,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
          });

          if (createError) {
            console.error('Failed to create bucket:', createError);
            setShowStorageError(true);
            return;
          }

          // Retry upload
          const { error: retryError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true });
            
          if (retryError) throw retryError;
        } else {
          throw uploadError;
        }
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      onUpdateUser({ avatar_url: data.publicUrl });
      toast.success('Profile photo updated');
    } catch (error) {
      console.error('Error uploading image:', error);
      // Only show alert if it wasn't the storage bucket error (which is handled by the dialog)
      if (!showStorageError) {
        toast.error('Error uploading image. Please try again.');
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 bg-black/40">
      <Dialog open={showStorageError} onOpenChange={setShowStorageError}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-400">
              <ShieldAlert className="w-5 h-5" />
              Storage Setup Required
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-left pt-2">
              The "avatars" storage bucket is missing. Please run this SQL in your Supabase SQL Editor to set it up:
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative mt-2 rounded-md bg-black/50 p-4 border border-white/10 font-mono text-xs text-zinc-300 overflow-x-auto max-h-[200px]">
            <pre>{STORAGE_SQL}</pre>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowStorageError(false)} className="bg-white text-black hover:bg-white/90">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-2xl mx-auto">
        <Tabs defaultValue="links" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/40 border border-white/5 p-1 rounded-xl backdrop-blur-md sticky top-0 z-10">
            <TabsTrigger value="links" className="data-[state=active]:bg-vybe-accent data-[state=active]:text-black rounded-lg transition-all font-medium">Links</TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-vybe-accent data-[state=active]:text-black rounded-lg transition-all font-medium">Appearance</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-vybe-accent data-[state=active]:text-black rounded-lg transition-all font-medium">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="links" className="space-y-6 focus-visible:outline-none">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Your Links</h2>
              <Button onClick={onAddLink} className="bg-vybe-accent text-black hover:bg-vybe-accent/90 gap-2">
                <Plus className="w-4 h-4" /> Add Link
              </Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={links} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {links.map((link) => (
                    <SortableLink 
                      key={link.id} 
                      link={link} 
                      onDelete={onDeleteLink} 
                      onUpdate={handleUpdateLink}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {links.length === 0 && (
              <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-white/20" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No links yet</h3>
                <p className="text-white/40 mb-6 max-w-xs mx-auto">Add your first link to start building your page.</p>
                <Button onClick={onAddLink} variant="outline" className="border-white/20 hover:bg-white/10">Add Link</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="appearance" className="space-y-8 focus-visible:outline-none">
            <section>
              <h2 className="text-2xl font-bold mb-6 tracking-tight">Profile</h2>
              <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 space-y-8 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-full bg-zinc-800 overflow-hidden border-4 border-zinc-900 shadow-xl shrink-0">
                      {user?.avatar_url ? (
                        <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white/20 bg-gradient-to-br from-white/5 to-white/10">
                          {user?.username?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-vybe-accent rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-black"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4 w-full text-center sm:text-left">
                    <div>
                      <h3 className="font-medium text-white">Profile Image</h3>
                      <p className="text-sm text-zinc-400 mt-1">
                        Recommended: Square JPG, PNG, or GIF. Max 5MB.
                      </p>
                    </div>
                    <div className="flex gap-3 justify-center sm:justify-start">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="border-white/10 hover:bg-white/5"
                      >
                        {uploading ? 'Uploading...' : 'Upload New'}
                      </Button>
                      {user?.avatar_url && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          onClick={() => onUpdateUser({ avatar_url: null })}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-5 border-t border-white/5 pt-6">
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Display Name</Label>
                    <Input 
                      value={user?.display_name || ''} 
                      onChange={(e) => onUpdateUser({ display_name: e.target.value })}
                      className="bg-black/40 border-white/10 focus:border-vybe-accent/50 focus:ring-vybe-accent/20 h-11"
                      placeholder="e.g. Alex Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Bio</Label>
                    <Textarea 
                      value={user?.bio || ''} 
                      onChange={(e) => onUpdateUser({ bio: e.target.value })}
                      className="bg-black/40 border-white/10 min-h-[120px] focus:border-vybe-accent/50 focus:ring-vybe-accent/20 resize-none p-4"
                      placeholder="Tell the world about yourself..."
                    />
                    <p className="text-xs text-zinc-500 text-right">
                      {(user?.bio || '').length}/150 characters
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 tracking-tight">Themes</h2>
              <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <ThemeSelector 
                  currentTemplateId={user?.theme_config?.templateId || 'minimal'} 
                  onSelect={(id) => onUpdateUser({ theme_config: { ...user?.theme_config, templateId: id } })}
                />
              </div>
            </section>
          </TabsContent>

          <TabsContent value="settings" className="space-y-8 focus-visible:outline-none">
            <h2 className="text-2xl font-bold mb-6 tracking-tight">Account Settings</h2>
            
            <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label className="text-base">Username</Label>
                    <p className="text-sm text-zinc-400">Your unique URL: <span className="text-vybe-accent">https://vybe.indevs.in/{user?.username}</span></p>
                  </div>
                  <div className="relative">
                    <Input 
                      value={user?.username || ''} 
                      disabled
                      className="w-full sm:w-64 bg-black/40 border-white/10 font-mono text-zinc-400 pl-10"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">@</div>
                  </div>
                </div>

                <div className="h-px bg-white/5" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-base">Custom Domain</Label>
                      <span className="px-2 py-0.5 rounded-full bg-vybe-accent/10 text-vybe-accent text-[10px] font-bold uppercase tracking-wider border border-vybe-accent/20">Pro</span>
                    </div>
                    <p className="text-sm text-zinc-400">Connect your own domain (e.g. yourname.com)</p>
                  </div>
                  <Button variant="outline" disabled className="border-white/10 opacity-50 cursor-not-allowed gap-2">
                    <Globe className="w-4 h-4" /> Upgrade to Pro
                  </Button>
                </div>
              </div>
              
              <div className="bg-red-500/5 border-t border-red-500/10 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <Label className="text-base text-red-400">Danger Zone</Label>
                    <p className="text-sm text-red-400/60">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive" size="sm" className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 gap-2">
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

