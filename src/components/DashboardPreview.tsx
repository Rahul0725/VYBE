import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Link } from '../types/link';
import MobilePreview from './MobilePreview';
import { Button } from './ui/button';
import { Share2, Smartphone, X, Copy, Check, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { Input } from './ui/input';

interface DashboardPreviewProps {
  user: any;
  links: Link[];
}

export default function DashboardPreview({ user, links }: DashboardPreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGeneratePreview = async () => {
    setIsGenerating(true);
    try {
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

      const { error } = await supabase
        .from('preview_tokens')
        .insert({
          user_id: user.id,
          token,
          expires_at: expiresAt
        });

      if (error) throw error;

      const url = `${window.location.origin}/preview/${token}`;
      setPreviewUrl(url);
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate preview link');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (previewUrl) {
      navigator.clipboard.writeText(previewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Link copied!');
    }
  };

  return (
    <div className="hidden lg:flex flex-col items-center justify-center h-full sticky top-0 p-8 border-l border-white/10 bg-vybe-darker/50 backdrop-blur-3xl">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-xl font-bold text-white/80">Live Preview</h2>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
      </div>

      <div className="relative group">
        <MobilePreview user={user} links={links} />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm rounded-[3rem]">
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="neon" size="icon" className="rounded-full w-12 h-12">
                <Smartphone className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-transparent border-none shadow-none p-0 flex items-center justify-center h-[90vh]">
              <div className="relative w-full h-full flex items-center justify-center scale-110 origin-center">
                <MobilePreview user={user} links={links} />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute -top-12 right-0 text-white hover:bg-white/10 rounded-full"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isShareOpen} onOpenChange={(open) => {
            setIsShareOpen(open);
            if (!open) setPreviewUrl(null);
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full w-12 h-12 bg-white/10 border-white/20 hover:bg-white/20 text-white">
                <Share2 className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-vybe-dark border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Share Preview</DialogTitle>
                <DialogDescription className="text-white/60">
                  Generate a temporary link to share your draft with others.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                {!previewUrl ? (
                  <Button onClick={handleGeneratePreview} disabled={isGenerating} className="w-full" variant="neon">
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Generate Preview Link
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input value={previewUrl} readOnly className="bg-black/20 border-white/10" />
                      <Button size="icon" onClick={copyToClipboard} variant="outline">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-yellow-500/80">
                      This link expires in 24 hours.
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-white/40">
          Changes are auto-saved
        </p>
      </div>
    </div>
  );
}

