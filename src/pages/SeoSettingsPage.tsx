import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';
import { SeoPreview } from '../components/SeoPreview';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

const seoSchema = z.object({
  seo_title: z.string().max(60, 'Title must be less than 60 characters').optional(),
  seo_description: z.string().max(160, 'Description must be less than 160 characters').optional(),
  og_template_style: z.enum(['default', 'minimal', 'dark', 'gradient', 'glass']).default('default'),
});

type SeoFormValues = z.infer<typeof seoSchema>;

export default function SeoSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [ogImageUrl, setOgImageUrl] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SeoFormValues>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      og_template_style: 'default',
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUser(profile);
          setValue('seo_title', profile.seo_title || '');
          setValue('seo_description', profile.seo_description || '');
          setValue('og_template_style', profile.og_template_style || 'default');
          setOgImageUrl(profile.og_image_url);
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [setValue]);

  const onSubmit = async (data: SeoFormValues) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          seo_title: data.seo_title,
          seo_description: data.seo_description,
          og_template_style: data.og_template_style,
          og_image_url: ogImageUrl,
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('SEO settings updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update SEO settings');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/og-image-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars') // Using avatars bucket for now as per policy
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setOgImageUrl(publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">SEO & Social Sharing</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form Section */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-2">
              <Label htmlFor="seo_title">SEO Title</Label>
              <Input 
                id="seo_title" 
                {...register('seo_title')} 
                placeholder="My Awesome Link Page" 
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Recommended: 50-60 chars</span>
                <span className={watchedValues.seo_title?.length > 60 ? 'text-red-500' : ''}>
                  {watchedValues.seo_title?.length || 0}/60
                </span>
              </div>
              {errors.seo_title && <p className="text-red-500 text-sm">{errors.seo_title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="seo_description">SEO Description</Label>
              <Textarea 
                id="seo_description" 
                {...register('seo_description')} 
                placeholder="Check out my links and bio..." 
                className="h-24"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Recommended: 150-160 chars</span>
                <span className={watchedValues.seo_description?.length > 160 ? 'text-red-500' : ''}>
                  {watchedValues.seo_description?.length || 0}/160
                </span>
              </div>
              {errors.seo_description && <p className="text-red-500 text-sm">{errors.seo_description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Open Graph Image</Label>
              <div className="flex items-center gap-4">
                {ogImageUrl && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                    <img src={ogImageUrl} alt="OG Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    disabled={uploading}
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 1200x630px</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="og_template_style">OG Image Template Style</Label>
              <select 
                id="og_template_style" 
                {...register('og_template_style')}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="default">Default</option>
                <option value="minimal">Minimal</option>
                <option value="dark">Dark</option>
                <option value="gradient">Gradient</option>
                <option value="glass">Glass</option>
              </select>
              <p className="text-xs text-gray-500">
                Used when no custom image is uploaded.
              </p>
            </div>

            <Button type="submit" disabled={uploading}>
              Save Changes
            </Button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Live Preview</h2>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <SeoPreview 
              title={watchedValues.seo_title || user?.display_name || 'Page Title'}
              description={watchedValues.seo_description || user?.bio || 'Page description...'}
              image={ogImageUrl || `${window.location.origin}/api/og?username=${user?.username}`}
              url={`${window.location.origin}/${user?.username}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
