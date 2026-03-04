import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Image as ImageIcon, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Link } from '../types/link';
import React from 'react';

interface SortableLinkProps {
  link: Link;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Link>) => void;
  isLocked?: boolean;
  slotLabel?: string;
}

export const SortableLink: React.FC<SortableLinkProps> = ({ link, onDelete, onUpdate, isLocked, slotLabel }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 mb-4 group hover:border-white/20 transition-colors">
      {slotLabel && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-vybe-accent bg-vybe-accent/10 px-2 py-1 rounded-md">
            {slotLabel}
          </span>
        </div>
      )}
      <div className="flex items-start md:items-center gap-3 md:gap-4">
        {!isLocked && (
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-white/40 hover:text-white transition-colors mt-2 md:mt-0">
            <GripVertical className="w-5 h-5" />
          </div>
        )}
        
        <div className="flex-1 space-y-3 min-w-0">
          <div className="flex items-center gap-2">
            <Input 
              value={link.title} 
              onChange={(e) => onUpdate(link.id, { title: e.target.value })}
              placeholder="Link Title" 
              className="bg-transparent border-none p-0 h-auto text-base md:text-lg font-medium placeholder:text-white/20 focus-visible:ring-0 min-w-0"
            />
            <Switch 
              checked={link.is_active} 
              onCheckedChange={(checked) => onUpdate(link.id, { is_active: checked })}
              className="ml-auto shrink-0"
            />
          </div>
          <div className="flex items-center gap-2">
            {link.url ? (
              <a 
                href={link.url.startsWith('http') ? link.url : `https://${link.url}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/40 hover:text-vybe-accent transition-colors shrink-0"
                title="Test Link"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <LinkIcon className="w-4 h-4 text-white/40 shrink-0" />
            )}
            <Input 
              value={link.url} 
              onChange={(e) => onUpdate(link.id, { url: e.target.value })}
              placeholder="https://example.com" 
              className="bg-transparent border-none p-0 h-auto text-sm text-white/60 placeholder:text-white/20 focus-visible:ring-0 min-w-0"
            />
          </div>
        </div>

        {!isLocked && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 shrink-0"
            onClick={() => onDelete(link.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      {/* Expanded Settings (Optional) */}
      <div className="mt-4 pt-4 border-t border-white/5 hidden group-focus-within:block animate-in fade-in slide-in-from-top-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-white/40">Icon (Optional)</Label>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-white/40" />
              <Input 
                value={link.icon || ''} 
                onChange={(e) => onUpdate(link.id, { icon: e.target.value })}
                placeholder="Icon name (e.g. twitter)" 
                className="bg-white/5 border-white/10 h-8 text-xs"
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 md:pt-6">
            <Label className="text-xs text-white/40">Show Clicks</Label>
            <Switch 
              checked={link.show_clicks !== false} 
              onCheckedChange={(checked) => onUpdate(link.id, { show_clicks: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

