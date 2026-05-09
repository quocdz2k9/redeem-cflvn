"use client"
import React from "react"
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Database, 
  UserSearch, 
  ServerCrash 
} from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export default function PolicyPage() {
  const currentDomain = typeof window !== "undefined" ? window.location.hostname.toUpperCase() : "AUTONHAPCODECFL.VN"
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto p-4 mt-6 space-y-8 pb-20">
        {/* HEADER */}
        <div className="px-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">Quyền riêng tư</span>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter mt-1">CHÍNH SÁCH <span className="text-orange-600">BẢO MẬT</span></h1>
          <p className="text-[11px] font-bold text-zinc-500 mt-2 italic">Cập nhật lần cuối: Tháng 5, {currentYear}</p>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="space-y-4">
          
          {/* Section 1: Thu thập dữ liệu */}
          <PolicyCard 
            icon={<UserSearch className="w-5 h-5 text-orange-600" />}
            title="Thu thập dữ liệu"
            content="Hệ thống chỉ thu thập ID nhân vật (RoleID) do bạn cung cấp để thực hiện lệnh nhập code qua API VNG. Chúng tôi không yêu cầu mật khẩu hoặc thông tin đăng nhập tài khoản game của bạn."
          />

          {/* Section 2: Công nghệ định danh */}
          <PolicyCard 
            icon={<FingerprintIcon />}
            title="Công nghệ định danh"
            content="Chúng tôi sử dụng dấu vân tay trình duyệt (Browser Fingerprint) để tạo mã định danh duy nhất nhằm mục đích thống kê lượt sử dụng và ngăn chặn các hành vi spam hệ thống. Dữ liệu này hoàn toàn ẩn danh."
          />

          {/* Section 3: Lưu trữ cục bộ */}
          <PolicyCard 
            icon={<Database className="w-5 h-5 text-orange-600" />}
            title="Lưu trữ cục bộ (Local Storage)"
            content="Danh sách các ID nhân vật mà bạn đã xác thực sẽ được lưu trực tiếp tại trình duyệt của bạn (LocalStorage). Chúng tôi không lưu trữ danh sách cá nhân này trên máy chủ để đảm bảo tính riêng tư tuyệt đối."
          />

          {/* Section 4: Bảo mật API */}
          <PolicyCard 
            icon={<Lock className="w-5 h-5 text-orange-600" />}
            title="An toàn giao dịch"
            content="Mọi yêu cầu gửi đến máy chủ VNG đều được thực hiện qua các kênh kết nối an toàn. Chúng tôi sử dụng hệ thống Proxy xoay vòng để đảm bảo yêu cầu của bạn luôn ổn định và không bị gián đoạn."
          />

          {/* Section 5: Miễn trừ trách nhiệm */}
          <PolicyCard 
            icon={<ServerCrash className="w-5 h-5 text-orange-600" />}
            title="Miễn trừ trách nhiệm"
            content="Công cụ được phát triển nhằm mục đích hỗ trợ cộng đồng CFL. Chúng tôi không chịu trách nhiệm đối với các khiếu nại liên quan đến việc sử dụng mã code hết hạn hoặc sai ID nhân vật."
          />

        </div>

        {/* CAM KẾT */}
        <div className="bg-orange-600 rounded-[32px] p-8 text-white shadow-xl shadow-orange-600/20 relative overflow-hidden">
            <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">Lời cam kết từ Admin</h3>
            <p className="text-xs font-bold leading-relaxed opacity-90">
              Hệ thống được vận hành với tiêu chí minh bạch và an toàn. Quốc cam kết không mua bán dữ liệu người dùng và luôn nỗ lực tối ưu hệ thống để mang lại trải nghiệm tốt nhất cho anh em.
            </p>
        </div>
      </main>

      <Footer mounted={true} currentYear={currentYear} currentDomain={currentDomain} />
    </div>
  )
}

function PolicyCard({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[28px] p-6 shadow-sm hover:border-orange-600/50 transition-all group">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center group-hover:bg-orange-600/10 transition-colors">
          {icon}
        </div>
        <h4 className="font-black uppercase italic text-sm tracking-tight">{title}</h4>
      </div>
      <p className="text-[12px] font-bold leading-relaxed text-zinc-500 dark:text-zinc-400">
        {content}
      </p>
    </div>
  )
}

function FingerprintIcon() {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="w-5 h-5 text-orange-600"
    >
      <path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12" />
      <path d="M5 15C5 11.134 8.13401 8 12 8C15.866 8 19 11.134 19 15" />
      <path d="M8 18C8 15.7909 9.79086 14 12 14C14.2091 14 16 15.7909 16 18" />
      <path d="M12 20V22" />
      <path d="M12 11V12" />
    </svg>
  )
}

