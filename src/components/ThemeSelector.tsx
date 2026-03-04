import { TEMPLATES } from '../constants/templates';
import { TemplateId } from '../types/theme';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface ThemeSelectorProps {
  currentTemplateId: TemplateId;
  onSelect: (templateId: TemplateId) => void;
}

export default function ThemeSelector({ currentTemplateId, onSelect }: ThemeSelectorProps) {
  return (
    <div className="max-h-[600px] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Object.values(TEMPLATES).map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={cn(
              "relative aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all hover:scale-[1.02]",
              currentTemplateId === template.id 
                ? "border-vybe-accent ring-2 ring-vybe-accent/20" 
                : "border-transparent hover:border-white/20"
            )}
            style={{ 
              background: template.background,
              backgroundSize: template.bgSize,
              animation: template.animation
            }}
          >
            {/* Preview Content */}
            <div className="absolute inset-0 p-4 flex flex-col items-center justify-center gap-2 pointer-events-none">
              <div 
                className="w-12 h-12 rounded-full mb-2" 
                style={{ background: template.cardBg, color: template.textColor }}
              />
              {template.layout === 'profile-card' ? (
                <div className="flex gap-2">
                  <div 
                    className="w-8 h-8 rounded-full" 
                    style={{ 
                      background: template.cardBg, 
                      border: template.cardBorder,
                      boxShadow: template.cardShadow
                    }}
                  />
                  <div 
                    className="w-8 h-8 rounded-full" 
                    style={{ 
                      background: template.cardBg, 
                      border: template.cardBorder,
                      boxShadow: template.cardShadow
                    }}
                  />
                </div>
              ) : (
                <>
                  <div 
                    className="w-full h-8 rounded-lg" 
                    style={{ 
                      background: template.cardBg, 
                      border: template.cardBorder,
                      boxShadow: template.cardShadow
                    }}
                  />
                  <div 
                    className="w-full h-8 rounded-lg opacity-60" 
                    style={{ 
                      background: template.cardBg,
                      border: template.cardBorder,
                      boxShadow: template.cardShadow
                    }}
                  />
                </>
              )}
            </div>

            {/* Label */}
            <div className="absolute bottom-0 inset-x-0 bg-black/50 backdrop-blur-sm p-2 text-center">
              <span className="text-xs font-medium text-white">{template.name}</span>
            </div>

            {/* Active Indicator */}
            {currentTemplateId === template.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-vybe-accent rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-4 h-4 text-black" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
