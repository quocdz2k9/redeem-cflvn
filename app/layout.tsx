"use client" // Chuyển layout sang client-side để điều khiển state loading

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Giả lập thời gian load tài nguyên hoặc chờ DOM sẵn sàng
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 giây để hiệu ứng kịp hiển thị

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="vi" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Giao diện Loading */}
          {isLoading && (
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#09090b] transition-all duration-500">
              <div className="relative flex flex-col items-center">
                {/* Logo hoặc Icon Loading */}
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

                {/* Text Loading */}
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

              {/* Thanh progress bar giả ở dưới cùng */}
              <div className="absolute bottom-0 left-0 h-1 bg-orange-600 animate-loading-bar w-full"></div>
            </div>
          )}

          {/* Main Content: Ẩn đi khi đang load để tránh layout shift */}
          <main className={`flex-1 transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            {children}
          </main>
          
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

