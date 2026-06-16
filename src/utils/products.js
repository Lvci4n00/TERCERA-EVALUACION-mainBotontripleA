const KEY = 'products';

const seedProducts = [
  { id: 'p1', title: 'NVIDIA GeForce GTX 1650 SUPER', image: '/images/GTX 1650 SUPER.png', description: 'GPU eficiente para gaming en 1080p.', price: '$210.000' },
  { id: 'p2', title: 'Ryzen 7 5000', image: '/images/Ryzen 7.jpg', description: 'Procesador AMD para multitarea y videojuegos.', price: '$180.000' },
  { id: 'c1', title: 'Ryzen 3 3200G', image: '/images/Ryzen 3 3200g.jpg', description: 'CPU con gráficos integrados para uso diario y gaming ligero.', price: '$95.000' },
  { id: 'c2', title: 'Ryzen 5 3400G', image: '/images/Ryzen 5 3400g.jpg', description: 'Buen equilibrio entre rendimiento y consumo para escritorio.', price: '$120.000' },
  { id: 'c3', title: 'Ryzen 5 5500', image: '/images/Ryzen 5 5500.jpg', description: 'Excelente opción para gaming en 1080p y multitarea.', price: '$145.000' },
  { id: 'c4', title: 'Ryzen 5 5600', image: '/images/Ryzen 5 5600.jpg', description: 'Rendimiento sólido para juegos y creación de contenido.', price: '$175.000' },
  { id: 'c5', title: 'Ryzen 5 8500G', image: '/images/ryzen 5 8500G.jpg', description: 'Procesador moderno con buen desempeño general e iGPU.', price: '$210.000' },
  { id: 'p3', title: 'Disco Duro HDD 1TB', image: '/images/HDD.png', description: 'Almacenamiento confiable.', price: '$45.000' },
  { id: 'p4', title: 'Unidad SSD 1TB', image: '/images/SSD.png', description: 'Mayor velocidad de carga.', price: '$75.000' },
  { id: 'p5', title: 'Fuente de Poder 650W 80 Plus', image: '/images/Fuente de poder.png', description: 'Potencia estable y eficiente.', price: '$68.000' },
  { id: 'p6', title: 'Memoria RAM 16GB DDR4', image: '/images/RAM.png', description: 'Rendimiento fluido en multitarea.', price: '$52.000' },
  { id: 'g1', title: 'AMD Radeon RX 6500 XT', image: '/images/RX 6500 XT.png', description: 'Buenas prestaciones para 1080p.', price: '$220.000' },
  { id: 'g2', title: 'NVIDIA GeForce RTX 3070', image: '/images/RTX3070.png', description: 'Excelente para gaming en 1440p.', price: '$950.000' },
  { id: 'g3', title: 'NVIDIA GeForce RTX 3050', image: '/images/RTX3050.jpg', description: 'Excelente relación precio-rendimiento para Full HD.', price: '$320.000' },
  { id: 'g4', title: 'AMD Radeon RX 6700 XT', image: '/images/RX 6700XT.png', description: 'Rendimiento sólido para gaming en 1440p.', price: '$540.000' },
  { id: 'g5', title: 'AMD Radeon RX 7600', image: '/images/RX 7600.png', description: 'Arquitectura moderna y gran desempeño en 1080p.', price: '$410.000' },
  { id: 'o1', title: 'PC Escritorio Gamer Alpha', image: '/images/PC1.png', description: 'Intel Core i5, 16GB RAM, GTX 1660, 512GB SSD.', price: '$1.250.000' },
  { id: 'o2', title: 'PC Gamer Nova', image: '/images/PC2.png', description: 'AMD Ryzen 5, 16GB RAM, RTX 3050, SSD 1TB.', price: '$1.390.000' },
  { id: 'o3', title: 'PC Gaming Storm', image: '/images/PC3.png', description: 'Intel Core i7, 32GB RAM, RTX 3070, SSD 1TB.', price: '$1.780.000' },
  { id: 'o4', title: 'PC Creator Pro', image: '/images/PC4.png', description: 'Ryzen 7, 32GB RAM, RX 6700 XT, SSD 2TB.', price: '$1.690.000' },
  { id: 'o5', title: 'PC Compact Elite', image: '/images/PC5.png', description: 'Intel Core i5, 16GB RAM, RX 7600, SSD 512GB.', price: '$1.320.000' },
  { id: 'o6', title: 'PC Hatsune Miku Edition', image: '/images/PC HATSUNE MIKU.png', description: 'Edición temática con gran rendimiento.', price: '$1.990.000' }
];

export function getProducts() {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seedProducts));
    return seedProducts.slice();
  }
  try {
    const stored = JSON.parse(raw);
    const storedIds = new Set(stored.map(item => item.id));
    const missingSeedItems = seedProducts.filter(item => !storedIds.has(item.id));
    if (missingSeedItems.length > 0) {
      const merged = [...stored, ...missingSeedItems];
      localStorage.setItem(KEY, JSON.stringify(merged));
      return merged;
    }
    return stored;
  } catch {
    localStorage.setItem(KEY, JSON.stringify(seedProducts));
    return seedProducts.slice();
  }
}

export function saveProducts(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addProduct(product) {
  const items = getProducts();
  items.push(product);
  saveProducts(items);
  globalThis.dispatchEvent(new CustomEvent('products-updated'));
  return items;
}

export function updateProduct(updated) {
  const items = getProducts().map(i => i.id === updated.id ? { ...i, ...updated } : i);
  saveProducts(items);
  globalThis.dispatchEvent(new CustomEvent('products-updated'));
  return items;
}

export function removeProduct(id) {
  const items = getProducts().filter(i => i.id !== id);
  saveProducts(items);
  globalThis.dispatchEvent(new CustomEvent('products-updated'));
  return items;
}

export function getProductById(id) {
  return getProducts().find(p => p.id === id);
}
