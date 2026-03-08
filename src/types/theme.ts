export type TemplateId = 
  | 'neon_pulse_profile'
  | 'sunset_motion_profile'
  | 'minimal' 
  | 'neon' 
  | 'gradient' 
  | 'glass' 
  | 'bold'
  | 'sunset'
  | 'ocean'
  | 'forest'
  | 'midnight'
  | 'cyber'
  | 'retro'
  | 'pastel'
  | 'monochrome'
  | 'galaxy'
  | 'aurora'
  | 'volcano'
  | 'glacier'
  | 'desert'
  | 'jungle'
  | 'candy'
  | 'royal'
  | 'slate'
  | 'coffee'
  | 'lavender'
  | 'mint'
  | 'aurora_motion'
  | 'premium_dark'
  | 'neon_pulse'
  | 'liquid_glass'
  | 'motion_stack'
  | 'creator_black_pro'
  | 'sunset_gradient_pro'
  | 'editorial_luxe'
  | 'glass_elite'
  | 'classic_solid_pro'
  | 'clean_light_pro'
  | 'soft_dark_pro'
  | 'solid_light_core'
  | 'accent_solid_minimal'
  | '3d_elevation_stack'
  | 'floating_panels_pro'
  | 'royal_ember_3d'
  | 'ember_contrast_pro'
  | 'ultra_depth_purple'
  | 'elegant_portrait_card'
  | 'yellow_hero_card'
  | 'brush_artist_card'
  | 'comic_bio';

export interface TemplateSlot {
  id: string;
  position: number;
  label?: string;
  defaultIcon?: string;
}

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  layout: 'stacked' | 'grid' | 'profile-card';
  buttonStyle: 'rounded' | 'square' | 'pill' | 'hard-shadow' | 'circular';
  fontStyle: 'modern' | 'serif' | 'mono' | 'comic';
  background: string; // CSS value (color or gradient)
  textColor: string;
  accentColor: string;
  cardBg: string; // CSS value for link cards
  cardBorder?: string;
  cardShadow?: string;
  animation?: string;
  bgSize?: string;
  // Advanced styling options
  cardBackdropBlur?: string;
  avatarAnimation?: string;
  containerGlass?: boolean;
  blobAnimation?: boolean;
  gridAnimation?: boolean;
  textOpacity?: number;
  
  // Template Engine Rules
  templateName?: string;
  layoutType?: 'stacked' | 'grid' | 'profile-card';
  maxButtons?: number;
  minButtons?: number;
  allowIcons?: boolean;
  allowImages?: boolean;
  allowSections?: boolean;
  animationStyle?: string;
  layoutLocked?: boolean;
  buttonSlots?: TemplateSlot[];
}

export interface UserThemeConfig {
  templateId: TemplateId;
  customConfig?: Partial<TemplateConfig>;
}
