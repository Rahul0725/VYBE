import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AlertTriangle, Copy, Check, Terminal } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';

const FIX_SQL = `-- Add missing columns to users table
alter table public.users 
add column if not exists theme_config jsonb default '{}'::jsonb,
add column if not exists is_published boolean default false,
add column if not exists custom_domain text unique,
add column if not exists social_links jsonb default '{}'::jsonb;

-- Ensure RLS policies exist (idempotent)
do $$
begin
  if not exists (select 1 from pg_policies where policyname = 'Users can update their own profile.') then
    create policy "Users can update their own profile." on public.users for update using ( auth.uid() = id );
  end if;
end $$;`;

export function SchemaCheck() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkSchema();
  }, []);

  const checkSchema = async () => {
    try {
      // Try to select the specific column that's causing issues
      const { error } = await supabase
        .from('users')
        .select('theme_config')
        .limit(1);

      if (error && error.message.includes('theme_config')) {
        setIsOpen(true);
      }
    } catch (e) {
      console.error('Schema check failed:', e);
    } finally {
      setIsChecking(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(FIX_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-zinc-900 border-red-500/50 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Database Update Required
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-left pt-2">
            Your database is missing a required column (<code>theme_config</code>). This is causing the dashboard and onboarding to fail.
            <br /><br />
            Please run the following SQL in your Supabase SQL Editor to fix it:
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative mt-2 rounded-md bg-black/50 p-4 border border-red-500/20 font-mono text-xs text-zinc-300 overflow-x-auto max-h-[200px]">
          <pre>{FIX_SQL}</pre>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </Button>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => window.open('https://supabase.com/dashboard/project/_/sql', '_blank')} className="w-full sm:w-auto gap-2">
            <Terminal className="w-4 h-4" /> Open SQL Editor
          </Button>
          <Button onClick={() => { setIsOpen(false); window.location.reload(); }} className="bg-white text-black hover:bg-white/90 w-full sm:w-auto">
            I've Run It, Reload App
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
