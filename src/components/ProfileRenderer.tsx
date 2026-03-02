import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Link as LinkType } from '../types/link';
import { TEMPLATES } from '../constants/templates';
import { TemplateConfig } from '../types/theme';
import { Share2, ExternalLink, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface ProfileRendererProps {
  user: any;
  links: LinkType[];
  isPreview?: boolean;
}

export default function ProfileRenderer({ user, links, isPreview = false }: ProfileRendererProps) {
  const [copied, setCopied] = useState(false);

  const themeConfig = user?.theme_config || { templateId: 'minimal' };
  const templateId = themeConfig.templateId || 'minimal';
  const template: TemplateConfig = TEMPLATES[templateId] || TEMPLATES.minimal;
  const activeTheme = { ...template, ...themeConfig.customConfig };

  const handleLinkClick = async (link: LinkType) => {
    if (!isPreview) {
      try {
        await supabase.rpc('increment_click_count', { link_id: link.id });
        await supabase.from('clicks').insert({ link_id: link.id, timestamp: new Date().toISOString() });
      } catch (e) {
        console.error(e);
      }
    }
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${user.display_name || user.username} on VYBE`,
        url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Styles
  const containerStyle = {
    background: activeTheme.background,
    backgroundSize: activeTheme.bgSize,
    animation: activeTheme.animation,
    color: activeTheme.textColor,
    fontFamily: activeTheme.fontStyle === 'mono' ? 'monospace' : activeTheme.fontStyle === 'serif' ? 'serif' : 'sans-serif',
  };

  const cardStyle = {
    background: activeTheme.cardBg,
    border: activeTheme.cardBorder || 'none',
    boxShadow: activeTheme.cardShadow || 'none',
    color: activeTheme.textColor,
    borderRadius: activeTheme.buttonStyle === 'pill' ? '9999px' : activeTheme.buttonStyle === 'square' ? '0px' : '16px',
    backdropFilter: activeTheme.cardBackdropBlur || 'none',
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500" style={containerStyle}>
      
      {/* Background Blobs for Aurora Motion */}
      {activeTheme.blobAnimation && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/30 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/30 blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
          <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-violet-500/20 blur-[80px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        </>
      )}

      {/* Share Button */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={handleShare}
          className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110 bg-black/5 hover:bg-black/10"
          style={{ color: activeTheme.textColor }}
        >
          {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
        </button>
      </div>

      <div className={`w-full max-w-2xl relative z-10 flex flex-col items-center ${activeTheme.containerGlass ? 'glass-panel p-8 rounded-3xl backdrop-blur-2xl border-white/10' : ''}`}>
        {/* Profile Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-12 mt-8"
        >
          <div 
            className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-opacity-20 border-current relative"
            style={{ animation: activeTheme.avatarAnimation || 'none' }}
          >
            {activeTheme.id === 'aurora_motion' && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 opacity-50 blur-md -z-10 animate-spin-slow" />
            )}
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover relative z-10" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold opacity-50 relative z-10">
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <h1 className="text-3xl font-black tracking-tight mb-2" style={{ opacity: activeTheme.textOpacity || 1 }}>
            {user.display_name || `@${user.username}`}
          </h1>
          
          {user.bio && (
            <p className="text-lg max-w-md font-medium" style={{ opacity: (activeTheme.textOpacity || 1) * 0.8 }}>
              {user.bio}
            </p>
          )}
        </motion.div>

        {/* Links */}
        <div className={`w-full ${activeTheme.layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'}`}>
          {links.filter(l => l.is_active).map((link, index) => (
            <motion.button
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.02, boxShadow: activeTheme.id === 'aurora_motion' ? '0 0 20px rgba(34, 211, 238, 0.3)' : undefined }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLinkClick(link)}
              className="w-full p-4 flex items-center justify-center text-center font-bold text-lg transition-all relative group min-h-[64px]"
              style={cardStyle}
            >
              <span className="relative z-10" style={{ opacity: activeTheme.textOpacity || 1 }}>{link.title}</span>
              {activeTheme.buttonStyle === 'hard-shadow' && (
                <div className="absolute inset-0 border-2 border-current translate-x-1 translate-y-1 -z-10" />
              )}
            </motion.button>
          ))}
        </div>

        {/* Branding */}
        <div className="mt-16 text-center">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-bold hover:opacity-100 transition-opacity" style={{ opacity: (activeTheme.textOpacity || 1) * 0.5 }}>
            Powered by VYBE<span className="text-current">.</span>
          </a>
        </div>
      </div>
    </div>
  );
}
