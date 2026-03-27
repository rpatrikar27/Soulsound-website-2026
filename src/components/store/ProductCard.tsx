import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { cn } from '../../lib/utils';

interface Product {
  id: string;
  name: string;
  slug: string;
  mrp: number;
  sale_price: number;
  images: string[];
  category: string;
  is_bestseller?: boolean;
  is_new?: boolean;
  is_featured?: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const discount = Math.round(((product.mrp - product.sale_price) / product.mrp) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.sale_price,
      mrp: product.mrp,
      image: product.images[0],
      color: 'Default',
      quantity: 1,
      sku: ''
    });
  };

  return (
    <Link 
      to={`/products/${product.slug}`}
      className="group relative bg-[#1A1A1A] rounded-2xl overflow-hidden flex flex-col transition-transform duration-500 hover:-translate-y-2"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {discount > 0 && (
          <span className="bg-[#FF3B30] text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-widest uppercase">
            SALE
          </span>
        )}
        {product.is_bestseller && (
          <span className="bg-[#D4A853] text-black text-[10px] font-bold px-2 py-1 rounded-md tracking-widest uppercase">
            BESTSELLER
          </span>
        )}
        {product.is_new && (
          <span className="bg-[#4ADE80] text-black text-[10px] font-bold px-2 py-1 rounded-md tracking-widest uppercase">
            NEW
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-[#0D0D0D]">
        <img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        {product.images[1] && (
          <img 
            src={product.images[1]} 
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        
        {/* Quick Add Button */}
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 bg-[#FF3B30] text-white py-4 font-bebas tracking-widest translate-y-full transition-transform duration-300 group-hover:translate-y-0 flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} /> ADD TO CART
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-2 flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">{product.category}</p>
          <div className="flex items-center gap-1 text-[#D4A853]">
            <Star size={10} fill="currentColor" />
            <span className="text-[10px] font-bold">4.9</span>
          </div>
        </div>
        <h3 className="text-white font-dm font-medium text-lg leading-tight group-hover:text-[#FF3B30] transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-2 flex items-center gap-3">
          <span className="text-xl font-bebas tracking-wider text-white">₹{product.sale_price.toLocaleString()}</span>
          {product.mrp > product.sale_price && (
            <>
              <span className="text-sm text-gray-500 line-through">₹{product.mrp.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-[#FF3B30]">{discount}% OFF</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
