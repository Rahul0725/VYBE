import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Loader2, ArrowRight, UserCircle, Palette } from 'lucide-react';

const usernameSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
});

const profileSchema = z.object({
  display_name: z.string().min(1, 'Display name is required'),
  bio: z.string().max(160, 'Bio must be less than 160 characters').optional(),
});

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isDemo } = useAuth();
  const navigate = useNavigate();

  const { register: registerUsername, handleSubmit: handleUsernameSubmit, formState: { errors: usernameErrors } } = useForm({
    resolver: zodResolver(usernameSchema),
  });

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const [onboardingData, setOnboardingData] = useState({
    username: '',
    display_name: '',
    bio: '',
    theme_color: '#f2ff00',
    theme_background: '#050505',
  });

  const onUsernameNext = async (data: any) => {
    setIsLoading(true);
    try {
      if (!isDemo) {
        // Check if username exists
        const { data: existingUser, error } = await supabase
          .from('users')
          .select('username')
          .eq('username', data.username)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
           throw error;
        }

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

  const onProfileNext = (data: any) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
    setStep(3);
  };

  const onFinish = async () => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('No user found');
      
      if (!isDemo) {
        const { error } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            username: onboardingData.username,
            display_name: onboardingData.display_name,
            bio: onboardingData.bio,
            theme_color: onboardingData.theme_color,
            theme_background: onboardingData.theme_background,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
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
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-vybe-dark flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-animated-gradient opacity-10" />
      
      <div className="w-full max-w-lg glass-panel rounded-[2rem] overflow-hidden relative z-10 min-h-[500px] flex flex-col">
        {/* Progress Bar */}
        <div className="h-1 w-full bg-white/10">
          <motion.div 
            className="h-full bg-vybe-accent"
            initial={{ width: '33%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex-1 p-8 relative">
          <AnimatePresence custom={1} mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="h-full flex flex-col"
              >
                <div className="mb-8">
                  <div className="w-12 h-12 rounded-full bg-vybe-accent/20 flex items-center justify-center mb-4">
                    <UserCircle className="w-6 h-6 text-vybe-accent" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Claim your link</h2>
                  <p className="text-white/60">Choose a unique username for your VYBE page.</p>
                </div>

                <form onSubmit={handleUsernameSubmit(onUsernameNext)} className="flex-1 flex flex-col">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">vybe.bio/</span>
                      <Input 
                        id="username" 
                        placeholder="yourname" 
                        className={`pl-24 ${usernameErrors.username ? 'border-red-500' : ''}`}
                        {...registerUsername('username')}
                      />
                    </div>
                    {usernameErrors.username && <p className="text-red-500 text-xs">{usernameErrors.username.message as string}</p>}
                  </div>

                  <Button type="submit" variant="neon" className="w-full mt-auto" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="h-full flex flex-col"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">Tell us about yourself</h2>
                  <p className="text-white/60">This will be displayed on your public page.</p>
                </div>

                <form onSubmit={handleProfileSubmit(onProfileNext)} className="flex-1 flex flex-col space-y-4">
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
                      placeholder="A short bio about you..." 
                      className={`w-full h-32 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-vybe-accent ${profileErrors.bio ? 'border-red-500' : ''}`}
                      {...registerProfile('bio')}
                    />
                    {profileErrors.bio && <p className="text-red-500 text-xs">{profileErrors.bio.message as string}</p>}
                  </div>

                  <div className="flex gap-4 mt-auto">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                    <Button type="submit" variant="neon" className="flex-1">Continue <ArrowRight className="ml-2 w-4 h-4" /></Button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="h-full flex flex-col"
              >
                <div className="mb-8">
                  <div className="w-12 h-12 rounded-full bg-vybe-accent-2/20 flex items-center justify-center mb-4">
                    <Palette className="w-6 h-6 text-vybe-accent-2" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Pick your VYBE</h2>
                  <p className="text-white/60">Choose a starting theme. You can change this later.</p>
                </div>

                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { bg: '#050505', color: '#f2ff00', name: 'Neon Dark' },
                      { bg: '#1a0b2e', color: '#ff00ff', name: 'Cyber Pink' },
                      { bg: '#0b1a2e', color: '#00ffff', name: 'Deep Sea' },
                      { bg: '#ffffff', color: '#000000', name: 'Clean Light' },
                    ].map((theme, i) => (
                      <button
                        key={i}
                        onClick={() => setOnboardingData(prev => ({ ...prev, theme_background: theme.bg, theme_color: theme.color }))}
                        className={`p-4 rounded-xl border-2 transition-all ${onboardingData.theme_background === theme.bg ? 'border-vybe-accent scale-105' : 'border-white/10 hover:border-white/30'}`}
                        style={{ backgroundColor: theme.bg }}
                      >
                        <div className="w-full h-8 rounded-full mb-2" style={{ backgroundColor: theme.color }} />
                        <span className="text-xs font-medium" style={{ color: theme.bg === '#ffffff' ? '#000000' : '#ffffff' }}>{theme.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1" disabled={isLoading}>Back</Button>
                  <Button onClick={onFinish} variant="neon" className="flex-1" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete Setup'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
