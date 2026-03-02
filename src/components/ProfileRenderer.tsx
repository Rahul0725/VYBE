import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Link as LinkType } from '../types/link';
import { TEMPLATES } from '../constants/templates';
import { TemplateConfig } from '../types/theme';
import { Share2, ExternalLink, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useThemeStyles } from '../hooks/useThemeStyles';

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

  const { themeFlags, styles, classes, animations } = useThemeStyles(activeTheme);
  const {
    isCreatorBlackPro,
    isSunsetGradientPro,
    isEditorialLuxe,
    isGlassElite,
    isClassicSolidPro,
    isCleanLightPro,
    isSoftDarkPro,
    isSolidLightCore,
    isAccentSolidMinimal,
    is3DElevationStack,
    isFloatingPanelsPro,
    isRoyalEmber3D,
    isEmberContrastPro,
    isUltraDepthPurple,
    isNeonPulse,
    isAuroraMotion,
    isLiquidGlass,
    isMotionStack,
  } = themeFlags;

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

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500" style={styles.container}>
      
      {/* Background Blobs for Aurora Motion */}
      {activeTheme.blobAnimation && !isGlassElite && (
        <>
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/30 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/30 blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
          <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] rounded-full bg-violet-500/20 blur-[80px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        </>
      )}

      {/* Glass Elite Specific Background */}
      {isGlassElite && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] opacity-80" />
          <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-[120px] animate-blob" />
          <div className="absolute bottom-[-20%] right-[20%] w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[100px] animate-blob animation-delay-2000" />
          <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-[80px] animate-blob animation-delay-4000" />
        </>
      )}

      {/* Creator Black Pro Glow */}
      {isCreatorBlackPro && (
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-[120px] pointer-events-none" />
      )}

      {/* Sunset Gradient Pro & Editorial Luxe Grain */}
      {(isSunsetGradientPro || isEditorialLuxe) && (
        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
      )}

      {/* Neon Grid Background */}
      {activeTheme.gridAnimation && (
        <div className="neon-grid-bg" />
      )}

      {/* Motion Stack Background Light */}
      {isMotionStack && (
        <div className="motion-stack-light" />
      )}

      {/* Share Button */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={handleShare}
          className={classes.shareButton}
          style={{ color: activeTheme.textColor }}
        >
          {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
        </button>
      </div>

      <div className={classes.profileContainer}>
        {/* Profile Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-12 mt-8"
        >
          <div className="relative mb-6">
            {isNeonPulse && (
              <div className="absolute inset-0 rounded-full" style={{ animation: 'pulse-ring 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite' }} />
            )}
            <div 
              className={classes.avatarContainer}
              style={{ animation: !isNeonPulse ? (activeTheme.avatarAnimation || 'none') : 'none' }}
            >
              {isAuroraMotion && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 opacity-50 blur-md -z-10 animate-spin-slow" />
              )}
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.username} 
                  className={classes.avatarImage} 
                />
              ) : (
                <div className={classes.avatarPlaceholder}>
                  {user.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <h1 className={classes.name} style={{ opacity: activeTheme.textOpacity || 1 }}>
            {user.display_name || `@${user.username}`}
          </h1>
          
          {user.bio && (
            <p className={classes.bio} style={{ opacity: isSoftDarkPro ? 0.7 : (activeTheme.textOpacity || 1) * 0.8 }}>
              {user.bio}
            </p>
          )}
        </motion.div>

        {/* Links */}
        <div className={classes.linksContainer}>
          {links.filter(l => l.is_active).map((link, index) => (
            <motion.button
              key={link.id}
              initial={animations.getInitial()}
              animate={animations.getAnimate()}
              transition={animations.getTransition(index)}
              whileHover={animations.getWhileHover()}
              whileTap={animations.getWhileTap()}
              onClick={() => handleLinkClick(link)}
              className={classes.linkCard}
              style={styles.card}
            >
              {isEditorialLuxe && (
                <div className="absolute inset-0 bg-[#1A1A1A] origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-x-100" />
              )}
              {isUltraDepthPurple && (
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#FF9100] transition-all duration-300 group-hover:bg-[#FFAB40] group-hover:w-[2px] group-hover:shadow-[0_0_10px_rgba(255,145,0,0.5)]" />
              )}
              <span className={`relative z-10 ${isEditorialLuxe ? 'group-hover:text-[#F3EFE9] transition-colors duration-300' : ''}`} style={{ opacity: activeTheme.textOpacity || 1 }}>{link.title}</span>
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
