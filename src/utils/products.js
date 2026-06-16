const KEY = 'products';

const seedProducts = [
  { id: 'p1', title: 'Gigabyte GeForce RTX 2060 Windforce', image: '/images/GPU.png', description: 'Gráficos potentes con Ray Tracing. 6GB GDDR6.', price: '$320.000' },
  { id: 'p2', title: 'Ryzen 7 5000', image: '/images/Ryzen 7.jpg', description: 'Procesador AMD para multitarea y videojuegos.', price: '$180.000' },
  { id: 'p3', title: 'Disco Duro HDD 1TB', image: '/images/HDD.png', description: 'Almacenamiento confiable.', price: '$45.000' },
  { id: 'p4', title: 'Unidad SSD 1TB', image: '/images/SSD.png', description: 'Mayor velocidad de carga.', price: '$75.000' },
  { id: 'p5', title: 'Fuente de Poder 650W 80 Plus', image: '/images/Fuente de poder.png', description: 'Potencia estable y eficiente.', price: '$68.000' },
  { id: 'p6', title: 'Memoria RAM 16GB DDR4', image: '/images/RAM.png', description: 'Rendimiento fluido en multitarea.', price: '$52.000' },
  { id: 'g1', title: 'AMD Radeon RX 6500 XT', image: '/images/RX 6500 XT.png', description: 'Buenas prestaciones para 1080p.', price: '$220.000' },
  { id: 'g2', title: 'NVIDIA GeForce RTX 3070', image: '/images/RTX3070.png', description: 'Excelente para gaming en 1440p.', price: '$950.000' },
  { id: 'o1', title: 'PC Escritorio Gamer Alpha', image: '/images/PC1.png', description: 'Intel Core i5, 16GB RAM, GTX 1660, 512GB SSD.', price: '$1.250.000' },
  { id: 'o6', title: 'PC Hatsune Miku Edition', image: '/images/PC HATSUNE MIKU.png', description: 'Edición temática con gran rendimiento.', price: '$1.990.000' }
];

export function getProducts() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seedProducts));
    return seedProducts.slice();
  }
  try { return JSON.parse(raw); } catch (e) { return []; }
}

export function saveProducts(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addProduct(product) {
  const items = getProducts();
  items.push(product);
  saveProducts(items);
  window.dispatchEvent(new CustomEvent('products-updated'));
  return items;
}

export function updateProduct(updated) {
  const items = getProducts().map(i => i.id === updated.id ? { ...i, ...updated } : i);
  saveProducts(items);
  window.dispatchEvent(new CustomEvent('products-updated'));
  return items;
}

export function removeProduct(id) {
  const items = getProducts().filter(i => i.id !== id);
  saveProducts(items);
  window.dispatchEvent(new CustomEvent('products-updated'));
  return items;
}

export function getProductById(id) {
  return getProducts().find(p => p.id === id);
}
