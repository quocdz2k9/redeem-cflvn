"use client"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation" // Thêm hook này
import { 
  LayoutDashboard, 
  Menu, 
  Coffee, 
  Heart, 
  History, 
  UserCircle, 
  Home, 
  Shield 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"

export function Navbar() {
  const pathname = usePathname() // Lấy đường dẫn hiện tại (ví dụ: "/" hoặc "/heros")

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-950 border-b dark:border-zinc-800 sticky top-0 z-50">
      {/* LEFT: LOGO */}
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl lg:hidden active:scale-95 transition-transform">
              <Menu className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[320px] dark:bg-zinc-950 border-none p-0">
            <div className="p-6 space-y-6">
              <SheetHeader className="text-left border-b pb-6 dark:border-zinc-900">
                <SheetTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                    <LayoutDashboard className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-black italic tracking-tighter uppercase">
                    CFL <span className="text-orange-600">MENU</span>
                  </span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2">
                {/* Tự động check active dựa trên pathname */}
                <MenuLink 
                  href="/" 
                  icon={<Home className="w-4 h-4" />} 
                  title="Trang chủ" 
                  active={pathname === "/"} 
                />
                <MenuLink 
                  href="/heros" 
                  icon={<UserCircle className="w-4 h-4" />} 
                  title="Thư viện Heroes" 
                  active={pathname === "/heros"} 
                />
                <MenuLink 
                  href="/history" 
                  icon={<History className="w-4 h-4" />} 
                  title="Lịch sử nhập code" 
                  active={pathname === "/history"} 
                />
                <MenuLink 
                  href="/policy" 
                  icon={<Shield className="w-4 h-4" />} 
                  title="Chính sách bảo mật" 
                  active={pathname === "/policy"} 
                />
              </div>

              <div className="pt-6 border-t dark:border-zinc-900">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 px-3">Cộng đồng</p>
                <div className="grid grid-cols-2 gap-2">
                  <a href="https://shopcfl.com" target="_blank" className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex flex-col items-center gap-2 text-[10px] font-bold hover:text-orange-600 transition-colors">
                    Shop CFL
                  </a>
                  <a href="#" className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex flex-col items-center gap-2 text-[10px] font-bold hover:text-orange-600 transition-colors">
                    Zalo Admin
                  </a>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2 active:scale-95 transition-transform">
          <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-600/20">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xl font-black tracking-tighter uppercase italic leading-[1.1]">
              CÔNG <span className="text-orange-600">CỤ</span>
            </span>
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase opacity-70 italic">
              Auto Nhập Code CFL
            </span>
          </div>
        </Link>
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="hidden md:flex rounded-xl border-zinc-200 dark:border-zinc-800 text-orange-600 h-9 px-4 active:scale-95 transition-all">
              <Coffee className="h-4 w-4 mr-2" />
              <span className="font-bold text-[11px] uppercase tracking-tighter">Ủng hộ Admin</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[380px] rounded-[32px] border-none shadow-2xl dark:bg-zinc-950 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-600" />
            <DialogHeader className="pt-4 px-6 text-center space-y-3">
              <DialogTitle className="font-black flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-orange-600 fill-orange-600 animate-pulse" />
                </div>
                ỦNG HỘ ADMIN
              </DialogTitle>
              <DialogDescription className="text-[11px] font-bold">Mời admin một ly cà phê nhé!</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center p-6 pt-2">
              <img src="https://img.vietqr.io/image/VPB-0825966162-compact.png" alt="QR" className="w-44 h-44 rounded-2xl border bg-white p-1 mb-4" />
              <div className="w-full space-y-2">
                <div className="flex justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 text-[11px] font-bold">
                  <span className="text-zinc-400 uppercase">VP BANK</span>
                  <span>0825966162</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <ThemeToggle />
      </div>
    </nav>
  )
}

// Giữ nguyên MenuLink nhưng tối ưu CSS một chút
function MenuLink({ href, icon, title, active = false }: { href: string, icon: React.ReactNode, title: string, active?: boolean }) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-all duration-200 active:scale-95 ${
        active 
        ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20 translate-x-2" 
        : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-orange-600"
      }`}>
        <div className={`${active ? "text-white" : "text-zinc-400 group-hover:text-orange-600"}`}>
          {icon}
        </div>
        {title}
      </div>
    </Link>
  )
}

