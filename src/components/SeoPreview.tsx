import React from 'react';
import { User } from '@supabase/supabase-js';

interface SeoPreviewProps {
  title: string;
  description: string;
  image: string;
  url: string;
}

export const SeoPreview: React.FC<SeoPreviewProps> = ({ title, description, image, url }) => {
  return (
    <div className="space-y-8">
      {/* Twitter / X Preview */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-md mx-auto shadow-sm">
        <div className="p-3 border-b border-gray-100 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span className="ml-2 text-xs text-gray-400 font-mono">Twitter / X Card</span>
        </div>
        <div className="relative aspect-[1.91/1] bg-gray-100 overflow-hidden">
          {image ? (
            <img src={image} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>
        <div className="p-3 bg-gray-50">
          <div className="text-xs text-gray-500 uppercase mb-1 truncate">{new URL(url || 'https://vybe.page').hostname}</div>
          <div className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{title || 'Page Title'}</div>
          <div className="text-xs text-gray-600 line-clamp-2">{description || 'Page description goes here...'}</div>
        </div>
      </div>

      {/* iMessage / WhatsApp Preview */}
      <div className="bg-[#E9E9EB] rounded-2xl p-3 max-w-xs mx-auto relative">
        <div className="absolute -top-6 left-0 text-xs text-gray-400 font-mono">iMessage Style</div>
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="aspect-[1.91/1] bg-gray-100 overflow-hidden relative">
             {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>
          <div className="p-3">
            <div className="font-semibold text-black text-sm mb-0.5 line-clamp-1">{title || 'Page Title'}</div>
            <div className="text-xs text-gray-500 line-clamp-2">{description || 'Page description...'}</div>
            <div className="text-[10px] text-gray-400 mt-1 truncate">{new URL(url || 'https://vybe.page').hostname}</div>
          </div>
        </div>
        <div className="w-4 h-4 bg-[#E9E9EB] absolute bottom-0 -left-1 rounded-bl-full"></div>
      </div>
    </div>
  );
};
