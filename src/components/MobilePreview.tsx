import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { TEMPLATES } from '../constants/templates';
import { TemplateConfig } from '../types/theme';

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  is_active: boolean;
}

interface MobilePreviewProps {
  user: any; // Using any for now to avoid strict type checks on the extended user object
  links: Link[];
}

export default function MobilePreview({ user, links }: MobilePreviewProps) {
  const themeConfig = user?.theme_config || { templateId: 'minimal' };
  const templateId = themeConfig.templateId || 'minimal';
  const template: TemplateConfig = TEMPLATES[templateId] || TEMPLATES.minimal;

  // Merge custom config if exists
  const activeTheme = { ...template, ...themeConfig.customConfig };

  const containerStyle = {
    background: activeTheme.background,
    backgroundSize: activeTheme.bgSize,
    animation: activeTheme.animation,
    color: activeTheme.textColor,
    fontFamily: activeTheme.fontStyle === 'mono' ? 'monospace' : activeTheme.fontStyle === 'serif' ? 'serif' : activeTheme.fontStyle === 'comic' ? "'Patrick Hand', cursive" : 'sans-serif',
  };

  const cardStyle = {
    background: activeTheme.cardBg,
    border: activeTheme.cardBorder || 'none',
    boxShadow: activeTheme.cardShadow || 'none',
    color: activeTheme.textColor,
    borderRadius: templateId === 'comic_bio' ? '18px' : activeTheme.buttonStyle === 'pill' ? '9999px' : activeTheme.buttonStyle === 'square' ? '0px' : '12px',
  };

  const getComicEmoji = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('web')) return '🚀';
    if (t.includes('tube')) return '🎥';
    if (t.includes('insta')) return '📸';
    if (t.includes('shop')) return '🛒';
    if (t.includes('project')) return '⭐';
    if (t.includes('twitter') || t.includes('x')) return '🐦';
    if (t.includes('music') || t.includes('spotify')) return '🎵';
    return '✨';
  };

  return (
    <div className="relative w-[300px] h-[600px] bg-black rounded-[3rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden mx-auto">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20" />
      
      {/* Screen Content */}
      <div 
        className="w-full h-full overflow-y-auto scrollbar-hide"
        style={containerStyle}
      >
        {templateId === 'comic_bio' && (
          <>
            <div className="absolute text-[16px] animate-[float_6s_infinite_ease-in-out] top-[10%] left-[20%]">⭐</div>
            <div className="absolute text-[16px] animate-[float_6s_infinite_ease-in-out] top-[20%] left-[10%]">✨</div>
            <div className="absolute text-[16px] animate-[float_6s_infinite_ease-in-out] top-[70%] left-[80%]">⭐</div>
            <div className="absolute text-[16px] animate-[float_6s_infinite_ease-in-out] top-[80%] left-[15%]">✨</div>
            <div className="absolute text-[16px] animate-[float_6s_infinite_ease-in-out] top-[40%] right-[10%]">⭐</div>
          </>
        )}
        <div className={`pt-12 pb-8 px-6 flex flex-col items-center min-h-full ${templateId === 'comic_bio' ? 'bg-white border-[4px] border-black rounded-[25px] m-4 shadow-[5px_5px_0_#000]' : ''}`}>
          {/* Profile Header */}
          <div className="mb-8 text-center w-full">
            <div className={`w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 ${templateId === 'comic_bio' ? 'border-[3px] border-black' : 'border-2 border-opacity-20 border-current'}`}>
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-400">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <h1 className={`text-xl font-bold mb-1 tracking-tight ${templateId === 'comic_bio' ? 'text-2xl' : ''}`}>
              {user?.display_name || `@${user?.username}`}
            </h1>
            {user?.bio && (
              <p className={`text-sm opacity-80 font-medium ${templateId === 'comic_bio' ? 'bg-white border-[2px] border-black rounded-[15px] py-1 px-3 my-2 mx-auto inline-block relative after:content-[\'\'] after:absolute after:-bottom-[8px] after:left-[20px] after:w-0 after:h-0 after:border-l-[6px] after:border-l-transparent after:border-r-[6px] after:border-r-transparent after:border-t-[8px] after:border-t-black' : ''}`}>
                {user.bio}
              </p>
            )}
          </div>

          {/* Links */}
          <div className={`w-full ${activeTheme.layout === 'grid' ? 'grid grid-cols-1 gap-3' : 'space-y-3'}`}>
            {links.filter(l => l.is_active).map((link) => (
              <div
                key={link.id}
                className={`block w-full p-4 text-center transition-transform active:scale-95 hover:scale-[1.02] relative group min-h-[56px] flex items-center ${templateId === 'comic_bio' ? 'justify-between px-4' : 'justify-center'}`}
                style={cardStyle}
              >
                <span className="font-medium relative z-10">{link.title}</span>
                {templateId === 'comic_bio' && (
                  <span className="relative z-10">{getComicEmoji(link.title)}</span>
                )}
                {activeTheme.buttonStyle === 'hard-shadow' && templateId !== 'comic_bio' && (
                  <div className="absolute inset-0 border-2 border-current translate-x-1 translate-y-1 -z-10 rounded-none" />
                )}
              </div>
            ))}
          </div>
          
          {/* Branding */}
          <div className="mt-auto pt-8 pb-4">
            <p className="text-[10px] opacity-50 uppercase tracking-widest font-bold">
              bio link<span className="text-current">.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
