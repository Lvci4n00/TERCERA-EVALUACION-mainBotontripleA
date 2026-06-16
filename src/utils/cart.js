const KEY = 'cartItems';

export function getCart() {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}

export function saveCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(product) {
  const items = getCart();
  const idx = items.findIndex(i => i.id === product.id);
  if (idx >= 0) {
    items[idx].quantity = (items[idx].quantity || 1) + (product.quantity || 1);
  } else {
    items.push({ ...product, quantity: product.quantity || 1 });
  }
  saveCart(items);
  return items;
}

export function removeFromCart(id) {
  const items = getCart().filter(i => i.id !== id);
  saveCart(items);
  return items;
}

export function updateQuantity(id, quantity) {
  const items = getCart().map(i => i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i).filter(i => i.quantity > 0);
  saveCart(items);
  return items;
}

export function clearCart() {
  saveCart([]);
}
