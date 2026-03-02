import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SearchBar } from '../components/SearchBar';
import { Loader2, User, ArrowRight, Sparkles } from 'lucide-react';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, username, full_name, avatar_url, bio, is_published')
          .ilike('username', `%${searchQuery}%`)
          .eq('is_published', true)
          .limit(10);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      searchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-vybe-dark text-white overflow-x-hidden">
      {/* Background Grid (Uiverse style) */}
      <div className="uiverse-grid opacity-20 fixed inset-0 pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vybe-accent/10 border border-vybe-accent/20 mb-6">
            <Sparkles className="w-4 h-4 text-vybe-accent" />
            <span className="text-sm font-medium text-vybe-accent">Discover Creators</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Explore the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-vybe-accent via-vybe-accent-2 to-vybe-accent-3">
              Vybe Community
            </span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Find and follow your favorite creators, artists, and influencers on Vybe.
          </p>
        </motion.div>

        <div className="flex justify-center mb-20">
          <SearchBar 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username..."
          />
        </div>

        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center py-12"
              >
                <Loader2 className="w-8 h-8 animate-spin text-vybe-accent" />
              </motion.div>
            ) : results.length > 0 ? (
              results.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <Link 
                    to={`/${user.username}`}
                    className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-vybe-accent/50 transition-all duration-300"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-vybe-darker border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                      {user.avatar_url ? (
                        <img 
                          src={user.avatar_url} 
                          alt={user.username} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User className="w-8 h-8 text-white/20" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">@{user.username}</h3>
                      <p className="text-white/40 text-sm truncate">{user.full_name || 'Vybe Creator'}</p>
                      {user.bio && <p className="text-white/60 text-sm mt-1 line-clamp-1">{user.bio}</p>}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-vybe-accent group-hover:text-vybe-darker transition-all duration-300">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : hasSearched && searchQuery.length >= 2 ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-white/40"
              >
                No creators found matching "{searchQuery}"
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
