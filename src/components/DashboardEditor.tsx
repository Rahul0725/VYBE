import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Link } from '../types/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Plus, Palette, Settings } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableLink } from './SortableLink';
import ThemeSelector from './ThemeSelector';
import { TEMPLATES } from '../constants/templates';

interface DashboardEditorProps {
  user: any;
  links: Link[];
  onUpdateUser: (updates: Partial<any>) => void;
  onUpdateLinks: (links: Link[]) => void;
  onAddLink: () => void;
  onDeleteLink: (id: string) => void;
}

export default function DashboardEditor({ user, links, onUpdateUser, onUpdateLinks, onAddLink, onDeleteLink }: DashboardEditorProps) {
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

  return (
    <div className="flex-1 overflow-y-auto p-8 pb-32">
      <div className="max-w-2xl mx-auto">
        <Tabs defaultValue="links" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/5 p-1 rounded-xl">
            <TabsTrigger value="links" className="data-[state=active]:bg-vybe-accent data-[state=active]:text-black rounded-lg transition-all">Links</TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-vybe-accent data-[state=active]:text-black rounded-lg transition-all">Appearance</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-vybe-accent data-[state=active]:text-black rounded-lg transition-all">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="links" className="space-y-6 focus-visible:outline-none">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Links</h2>
              <Button onClick={onAddLink} variant="neon" size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Add Link
              </Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={links} strategy={verticalListSortingStrategy}>
                {links.map((link) => (
                  <SortableLink 
                    key={link.id} 
                    link={link} 
                    onDelete={onDeleteLink} 
                    onUpdate={handleUpdateLink}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {links.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
                <p className="text-white/40 mb-4">No links yet. Add your first one!</p>
                <Button onClick={onAddLink} variant="outline">Add Link</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="appearance" className="space-y-8 focus-visible:outline-none">
            <div>
              <h2 className="text-2xl font-bold mb-6">Profile</h2>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-white/10 overflow-hidden border-2 border-white/20 shrink-0">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white/20">
                        {user?.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <Button variant="outline" size="sm">Change Photo</Button>
                    <p className="text-xs text-white/40">Recommended: Square JPG, PNG, or GIF. Max 5MB.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    <Input 
                      value={user?.display_name || ''} 
                      onChange={(e) => onUpdateUser({ display_name: e.target.value })}
                      className="bg-black/20 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea 
                      value={user?.bio || ''} 
                      onChange={(e) => onUpdateUser({ bio: e.target.value })}
                      className="bg-black/20 border-white/10 min-h-[100px]"
                      placeholder="Tell the world about yourself..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Themes</h2>
              <ThemeSelector 
                currentTemplateId={user?.theme_config?.templateId || 'minimal'} 
                onSelect={(id) => onUpdateUser({ theme_config: { ...user?.theme_config, templateId: id } })}
              />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 focus-visible:outline-none">
            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Username</Label>
                  <p className="text-xs text-white/40">Your unique URL: vybe.bio/{user?.username}</p>
                </div>
                <Input 
                  value={user?.username || ''} 
                  disabled
                  className="w-48 bg-black/20 border-white/10 text-right font-mono opacity-50"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="space-y-1">
                  <Label>Custom Domain</Label>
                  <p className="text-xs text-white/40">Connect your own domain (Pro feature)</p>
                </div>
                <Button variant="outline" disabled>Upgrade to Pro</Button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="space-y-1">
                  <Label className="text-red-400">Danger Zone</Label>
                  <p className="text-xs text-white/40">Delete your account and all data</p>
                </div>
                <Button variant="destructive" size="sm">Delete Account</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

