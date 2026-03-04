import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Link as LinkType } from '../types/link';
import { TEMPLATES } from '../constants/templates';
import { TemplateConfig } from '../types/theme';
import { Share2, ExternalLink, Check, MessageCircle, Instagram, ChevronUp } from 'lucide-react';
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
    isElegantPortraitCard,
    isYellowHeroCard,
    isBrushArtistCard,
    isSunsetMotionProfile,
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

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    const name = iconName.toLowerCase();
    if (name.includes('instagram')) return <Instagram className="w-6 h-6" />;
    if (name.includes('message') || name.includes('whatsapp')) return <MessageCircle className="w-6 h-6" />;
    return <ExternalLink className="w-6 h-6" />;
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500 ${isElegantPortraitCard ? 'justify-center' : ''}`} style={styles.container}>
      
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

      {/* Sunset Gradient Pro, Editorial Luxe & Sunset Motion Profile Grain */}
      {(isSunsetGradientPro || isEditorialLuxe || isSunsetMotionProfile) && (
        <div className={`absolute inset-0 pointer-events-none mix-blend-overlay ${isSunsetMotionProfile ? 'opacity-20' : 'opacity-40'}`} style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
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
      {!isElegantPortraitCard && !isYellowHeroCard && !isBrushArtistCard && !isSunsetMotionProfile && (
        <div className="absolute top-6 right-6 z-20">
          <button 
            onClick={handleShare}
            className={classes.shareButton}
            style={{ color: activeTheme.textColor }}
          >
            {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          </button>
        </div>
      )}

      {isElegantPortraitCard && (
        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center pointer-events-none">
          <button className="w-12 h-12 rounded-2xl bg-[#8E4F4B] text-white flex items-center justify-center shadow-md pointer-events-auto hover:bg-[#7A433F] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <button onClick={handleShare} className="w-12 h-12 rounded-2xl bg-[#8E4F4B] text-white flex items-center justify-center shadow-md pointer-events-auto hover:bg-[#7A433F] transition-colors">
            {copied ? <Check className="w-5 h-5" /> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>}
          </button>
        </div>
      )}

      {isYellowHeroCard && (
        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center pointer-events-none">
          <button className="w-12 h-12 rounded-2xl bg-[#8C7A00] text-white flex items-center justify-center shadow-md pointer-events-auto hover:bg-[#7A6A00] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <div className="flex gap-2">
            <button onClick={handleShare} className="w-12 h-12 rounded-2xl bg-[#8C7A00] text-white flex items-center justify-center shadow-md pointer-events-auto hover:bg-[#7A6A00] transition-colors">
              {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button className="w-12 h-12 rounded-2xl bg-[#8C7A00] text-white flex items-center justify-center shadow-md pointer-events-auto hover:bg-[#7A6A00] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
          </div>
        </div>
      )}

      {isBrushArtistCard && (
        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center pointer-events-none">
          <button className="w-12 h-12 rounded-2xl bg-[#9C948A] text-white flex items-center justify-center shadow-md pointer-events-auto hover:bg-[#8A8278] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <div className="flex gap-2">
            <button onClick={handleShare} className="w-12 h-12 rounded-2xl bg-[#9C948A] text-white flex items-center justify-center shadow-md pointer-events-auto hover:bg-[#8A8278] transition-colors">
              {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button className="w-12 h-12 rounded-2xl bg-[#9C948A] text-white flex items-center justify-center shadow-md pointer-events-auto hover:bg-[#8A8278] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
          </div>
        </div>
      )}

      {isSunsetMotionProfile && (
        <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center pointer-events-none">
          <button className="w-12 h-12 rounded-2xl bg-[#F4F4F4] text-[#2C2C2C] flex items-center justify-center shadow-md pointer-events-auto hover:bg-[#EAEAEA] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <div className="flex gap-2">
            <button onClick={handleShare} className="w-12 h-12 rounded-2xl bg-[#F4F4F4] text-[#2C2C2C] flex items-center justify-center shadow-md pointer-events-auto hover:bg-[#EAEAEA] transition-colors">
              {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button className="w-12 h-12 rounded-2xl bg-[#F4F4F4] text-[#2C2C2C] flex items-center justify-center shadow-md pointer-events-auto hover:bg-[#EAEAEA] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
          </div>
        </div>
      )}

      <motion.div 
        className={classes.profileContainer}
        initial={isYellowHeroCard || isBrushArtistCard || isSunsetMotionProfile ? { opacity: 0, y: 40 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {isElegantPortraitCard && (
          <div className="w-full text-center pt-12 pb-4">
            <h2 className="text-xl font-serif text-[#8E4F4B] tracking-widest">
              {user.username?.substring(0, 2).toUpperCase() || 'KS'}
            </h2>
          </div>
        )}

        {/* Profile Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex flex-col items-center text-center ${isElegantPortraitCard ? 'mt-4 mb-8' : isYellowHeroCard ? 'mt-10 mb-8' : isSunsetMotionProfile ? 'mt-12 mb-10' : 'mb-12 mt-8'}`}
        >
          <div className="relative mb-6">
            {isBrushArtistCard && (
              <>
                <div className="absolute -inset-4 bg-[#F28BB7] rounded-full opacity-30 blur-md -z-10" style={{ transform: 'rotate(-15deg) scale(1.1)' }} />
                <svg className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)] -z-10 opacity-40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M50 5C74.8528 5 95 25.1472 95 50C95 74.8528 74.8528 95 50 95C25.1472 95 5 74.8528 5 50C5 25.1472 25.1472 5 50 5Z" stroke="#1A1A1A" strokeWidth="1" strokeDasharray="4 4" />
                  <path d="M50 10C72.0914 10 90 27.9086 90 50C90 72.0914 72.0914 90 50 90C27.9086 90 10 72.0914 10 50C10 27.9086 27.9086 10 50 10Z" stroke="#1A1A1A" strokeWidth="0.5" />
                </svg>
              </>
            )}
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
          {links
            .slice(0, activeTheme.maxButtons || undefined)
            .map((link, index) => ({ link, index }))
            .filter(({ link }) => link.is_active)
            .map(({ link, index }) => (
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
              
              {isElegantPortraitCard ? (
                <span className="relative z-10 flex items-center justify-center">
                  {renderIcon(link.icon || activeTheme.buttonSlots?.[index]?.defaultIcon || (index === 0 ? 'instagram' : 'whatsapp'))}
                </span>
              ) : isYellowHeroCard ? (
                <div className="flex items-center w-full gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFD600" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                  <span className="relative z-10 text-[#222222] font-bold">{link.title}</span>
                </div>
              ) : isBrushArtistCard ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-2xl opacity-90 ${index % 2 === 0 ? 'bg-[#000000]' : 'bg-[#F28BB7]'}`} style={{ clipPath: 'polygon(2% 5%, 98% 2%, 99% 95%, 1% 98%)' }} />
                  <span className={`relative z-10 font-bold tracking-widest ${index % 2 === 0 ? 'text-white' : 'text-black'}`}>{link.title}</span>
                </div>
              ) : isSunsetMotionProfile ? (
                <span className="relative z-10 text-[#2C2C2C] font-medium">{link.title}</span>
              ) : (
                <span className={`relative z-10 ${isEditorialLuxe ? 'group-hover:text-[#F3EFE9] transition-colors duration-300' : ''}`} style={{ opacity: activeTheme.textOpacity || 1 }}>{link.title}</span>
              )}
              
              {activeTheme.buttonStyle === 'hard-shadow' && (
                <div className="absolute inset-0 border-2 border-current translate-x-1 translate-y-1 -z-10" />
              )}
            </motion.button>
          ))}
        </div>

        {isElegantPortraitCard && (
          <div className="mt-8 text-center">
            <p className="text-xs text-[#8E4F4B]/60 font-medium tracking-wide">Clique nos ícones para interagir</p>
          </div>
        )}

        {/* Branding */}
        <div className={`mt-16 text-center ${isElegantPortraitCard ? 'mt-auto pb-8' : ''}`}>
          <a href="/" className="inline-flex items-center gap-2 text-sm font-bold hover:opacity-100 transition-opacity" style={{ opacity: (activeTheme.textOpacity || 1) * 0.5 }}>
            Powered by VYBE<span className="text-current">.</span>
          </a>
        </div>
      </motion.div>
      
      {isElegantPortraitCard && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="text-xs text-white uppercase tracking-widest font-medium">Swipe up to explore area</span>
          <div className="w-8 h-1 bg-white/50 rounded-full mt-1" />
        </div>
      )}

      {isYellowHeroCard && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-80">
          <span className="text-sm text-white font-medium">Swipe up to explore area</span>
          <div className="w-12 h-1 bg-white/80 rounded-full mt-1" />
        </div>
      )}

      {isBrushArtistCard && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="text-xs text-[#9C948A] font-medium">Swipe up to explore area</span>
          <div className="w-8 h-1 bg-[#9C948A]/50 rounded-full mt-1" />
        </div>
      )}

      {isSunsetMotionProfile && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="text-xs text-[#2C2C2C] font-medium tracking-widest uppercase">Swipe up to explore area</span>
          <div className="w-8 h-1 bg-[#2C2C2C]/50 rounded-full mt-1" />
        </div>
      )}
    </div>
  );
}
