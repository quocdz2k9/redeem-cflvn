"use client"
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#09090b]">
          <div className="relative flex flex-col items-center">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-orange-600/20 border-t-orange-600 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="https://cdn-mainsite-aka.vnggames.com/products/cfl/favicon.png" 
                  alt="CFL Logo" 
                  className="w-12 h-12 animate-pulse"
                />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <h2 className="text-sm font-black uppercase italic tracking-[0.3em] text-zinc-900 dark:text-white">
                CROSSFIRE: <span className="text-orange-600">LEGENDS</span>
              </h2>
              <div className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 text-orange-600 animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Đang tải dữ liệu hệ thống...
                </span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-orange-600 animate-loading-bar w-full"></div>
        </div>
      )}
      <div className={`transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </>
  );
}

