import { useMemo } from 'react';
import { TemplateConfig } from '../types/theme';

export const useThemeStyles = (activeTheme: TemplateConfig) => {
  const themeFlags = useMemo(() => {
    return {
      isCreatorBlackPro: activeTheme.id === 'creator_black_pro',
      isSunsetGradientPro: activeTheme.id === 'sunset_gradient_pro',
      isEditorialLuxe: activeTheme.id === 'editorial_luxe',
      isGlassElite: activeTheme.id === 'glass_elite',
      isClassicSolidPro: activeTheme.id === 'classic_solid_pro',
      isCleanLightPro: activeTheme.id === 'clean_light_pro',
      isSoftDarkPro: activeTheme.id === 'soft_dark_pro',
      isSolidLightCore: activeTheme.id === 'solid_light_core',
      isAccentSolidMinimal: activeTheme.id === 'accent_solid_minimal',
      is3DElevationStack: activeTheme.id === '3d_elevation_stack',
      isFloatingPanelsPro: activeTheme.id === 'floating_panels_pro',
      isRoyalEmber3D: activeTheme.id === 'royal_ember_3d',
      isEmberContrastPro: activeTheme.id === 'ember_contrast_pro',
      isUltraDepthPurple: activeTheme.id === 'ultra_depth_purple',
      isNeonPulse: activeTheme.id === 'neon_pulse',
      isAuroraMotion: activeTheme.id === 'aurora_motion',
      isLiquidGlass: activeTheme.id === 'liquid_glass',
      isMotionStack: activeTheme.id === 'motion_stack',
      isElegantPortraitCard: activeTheme.id === 'elegant_portrait_card',
      isYellowHeroCard: activeTheme.id === 'yellow_hero_card',
      isBrushArtistCard: activeTheme.id === 'brush_artist_card',
      isSunsetMotionProfile: activeTheme.id === 'sunset_motion_profile',
      isNeonPulseProfile: activeTheme.id === 'neon_pulse_profile',
    };
  }, [activeTheme.id]);

  const styles = useMemo(() => {
    const {
      isCreatorBlackPro,
      isSunsetGradientPro,
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
      isElegantPortraitCard,
      isSunsetMotionProfile,
      isNeonPulseProfile,
    } = themeFlags;

    const container = {
      background: activeTheme.background,
      backgroundSize: activeTheme.bgSize,
      animation: activeTheme.animation,
      color: activeTheme.textColor,
      fontFamily: activeTheme.fontStyle === 'mono' ? 'monospace' : activeTheme.fontStyle === 'serif' ? 'serif' : 'sans-serif',
    };

    const card = {
      background: activeTheme.cardBg,
      border: activeTheme.cardBorder || 'none',
      boxShadow: activeTheme.cardShadow || 'none',
      color: isAccentSolidMinimal ? '#111827' : activeTheme.textColor,
      borderRadius: isCreatorBlackPro ? '28px' : isSunsetGradientPro ? '20px' : isClassicSolidPro ? '12px' : (isCleanLightPro || isSoftDarkPro || isSolidLightCore || isAccentSolidMinimal) ? '14px' : (is3DElevationStack || isEmberContrastPro) ? '16px' : (isFloatingPanelsPro || isRoyalEmber3D) ? '18px' : isUltraDepthPurple ? '20px' : isElegantPortraitCard ? '50%' : (activeTheme.buttonStyle === 'pill' ? '9999px' : activeTheme.buttonStyle === 'square' ? '0px' : '16px'),
      backdropFilter: activeTheme.cardBackdropBlur || 'none',
    };

    return { container, card };
  }, [activeTheme, themeFlags]);

  const classes = useMemo(() => {
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
      isLiquidGlass,
      isMotionStack,
      isElegantPortraitCard,
      isYellowHeroCard,
      isBrushArtistCard,
      isSunsetMotionProfile,
      isNeonPulseProfile,
    } = themeFlags;

    const avatarContainer = `rounded-full overflow-hidden relative z-10 ${
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
                    : isElegantPortraitCard
                      ? 'w-32 h-32 border-4 border-[#B88986]/30 shadow-lg'
                    : isYellowHeroCard
                      ? 'w-24 h-24 shadow-[0_0_30px_rgba(255,214,0,0.4)] absolute -top-12 left-1/2 -translate-x-1/2 bg-white'
                    : isBrushArtistCard
                      ? 'w-24 h-24 shadow-[0_8px_24px_rgba(0,0,0,0.08)] bg-white border-2 border-white'
                    : isSunsetMotionProfile
                      ? 'w-24 h-24 shadow-[0_8px_24px_rgba(0,0,0,0.12)]'
                    : isNeonPulseProfile
                      ? 'w-24 h-24 shadow-[0_0_20px_rgba(138,92,255,0.3)] ring-2 ring-[rgba(138,92,255,0.3)]'
                  : isLiquidGlass  
                    ? 'w-32 h-32 liquid-avatar-card p-1' 
                    : 'w-32 h-32 border-4 border-opacity-20 border-current'
    }`;

    const avatarImage = `w-full h-full object-cover relative z-10 ${
      isLiquidGlass || isGlassElite || isClassicSolidPro || isCleanLightPro || isSoftDarkPro || isSolidLightCore || isAccentSolidMinimal || is3DElevationStack || isFloatingPanelsPro || isRoyalEmber3D || isEmberContrastPro || isUltraDepthPurple || isElegantPortraitCard || isYellowHeroCard || isBrushArtistCard || isSunsetMotionProfile || isNeonPulseProfile ? 'rounded-full' : ''
    }`;

    const avatarPlaceholder = `w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold opacity-50 relative z-10 ${
      isLiquidGlass || isGlassElite || isClassicSolidPro || isCleanLightPro || isSoftDarkPro || isSolidLightCore || isAccentSolidMinimal || is3DElevationStack || isFloatingPanelsPro || isRoyalEmber3D || isEmberContrastPro || isUltraDepthPurple || isElegantPortraitCard || isYellowHeroCard || isBrushArtistCard || isSunsetMotionProfile || isNeonPulseProfile ? 'rounded-full' : ''
    }`;

    const profileContainer = `w-full relative z-10 flex flex-col items-center ${
      isLiquidGlass 
        ? 'max-w-2xl liquid-glass-panel p-10 rounded-[2rem]' 
        : activeTheme.containerGlass || isGlassElite
          ? 'max-w-2xl glass-panel p-8 rounded-3xl backdrop-blur-2xl border-white/10 shadow-2xl' 
          : isElegantPortraitCard
            ? 'max-w-[420px] bg-[#F3E8E4] rounded-[28px] p-7 shadow-[0_8px_32px_rgba(0,0,0,0.08)] min-h-[500px] flex flex-col relative'
            : isYellowHeroCard
              ? 'max-w-[420px] bg-[#F2F2F2] rounded-[32px] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.08)] mt-16 flex flex-col relative'
            : isBrushArtistCard
              ? 'max-w-[420px] bg-[#EFE9E2] rounded-[32px] p-8 mt-16 flex flex-col relative border-[3px] border-[#9C948A] shadow-[0_12px_40px_rgba(0,0,0,0.05)]'
            : isSunsetMotionProfile
              ? 'max-w-[420px] mt-8 flex flex-col relative'
            : isNeonPulseProfile
              ? 'max-w-[420px] bg-white/20 backdrop-blur-xl rounded-[28px] p-7 shadow-[0_0_80px_rgba(255,255,255,0.15),0_20px_40px_rgba(0,0,0,0.1)] mt-8 flex flex-col relative border border-white/30'
            : 'max-w-2xl'
    }`;

    const name = `text-3xl font-black tracking-tight mb-2 ${isNeonPulse ? 'neon-text-flicker uppercase' : ''} ${isEditorialLuxe ? 'font-serif text-4xl' : ''} ${isClassicSolidPro ? 'text-2xl font-bold tracking-normal' : ''} ${isCleanLightPro ? 'text-2xl font-bold text-black tracking-tight' : ''} ${isSolidLightCore ? 'text-2xl font-bold text-black' : ''} ${isAccentSolidMinimal ? 'text-2xl font-bold text-white tracking-tight' : ''} ${is3DElevationStack ? 'text-2xl font-bold text-white tracking-tight' : ''} ${isFloatingPanelsPro ? 'text-3xl font-bold text-white tracking-tight drop-shadow-lg' : ''} ${isRoyalEmber3D ? 'text-3xl font-bold text-white tracking-tight' : ''} ${isEmberContrastPro ? 'text-3xl font-bold text-white tracking-tight' : ''} ${isUltraDepthPurple ? 'text-3xl font-bold text-white tracking-tight' : ''} ${isElegantPortraitCard ? 'text-2xl font-serif text-[#8E4F4B] mt-4 font-medium tracking-wide' : ''} ${isYellowHeroCard ? 'text-3xl font-bold text-[#222222] mt-12' : ''} ${isBrushArtistCard ? 'text-[32px] font-["Caveat",cursive] text-[#1A1A1A] mt-4 leading-none' : ''} ${isSunsetMotionProfile ? 'text-[28px] font-bold text-white mt-4 tracking-tight' : ''} ${isNeonPulseProfile ? 'text-2xl font-bold text-[#1F1F1F] mt-4 tracking-tight' : ''}`;

    const bio = `text-lg max-w-md font-medium ${isEditorialLuxe ? 'font-light italic opacity-80' : ''} ${isClassicSolidPro ? 'text-base opacity-80 font-normal' : ''} ${isCleanLightPro ? 'text-base text-gray-500 font-normal' : ''} ${isSoftDarkPro ? 'text-base opacity-70 font-normal' : ''} ${isSolidLightCore ? 'text-base text-[#555555] font-normal' : ''} ${isAccentSolidMinimal ? 'text-base text-white/80 font-normal' : ''} ${is3DElevationStack ? 'text-base text-gray-400 font-normal' : ''} ${isFloatingPanelsPro ? 'text-base text-slate-400 font-medium' : ''} ${isRoyalEmber3D ? 'text-base text-[#E6E6FA] font-medium opacity-70' : ''} ${isEmberContrastPro ? 'text-base text-white/90 font-medium' : ''} ${isUltraDepthPurple ? 'text-base text-white/80 font-medium' : ''} ${isElegantPortraitCard ? 'text-xs uppercase tracking-[0.2em] text-[#8E4F4B]/70 mt-1' : ''} ${isYellowHeroCard ? 'text-base font-medium text-[#666666] mt-1' : ''} ${isBrushArtistCard ? 'text-base font-medium text-[#1A1A1A] mt-2' : ''} ${isSunsetMotionProfile ? 'text-base font-medium text-white/80 mt-1' : ''} ${isNeonPulseProfile ? 'text-[15px] font-normal text-[#4A4A4A] leading-relaxed mt-1' : ''}`;

    const linksContainer = `w-full ${activeTheme.layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : activeTheme.layout === 'profile-card' ? 'flex justify-center gap-6 mt-8' : isYellowHeroCard ? 'space-y-4 mt-8' : isBrushArtistCard ? 'space-y-[18px] mt-8' : isSunsetMotionProfile ? 'space-y-[18px] mt-10' : isNeonPulseProfile ? 'space-y-5 mt-8' : 'space-y-4'} ${isFloatingPanelsPro || isRoyalEmber3D || isUltraDepthPurple ? 'perspective-[1000px]' : ''}`;

    const linkCard = `${isElegantPortraitCard ? '' : 'w-full'} p-4 flex items-center justify-center text-center font-bold text-lg transition-all relative group min-h-[64px] ${
      isLiquidGlass ? 'liquid-card' : ''
    } ${isMotionStack ? 'motion-stack-card' : ''} ${
      isCreatorBlackPro ? 'hover:border-white/20 hover:bg-white/[0.02]' : ''
    } ${isEditorialLuxe ? 'overflow-hidden' : ''} ${isCleanLightPro ? 'text-white' : ''} ${isSolidLightCore ? 'text-white' : ''} ${isAccentSolidMinimal ? 'text-[#111827]' : ''} ${is3DElevationStack ? 'text-white perspective-1000' : ''} ${isFloatingPanelsPro ? 'text-white' : ''} ${isRoyalEmber3D ? 'text-white font-semibold py-4' : ''} ${isEmberContrastPro ? 'text-white font-semibold' : ''} ${isUltraDepthPurple ? 'text-white overflow-hidden' : ''} ${isElegantPortraitCard ? 'w-16 h-16 rounded-full p-0 flex items-center justify-center bg-[#F3E8E4] shadow-[5px_5px_10px_#dcd2ce,-5px_-5px_10px_#ffffff] text-[#8E4F4B]' : ''} ${isYellowHeroCard ? 'h-14 rounded-[28px] bg-[#FFD600] flex items-center justify-start px-2 text-[#222222] font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all' : ''} ${isBrushArtistCard ? 'h-[60px] rounded-2xl flex items-center justify-center px-6 font-bold uppercase tracking-wider text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all' : ''} ${isSunsetMotionProfile ? 'h-[58px] rounded-[18px] bg-white flex items-center justify-center px-6 font-medium text-[#2C2C2C] text-base shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-300' : ''} ${isNeonPulseProfile ? 'rounded-full bg-white border border-black/5 text-[#1F1F1F] font-semibold py-4 px-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all duration-300' : ''}`;

    const shareButton = `w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110 bg-black/5 hover:bg-black/10 ${isNeonPulse ? 'shadow-[0_0_15px_rgba(0,255,255,0.5)] border border-cyan-500/50' : ''} ${isElegantPortraitCard ? 'bg-[#8E4F4B] text-white hover:bg-[#7A433F] shadow-md' : ''} ${isYellowHeroCard ? 'w-12 h-12 rounded-2xl bg-[#8C7A00] text-white hover:bg-[#7A6A00] shadow-md' : ''} ${isBrushArtistCard ? 'w-12 h-12 rounded-2xl bg-[#9C948A] text-white hover:bg-[#8A8278] shadow-md' : ''} ${isNeonPulseProfile ? 'bg-white/20 text-[#1F1F1F] hover:bg-white/30 shadow-sm' : ''}`;

    return {
      avatarContainer,
      avatarImage,
      avatarPlaceholder,
      profileContainer,
      name,
      bio,
      linksContainer,
      linkCard,
      shareButton,
    };
  }, [activeTheme, themeFlags]);

    const animations = useMemo(() => {
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
      isAuroraMotion,
      isNeonPulse,
      isElegantPortraitCard,
      isYellowHeroCard,
      isBrushArtistCard,
      isSunsetMotionProfile,
      isNeonPulseProfile,
    } = themeFlags;

    const getInitial = () => {
      if (isFloatingPanelsPro) return { opacity: 0, scale: 0.95, y: 20 };
      if (isRoyalEmber3D) return { opacity: 0, y: 30 };
      if (isEmberContrastPro) return { opacity: 0, scale: 0.9 };
      if (isUltraDepthPurple) return { opacity: 0, scale: 0.9, y: 20 };
      if (isElegantPortraitCard) return { opacity: 0, scale: 0.95, y: 10 };
      if (isYellowHeroCard) return { opacity: 0, y: 20 };
      if (isSunsetMotionProfile) return { opacity: 0, y: 15 };
      if (isNeonPulseProfile) return { opacity: 0, y: 20 };
      return { opacity: 0, y: 20 };
    };

    const getAnimate = () => {
      if (isFloatingPanelsPro) return { opacity: 1, scale: 1, y: 0 };
      if (isRoyalEmber3D) return { opacity: 1, y: 0 };
      if (isEmberContrastPro) return { opacity: 1, scale: 1 };
      if (isUltraDepthPurple) return { opacity: 1, scale: 1, y: 0 };
      if (isElegantPortraitCard) return { opacity: 1, scale: 1, y: 0 };
      if (isYellowHeroCard) return { opacity: 1, y: 0 };
      if (isSunsetMotionProfile) return { opacity: 1, y: 0 };
      if (isNeonPulseProfile) return { opacity: 1, y: 0 };
      return { opacity: 1, y: 0 };
    };

    const getTransition = (index: number) => {
      if (isCreatorBlackPro) return { ease: [0.4, 0, 0.2, 1], duration: 0.5, delay: 0.08 * index };
      if (isSunsetGradientPro) return { duration: 0.5, delay: 0.07 * index };
      if (isClassicSolidPro) return { duration: 0.3, delay: 0.06 * index };
      if (isCleanLightPro) return { duration: 0.4, delay: 0.05 * index, ease: [0.25, 0.1, 0.25, 1] };
      if (isSoftDarkPro) return { duration: 0.2, delay: 0.05 * index };
      if (isSolidLightCore) return { duration: 0.25, delay: 0.05 * index };
      if (isAccentSolidMinimal) return { duration: 0.25, delay: 0.05 * index };
      if (is3DElevationStack) return { duration: 0.5, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] };
      if (isFloatingPanelsPro) return { duration: 0.5, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] };
      if (isRoyalEmber3D) return { duration: 0.28, delay: 0.06 * index, ease: [0.22, 1, 0.36, 1] };
      if (isEmberContrastPro) return { duration: 0.25, delay: 0.07 * index };
      if (isUltraDepthPurple) return { duration: 0.4, delay: 0.06 * index, type: 'spring', stiffness: 200, damping: 20 };
      if (isElegantPortraitCard) return { duration: 0.6, delay: 0.1 * index, ease: [0.22, 1, 0.36, 1] };
      if (isYellowHeroCard) return { duration: 0.4, delay: 0.08 * index, ease: [0.25, 0.1, 0.25, 1] };
      if (isSunsetMotionProfile) return { duration: 0.6, delay: 0.1 * index, ease: [0.22, 1, 0.36, 1] };
      if (isNeonPulseProfile) return { type: 'spring', stiffness: 300, damping: 24, delay: 0.08 * index };
      return { duration: 0.4, delay: 0.1 * index };
    };

    const getWhileHover = () => {
      if (isCreatorBlackPro) return { y: -3, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' };
      if (isSunsetGradientPro) return { y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' };
      if (isEditorialLuxe) return { scale: 1.01 };
      if (isGlassElite) return { y: -2, boxShadow: '0 0 25px rgba(129, 140, 248, 0.25)', borderColor: 'rgba(255, 255, 255, 0.3)' };
      if (isClassicSolidPro) return { y: -2, filter: 'brightness(0.95)' };
      if (isCleanLightPro) return { y: -2, boxShadow: '0 8px 20px rgba(0,0,0,0.12)' };
      if (isSoftDarkPro) return { y: -2, backgroundColor: '#2C2C35' };
      if (isSolidLightCore) return { y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
      if (isAccentSolidMinimal) return { y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' };
      if (is3DElevationStack) return { y: -4, rotateX: 2, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)' };
      if (isFloatingPanelsPro) return { y: -5, rotateX: 4, scale: 1.02, boxShadow: '0 20px 30px -5px rgba(0,0,0,0.5), 0 10px 10px -5px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)' };
      if (isRoyalEmber3D) return { y: -5, rotateX: 3, boxShadow: '0 15px 30px -5px rgba(43, 15, 84, 0.9), 0 0 20px rgba(255, 122, 24, 0.4)', borderColor: '#FF9F55' };
      if (isEmberContrastPro) return { y: -4, scale: 1.02, boxShadow: '0 20px 30px -8px rgba(59, 7, 100, 0.7), 0 8px 20px rgba(249, 115, 22, 0.4)' };
      if (isUltraDepthPurple) return { y: -6, rotateX: 3, boxShadow: '0 20px 40px -5px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)' };
      if (isElegantPortraitCard) return { y: -2, boxShadow: '8px 8px 16px #dcd2ce, -8px -8px 16px #ffffff' };
      if (isYellowHeroCard) return { y: -2, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' };
      if (isSunsetMotionProfile) return { y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' };
      if (isNeonPulseProfile) return { scale: 1.02, boxShadow: '0 8px 24px rgba(138, 92, 255, 0.15)', borderColor: 'rgba(138, 92, 255, 0.5)' };
      
      return { 
        scale: 1.02,  
        boxShadow: isAuroraMotion 
          ? '0 0 20px rgba(34, 211, 238, 0.3)' 
          : isNeonPulse
            ? '0 0 20px rgba(0, 255, 255, 0.8), inset 0 0 20px rgba(0, 255, 255, 0.2)'
            : undefined 
      };
    };

    const getWhileTap = () => {
      if (isCreatorBlackPro) return { scale: 0.97 };
      if (isSunsetGradientPro) return { scale: 0.98 };
      if (isEditorialLuxe) return { scale: 0.99 };
      if (isGlassElite) return { scale: 0.98 };
      if (isClassicSolidPro) return { scale: 0.98 };
      if (isCleanLightPro) return { scale: 0.97 };
      if (isSoftDarkPro) return { scale: 0.97 };
      if (isSolidLightCore) return { scale: 0.97 };
      if (isAccentSolidMinimal) return { scale: 0.98 };
      if (is3DElevationStack) return { scale: 0.97, y: 1 };
      if (isFloatingPanelsPro) return { scale: 0.98, boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)' };
      if (isRoyalEmber3D) return { scale: 0.96, y: 1 };
      if (isEmberContrastPro) return { scale: 0.98, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' };
      if (isUltraDepthPurple) return { scale: 0.95, boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)' };
      if (isElegantPortraitCard) return { scale: 0.95, boxShadow: 'inset 5px 5px 10px #dcd2ce, inset -5px -5px 10px #ffffff' };
      if (isYellowHeroCard) return { scale: 0.97 };
      if (isSunsetMotionProfile) return { scale: 0.97 };
      if (isNeonPulseProfile) return { scale: 0.98 };
      return { scale: 0.98 };
    };

    return {
      getInitial,
      getAnimate,
      getTransition,
      getWhileHover,
      getWhileTap,
    };
  }, [themeFlags]);

  return { themeFlags, styles, classes, animations };
};
