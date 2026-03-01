export type TemplateId = 'minimal' | 'neon' | 'gradient' | 'glass' | 'bold';

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
}

export interface UserThemeConfig {
  templateId: TemplateId;
  customConfig?: Partial<TemplateConfig>;
}
