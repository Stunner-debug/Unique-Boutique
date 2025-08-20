import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Filter, Star, Shirt, Sparkles, Baby, Hat, Perfume, BadgePercent, ChevronDown, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ----- Mock Data -----
const CATEGORIES = [
  { key: "men", label: "Men's Clothing", icon: <Shirt className="w-5 h-5" /> },
  { key: "women", label: "Women's Fashion", icon: <Sparkles className="w-5 h-5" /> },
  { key: "youth", label: "Kids & Youth Trends", icon: <Baby className="w-5 h-5" /> },
  { key: "shoes", label: "Shoes", icon: <Sparkles className="w-5 h-5" /> },
  { key: "accessories", label: "Accessories (Caps & Belts)", icon: <Hat className="w-5 h-5" /> },
  { key: "perfumes", label: "Perfumes (Refillable)", icon: <Perfume className="w-5 h-5" /> },
];

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Kids"]; 
const ALL_COLORS = ["Black", "White", "Blue", "Red", "Green", "Beige", "Gold"];

const MOCK_PRODUCTS = [
  { id: 1, name: "Slim Fit Oxford Shirt", price: 45, category: "men", sizes: ["S","M","L","XL"], colors: ["White","Blue"], rating: 4.6, img: "https://images.unsplash.com/photo-1520975922375-0a1173a3b3e0?q=80&w=1200&auto=format&fit=crop" },
  { id: 2, name: "High-Waist Satin Skirt", price: 59, category: "women", sizes: ["S","M","L"], colors: ["Black","Beige"], rating: 4.8, img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop" },
  { id: 3, name: "Streetwear Hoodie (Youth)", price: 35, category: "youth", sizes: ["Kids","S","M"], colors: ["Black","Red"], rating: 4.4, img: "https://images.unsplash.com/photo-1517341726591-2d4d4d5f9b48?q=80&w=1200&auto=format&fit=crop" },
  { id: 4, name: "Minimalist Sneakers", price: 79, category: "shoes", sizes: ["S","M","L","XL"], colors: ["White","Black"], rating: 4.7, img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200&auto=format&fit=crop" },
  { id: 5, name: "Classic Leather Belt", price: 25, category: "accessories", sizes: ["S","M","L","XL"], colors: ["Black","Brown"], rating: 4.3, img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop" },
  { id: 6, name: "Refillable Eau de Parfum 50ml", price: 39, category: "perfumes", sizes: ["One"], colors: ["Gold"], rating: 4.5, img: "https://images.unsplash.com/photo-1585386959984-a41552231659?q=80&w=1200&auto=format&fit=crop" },
  { id: 7, name: "Tailored Blazer", price: 120, category: "men", sizes: ["M","L","XL","XXL"], colors: ["Blue","Black"], rating: 4.9, img: "https://images.unsplash.com/photo-1520975657283-cd1b4e72a99f?q=80&w=1200&auto=format&fit=crop" },
  { id: 8, name: "Knot Midi Dress", price: 89, category: "women", sizes: ["S","M","L"], colors: ["Red","Beige"], rating: 4.6, img: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?q=80&w=1200&auto=format&fit=crop" },
  { id: 9, name: "Chunky Platform Sneakers", price: 95, category: "shoes", sizes: ["S","M","L","XL"], colors: ["White"], rating: 4.2, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop" },
  { id: 10, name: "Kids Graphic Tee", price: 19, category: "youth", sizes: ["Kids"], colors: ["Blue","Green"], rating: 4.1, img: "https://images.unsplash.com/photo-1520975592280-3c6d1a1b728f?q=80&w=1200&auto=format&fit=crop" },
  { id: 11, name: "Trucker Cap", price: 18, category: "accessories", sizes: ["One"], colors: ["Black","White"], rating: 4.0, img: "https://images.unsplash.com/photo-1516826957135-700dedea6984?q=80&w=1200&auto=format&fit=crop" },
  { id: 12, name: "Refillable Eau de Parfum 100ml", price: 59, category: "perfumes", sizes: ["One"], colors: ["Gold"], rating: 4.7, img: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=1200&auto=format&fit=crop" },
];

// ----- Utilities -----
const currency = (n) => new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);

// ----- Small UI Helpers -----
const Rating = ({ value }) => (
  <div className="flex items-center gap-1" aria-label={`Rating ${value} of 5`}>
    {[1,2,3,4,5].map(i => (
      <Star key={i} className={`w-4 h-4 ${i <= Math.round(value) ? "fill-current" : ""}`} />
    ))}
    <span className="text-xs text-muted-foreground">{value.toFixed(1)}</span>
  </div>
);

const Tag = ({ children }) => (
  <span className="text-xs rounded-full bg-muted px-2 py-1">{children}</span>
);

// ----- Main Component -----
export default function UniqueBoutiqueApp() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [size, setSize] = useState("any");
  const [color, setColor] = useState("any");
  const [price, setPrice] = useState([0, 150]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchQ = p.name.toLowerCase().includes(query.toLowerCase());
      const matchC = category === "all" ? true : p.category === category;
      const matchS = size === "any" ? true : p.sizes.includes(size);
      const matchCol = color === "any" ? true : p.colors.includes(color);
      const matchP = p.price >= price[0] && p.price <= price[1];
      return matchQ && matchC && matchS && matchCol && matchP;
    });
  }, [query, category, size, color, price]);

  const addToCart = (product) => {
    setCart(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-2xl border px-3 py-1">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">Unique Boutique</span>
              </motion.div>
              <Tag>Where Style Meets You</Tag>
              <Tag className="hidden sm:inline-flex">Gold • Black • White</Tag>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search products" className="pl-9 w-72" />
              </div>
              <Button variant="outline" className="md:hidden" onClick={()=>{}}><Search className="w-4 h-4" /></Button>
              <Button className="relative" onClick={()=>setCartOpen(true)}>
                <ShoppingCart className="w-4 h-4 mr-2" /> Cart
                {cart.length>0 && (
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black text-white text-xs px-1">{cart.length}</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y:0, opacity:1 }} transition={{ duration: 0.5 }} className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Discover Your Signature Look
              </motion.h1>
              <p className="mt-4 text-muted-foreground max-w-prose">
                Shop curated picks across men's clothing, women's fashion, and youth trends — plus shoes, caps, belts, and refillable perfumes. Premium styles, fair prices, fast checkout.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={()=>setCategory("women")}>Shop Women's</Button>
                <Button variant="outline" onClick={()=>setCategory("men")}>Shop Men's</Button>
                <Button variant="ghost" onClick={()=>setCategory("youth")}>Youth Trends</Button>
              </div>
              <div className="mt-6 flex items-center gap-3 text-sm">
                <BadgePercent className="w-4 h-4" />
                <span>New: Launch offers on shoes & perfumes this week</span>
              </div>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 gap-4">
              {MOCK_PRODUCTS.slice(0,6).map(p => (
                <motion.img key={p.id} src={p.img} alt={p.name} className="aspect-[3/4] object-cover rounded-2xl shadow" whileHover={{ scale: 1.03 }} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <div className="sticky top-14 z-20 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 overflow-x-auto">
          <Button variant={category === "all" ? "default" : "outline"} onClick={()=>setCategory("all")}>All</Button>
          {CATEGORIES.map(c => (
            <Button key={c.key} variant={category===c.key?"default":"outline"} onClick={()=>setCategory(c.key)} className="inline-flex items-center gap-2">
              {c.icon} {c.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <section className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2"><Filter className="w-4 h-4" /><span className="font-medium">Filters</span></div>
          <Separator orientation="vertical" className="h-6" />
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Size" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Size</SelectItem>
              {ALL_SIZES.map(s => (<SelectItem value={s} key={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Color" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Color</SelectItem>
              {ALL_COLORS.map(c => (<SelectItem value={c} key={c}>{c}</SelectItem>))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-3 w-64">
            <span className="text-sm">Price</span>
            <Slider value={price} onValueChange={setPrice} min={0} max={150} step={5} />
            <span className="text-sm tabular-nums">{currency(price[0])} - {currency(price[1])}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search products" className="pl-9 w-56" />
            </div>
            <Button variant="ghost" onClick={()=>{ setQuery(""); setCategory("all"); setSize("any"); setColor("any"); setPrice([0,150]); }}>Reset</Button>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {filtered.map(p => (
              <motion.div key={p.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
                <Card className="group overflow-hidden rounded-2xl">
                  <div className="relative">
                    <img src={p.img} alt={p.name} className="aspect-[4/5] w-full object-cover transition-transform group-hover:scale-[1.03]" />
                    <div className="absolute left-2 top-2"><Tag>{p.category}</Tag></div>
                  </div>
                  <CardContent className="p-4">
                    <CardHeader className="p-0 mb-2">
                      <CardTitle className="text-base line-clamp-1">{p.name}</CardTitle>
                    </CardHeader>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{currency(p.price)}</span>
                      <Rating value={p.rating} />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Tag>{p.sizes.join(" • ")}</Tag>
                      <Tag>{p.colors.join(" • ")}</Tag>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button className="w-full" onClick={()=>addToCart(p)}>Add to Cart</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Unique Boutique</h3>
            <p className="text-sm text-muted-foreground">Curated looks for men, women, and youth. Shoes, accessories, and refillable perfumes.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Shop</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {CATEGORIES.map(c => (<li key={c.key}><button className="hover:underline" onClick={()=>setCategory(c.key)}>{c.label}</button></li>))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Help</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Shipping & Returns</li>
              <li>Size Guide</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Newsletter</h4>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground pb-8">© {new Date().getFullYear()} Unique Boutique. All rights reserved.</div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 260, damping: 30 }} className="fixed inset-y-0 right-0 w-full sm:w-[28rem] bg-white border-l z-50 shadow-2xl flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="font-semibold flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Your Cart</div>
              <Button variant="ghost" size="icon" onClick={()=>setCartOpen(false)}><X className="w-5 h-5" /></Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 && <p className="text-sm text-muted-foreground">Your cart is empty.</p>}
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 border rounded-xl p-3">
                  <img src={item.img} alt={item.name} className="w-16 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <div className="font-medium line-clamp-1">{item.name}</div>
                    <div className="text-xs text-muted-foreground">Qty: {item.qty}</div>
                    <div className="text-sm font-semibold">{currency(item.price * item.qty)}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={()=>removeFromCart(item.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              ))}
            </div>
            <div className="p-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{currency(total)}</span>
              </div>
              <Button className="w-full">Proceed to Checkout</Button>
              <Button variant="outline" className="w-full" onClick={()=>setCartOpen(false)}>Continue Shopping</Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
