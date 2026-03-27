import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Shield, Truck, RotateCcw, Lock, Plus, Minus, ChevronRight, ShoppingCart, CheckCircle2, Zap, Headphones, MapPin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';
import { useCart } from '../lib/cart-context';
import ProductCard from '../components/store/ProductCard';
import { cn } from '../lib/utils';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const { data: p } = await supabase.from('products').select('*').eq('slug', slug).single();
      if (p) {
        setProduct(p);
        setMainImage(p.images[0]);
        setSelectedColor(p.colors?.[0] || 'Default');
        
        const { data: related } = await supabase.from('products').select('*').eq('category', p.category).neq('id', p.id).limit(4);
        setRelatedProducts(related || []);

        const { data: revs } = await supabase.from('reviews').select('*').eq('product_id', p.id).eq('is_approved', true);
        setReviews(revs || []);
      }
      setLoading(false);
    }
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#FF3B30] border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Product not found</div>;

  const discount = Math.round(((product.mrp - product.sale_price) / product.mrp) * 100);

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.sale_price,
      mrp: product.mrp,
      image: product.images[0],
      color: selectedColor,
      quantity: quantity,
      sku: product.sku || ''
    });
  };

  const checkPincode = () => {
    if (pincode.length === 6) {
      setPincodeStatus("Delivered in 3-5 business days to " + pincode);
    } else {
      setPincodeStatus("Please enter a valid 6-digit pincode");
    }
  };

  return (
    <div className="bg-[#0A0A0A] text-white pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest mb-12">
          <Link to="/" className="hover:text-white transition-colors">HOME</Link>
          <ChevronRight size={12} />
          <Link to={`/collections/${product.category}`} className="hover:text-white transition-colors">{product.category}</Link>
          <ChevronRight size={12} />
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* LEFT — Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square bg-[#1A1A1A] rounded-3xl overflow-hidden group">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img: string, i: number) => (
                <button 
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={cn(
                    "aspect-square rounded-xl overflow-hidden border-2 transition-all",
                    mainImage === img ? "border-[#FF3B30]" : "border-transparent opacity-50 hover:opacity-100"
                  )}
                >
                  <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — Product Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-500 tracking-[0.3em] uppercase">SOULSOUND</p>
              <h1 className="text-5xl md:text-6xl font-bebas tracking-wider leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex gap-1 text-[#D4A853]">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <span className="text-sm text-gray-400 font-dm">({reviews.length} reviews)</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bebas tracking-wider">₹{product.sale_price.toLocaleString()}</span>
                <span className="text-xl text-gray-500 line-through font-bebas tracking-wider">₹{product.mrp.toLocaleString()}</span>
              </div>
              <span className="bg-[#FF3B30] text-white text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                {discount}% OFF
              </span>
            </div>

            <div className="h-px bg-[#1A1A1A]" />

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm font-bold tracking-widest uppercase text-gray-400">COLOR: {selectedColor}</p>
                <div className="flex gap-3">
                  {product.colors.map((color: string) => (
                    <button 
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all",
                        selectedColor === color ? "border-[#FF3B30] scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-[#1A1A1A] rounded-full px-4 py-2 border border-[#2A2A2A]">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center text-xl font-bebas tracking-widest">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Plus size={20} />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#FF3B30] text-white py-4 rounded-full font-bebas tracking-widest text-xl hover:bg-red-700 transition-all flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={24} /> ADD TO CART
                </button>
              </div>
              <button className="w-full border border-white text-white py-4 rounded-full font-bebas tracking-widest text-xl hover:bg-white hover:text-black transition-all">
                BUY IT NOW
              </button>
            </div>

            <div className="h-px bg-[#1A1A1A]" />

            {/* Trust Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
              {[
                { icon: <Truck size={20} />, text: "FREE SHIPPING" },
                { icon: <Shield size={20} />, text: "1 YR WARRANTY" },
                { icon: <RotateCcw size={20} />, text: "EASY RETURNS" },
                { icon: <Lock size={20} />, text: "SECURE PAYMENT" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-center group">
                  <div className="text-[#FF3B30] group-hover:scale-110 transition-transform">{item.icon}</div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-gray-500">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Pincode Checker */}
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#2A2A2A] space-y-4">
              <p className="text-sm font-bold tracking-widest uppercase text-gray-400">CHECK DELIVERY</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  maxLength={6}
                  placeholder="Enter Pincode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 bg-black border border-[#2A2A2A] rounded-full px-6 py-2 text-white focus:outline-none focus:border-[#FF3B30]"
                />
                <button 
                  onClick={checkPincode}
                  className="bg-white text-black px-6 py-2 rounded-full font-bebas tracking-widest hover:bg-gray-200 transition-colors"
                >
                  CHECK
                </button>
              </div>
              {pincodeStatus && (
                <p className="text-sm text-[#FF3B30] font-dm flex items-center gap-2">
                  <CheckCircle2 size={16} /> {pincodeStatus}
                </p>
              )}
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-[#1A1A1A] px-4 py-2 rounded-lg border border-[#2A2A2A] flex items-center gap-3">
                <Zap size={16} className="text-[#FF3B30]" />
                <span className="text-xs font-bold tracking-widest uppercase">{product.total_playtime}H PLAYTIME</span>
              </div>
              <div className="bg-[#1A1A1A] px-4 py-2 rounded-lg border border-[#2A2A2A] flex items-center gap-3">
                <Headphones size={16} className="text-[#FF3B30]" />
                <span className="text-xs font-bold tracking-widest uppercase">BT v{product.bluetooth_version}</span>
              </div>
              <div className="bg-[#1A1A1A] px-4 py-2 rounded-lg border border-[#2A2A2A] flex items-center gap-3">
                <Plus size={16} className="text-[#FF3B30]" />
                <span className="text-xs font-bold tracking-widest uppercase">{product.driver_size} DRIVERS</span>
              </div>
            </div>
          </div>
        </div>

        {/* BELOW FOLD — Tabs */}
        <div className="mt-32">
          <div className="flex border-b border-[#1A1A1A] overflow-x-auto no-scrollbar">
            {['description', 'specifications', 'in box', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-8 py-4 font-bebas tracking-widest text-xl whitespace-nowrap transition-all relative",
                  activeTab === tab ? "text-[#FF3B30]" : "text-gray-500 hover:text-white"
                )}
              >
                {tab.toUpperCase()}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF3B30]" />
                )}
              </button>
            ))}
          </div>

          <div className="py-12 min-h-[400px]">
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none font-dm text-gray-400 leading-relaxed">
                <ReactMarkdown>{product.long_description}</ReactMarkdown>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { label: "Bluetooth Version", value: product.bluetooth_version },
                  { label: "Battery Life", value: `${product.total_playtime} Hours` },
                  { label: "Driver Size", value: product.driver_size },
                  { label: "Water Resistance", value: product.water_resistance },
                  { label: "Noise Cancellation", value: product.noise_cancellation ? "Yes" : "No" },
                  { label: "Charging Type", value: product.charging_type },
                  { label: "Warranty", value: `${product.warranty_months} Months` },
                  { label: "Weight", value: `${product.weight_grams}g` },
                ].map((spec, i) => (
                  <div key={i} className="flex justify-between py-4 border-b border-[#1A1A1A]">
                    <span className="text-gray-500 font-dm uppercase tracking-widest text-xs">{spec.label}</span>
                    <span className="text-white font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'in box' && (
              <ul className="space-y-4">
                {product.in_box_items?.map((item: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400 font-dm">
                    <CheckCircle2 size={18} className="text-[#FF3B30]" /> {item}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-bebas tracking-wider">CUSTOMER REVIEWS</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1 text-[#D4A853]">
                        {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="currentColor" />)}
                      </div>
                      <span className="text-xl font-dm text-gray-400">Based on {reviews.length} reviews</span>
                    </div>
                  </div>
                  <button className="bg-white text-black px-10 py-4 rounded-full font-bebas tracking-widest text-xl hover:bg-gray-200 transition-all">
                    WRITE A REVIEW
                  </button>
                </div>

                <div className="space-y-8">
                  {reviews.length > 0 ? (
                    reviews.map((rev) => (
                      <div key={rev.id} className="bg-[#1A1A1A] p-8 rounded-3xl border border-[#2A2A2A] space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex gap-1 text-[#D4A853]">
                              {[...Array(rev.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                            <h4 className="text-white font-bebas tracking-widest text-xl">{rev.title}</h4>
                          </div>
                          <span className="text-gray-500 text-xs font-dm">{new Date(rev.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-400 font-dm leading-relaxed">{rev.body}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bebas tracking-widest">{rev.customer_name.toUpperCase()}</span>
                          {rev.is_verified && <span className="bg-[#4ADE80]/10 text-[#4ADE80] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">VERIFIED</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 font-dm italic">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-32">
          <h2 className="text-5xl font-bebas tracking-wider text-white mb-12">YOU MAY ALSO LIKE</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
