import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Compass, ArrowLeft } from 'lucide-react';

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-vybe-dark overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-animated-gradient opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vybe-accent/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-vybe-accent-2/20 rounded-full blur-[120px]" />

      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-black tracking-tighter text-white">
          VYBE<span className="text-vybe-accent">.</span>
        </Link>
        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button variant="neon" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <Compass className="w-4 h-4 text-vybe-accent-3" />
          <span className="text-sm font-medium">Explore the Community</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight"
        >
          Discover <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-vybe-accent-3 via-vybe-accent-2 to-vybe-accent">
            Creators
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mb-10"
        >
          Explore trending profiles and find inspiration for your own page.
          <br />
          <span className="text-sm mt-4 block opacity-70">(Coming Soon)</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button variant="outline" asChild className="border-white/20 hover:bg-white/10">
            <Link to="/">
              <ArrowLeft className="mr-2 w-4 h-4" /> Back Home
            </Link>
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
