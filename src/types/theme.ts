export type TemplateId = 
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
  | 'premium_dark';

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  layout: 'stacked' | 'grid';
  buttonStyle: 'rounded' | 'square' | 'pill' | 'hard-shadow';
  fontStyle: 'modern' | 'serif' | 'mono';
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
  textOpacity?: number;
}

export interface UserThemeConfig {
  templateId: TemplateId;
  customConfig?: Partial<TemplateConfig>;
}
