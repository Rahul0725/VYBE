import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import React from 'react';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Trust proxy for correct protocol/host behind Nginx/Cloud Run
app.set('trust proxy', true);

// Supabase Client for Server
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Cache fonts
let fontData: ArrayBuffer | null = null;
let fontRegularData: ArrayBuffer | null = null;

async function getFonts() {
  if (!fontData) {
    const res = await fetch('https://github.com/google/fonts/raw/main/ofl/inter/Inter-Bold.ttf');
    fontData = await res.arrayBuffer();
  }
  if (!fontRegularData) {
    const res = await fetch('https://github.com/google/fonts/raw/main/ofl/inter/Inter-Regular.ttf');
    fontRegularData = await res.arrayBuffer();
  }
  return { fontData: fontData as ArrayBuffer, fontRegularData: fontRegularData as ArrayBuffer };
}

async function startServer() {
  let vite: any;

  if (process.env.NODE_ENV !== 'production') {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist'), { index: false }));
  }

  // OG Image Generation Route
  app.get('/api/og', async (req, res) => {
    try {
      const { username } = req.query;
      console.log(`[OG] Generating image for username: ${username}`);
      
      if (!username || typeof username !== 'string') {
        return res.status(400).send('Username is required');
      }

      // Fetch user data
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (!user) {
        console.log(`[OG] User not found: ${username}`);
        return res.status(404).send('User not found');
      }

      // Fetch font
      const { fontData, fontRegularData } = await getFonts();

      const templateStyle = user.og_template_style || 'default';
      
      let bgStyle: any = {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: user.theme_background || '#fff',
        color: user.theme_color || '#000',
        fontFamily: 'Inter',
      };

      let textStyle: any = {
        color: user.theme_color || '#000',
      };

      if (templateStyle === 'minimal') {
        bgStyle = {
          ...bgStyle,
          backgroundColor: '#f9fafb',
          color: '#111827',
        };
        textStyle = { color: '#111827' };
      } else if (templateStyle === 'dark') {
        bgStyle = {
          ...bgStyle,
          backgroundColor: '#000000',
          color: '#ffffff',
        };
        textStyle = { color: '#ffffff' };
      } else if (templateStyle === 'gradient') {
        bgStyle = {
          ...bgStyle,
          backgroundImage: 'linear-gradient(to bottom right, #4f46e5, #ec4899)',
          color: '#ffffff',
        };
        textStyle = { color: '#ffffff' };
      } else if (templateStyle === 'glass') {
        bgStyle = {
          ...bgStyle,
          backgroundImage: 'linear-gradient(to bottom right, #1e1b4b, #312e81)',
          color: '#ffffff',
        };
        textStyle = { color: '#ffffff' };
      }

      // Generate SVG with Satori
      const svg = await satori(
        {
          type: 'div',
          props: {
            style: bgStyle,
            children: [
              // Glass effect overlay for 'glass' template
              templateStyle === 'glass' ? {
                type: 'div',
                props: {
                  style: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    height: '80%',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 20,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  children: [
                    {
                      type: 'img',
                      props: {
                        src: user.avatar_url || 'https://via.placeholder.com/150',
                        style: {
                          borderRadius: '50%',
                          width: 150,
                          height: 150,
                          marginBottom: 20,
                          objectFit: 'cover',
                          border: '4px solid rgba(255,255,255,0.2)',
                        },
                      },
                    },
                    {
                      type: 'h1',
                      props: {
                        style: {
                          fontSize: 60,
                          fontWeight: 'bold',
                          margin: 0,
                          color: '#fff',
                          textAlign: 'center',
                        },
                        children: user.display_name || user.username,
                      },
                    },
                    {
                      type: 'p',
                      props: {
                        style: {
                          fontSize: 30,
                          opacity: 0.9,
                          color: '#e0e7ff',
                          marginTop: 10,
                          textAlign: 'center',
                        },
                        children: user.bio || `Check out my links on VYBE`,
                      },
                    },
                  ]
                }
              } : [
                // Standard layout for other templates
                {
                  type: 'img',
                  props: {
                    src: user.avatar_url || 'https://via.placeholder.com/150',
                    style: {
                      borderRadius: '50%',
                      width: 150,
                      height: 150,
                      marginBottom: 20,
                      objectFit: 'cover',
                      border: templateStyle === 'dark' || templateStyle === 'gradient' ? '4px solid rgba(255,255,255,0.2)' : 'none',
                    },
                  },
                },
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: 60,
                      fontWeight: 'bold',
                      margin: 0,
                      ...textStyle,
                      textAlign: 'center',
                    },
                    children: user.display_name || user.username,
                  },
                },
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: 30,
                      opacity: 0.8,
                      ...textStyle,
                      marginTop: 10,
                      textAlign: 'center',
                    },
                    children: user.bio || `Check out my links on VYBE`,
                  },
                },
              ],
              // Footer branding
              {
                type: 'div',
                props: {
                  style: {
                    position: 'absolute',
                    bottom: 40,
                    fontSize: 20,
                    opacity: 0.5,
                    ...textStyle,
                  },
                  children: 'VYBE',
                },
              },
            ],
          },
        },
        {
          width: 1200,
          height: 630,
          fonts: [
            {
              name: 'Inter',
              data: fontData,
              weight: 700,
              style: 'normal',
            },
            {
              name: 'Inter',
              data: fontRegularData,
              weight: 400,
              style: 'normal',
            },
          ],
        }
      );

      // Convert SVG to PNG using Resvg
      const resvg = new Resvg(svg);
      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=3600, immutable');
      res.send(pngBuffer);

    } catch (e) {
      console.error(e);
      res.status(500).send('Internal Server Error');
    }
  });

  // Profile Page with Dynamic Metadata
  app.get('/:username', async (req, res, next) => {
    const { username } = req.params;
    
    // Skip if it looks like a file extension
    if (username.includes('.')) return next();

    console.log(`[Profile] Request for username: ${username}`);

    try {
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      let template = fs.readFileSync(
        path.resolve(__dirname, process.env.NODE_ENV === 'production' ? 'dist/index.html' : 'index.html'),
        'utf-8'
      );

      if (process.env.NODE_ENV !== 'production') {
        template = await vite.transformIndexHtml(req.originalUrl, template);
      }

      if (user) {
        console.log(`[Profile] User found: ${username}, injecting metadata`);
        const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        const title = user.seo_title || `${user.display_name || user.username} | VYBE`;
        const description = user.seo_description || user.bio || `Check out ${user.display_name || user.username}'s links on VYBE.`;
        const image = user.og_image_url || `${baseUrl}/api/og?username=${username}`;
        const url = `${baseUrl}/${username}`;

        const head = `
          <title>${title}</title>
          <meta name="description" content="${description}" />
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" content="${image}" />
          <meta property="og:url" content="${url}" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${title}" />
          <meta name="twitter:description" content="${description}" />
          <meta name="twitter:image" content="${image}" />
          <link rel="canonical" href="${url}" />
        `;

        // Inject into head
        const html = template.replace('<meta name="seo-placeholder" content="true" />', head);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } else {
        // User not found, fall through to default handler
        console.log(`[Profile] User not found: ${username}, falling through`);
        next();
      }
    } catch (e) {
      console.error(e);
      next();
    }
  });

  // Fallback for SPA
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      console.log(`[Fallback] Handling request for: ${url}`);
      
      let template = fs.readFileSync(
        path.resolve(__dirname, process.env.NODE_ENV === 'production' ? 'dist/index.html' : 'index.html'),
        'utf-8'
      );

      if (process.env.NODE_ENV !== 'production') {
        template = await vite.transformIndexHtml(url, template);
      }

      const title = 'Vybe - Free Open Source Linktree Alternative';
      const description = 'The free, open-source Linktree alternative. Create your bio link page in minutes.';
      const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
      const image = `${baseUrl}/og-image.png`; // Or a default image URL
      const canonicalUrl = `${baseUrl}${url}`;

      const head = `
        <title>${title}</title>
        <meta name="description" content="${description}" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${image}" />
        <meta property="og:url" content="${canonicalUrl}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image" content="${image}" />
        <link rel="canonical" href="${canonicalUrl}" />
      `;

      const html = template.replace('<meta name="seo-placeholder" content="true" />', head);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      console.error(e);
      res.status(500).end(e);
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
