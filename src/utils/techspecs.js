const DEFAULT_PROXY = (typeof window !== 'undefined' && window.location.origin) ? `${window.location.origin}/techspecs/search` : null;

export async function fetchSpecsByQuery(query){
  const base = import.meta.env.VITE_TECHSPECS_API || DEFAULT_PROXY;
  if (!base) return null;

  try {
    const q = `${base.replace(/\/$/, '')}?q=${encodeURIComponent(query)}`;
    const r = await fetch(q);
    if (!r.ok) return null;
    const json = await r.json();
    // If proxy returned { product, url }
    if (json && (json.product || json.url)) return json.product ? { name: json.product.title || json.product.name, specs: json.product, url: json.url } : { url: json.url };
    // If upstream API returned array or items
    return json?.items?.[0] || json?.[0] || json || null;
  } catch (e) {
    console.warn('TechSpecs fetch error', e.message || e);
    return null;
  }
}

export default { fetchSpecsByQuery };
