"use client"
import React, { useEffect, useState } from "react"
import { ExternalLink } from "lucide-react"

interface FooterProps {
  mounted: boolean;
  currentYear: number;
  currentDomain: string;
}

export function Footer({ mounted, currentYear, currentDomain }: FooterProps) {
  const [hostname, setHostname] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostname(window.location.hostname)
    }
  }, [])

  return (
    <footer className="mt-auto pt-10 pb-[calc(20px+env(safe-area-inset-bottom))] border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-6 flex flex-col items-center gap-6">
        <div className="flex items-center justify-center gap-6">
          <a
            href="https://fb.com/tranminhquocreal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[12px] font-black uppercase tracking-tighter text-zinc-500 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            Facebook
          </a>
          <div className="w-[1px] h-3 bg-zinc-300 dark:bg-zinc-700" />
          <a
            href={mounted && hostname ? `mailto:contact@${hostname}` : "#"}
            className="flex items-center gap-2 text-[12px] font-black uppercase tracking-tighter text-zinc-500 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
            Liên hệ
          </a>
        </div>

        <div className="text-center space-y-1">
          <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            &copy; {currentYear} <span className="text-orange-600">{currentDomain}</span>
          </p>
          <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-500">
            Một sản phẩm từ <span className="text-zinc-900 dark:text-zinc-100 italic">Trần Minh Quốc</span>
          </p>
        </div>

        <div className="relative group cursor-default">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/0 via-orange-600/20 to-orange-600/0 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center gap-2 px-4 py-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
              🇻🇳 Hoàng Sa & Trường Sa là của Việt Nam
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

