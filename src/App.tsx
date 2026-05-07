/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronRight, 
  Store, 
  Info, 
  Phone, 
  MapPin,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  featured?: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

// --- Data ---

const CATEGORIES = [
  "Todos",
  "Frutas y Verduras", 
  "Lácteos y Huevos", 
  "Panadería", 
  "Carnes", 
  "Despensa", 
  "Bebidas", 
  "Limpieza"
];

const PRODUCTS: Product[] = [
  // Frutas y Verduras
  { id: 1, name: "Manzana Roja", price: 45, category: "Frutas y Verduras", image: "https://picsum.photos/seed/apple/400/300", description: "Manzana roja dulce y crujiente, kg.", featured: true },
  { id: 2, name: "Plátano Tabasco", price: 22, category: "Frutas y Verduras", image: "https://picsum.photos/seed/banana/400/300", description: "Plátano maduro de excelente calidad, kg." },
  { id: 3, name: "Jitomate Saladet", price: 35, category: "Frutas y Verduras", image: "https://picsum.photos/seed/tomato/400/300", description: "Jitomate fresco para tus ensaladas o salsas, kg.", featured: true },
  { id: 4, name: "Aguacate Haas", price: 80, category: "Frutas y Verduras", image: "https://picsum.photos/seed/avocado/400/300", description: "Aguacate cremoso listo para comer, kg.", featured: true },
  { id: 5, name: "Cebolla Blanca", price: 28, category: "Frutas y Verduras", image: "https://picsum.photos/seed/onion/400/300", description: "Cebolla blanca firme y fresca, kg." },
  
  // Lácteos
  { id: 6, name: "Leche Entera 1L", price: 26, category: "Lácteos y Huevos", image: "https://picsum.photos/seed/milk/400/300", description: "Leche entera ultrapasteurizada, envase 1L.", featured: true },
  { id: 7, name: "Huevo Blanco 12pzs", price: 42, category: "Lácteos y Huevos", image: "https://picsum.photos/seed/eggs/400/300", description: "Docena de huevos blancos frescos de granja." },
  { id: 8, name: "Queso Panela 400g", price: 65, category: "Lácteos y Huevos", image: "https://picsum.photos/seed/cheese/400/300", description: "Queso panela fresco y bajo en grasa." },
  { id: 9, name: "Yogurt Natural 1kg", price: 38, category: "Lácteos y Huevos", image: "https://picsum.photos/seed/yogurt/400/300", description: "Yogurt natural sin azúcar añadida." },

  // Panadería
  { id: 10, name: "Pan de Caja Integral", price: 48, category: "Panadería", image: "https://picsum.photos/seed/bread/400/300", description: "Pan de caja integral con granos enteros.", featured: true },
  { id: 11, name: "Bolillo (Pieza)", price: 2.5, category: "Panadería", image: "https://picsum.photos/seed/bolillo/400/300", description: "Bolillo calientito recién horneado." },
  { id: 12, name: "Galletas de Avena", price: 32, category: "Panadería", image: "https://picsum.photos/seed/cookies/400/300", description: "Paquete de galletas artesanales de avena." },

  // Carnes
  { id: 13, name: "Pechuga de Pollo", price: 120, category: "Carnes", image: "https://picsum.photos/seed/chicken/400/300", description: "Pechuga de pollo fresca sin hueso, kg.", featured: true },
  { id: 14, name: "Bistec de Res", price: 185, category: "Carnes", image: "https://picsum.photos/seed/beef/400/300", description: "Bistec de res suave y jugoso, kg." },
  { id: 15, name: "Jamón de Pavo 250g", price: 55, category: "Carnes", image: "https://picsum.photos/seed/ham/400/300", description: "Jamón de pavo premium rebanado." },

  // Despensa
  { id: 16, name: "Arroz Blanco 1kg", price: 24, category: "Despensa", image: "https://picsum.photos/seed/rice/400/300", description: "Arroz blanco de grano largo extra." },
  { id: 17, name: "Frijol Negro 1kg", price: 34, category: "Despensa", image: "https://picsum.photos/seed/beans/400/300", description: "Frijol negro seleccionado de temporada." },
  { id: 18, name: "Aceite Vegetal 900ml", price: 45, category: "Despensa", image: "https://picsum.photos/seed/oil/400/300", description: "Aceite puro de soya para cocinar." },
  { id: 19, name: "Atún en Agua", price: 19, category: "Despensa", image: "https://picsum.photos/seed/tuna/400/300", description: "Lata de atún en agua, 140g." },
  { id: 20, name: "Pasta Spaghetti", price: 12, category: "Despensa", image: "https://picsum.photos/seed/pasta/400/300", description: "Pasta de sémola de trigo duro, 200g." },

  // Bebidas
  { id: 21, name: "Agua Natural 1.5L", price: 15, category: "Bebidas", image: "https://picsum.photos/seed/water/400/300", description: "Agua purificada de manantial." },
  { id: 22, name: "Refresco de Cola 2L", price: 32, category: "Bebidas", image: "https://picsum.photos/seed/cola/400/300", description: "Refresco sabor cola original." },
  { id: 23, name: "Jugo de Naranja 1L", price: 28, category: "Bebidas", image: "https://picsum.photos/seed/juice/400/300", description: "Jugo de naranja 100% natural sin conservadores." },

  // Limpieza
  { id: 24, name: "Detergente Líquido 1L", price: 52, category: "Limpieza", image: "https://picsum.photos/seed/detergent/400/300", description: "Detergente de alta eficiencia para ropa blanca y color." },
  { id: 25, name: "Jabón de Trastes", price: 25, category: "Limpieza", image: "https://picsum.photos/seed/dissoap/400/300", description: "Lavatrastes líquido con aroma a limón." }
];

