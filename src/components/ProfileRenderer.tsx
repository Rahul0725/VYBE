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
  const isCreatorBlackPro = activeTheme.id === 'creator_black_pro';
  const isSunsetGradientPro = activeTheme.id === 'sunset_gradient_pro';
  const isEditorialLuxe = activeTheme.id === 'editorial_luxe';
  const isGlassElite = activeTheme.id === 'glass_elite';
  const isClassicSolidPro = activeTheme.id === 'classic_solid_pro';
  const isCleanLightPro = activeTheme.id === 'clean_light_pro';
  const isSoftDarkPro = activeTheme.id === 'soft_dark_pro';
  const isSolidLightCore = activeTheme.id === 'solid_light_core';
  const isAccentSolidMinimal = activeTheme.id === 'accent_solid_minimal';
  const is3DElevationStack = activeTheme.id === '3d_elevation_stack';
  const isFloatingPanelsPro = activeTheme.id === 'floating_panels_pro';
  const isRoyalEmber3D = activeTheme.id === 'royal_ember_3d';
  const isEmberContrastPro = activeTheme.id === 'ember_contrast_pro';
  const isUltraDepthPurple = activeTheme.id === 'ultra_depth_purple';

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
    color: isAccentSolidMinimal ? '#111827' : activeTheme.textColor,
    borderRadius: isCreatorBlackPro ? '28px' : isSunsetGradientPro ? '20px' : isClassicSolidPro ? '12px' : (isCleanLightPro || isSoftDarkPro || isSolidLightCore || isAccentSolidMinimal) ? '14px' : (is3DElevationStack || isEmberContrastPro) ? '16px' : (isFloatingPanelsPro || isRoyalEmber3D) ? '18px' : isUltraDepthPurple ? '20px' : (activeTheme.buttonStyle === 'pill' ? '9999px' : activeTheme.buttonStyle === 'square' ? '0px' : '16px'),
    backdropFilter: activeTheme.cardBackdropBlur || 'none',
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500" style={containerStyle}>
      
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
      {activeTheme.id === 'motion_stack' && (
        <div className="motion-stack-light" />
      )}

      {/* Share Button */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={handleShare}
          className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110 bg-black/5 hover:bg-black/10 ${activeTheme.id === 'neon_pulse' ? 'shadow-[0_0_15px_rgba(0,255,255,0.5)] border border-cyan-500/50' : ''}`}
          style={{ color: activeTheme.textColor }}
        >
          {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
        </button>
      </div>

      <div className={`w-full max-w-2xl relative z-10 flex flex-col items-center ${
        activeTheme.id === 'liquid_glass' 
          ? 'liquid-glass-panel p-10 rounded-[2rem]' 
          : activeTheme.containerGlass || isGlassElite
            ? 'glass-panel p-8 rounded-3xl backdrop-blur-2xl border-white/10 shadow-2xl' 
            : ''
      }`}>
        {/* Profile Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-12 mt-8"
        >
          <div className="relative mb-6">
            {activeTheme.id === 'neon_pulse' && (
              <div className="absolute inset-0 rounded-full" style={{ animation: 'pulse-ring 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite' }} />
            )}
            <div 
              className={`rounded-full overflow-hidden relative z-10 ${
                isCreatorBlackPro 
                  ? 'w-24 h-24 md:w-[120px] md:h-[120px] border-2 border-white/20' 
                  : isSunsetGradientPro
                    ? 'w-28 h-28 shadow-xl'
                    : isEditorialLuxe
                      ? 'w-32 h-32 border border-black/10'
                      : isGlassElite
                        ? 'w-32 h-32 p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500'
                        : isClassicSolidPro
                          ? 'w-24 h-24 border-2 border-white/20 shadow-sm'
                          : isCleanLightPro
                            ? 'w-24 h-24 shadow-md border border-gray-100'
                            : isSoftDarkPro
                              ? 'w-24 h-24'
                              : isSolidLightCore
                                ? 'w-24 h-24'
                              : isAccentSolidMinimal
                                ? 'w-24 h-24'
                              : is3DElevationStack
                                ? 'w-28 h-28 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]'
                              : isFloatingPanelsPro
                                ? 'w-28 h-28 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] ring-4 ring-white/10'
                              : isRoyalEmber3D
                                ? 'w-28 h-28 ring-2 ring-[#FF7A18] shadow-[0_0_30px_rgba(255,122,24,0.3)]'
                              : isEmberContrastPro
                                ? 'w-28 h-28 shadow-[0_0_25px_rgba(59,7,100,0.4)]'
                              : isUltraDepthPurple
                                ? 'w-28 h-28 ring-1 ring-[#FF9100]/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                            : activeTheme.id === 'liquid_glass'  
                              ? 'w-32 h-32 liquid-avatar-card p-1' 
                              : 'w-32 h-32 border-4 border-opacity-20 border-current'
              }`}
              style={{ animation: activeTheme.id !== 'neon_pulse' ? (activeTheme.avatarAnimation || 'none') : 'none' }}
            >
              {activeTheme.id === 'aurora_motion' && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 opacity-50 blur-md -z-10 animate-spin-slow" />
              )}
              {user.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.username} 
                  className={`w-full h-full object-cover relative z-10 ${activeTheme.id === 'liquid_glass' || isGlassElite || isClassicSolidPro || isCleanLightPro || isSoftDarkPro || isSolidLightCore || isAccentSolidMinimal || is3DElevationStack || isFloatingPanelsPro || isRoyalEmber3D || isEmberContrastPro || isUltraDepthPurple ? 'rounded-full' : ''}`} 
                />
              ) : (
                <div className={`w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold opacity-50 relative z-10 ${activeTheme.id === 'liquid_glass' || isGlassElite || isClassicSolidPro || isCleanLightPro || isSoftDarkPro || isSolidLightCore || isAccentSolidMinimal || is3DElevationStack || isFloatingPanelsPro || isRoyalEmber3D || isEmberContrastPro || isUltraDepthPurple ? 'rounded-full' : ''}`}>
                  {user.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <h1 className={`text-3xl font-black tracking-tight mb-2 ${activeTheme.id === 'neon_pulse' ? 'neon-text-flicker uppercase' : ''} ${isEditorialLuxe ? 'font-serif text-4xl' : ''} ${isClassicSolidPro ? 'text-2xl font-bold tracking-normal' : ''} ${isCleanLightPro ? 'text-2xl font-bold text-black tracking-tight' : ''} ${isSolidLightCore ? 'text-2xl font-bold text-black' : ''} ${isAccentSolidMinimal ? 'text-2xl font-bold text-white tracking-tight' : ''} ${is3DElevationStack ? 'text-2xl font-bold text-white tracking-tight' : ''} ${isFloatingPanelsPro ? 'text-3xl font-bold text-white tracking-tight drop-shadow-lg' : ''} ${isRoyalEmber3D ? 'text-3xl font-bold text-white tracking-tight' : ''} ${isEmberContrastPro ? 'text-3xl font-bold text-white tracking-tight' : ''} ${isUltraDepthPurple ? 'text-3xl font-bold text-white tracking-tight' : ''}`} style={{ opacity: activeTheme.textOpacity || 1 }}>
            {user.display_name || `@${user.username}`}
          </h1>
          
          {user.bio && (
            <p className={`text-lg max-w-md font-medium ${isEditorialLuxe ? 'font-light italic opacity-80' : ''} ${isClassicSolidPro ? 'text-base opacity-80 font-normal' : ''} ${isCleanLightPro ? 'text-base text-gray-500 font-normal' : ''} ${isSoftDarkPro ? 'text-base opacity-70 font-normal' : ''} ${isSolidLightCore ? 'text-base text-[#555555] font-normal' : ''} ${isAccentSolidMinimal ? 'text-base text-white/80 font-normal' : ''} ${is3DElevationStack ? 'text-base text-gray-400 font-normal' : ''} ${isFloatingPanelsPro ? 'text-base text-slate-400 font-medium' : ''} ${isRoyalEmber3D ? 'text-base text-[#E6E6FA] font-medium opacity-70' : ''} ${isEmberContrastPro ? 'text-base text-white/90 font-medium' : ''} ${isUltraDepthPurple ? 'text-base text-white/80 font-medium' : ''}`} style={{ opacity: isSoftDarkPro ? 0.7 : (activeTheme.textOpacity || 1) * 0.8 }}>
              {user.bio}
            </p>
          )}
        </motion.div>

        {/* Links */}
        <div className={`w-full ${activeTheme.layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'} ${isFloatingPanelsPro || isRoyalEmber3D || isUltraDepthPurple ? 'perspective-[1000px]' : ''}`}>
          {links.filter(l => l.is_active).map((link, index) => (
            <motion.button
              key={link.id}
              initial={isFloatingPanelsPro ? { opacity: 0, scale: 0.95, y: 20 } : isRoyalEmber3D ? { opacity: 0, y: 30 } : isEmberContrastPro ? { opacity: 0, scale: 0.9 } : isUltraDepthPurple ? { opacity: 0, scale: 0.9, y: 20 } : { opacity: 0, y: 20 }}
              animate={isFloatingPanelsPro ? { opacity: 1, scale: 1, y: 0 } : isRoyalEmber3D ? { opacity: 1, y: 0 } : isEmberContrastPro ? { opacity: 1, scale: 1 } : isUltraDepthPurple ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={isCreatorBlackPro 
                ? { ease: [0.4, 0, 0.2, 1], duration: 0.5, delay: 0.08 * index }
                : isSunsetGradientPro
                  ? { duration: 0.5, delay: 0.07 * index }
                  : isClassicSolidPro
                    ? { duration: 0.3, delay: 0.06 * index }
                    : isCleanLightPro
                      ? { duration: 0.4, delay: 0.05 * index, ease: [0.25, 0.1, 0.25, 1] }
                      : isSoftDarkPro
                        ? { duration: 0.2, delay: 0.05 * index }
                        : isSolidLightCore
                          ? { duration: 0.25, delay: 0.05 * index }
                        : isAccentSolidMinimal
                          ? { duration: 0.25, delay: 0.05 * index }
                        : is3DElevationStack
                          ? { duration: 0.5, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }
                        : isFloatingPanelsPro
                          ? { duration: 0.5, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }
                        : isRoyalEmber3D
                          ? { duration: 0.28, delay: 0.06 * index, ease: [0.22, 1, 0.36, 1] }
                        : isEmberContrastPro
                          ? { duration: 0.25, delay: 0.07 * index }
                        : isUltraDepthPurple
                          ? { duration: 0.4, delay: 0.06 * index, type: 'spring', stiffness: 200, damping: 20 }
                      : { duration: 0.4, delay: 0.1 * index }
              }
              whileHover={isCreatorBlackPro 
                ? { y: -3, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }
                : isSunsetGradientPro
                  ? { y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }
                  : isEditorialLuxe
                    ? { scale: 1.01 }
                    : isGlassElite
                      ? { y: -2, boxShadow: '0 0 25px rgba(129, 140, 248, 0.25)', borderColor: 'rgba(255, 255, 255, 0.3)' }
                      : isClassicSolidPro
                        ? { y: -2, filter: 'brightness(0.95)' }
                        : isCleanLightPro
                          ? { y: -2, boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }
                          : isSoftDarkPro
                            ? { y: -2, backgroundColor: '#2C2C35' }
                            : isSolidLightCore
                              ? { y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                            : isAccentSolidMinimal
                              ? { y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
                            : is3DElevationStack
                              ? { y: -4, rotateX: 2, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)' }
                            : isFloatingPanelsPro
                              ? { y: -5, rotateX: 4, scale: 1.02, boxShadow: '0 20px 30px -5px rgba(0,0,0,0.5), 0 10px 10px -5px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)' }
                            : isRoyalEmber3D
                              ? { y: -5, rotateX: 3, boxShadow: '0 15px 30px -5px rgba(43, 15, 84, 0.9), 0 0 20px rgba(255, 122, 24, 0.4)', borderColor: '#FF9F55' }
                            : isEmberContrastPro
                              ? { y: -4, scale: 1.02, boxShadow: '0 20px 30px -8px rgba(59, 7, 100, 0.7), 0 8px 20px rgba(249, 115, 22, 0.4)' }
                            : isUltraDepthPurple
                              ? { y: -6, rotateX: 3, boxShadow: '0 20px 40px -5px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)' }
                          : { 
                            scale: 1.02,  
                            boxShadow: activeTheme.id === 'aurora_motion' 
                              ? '0 0 20px rgba(34, 211, 238, 0.3)' 
                              : activeTheme.id === 'neon_pulse'
                                ? '0 0 20px rgba(0, 255, 255, 0.8), inset 0 0 20px rgba(0, 255, 255, 0.2)'
                                : undefined 
                          }
              }
              whileTap={isCreatorBlackPro ? { scale: 0.97 } : isSunsetGradientPro ? { scale: 0.98 } : isEditorialLuxe ? { scale: 0.99 } : isGlassElite ? { scale: 0.98 } : isClassicSolidPro ? { scale: 0.98 } : isCleanLightPro ? { scale: 0.97 } : isSoftDarkPro ? { scale: 0.97 } : isSolidLightCore ? { scale: 0.97 } : isAccentSolidMinimal ? { scale: 0.98 } : is3DElevationStack ? { scale: 0.97, y: 1 } : isFloatingPanelsPro ? { scale: 0.98, boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)' } : isRoyalEmber3D ? { scale: 0.96, y: 1 } : isEmberContrastPro ? { scale: 0.98, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' } : isUltraDepthPurple ? { scale: 0.95, boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)' } : { scale: 0.98 }}
              onClick={() => handleLinkClick(link)}
              className={`w-full p-4 flex items-center justify-center text-center font-bold text-lg transition-all relative group min-h-[64px] ${
                activeTheme.id === 'liquid_glass' ? 'liquid-card' : ''
              } ${activeTheme.id === 'motion_stack' ? 'motion-stack-card' : ''} ${
                isCreatorBlackPro ? 'hover:border-white/20 hover:bg-white/[0.02]' : ''
              } ${isEditorialLuxe ? 'overflow-hidden' : ''} ${isCleanLightPro ? 'text-white' : ''} ${isSolidLightCore ? 'text-white' : ''} ${isAccentSolidMinimal ? 'text-[#111827]' : ''} ${is3DElevationStack ? 'text-white perspective-1000' : ''} ${isFloatingPanelsPro ? 'text-white' : ''} ${isRoyalEmber3D ? 'text-white font-semibold py-4' : ''} ${isEmberContrastPro ? 'text-white font-semibold' : ''} ${isUltraDepthPurple ? 'text-white overflow-hidden' : ''}`}
              style={cardStyle}
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
