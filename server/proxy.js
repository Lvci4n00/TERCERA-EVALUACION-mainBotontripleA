const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const BUILDCORES_SITE = 'https://buildcores.com';

async function fetchText(url){
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
  return r.text();
}

app.get('/techspecs/search', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: 'Missing q parameter' });

  const base = process.env.TECHSPECS_API || process.env.VITE_TECHSPECS_API;
  if (base) {
    try {
      const url = `${base.replace(/\/$/, '')}/search?q=${encodeURIComponent(q)}`;
      const r = await fetch(url);
      const json = await r.json();
      return res.json(json);
    } catch (e) {
      console.warn('Upstream API error', e.message);
    }
  }

  try {
    const searchUrl = `${BUILDCORES_SITE}/products?search=${encodeURIComponent(q)}`;
    const html = await fetchText(searchUrl);
    const linkMatch = html.match(/href=\"(\/[^\"']*(?:product|products|part)[^\"']*)\"/i)
      || html.match(/href=\"(\/[^\"']*\/p\/[a-z0-9_-]+)\"/i);
    if (!linkMatch) return res.json(null);
    const rel = linkMatch[1];
    const productUrl = rel.startsWith('http') ? rel : BUILDCORES_SITE + rel;

    const prodHtml = await fetchText(productUrl);
    const jsonMatch = prodHtml.match(/<script id=\"__NEXT_DATA__\" type=\"application\/json\">([\s\S]*?)<\/script>/i)
      || prodHtml.match(/window\.__NEXT_DATA__\s*=\s*({[\s\S]*?});/i);

    if (!jsonMatch) return res.json({ url: productUrl });
    const raw = jsonMatch[1];
    let data;
    try { data = JSON.parse(raw); } catch (e) { return res.json({ url: productUrl }); }

    const maybe = data?.props?.pageProps || data?.props || data?.pageProps || {};
    const product = maybe?.product || maybe?.part || maybe?.initialProduct || maybe?.component || maybe?.item || maybe?.productData;

    return res.json({ product, url: productUrl });
  } catch (e) {
    console.warn('Proxy error', e.message);
    return res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`TechSpecs proxy listening on http://localhost:${PORT}`));