// --- Components ---

export default function App() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filters
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesCategory = activeCategory === "Todos" || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const featuredProducts = useMemo(() => PRODUCTS.filter(p => p.featured), []);

  // Cart logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-natural-bg font-sans text-natural-text overflow-x-hidden" id="app-root">
      
      {/* --- Navigation --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-natural-border shadow-sm">
        <div className="max-w-7xl mx-auto px-10 h-24 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-4xl font-serif font-bold text-natural-accent tracking-tight">Abarrotes El Oasis</h1>
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Tradición y Calidad en tu Barrio</p>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#catalogo" className="text-xs uppercase tracking-widest font-bold opacity-60 hover:opacity-100 transition-opacity">Catálogo</a>
            <a href="#nosotros" className="text-xs uppercase tracking-widest font-bold opacity-60 hover:opacity-100 transition-opacity">Nosotros</a>
            <a href="#contacto" className="text-xs uppercase tracking-widest font-bold opacity-60 hover:opacity-100 transition-opacity">Contacto</a>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Bar Inline */}
            <div className="hidden lg:relative lg:block">
              <input 
                type="text" 
                placeholder="Buscar víveres..." 
                className="bg-natural-surface border border-natural-border rounded-full py-2 px-6 w-64 text-sm focus:outline-none focus:border-natural-accent transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-4 top-2.5 opacity-40">
                <Search className="w-4 h-4" />
              </div>
            </div>

            <button 
              className="group flex items-center gap-3 bg-natural-surface border border-natural-border p-2 pr-6 rounded-full hover:border-natural-accent transition-all"
              onClick={() => setIsCartOpen(true)}
              aria-label="Ver carrito"
            >
              <div className="bg-natural-accent text-white p-2.5 rounded-full relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-natural-highlight text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-bold text-sm text-natural-accent">${cartTotal.toFixed(2)}</span>
            </button>
            <button 
              className="md:hidden p-2 hover:bg-natural-surface rounded-full transition-colors border border-transparent hover:border-natural-border"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-16 z-40 bg-white p-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-lg font-medium">
              <a href="#catalogo" onClick={() => setIsMobileMenuOpen(false)}>Catálogo</a>
              <a href="#nosotros" onClick={() => setIsMobileMenuOpen(false)}>Nosotros</a>
              <a href="#contacto" onClick={() => setIsMobileMenuOpen(false)}>Contacto</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <header className="pt-40 pb-20 px-10 bg-white border-b border-natural-border">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-8xl font-serif font-bold leading-tight tracking-tight text-natural-accent mb-8">
              Tu mandado fresco, <br />
              <span className="italic opacity-80">siempre cerca.</span>
            </h1>
            <p className="text-lg text-natural-text/70 mb-10 max-w-lg leading-relaxed">
              En El Oasis honramos la tradición de los mercados locales. 
              Seleccionamos cada fruto y producto pensando en la calidad que tu hogar merece.
            </p>
            <div className="flex flex-wrap gap-6">
              <a href="#catalogo" className="bg-natural-accent text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg shadow-natural-accent/20 hover:-translate-y-1 transition-all">
                Ver Catálogo
              </a>
              <a href="#contacto" className="bg-white border border-natural-border text-natural-accent px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-natural-surface transition-all">
                Nuestras Sedes
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group relative"
          >
            <div className="aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="https://picsum.photos/seed/natural-market/800/600" 
                alt="Tienda El Oasis" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decal Card */}
            <div className="absolute -bottom-8 -left-8 bg-natural-highlight text-white p-8 rounded-[32px] shadow-2xl max-w-[220px]">
              <div className="flex items-center gap-2 mb-2">
                <Star className="fill-current w-4 h-4" />
                <span className="font-bold text-sm tracking-widest uppercase">Garantía Real</span>
              </div>
              <p className="text-xs opacity-90 leading-relaxed font-medium">Productos frescos de agricultores locales entregados cada mañana.</p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* --- Featured Section --- */}
      <section className="py-24 max-w-7xl mx-auto px-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-natural-highlight mb-3">Recomendaciones</p>
            <h2 className="text-4xl font-serif italic text-natural-accent">Lo mejor de la temporada</h2>
          </div>
          <div className="flex gap-2">
             <div className="w-12 h-12 rounded-full border border-natural-border flex items-center justify-center text-natural-accent opacity-40">
                <ChevronRight className="rotate-180" />
             </div>
             <div className="w-12 h-12 rounded-full border border-natural-border flex items-center justify-center text-natural-accent hover:bg-natural-accent hover:text-white transition-all cursor-pointer">
                <ChevronRight />
             </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {featuredProducts.map((p, idx) => (
            <motion.div 
               key={p.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="group relative bg-white rounded-[40px] p-6 border border-transparent shadow-sm hover:border-natural-accent/10 hover:shadow-xl transition-all h-full flex flex-col"
            >
              <div className="aspect-[4/5] rounded-[32px] overflow-hidden mb-6 bg-natural-bg relative">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-natural-highlight text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">Fresco</span>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-natural-text opacity-40 uppercase tracking-widest mb-2">{p.category}</p>
                <h3 className="text-xl font-bold text-natural-text leading-tight mb-3">{p.name}</h3>
                <div className="flex items-center justify-between mt-auto">
                   <p className="text-2xl font-serif font-bold text-natural-accent">${p.price.toFixed(2)}<span className="text-[10px] opacity-40 font-sans ml-1 uppercase">/ ud</span></p>
                   <button 
                    onClick={() => addToCart(p)}
                    className="bg-natural-accent text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-natural-highlight hover:scale-110 transition-all active:scale-90"
                    aria-label="Agregar al carrito"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Catalog Section --- */}
      <section id="catalogo" className="py-24 bg-natural-bg px-10 border-t border-natural-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-natural-highlight mb-4">Nuestro Stock</p>
              <h2 className="text-5xl font-serif font-bold text-natural-accent">Pasillos de Víveres</h2>
            </div>
            
            {/* Search Bar Secondary */}
            <div className="relative w-full md:w-96 lg:hidden">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-natural-accent/30 w-5 h-5" />
              <input 
                type="text" 
                placeholder="¿Qué buscas hoy?"
                className="w-full bg-white border border-natural-border rounded-full py-5 pl-14 pr-6 focus:outline-none focus:border-natural-accent shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-16">
            <aside className="w-full lg:w-72 shrink-0">
              <div className="sticky top-32">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-natural-text opacity-30 mb-8 ml-6">Categorías</h3>
                <nav className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-8 py-5 rounded-[20px] transition-all flex items-center justify-between group font-medium ${
                        activeCategory === cat ? 'bg-natural-accent text-white shadow-xl shadow-natural-accent/20' : 'hover:bg-natural-surface text-natural-text opacity-60 hover:opacity-100'
                      }`}
                    >
                      {cat}
                      <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === cat ? 'translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                    </button>
                  ))}
                </nav>

                <div className="mt-12 p-8 bg-natural-accent text-white rounded-[40px] relative overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3 opacity-60">Sugerencia</p>
                    <p className="font-serif text-2xl leading-tight mb-6 italic">Orgánicos recién llegados de la granja</p>
                    <button className="text-[10px] bg-white text-natural-accent px-6 py-2.5 rounded-full font-bold uppercase tracking-widest hover:bg-natural-highlight hover:text-white transition-all">Explorar</button>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-serif text-2xl italic text-natural-accent">{activeCategory === "Todos" ? "Todo el Catálogo" : activeCategory}</h3>
                <div className="flex gap-3 text-[10px] font-bold uppercase tracking-widest">
                  <span className="px-5 py-2.5 rounded-full bg-white border border-natural-border cursor-pointer hover:border-natural-accent">Recientes</span>
                  <span className="px-5 py-2.5 rounded-full bg-natural-accent text-white border border-natural-accent cursor-pointer shadow-md shadow-natural-accent/10">Más Comprados</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map(p => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={p.id}
                      className="bg-white group rounded-[48px] p-6 shadow-sm border border-transparent hover:border-natural-accent/10 hover:shadow-2xl transition-all flex flex-col"
                    >
                      <div className="aspect-[4/5] rounded-[32px] overflow-hidden mb-6 bg-natural-bg border border-natural-border/50">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 px-4">
                        <div className="flex flex-col gap-1 mb-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-natural-highlight">{p.category}</p>
                          <h3 className="text-2xl font-bold text-natural-accent tracking-tight leading-none">{p.name}</h3>
                        </div>
                        <p className="text-natural-text opacity-50 text-xs mb-8 leading-relaxed font-medium">{p.description}</p>
                      </div>
                      <div className="flex items-center justify-between px-4 pt-8 border-t border-natural-border">
                        <span className="font-serif text-3xl font-bold text-natural-accent">
                          ${p.price.toFixed(2)}
                          <small className="text-xs font-sans font-medium opacity-30 ml-2 uppercase">/ ud</small>
                        </span>
                        <button 
                          onClick={() => addToCart(p)}
                          className="bg-natural-accent text-white w-12 h-12 rounded-full font-bold hover:bg-natural-highlight active:scale-90 transition-all flex items-center justify-center shadow-lg shadow-natural-accent/10"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-32 text-center opacity-40 flex flex-col items-center">
                    <Search className="w-12 h-12 mb-4" />
                    <p className="text-xl font-serif italic">Pasillo vacío. Intenta con otra búsqueda.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- About Section --- */}
      <section id="nosotros" className="py-32 max-w-7xl mx-auto px-10 grid md:grid-cols-2 gap-32 items-center">
        <div className="order-2 md:order-1 relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-dashed border-natural-border rounded-full -z-10 opacity-60" />
           <div className="grid grid-cols-2 gap-8 items-end">
              <div className="rounded-[40px] overflow-hidden shadow-2xl skew-y-2 border-4 border-white">
                <img src="https://picsum.photos/seed/vintage-shop/400/600" alt="Tradición" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="rounded-[40px] overflow-hidden shadow-2xl -translate-y-12 -skew-y-2 border-4 border-white">
                <img src="https://picsum.photos/seed/heritage/400/400" alt="Calidad" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
           </div>
        </div>
        <div className="order-1 md:order-2">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white border border-natural-border text-natural-accent rounded-full text-[10px] font-bold uppercase tracking-widest mb-10 shadow-sm">
            <Info className="w-4 h-4" /> Nuestra Herencia
          </div>
          <h2 className="text-5xl font-serif font-bold text-natural-accent mb-10 leading-tight">Tradición y Frescura <br /> <span className="italic opacity-60">desde 1985.</span></h2>
          <div className="space-y-8 text-natural-text/70 leading-relaxed text-lg font-medium">
            <p>
              Abarrotes El Oasis nació del deseo de preservar el trato cálido y los 
              productos naturales que definen a nuestra tierra. Lo que comenzó como un
              pequeño mostrador de madera, hoy es un referente de calidad.
            </p>
            <p>
              Creemos en el comercio justo y en el valor de lo local. Por eso, cada 
              temporada traemos lo mejor del campo directamente a tu mesa, sin escalas 
              innecesarias y con el mismo cariño de siempre.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12 mt-16">
            <div className="space-y-2">
              <p className="text-4xl font-serif font-bold text-natural-accent tracking-tighter">1,200+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Víveres Activos</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-serif font-bold text-natural-accent tracking-tighter">5 Estrellas</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Atención Personal</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Contact & Location --- */}
      <footer id="contacto" className="bg-white border-t border-natural-border pt-32">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid md:grid-cols-4 gap-20 pb-20 border-b border-natural-border">
            <div className="col-span-1 md:col-span-1 space-y-8">
              <div className="flex flex-col">
                <h1 className="text-3xl font-serif font-bold text-natural-accent tracking-tight leading-none">Abarrotes El Oasis</h1>
                <p className="text-[8px] uppercase tracking-[0.3em] font-bold opacity-30 mt-2">Fundado con Amor</p>
              </div>
              <p className="text-sm text-natural-text opacity-50 leading-relaxed font-medium">Servicio ininterrumpido al corazón de la comunidad. Tu confianza es nuestra mayor cosecha.</p>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full border border-natural-border flex items-center justify-center text-natural-accent hover:bg-natural-accent hover:text-white cursor-pointer transition-all">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="w-12 h-12 rounded-full border border-natural-border flex items-center justify-center text-natural-accent hover:bg-natural-accent hover:text-white cursor-pointer transition-all">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-xs font-bold uppercase tracking-widest text-natural-text opacity-30 border-b border-natural-border pb-4">Horarios de Venta</h4>
              <ul className="space-y-4 text-sm font-bold text-natural-accent/80">
                <li className="flex justify-between"><span>Lun - Sáb:</span> <span className="opacity-100">7 AM - 10 PM</span></li>
                <li className="flex justify-between"><span>Dom y Fest:</span> <span className="opacity-100">8 AM - 9 PM</span></li>
              </ul>
            </div>

            <div className="space-y-8 md:col-span-2">
               <h4 className="text-xs font-bold uppercase tracking-widest text-natural-text opacity-30 border-b border-natural-border pb-4">Nuestra Casa</h4>
               <div className="flex flex-col lg:flex-row gap-8 items-start">
                 <p className="flex-1 text-sm font-bold text-natural-accent/80 leading-relaxed">Calle Principal #124, Colonia Centro. Esquina con Arcos del Sol. México CDMX.</p>
                 <div className="w-full lg:w-48 aspect-video bg-natural-bg rounded-[24px] flex items-center justify-center overflow-hidden border border-natural-border group cursor-pointer relative shadow-inner">
                   <img src="https://picsum.photos/seed/location/400/200" alt="Ubicación" className="w-full h-full object-cover opacity-20 group-hover:scale-125 transition-transform duration-1000 grayscale" referrerPolicy="no-referrer" />
                   <MapPin className="absolute text-natural-accent w-6 h-6 animate-pulse" />
                 </div>
               </div>
            </div>
          </div>

          <div className="py-12 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-natural-text/30">
            <p>© 2026 Abarrotes El Oasis &bull; Una Vida de Calidad</p>
            <div className="flex gap-10">
              <a href="#" className="hover:text-natural-accent transition-colors">Privacidad</a>
              <a href="#" className="hover:text-natural-accent transition-colors">Legal</a>
              <a href="#" className="hover:text-natural-accent transition-colors">Ayuda</a>
            </div>
          </div>
        </div>
      </footer>

      {/* --- Cart Sidebar --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-[#33332d]/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-natural-surface z-[101] shadow-2xl flex flex-col border-l border-natural-border"
            >
              <div className="p-10 border-b border-natural-border flex items-center justify-between bg-white">
                <div>
                  <h2 className="text-4xl font-serif font-bold text-natural-accent">Tu Pedido</h2>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-natural-accent opacity-40">{cartCount} Artículos en canasta</p>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-4 hover:bg-natural-bg rounded-full text-natural-accent opacity-40 hover:opacity-100 transition-all border border-natural-border"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                    <div className="w-24 h-24 border border-dashed border-natural-accent rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-8 h-8" />
                    </div>
                    <p className="text-xl font-serif italic text-natural-accent">La canasta aún está vacía</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-[10px] font-bold uppercase tracking-widest underline decoration-2 underline-offset-4"
                    >
                      Volver al pasillo
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-6 group">
                      <div className="w-24 h-24 shrink-0 rounded-[24px] overflow-hidden bg-white border border-natural-border flex items-center justify-center p-2">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-[16px]" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 py-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-bold text-natural-accent leading-none tracking-tight">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-natural-accent opacity-20 hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-natural-highlight mb-4">
                           <span className="font-serif text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                           <span className="text-[10px] opacity-40 font-sans ml-2 uppercase">Subtotal</span>
                        </p>
                        <div className="flex items-center gap-4 border border-natural-border w-fit rounded-full px-4 py-1.5 bg-white shadow-sm">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-natural-accent opacity-40 hover:opacity-100 transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-natural-accent opacity-40 hover:opacity-100 transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-10 bg-natural-accent text-white rounded-t-[48px] shadow-[0_-20px_50px_rgba(90,90,64,0.15)] space-y-10">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-40 text-white">Total a pagar</p>
                    <p className="text-5xl font-serif font-bold text-white">${cartTotal.toFixed(2)}</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl">
                     <p className="text-[10px] font-bold opacity-60 leading-tight uppercase tracking-widest text-right">IVA & <br /> Envío Incl.</p>
                  </div>
                </div>
                <button 
                  className="w-full bg-white text-natural-accent py-6 rounded-full font-bold uppercase tracking-widest text-sm shadow-2xl hover:bg-natural-highlight hover:text-white transition-all active:scale-95 disabled:opacity-30"
                  disabled={cart.length === 0}
                  onClick={() => alert('¡Gracias por tu confianza! Procesando tu pedido.')}
                >
                  Confirmar Compra
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Floating Action --- */}
      <a 
        href="https://wa.me/5523456789"
        className="fixed bottom-10 right-10 z-[80] bg-natural-accent text-white p-6 rounded-full shadow-2xl shadow-natural-accent/40 hover:scale-110 active:scale-90 transition-all border-4 border-white"
        aria-label="Contactar por WhatsApp"
      >
        <Phone className="w-6 h-6 fill-current" />
      </a>

    </div>
  );
}
