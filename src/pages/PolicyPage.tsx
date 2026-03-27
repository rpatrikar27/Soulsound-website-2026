import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, ShieldCheck, FileText, Globe, Mail, Phone, MapPin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

const POLICY_DATA: Record<string, any> = {
  'privacy-policy': {
    title: 'PRIVACY POLICY',
    lastUpdated: 'March 15, 2026',
    icon: ShieldCheck,
    content: `
# Privacy Policy for SoulSound

At SoulSound, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website (soulsound.in) or make a purchase.

## 1. Information We Collect
We collect information you provide directly to us, such as:
- Name, email address, and phone number
- Shipping and billing addresses
- Payment information (processed securely via Razorpay)
- Order history and preferences

## 2. How We Use Your Information
We use the collected information to:
- Process and fulfill your orders
- Communicate with you about your orders and promotional offers
- Improve our website and customer service
- Comply with legal obligations

## 3. Data Security
We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.

## 4. Third-Party Disclosure
We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except for providing services like shipping (Shiprocket) and payment processing (Razorpay).

## 5. Your Rights
You have the right to access, correct, or delete your personal information. You can do this by logging into your account or contacting us at support@soulsound.in.
    `
  },
  'refund-policy': {
    title: 'REFUND & RETURN POLICY',
    lastUpdated: 'March 15, 2026',
    icon: FileText,
    content: `
# Refund & Return Policy

We want you to be completely satisfied with your SoulSound purchase. If you are not satisfied, we're here to help.

## 1. Returns
- You have **7 calendar days** to return an item from the date you received it.
- To be eligible for a return, your item must be unused and in the same condition that you received it.
- Your item must be in the original packaging.
- Your item needs to have the receipt or proof of purchase.

## 2. Refunds
- Once we receive your item, we will inspect it and notify you that we have received your returned item.
- We will immediately notify you on the status of your refund after inspecting the item.
- If your return is approved, we will initiate a refund to your original method of payment (via Razorpay).
- You will receive the credit within a certain amount of days, depending on your card issuer's policies.

## 3. Shipping
- You will be responsible for paying for your own shipping costs for returning your item.
- Shipping costs are non-refundable.

## 4. Warranty
- All SoulSound TWS earbuds come with a **1-year limited warranty** against manufacturing defects.
    `
  },
  'shipping-policy': {
    title: 'SHIPPING POLICY',
    lastUpdated: 'March 15, 2026',
    icon: Globe,
    content: `
# Shipping Policy

SoulSound is dedicated to delivering your products in the fastest time possible while ensuring maximum safety.

## 1. Shipping Rates
- We offer **FREE SHIPPING** on all orders across India. No minimum purchase is required.

## 2. Delivery Timeline
- Orders are usually processed within **24-48 hours**.
- Standard delivery time is **3-5 business days** depending on your location.
- Remote areas may take up to 7-10 business days.

## 3. Tracking
- Once your order is shipped, you will receive a tracking number via email and SMS.
- You can track your order directly on our website using the [Track Order](/track-order) page.

## 4. Shipping Partners
- We partner with reliable logistics providers like Shiprocket, BlueDart, Delhivery, and Ecom Express to ensure your order reaches you safely.
    `
  },
  'terms-of-service': {
    title: 'TERMS OF SERVICE',
    lastUpdated: 'March 15, 2026',
    icon: FileText,
    content: `
# Terms of Service

Welcome to SoulSound. By using our website and services, you agree to comply with and be bound by the following terms and conditions.

## 1. Use of Website
- The content of the pages of this website is for your general information and use only. It is subject to change without notice.
- Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.

## 2. Product Information
- We attempt to be as accurate as possible with product descriptions and images. However, we do not warrant that product descriptions or other content are accurate, complete, reliable, current, or error-free.

## 3. Pricing
- Prices for our products are subject to change without notice.
- We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.

## 4. Governing Law
- Your use of this website and any dispute arising out of such use of the website is subject to the laws of India.
- Any legal action shall be brought in the courts of Nagpur, Maharashtra.
    `
  }
};

export default function PolicyPage() {
  const { slug } = useParams();
  const policy = POLICY_DATA[slug || ''];

  if (!policy) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-bebas text-4xl">
        PAGE NOT FOUND
      </div>
    );
  }

  const Icon = policy.icon;

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen pb-24">
      {/* Header */}
      <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF3B30]/10 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF3B30]/5 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 text-center space-y-6 px-4">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-[#1A1A1A] rounded-3xl border border-[#2A2A2A] flex items-center justify-center mx-auto mb-8"
          >
            <Icon size={40} className="text-[#FF3B30]" />
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-bebas tracking-wider">{policy.title}</h1>
          <div className="flex items-center justify-center gap-2 text-gray-500 font-dm text-sm uppercase tracking-widest">
            <Clock size={14} /> LAST UPDATED: {policy.lastUpdated}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-[#1A1A1A] p-8 md:p-16 rounded-[3rem] border border-[#2A2A2A] shadow-2xl">
          <div className="prose prose-invert prose-red max-w-none font-dm leading-relaxed text-gray-300">
            <ReactMarkdown>{policy.content}</ReactMarkdown>
          </div>

          {/* Contact Section */}
          <div className="mt-16 pt-16 border-t border-[#2A2A2A] grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                <Mail size={20} className="text-[#FF3B30]" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-500">EMAIL US</p>
                <p className="text-white font-dm">support@soulsound.in</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                <Phone size={20} className="text-[#FF3B30]" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-500">CALL US</p>
                <p className="text-white font-dm">+91 82080 49909</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                <MapPin size={20} className="text-[#FF3B30]" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-500">VISIT US</p>
                <p className="text-white font-dm">Nagpur, Maharashtra, India</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-dm text-sm">
            <ArrowLeft size={16} /> BACK TO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
