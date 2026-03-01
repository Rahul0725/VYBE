import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Sparkles, Zap, Smartphone } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-vybe-dark overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-animated-gradient opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vybe-accent/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-vybe-accent-2/20 rounded-full blur-[120px]" />

      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter text-white">
          VYBE<span className="text-vybe-accent">.</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button variant="neon" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <Sparkles className="w-4 h-4 text-vybe-accent" />
          <span className="text-sm font-medium">The next-gen link in bio</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-tight"
        >
          Own your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-vybe-accent via-vybe-accent-2 to-vybe-accent-3">
            digital identity
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mb-10"
        >
          One link to rule them all. Connect your audience to all your content with a beautiful, customizable page that converts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
        >
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-medium">vybe.bio/</span>
            <input 
              type="text" 
              placeholder="yourname"
              className="w-full h-14 pl-24 pr-4 rounded-full bg-white/5 border border-white/10 text-white focus:outline-none focus:border-vybe-accent transition-colors"
            />
          </div>
          <Button variant="neon" size="lg" className="shrink-0" asChild>
            <Link to="/signup">
              Claim Link <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left"
        >
          <div className="glass-panel p-6 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-vybe-accent/20 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-vybe-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-white/60">Optimized for speed. Your page loads instantly, keeping your audience engaged.</p>
          </div>
          <div className="glass-panel p-6 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-vybe-accent-2/20 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-vybe-accent-2" />
            </div>
            <h3 className="text-xl font-bold mb-2">Stunning Design</h3>
            <p className="text-white/60">Stand out with premium themes, glassmorphism, and smooth animations.</p>
          </div>
          <div className="glass-panel p-6 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-vybe-accent-3/20 flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-vybe-accent-3" />
            </div>
            <h3 className="text-xl font-bold mb-2">Mobile First</h3>
            <p className="text-white/60">Designed perfectly for the devices your audience actually uses.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
