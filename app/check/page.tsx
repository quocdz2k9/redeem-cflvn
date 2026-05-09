"use client"

import React, { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { 
  Search, Loader2, ShieldCheck, 
  Trophy, Users, Clock, 
  Gem, Coins, Star, 
  Info, AlertCircle,
  Gamepad2
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function CheckRolePage() {
  const [roleID, setRoleID] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleID) return
    
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await fetch("/api/check-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleID })
      })
      const data = await res.json()
      
      if (data.returnCode === 1 && data.data) {
        setResult(data.data)
      } else {
        setError(data.returnMessage || "Không tìm thấy nhân vật này!")
      }
    } catch (err) {
      setError("Lỗi kết nối máy chủ, vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: string | number) => {
    return new Number(num).toLocaleString("vi-VN")
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 pb-20">
      <Navbar />

      <main className="max-w-2xl mx-auto p-4 mt-6 space-y-6">
        <div className="px-1 text-center mb-8">
          <span className="text-[10px] font-black uppercase text-orange-600 tracking-[0.3em]">Hệ thống tra cứu</span>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter mt-1 leading-none">
            CHECK <span className="text-zinc-400">INFO</span> ACCOUNT
          </h1>
          <p className="text-[11px] font-bold text-zinc-500 mt-2 uppercase">Nhập Role ID để kiểm tra thông tin nhân vật Crossfire: Legends</p>
        </div>

        <form onSubmit={handleCheck} className="relative group">
          <Input
            placeholder="Nhập Role ID (VD: 1403552873)..."
            className="h-16 pl-6 pr-32 bg-white dark:bg-zinc-900 border-none rounded-[24px] shadow-sm font-bold text-base focus-visible:ring-2 focus-visible:ring-orange-600/20 transition-all"
            value={roleID}
            onChange={(e) => setRoleID(e.target.value)}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button 
              type="submit" 
              disabled={loading}
              className="h-12 px-6 rounded-[18px] bg-orange-600 hover:bg-orange-700 text-white font-black italic uppercase tracking-tighter transition-all active:scale-95"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "KIỂM TRA"}
            </Button>
          </div>
        </form>

        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 p-4 rounded-2xl flex items-center gap-3 text-rose-600">
            <AlertCircle className="w-5 h-5" />
            <span className="text-[12px] font-bold uppercase italic leading-none">{error}</span>
          </div>
        )}

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <Card className="overflow-hidden border-none bg-white dark:bg-zinc-950 shadow-xl rounded-[32px] relative">
              <div className="h-24 bg-gradient-to-r from-orange-600 to-rose-600 opacity-20 absolute top-0 left-0 w-full" />
              
              <div className="p-6 pt-10 relative z-10 flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white dark:border-zinc-900 shadow-2xl bg-zinc-100">
                    <img 
                      src={result.info.pic_url || "https://download.playcfl.com/AVProVideoSamples/Icon/4U_Seraphim_avatar_Icon_Normal_01.png"} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-orange-600 text-white text-[10px] font-black px-2 py-1 rounded-lg border-2 border-white dark:border-zinc-900">
                    LV.{result.info.level}
                  </div>
                </div>

                <div className="text-center sm:text-left flex-1 space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">{result.roleName}</h2>
                    {result.info.is_online === "1" && (
                      <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    )}
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-orange-600" /> ID: {result.roleID}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3 text-blue-500" /> Guild: {result.info.guild_name || "Chưa vào Clan"}</span>
                  </div>
                  <div className="pt-3 flex gap-2 justify-center sm:justify-start">
                     <div className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border dark:border-zinc-800 flex items-center gap-2">
                        <Gem className="w-3.5 h-3.5 text-cyan-500" />
                        <span className="text-[11px] font-black text-zinc-700 dark:text-zinc-200">{formatNumber(result.info.diamond)}</span>
                     </div>
                     <div className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border dark:border-zinc-800 flex items-center gap-2">
                        <Coins className="w-3.5 h-3.5 text-yellow-500" />
                        <span className="text-[11px] font-black text-zinc-700 dark:text-zinc-200">{formatNumber(result.info.money)}</span>
                     </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 border-t dark:border-zinc-900">
                <StatBox icon={<Trophy />} colorClass="text-orange-500" label="Rank hiện tại" value={`ĐIỂM: ${result.info.ladder_score}`} />
                <StatBox icon={<Star />} colorClass="text-yellow-500" label="Rank cao nhất" value={`ĐIỂM: ${result.info.top_ladder_score}`} />
                <StatBox icon={<Clock />} colorClass="text-blue-500" label="Ngày tạo" value={new Date(result.info.register_time * 1000).toLocaleDateString('vi-VN')} />
                <StatBox icon={<Info />} colorClass="text-zinc-400" label="Uy tín" value={`${result.info.credit_score}/100`} />
              </div>
            </Card>

            <div className="bg-orange-600 rounded-[24px] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase opacity-60">Trạng thái máy chủ</p>
                  <p className="text-[11px] font-bold uppercase tracking-tighter italic">Server: {result.serverName} (Global)</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black uppercase opacity-60">Cập nhật lúc</p>
                <p className="text-[11px] font-bold uppercase italic">Vừa xong</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// Fix lỗi Type check tại đây bằng cách truyền class qua Props thay vì cloneElement phức tạp
function StatBox({ icon, colorClass, label, value }: { icon: React.ReactNode, colorClass: string, label: string, value: string }) {
  return (
    <div className="p-4 flex flex-col items-center justify-center text-center gap-1 border-r last:border-r-0 dark:border-zinc-900">
      <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg mb-1">
        {React.isValidElement(icon) 
          ? React.cloneElement(icon as React.ReactElement<any>, { className: `w-4 h-4 ${colorClass}` }) 
          : icon}
      </div>
      <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">{label}</p>
      <p className="text-[10px] font-black uppercase italic tracking-tighter">{value}</p>
    </div>
  )
}

