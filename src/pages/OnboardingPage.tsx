import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { 
  Loader2, ArrowRight, UserCircle, Palette, Briefcase, Users, 
  Instagram, Youtube, Twitter, Facebook, Linkedin, Github, Globe, 
  Music, MessageCircle, Camera, Check, Plus, Trash2, Image as ImageIcon,
  Smartphone, Link as LinkIcon, X
} from 'lucide-react';
import { TEMPLATES } from '../constants/templates';
import { SchemaCheck } from '../components/SchemaCheck';

const usernameSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
});

const profileSchema = z.object({
  display_name: z.string().min(1, 'Display name is required'),
  bio: z.string().max(160, 'Bio must be less than 160 characters').optional(),
});

const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E1306C' },
  { id: 'tiktok', name: 'TikTok', icon: Music, color: '#000000' }, // Using Music as placeholder
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' },
  { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: '#1DA1F2' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { id: 'github', name: 'GitHub', icon: Github, color: '#181717' },
  { id: 'website', name: 'Website', icon: Globe, color: '#25D366' },
  { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: '#25D366' },
  { id: 'snapchat', name: 'Snapchat', icon: Camera, color: '#FFFC00' },
  { id: 'spotify', name: 'Spotify', icon: Music, color: '#1DB954' },
  { id: 'pinterest', name: 'Pinterest', icon: Camera, color: '#BD081C' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { user, isDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialUsername = location.state?.username || '';

  const { register: registerUsername, handleSubmit: handleUsernameSubmit, formState: { errors: usernameErrors }, watch: watchUsername } = useForm({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: initialUsername }
  });

  const usernameValue = watchUsername('username');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  React.useEffect(() => {
    const checkUsername = async () => {
      if (!usernameValue || usernameValue.length < 3) {
        setUsernameAvailable(null);
        return;
      }
      
      setIsCheckingUsername(true);
      try {
        // Simulate network delay for better UX feel or just proceed
        // await new Promise(resolve => setTimeout(resolve, 300));

        if (!isDemo && user) {
          const { data: existingUser, error } = await supabase
            .from('users')
            .select('username')
            .eq('username', usernameValue)
            .single();
          
          if (error && error.code !== 'PGRST116') {
             console.error('Error checking username:', error);
             // Don't block on error, assume available but maybe log it
          }
          
          setUsernameAvailable(!existingUser);
        } else {
           // In demo mode, everything is available
           setUsernameAvailable(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const timeoutId = setTimeout(() => {
      checkUsername();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [usernameValue, user, isDemo]);

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, setValue: setProfileValue, watch: watchProfile } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { display_name: '', bio: '' }
  });

  const [onboardingData, setOnboardingData] = useState({
    username: '',
    category: '',
    templateId: 'minimal',
    selected_platforms: [] as string[],
    links: [] as { platform: string, url: string }[],
    display_name: '',
    bio: '',
    avatar_url: '',
  });

  const handleUsernameNext = async (data: any) => {
    setIsLoading(true);
    try {
      if (!isDemo && user) {
        const { data: existingUser, error } = await supabase
          .from('users')
          .select('username')
          .eq('username', data.username)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        if (existingUser) {
          toast.error('Username is already taken');
          return;
        }
      }
      setOnboardingData(prev => ({ ...prev, username: data.username }));
      setStep(2);
    } catch (error: any) {
      console.error(error);
      toast.error('Error checking username availability');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    setOnboardingData(prev => ({ ...prev, category }));
    setStep(3);
  };

  const handleThemeSelect = (templateId: string) => {
    setOnboardingData(prev => ({ ...prev, templateId }));
    setStep(4);
  };

  const togglePlatform = (platformId: string) => {
    setOnboardingData(prev => {
      const selected = prev.selected_platforms.includes(platformId)
        ? prev.selected_platforms.filter(id => id !== platformId)
        : [...prev.selected_platforms, platformId].slice(0, 5); // Limit to 5
      return { ...prev, selected_platforms: selected };
    });
  };

  const handleLinksNext = () => {
    // Filter out empty URLs
    const validLinks = onboardingData.links.filter(l => l.url.trim() !== '');
    setOnboardingData(prev => ({ ...prev, links: validLinks }));
    setStep(6);
  };

  const updateLinkUrl = (platformId: string, url: string) => {
    setOnboardingData(prev => {
      const existingLinkIndex = prev.links.findIndex(l => l.platform === platformId);
      const newLinks = [...prev.links];
      if (existingLinkIndex >= 0) {
        newLinks[existingLinkIndex] = { platform: platformId, url };
      } else {
        newLinks.push({ platform: platformId, url });
      }
      return { ...prev, links: newLinks };
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      setUploading(true);
      
      // Try Supabase upload first
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { upsert: true });

        if (uploadError) {
          // If bucket not found, try to create it
          if (uploadError.message.includes('Bucket not found') || (uploadError as any).statusCode === '404') {
            await supabase.storage.createBucket('avatars', { public: true });
            const { error: retryError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
            if (retryError) throw retryError;
          } else {
            throw uploadError;
          }
        }

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        setOnboardingData(prev => ({ ...prev, avatar_url: data.publicUrl }));
        toast.success('Image uploaded!');
      } catch (supabaseError) {
        console.warn('Supabase upload failed, falling back to local preview:', supabaseError);
        // Fallback to local preview
        const objectUrl = URL.createObjectURL(file);
        setOnboardingData(prev => ({ ...prev, avatar_url: objectUrl }));
        toast.success('Image uploaded (Preview Mode)');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleProfileNext = (data: any) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
    setStep(7);
  };

  const onFinish = async () => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('No user found');
      
      if (!isDemo) {
        // 1. Create User Profile
        const { error: userError } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            username: onboardingData.username,
            display_name: onboardingData.display_name,
            bio: onboardingData.bio,
            avatar_url: onboardingData.avatar_url,
            theme_config: { templateId: onboardingData.templateId },
            created_at: new Date().toISOString()
          });

        if (userError) throw userError;

        // 2. Create Links
        if (onboardingData.links.length > 0) {
          const linksToInsert = onboardingData.links.map((link, index) => ({
            user_id: user.id,
            title: SOCIAL_PLATFORMS.find(p => p.id === link.platform)?.name || link.platform,
            url: link.url,
            icon: link.platform,
            position: index,
            is_active: true,
            created_at: new Date().toISOString()
          }));

          const { error: linksError } = await supabase
            .from('links')
            .insert(linksToInsert);

          if (linksError) throw linksError;
        }
      }
      
      toast.success('Profile created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 1000 : -1000, opacity: 0 })
  };

  return (
    <div className="min-h-screen bg-vybe-dark flex items-center justify-center p-4 relative overflow-hidden">
      <SchemaCheck />
      <div className="absolute inset-0 bg-animated-gradient opacity-10" />
      
      <div className="w-full max-w-lg glass-panel rounded-[2rem] overflow-hidden relative z-10 min-h-[600px] flex flex-col">
        {/* Progress Bar */}
        <div className="h-1 w-full bg-white/10">
          <motion.div 
            className="h-full bg-vybe-accent"
            initial={{ width: '14%' }}
            animate={{ width: `${(step / 7) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex-1 p-8 relative flex flex-col">
          <AnimatePresence custom={1} mode="wait">
            
            {/* STEP 1: Username */}
            {step === 1 && (
              <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" className="flex-1 flex flex-col">
                <div className="mb-8">
                  <div className="w-12 h-12 rounded-full bg-vybe-accent/20 flex items-center justify-center mb-4">
                    <UserCircle className="w-6 h-6 text-vybe-accent" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Claim your link</h2>
                  <p className="text-white/60">Choose a unique username for your bio link page.</p>
                </div>
                <form onSubmit={handleUsernameSubmit(handleUsernameNext)} className="flex-1 flex flex-col">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">biolink.com/</span>
                      <Input 
                        id="username" 
                        placeholder="yourname" 
                        className={`pl-28 pr-10 ${
                          usernameErrors.username ? 'border-red-500' : 
                          usernameAvailable === true ? 'border-green-500' : 
                          usernameAvailable === false ? 'border-red-500' : ''
                        }`}
                        {...registerUsername('username')}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {isCheckingUsername ? (
                          <Loader2 className="w-4 h-4 animate-spin text-white/40" />
                        ) : usernameAvailable === true ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : usernameAvailable === false ? (
                          <X className="w-4 h-4 text-red-500" />
                        ) : null}
                      </div>
                    </div>
                    {usernameAvailable === false && !isCheckingUsername && (
                      <p className="text-red-500 text-xs mt-1">Username is already taken</p>
                    )}
                    {usernameErrors.username && <p className="text-red-500 text-xs">{usernameErrors.username.message as string}</p>}
                  </div>
                  <Button type="submit" variant="neon" className="w-full mt-auto" disabled={isLoading || isCheckingUsername || usernameAvailable === false}>
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: Category */}
            {step === 2 && (
              <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" className="flex-1 flex flex-col">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">What's your goal?</h2>
                  <p className="text-white/60">This helps us personalize your experience.</p>
                </div>
                <div className="space-y-4 flex-1">
                  {[
                    { id: 'creator', label: 'Creator', desc: 'Build my following and monetize.', icon: UserCircle, color: 'text-pink-500', bg: 'bg-pink-500/10' },
                    { id: 'business', label: 'Business', desc: 'Grow my business and reach customers.', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { id: 'personal', label: 'Personal', desc: 'Share links with friends.', icon: Users, color: 'text-green-500', bg: 'bg-green-500/10' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className="w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all text-left flex items-center gap-4 group"
                    >
                      <div className={`p-3 rounded-lg ${cat.bg} ${cat.color}`}>
                        <cat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{cat.label}</h3>
                        <p className="text-sm text-white/60">{cat.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <Button variant="ghost" onClick={() => setStep(1)} className="mt-4">Back</Button>
              </motion.div>
            )}

            {/* STEP 3: Theme */}
            {step === 3 && (
              <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" className="flex-1 flex flex-col">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2">Select a theme</h2>
                  <p className="text-white/60">Pick a style. You can change this later.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto pr-2 max-h-[400px]">
                  {Object.values(TEMPLATES).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleThemeSelect(template.id)}
                      className="group relative aspect-[3/4] rounded-xl border border-white/10 overflow-hidden hover:border-vybe-accent transition-all"
                      style={{ background: template.background }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                        <div className="w-12 h-12 rounded-full" style={{ backgroundColor: template.accentColor }} />
                        <div className="w-20 h-2 rounded-full bg-black/20" />
                        <div className="w-16 h-2 rounded-full bg-black/10" />
                        <div className="w-16 h-2 rounded-full bg-black/10" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm text-center rounded-b-xl">
                        <span className="text-xs font-bold text-white">{template.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <Button variant="ghost" onClick={() => setStep(2)} className="mt-4">Back</Button>
              </motion.div>
            )}

            {/* STEP 4: Social Platforms */}
            {step === 4 && (
              <motion.div key="step4" variants={slideVariants} initial="enter" animate="center" exit="exit" className="flex-1 flex flex-col">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2">Which platforms?</h2>
                  <p className="text-white/60">Pick up to 5 to get started.</p>
                </div>
                <div className="grid grid-cols-3 gap-3 flex-1 overflow-y-auto pr-2 max-h-[400px]">
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const isSelected = onboardingData.selected_platforms.includes(platform.id);
                    return (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${isSelected ? 'border-vybe-accent bg-vybe-accent/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                      >
                        <platform.icon className="w-8 h-8" style={{ color: isSelected ? '#f2ff00' : platform.color }} />
                        <span className="text-xs font-medium">{platform.name}</span>
                        {isSelected && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-vybe-accent" />}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-6">
                  <Button variant="outline" onClick={() => setStep(3)} className="flex-1">Back</Button>
                  <Button variant="neon" onClick={() => setStep(5)} className="flex-1">Continue</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Add Links */}
            {step === 5 && (
              <motion.div key="step5" variants={slideVariants} initial="enter" animate="center" exit="exit" className="flex-1 flex flex-col">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2">Add your links</h2>
                  <p className="text-white/60">Complete the fields below.</p>
                </div>
                <div className="space-y-4 flex-1 overflow-y-auto pr-2 max-h-[400px]">
                  {onboardingData.selected_platforms.length === 0 ? (
                    <div className="text-center py-10 text-white/40">
                      <p>No platforms selected.</p>
                      <Button variant="link" onClick={() => setStep(4)} className="text-vybe-accent">Go back to select platforms</Button>
                    </div>
                  ) : (
                    onboardingData.selected_platforms.map((platformId) => {
                      const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
                      const currentLink = onboardingData.links.find(l => l.platform === platformId)?.url || '';
                      return (
                        <div key={platformId} className="space-y-2">
                          <Label className="flex items-center gap-2">
                            {platform?.icon && <platform.icon className="w-4 h-4" />}
                            {platform?.name} URL
                          </Label>
                          <Input 
                            placeholder={`https://${platformId}.com/...`}
                            value={currentLink}
                            onChange={(e) => updateLinkUrl(platformId, e.target.value)}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="flex gap-4 mt-6">
                  <Button variant="outline" onClick={() => setStep(4)} className="flex-1">Back</Button>
                  <Button variant="neon" onClick={handleLinksNext} className="flex-1">Continue</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 6: Profile Details */}
            {step === 6 && (
              <motion.div key="step6" variants={slideVariants} initial="enter" animate="center" exit="exit" className="flex-1 flex flex-col">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2">Profile details</h2>
                  <p className="text-white/60">Add your photo and bio.</p>
                </div>
                
                <form onSubmit={handleProfileSubmit(handleProfileNext)} className="flex-1 flex flex-col space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 bg-white/5 flex items-center justify-center">
                        {onboardingData.avatar_url ? (
                          <img src={onboardingData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <UserCircle className="w-12 h-12 text-white/20" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 rounded-full bg-vybe-accent text-black hover:bg-vybe-accent/90 transition-colors"
                      >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                      />
                    </div>
                    <span className="text-sm text-white/40">Tap + to upload</span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input 
                      id="display_name" 
                      placeholder="Your Name" 
                      {...registerProfile('display_name')}
                      className={profileErrors.display_name ? 'border-red-500' : ''}
                    />
                    {profileErrors.display_name && <p className="text-red-500 text-xs">{profileErrors.display_name.message as string}</p>}
                  </div>

                  <div className="space-y-2 flex-1">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea 
                      id="bio" 
                      placeholder="Tell the world about yourself..." 
                      className={`w-full h-24 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-vybe-accent ${profileErrors.bio ? 'border-red-500' : ''}`}
                      {...registerProfile('bio')}
                    />
                    {profileErrors.bio && <p className="text-red-500 text-xs">{profileErrors.bio.message as string}</p>}
                  </div>

                  <div className="flex gap-4 mt-auto">
                    <Button type="button" variant="outline" onClick={() => setStep(5)} className="flex-1">Back</Button>
                    <Button type="submit" variant="neon" className="flex-1">Continue</Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 7: Final Preview */}
            {step === 7 && (
              <motion.div key="step7" variants={slideVariants} initial="enter" animate="center" exit="exit" className="flex-1 flex flex-col items-center text-center">
                <div className="mb-8 mt-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Looking good!</h2>
                  <p className="text-white/60">Your bio link page is ready to go.</p>
                </div>

                {/* Preview Card */}
                <div className="w-full max-w-xs aspect-[9/16] rounded-3xl border-4 border-black shadow-2xl overflow-hidden relative mb-8 transform scale-90">
                  <div className="absolute inset-0" style={{ background: TEMPLATES[onboardingData.templateId]?.background || '#fff' }}>
                    <div className="p-6 flex flex-col items-center pt-12">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 mb-4">
                        {onboardingData.avatar_url ? (
                          <img src={onboardingData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-white/10 flex items-center justify-center">
                            <UserCircle className="w-10 h-10 text-white/50" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-1" style={{ color: TEMPLATES[onboardingData.templateId]?.textColor }}>
                        {onboardingData.display_name || onboardingData.username}
                      </h3>
                      <p className="text-xs text-center opacity-80 mb-6" style={{ color: TEMPLATES[onboardingData.templateId]?.textColor }}>
                        {onboardingData.bio}
                      </p>
                      
                      <div className="w-full space-y-3">
                        {onboardingData.links.slice(0, 3).map((link, i) => (
                          <div key={i} className="w-full h-10 rounded-lg flex items-center justify-center" style={{ background: TEMPLATES[onboardingData.templateId]?.cardBg, color: TEMPLATES[onboardingData.templateId]?.textColor }}>
                            <span className="text-xs font-medium">
                              {SOCIAL_PLATFORMS.find(p => p.id === link.platform)?.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={onFinish} variant="neon" className="w-full max-w-xs" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Go to Dashboard'}
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
