import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function test() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  let template = fs.readFileSync('index.html', 'utf-8');
  template = await vite.transformIndexHtml('/', template);
  const head = '<meta name="test" content="test" />';
  const html = template.replace('</head>', `${head}</head>`);
  console.log(html.includes(head));
  process.exit(0);
}
test();
