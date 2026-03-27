import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color?: 'green' | 'red' | 'blue' | 'yellow' | 'white';
}

export default function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'white' 
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (typeof value === 'number') {
      const duration = 1000;
      const steps = 60;
      const stepValue = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [value]);

  const colorClasses = {
    green: 'text-green-500 bg-green-500/10 border-green-500/20',
    red: 'text-red-500 bg-red-500/10 border-red-500/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    white: 'text-white bg-white/10 border-white/20'
  };

  const iconColorClasses = {
    green: 'bg-green-500 text-black',
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
    yellow: 'bg-yellow-500 text-black',
    white: 'bg-white text-black'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1A1A1A] p-8 rounded-[2rem] border border-[#2A2A2A] space-y-6 group hover:border-[#FF3B30] transition-all"
    >
      <div className="flex justify-between items-start">
        <div className={cn("p-4 rounded-2xl", iconColorClasses[color])}>
          <Icon size={24} />
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase",
            change >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-xs font-bold tracking-widest uppercase text-gray-500">{title}</p>
        <h3 className="text-4xl font-bebas tracking-wider text-white">
          {typeof value === 'number' ? displayValue.toLocaleString() : value}
        </h3>
      </div>
    </motion.div>
  );
}
