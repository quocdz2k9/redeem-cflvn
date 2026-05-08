"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "sonner"
import {
  Loader2, Users, ClipboardList, Trash2, PlusCircle,
  LayoutDashboard, Terminal, Coffee, Heart, ShoppingBag,
  ExternalLink, Activity, Zap
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { DEFAULT_CODES, ERROR_MESSAGES } from "./constants/redeem"
import { Footer } from "@/components/Footer"
import { createClient } from "@/utils/supabase/client"
import { Navbar } from "@/components/Navbar"
export default function Home() {
  const supabase = createClient()
  const [roleId, setRoleId] = useState("")
  const [roleName, setRoleName] = useState("")
  const [codesInput, setCodesInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalError, setModalError] = useState("")
  const [modalSuccess, setModalSuccess] = useState("")
  const [logs, setLogs] = useState<{ code: string; status: string; msg: string; time: string }[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [showExpandButton, setShowExpandButton] = useState(false)
  const [tempIdInput, setTempIdInput] = useState("")
  const [validatedIds, setValidatedIds] = useState<{ id: string, name: string }[]>([])
  const [mounted, setMounted] = useState(false)
  const [statsRealtime, setStatsRealtime] = useState({ total: 0, online: 1 })
  const [isStatsLoading, setIsStatsLoading] = useState(true)

  const stats = useMemo(() => ({
    total: logs.length,
    success: logs.filter(l => l.status === "Thành công").length,
    fail: logs.filter(l => l.status === "Thất bại" || l.status === "Lỗi").length
  }), [logs])

  const generateFingerprint = () => {
    const gl = document.createElement('canvas').getContext('webgl')
    const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info')
    const renderer = debugInfo ? gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : ""
    const str = `${navigator.userAgent}|${screen.width}x${screen.height}|${navigator.language}|${renderer}`
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash).toString(36)
  }

  useEffect(() => {
    setMounted(true)
    let vId = localStorage.getItem("cfl_visitor_id")
    if (!vId) {
      vId = generateFingerprint()
      localStorage.setItem("cfl_visitor_id", vId)
    }

    const savedIds = localStorage.getItem("cfl_validated_ids")
    if (savedIds) {
      try {
        setValidatedIds(JSON.parse(savedIds))
      } catch (e) {}
    }

    const fetchStats = async () => {
      try {
        await supabase.from('ActiveUser').upsert({ 
          id: vId, 
          lastseen: new Date().toISOString() 
        })

        const { data: systemStats } = await supabase.from('SystemStat').select('value').eq('key', 'total_redeems').single()
        const thirtySecondsAgo = new Date(Date.now() - 30 * 1000).toISOString()
        const { count: onlineCount } = await supabase.from('ActiveUser')
          .select('*', { count: 'exact', head: true })
          .gte('lastseen', thirtySecondsAgo)
        
        setStatsRealtime({
          total: systemStats?.value || 0,
          online: onlineCount || 1
        })
        setIsStatsLoading(false)
      } catch (e) {}
    }

    fetchStats()
    const interval = setInterval(fetchStats, 15000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cfl_validated_ids", JSON.stringify(validatedIds))
    }
  }, [validatedIds, mounted])

  useEffect(() => {
    const lineCount = codesInput.split("\n").filter(line => line.trim() !== "").length
    setShowExpandButton(lineCount > 6)
  }, [codesInput])

  const isNumeric = (val: string) => /^\d+$/.test(val)

  const checkRoleApi = async (id: string) => {
    const res = await fetch("/api/check-role", {
      method: "POST",
      body: JSON.stringify({ roleID: id })
    })
    return await res.json()
  }

  const validateRole = async (id: string) => {
    if (!id || id === roleId) return
    if (!isNumeric(id)) {
      setRoleName("")
      toast.error("ID nhân vật không tồn tại")
      return
    }
    setIsValidating(true)
    try {
      const result = await checkRoleApi(id)
      if (result.returnCode === 1) {
        setRoleName(result.data.roleName)
      } else {
        setRoleName("")
        if (id.length > 3) {
          toast.error("Nhân vật không được tìm thấy trong khu vực này.")
        } else {
          toast.error("ID nhân vật không tồn tại")
        }
      }
    } catch {
      toast.error("Lỗi kết nối máy chủ")
    } finally {
      setIsValidating(false)
    }
  }

  const handleAddIdFromModal = async () => {
    setModalError("")
    setModalSuccess("")
    const id = tempIdInput.trim()
    if (!id) return setModalError("Vui lòng nhập ID")
    if (!isNumeric(id)) return setModalError("ID không hợp lệ")
    setIsValidating(true)
    try {
      const result = await checkRoleApi(id)
      if (result.returnCode === 1) {
        if (!validatedIds.some(item => item.id === id)) {
          setValidatedIds(prev => [...prev, { id, name: result.data.roleName }])
        }
        setModalSuccess(`Đã lưu: ${result.data.roleName}`)
        setTempIdInput("")
      } else {
        setModalError("Nhân vật không tồn tại")
      }
    } catch (e) {
      setModalError("Lỗi kết nối")
    } finally {
      setIsValidating(false)
    }
  }

  const handleRedeem = async () => {
    if (!roleId) return toast.error("Vui lòng chọn ID nhân vật")
    const listCodes = codesInput.split("\n").map(c => c.trim()).filter(c => c !== "")
    if (listCodes.length === 0) return toast.error("Danh sách code trống")

    setIsLoading(true)
    setLogs([])

    for (const code of listCodes) {
      const currentTime = new Date().toLocaleTimeString('vi-VN', { hour12: false })
      try {
        const response = await fetch("/api/redeem", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _targetServerId: "101", serverId: "101", gameCode: "A49",
            roleId, roleName: roleName || roleId, code
          })
        })
        const result = await response.json()
        const rawMsg = result.message || "Unknown"
        
        setLogs(prev => [{
          code,
          status: rawMsg === "Success" ? "Thành công" : "Thất bại",
          msg: ERROR_MESSAGES[rawMsg] || rawMsg,
          time: currentTime
        }, ...prev])
        await new Promise(r => setTimeout(r, 300))
      } catch {
        setLogs(prev => [{ code, status: "Lỗi", msg: "Lỗi mạng", time: currentTime }, ...prev])
      }
    }

    await supabase.rpc('increment_redeem_count', { row_key: 'total_redeems', inc_by: 1 })

    setIsLoading(false)
    toast.success("Xử lý hoàn tất!")
  }

  const currentDomain = mounted ? window.location.hostname.toUpperCase() : ""
  const currentYear = mounted ? new Date().getFullYear() : 2026

 return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
      {/* Navbar mới đây */}
      <Navbar /> 

      <main className="flex-1 p-4 max-w-2xl mx-auto w-full space-y-6 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[24px] p-4 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase text-zinc-400 tracking-tighter">Đang truy cập</p>
              <p className="text-lg font-black text-zinc-900 dark:text-white">
                {isStatsLoading ? <span className="text-[10px] animate-pulse">...</span> : statsRealtime.online}
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[24px] p-4 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase text-zinc-400 tracking-tighter">Đã sử dụng</p>
              <p className="text-lg font-black text-zinc-900 dark:text-white">
                {isStatsLoading ? <span className="text-[10px] animate-pulse">...</span> : statsRealtime.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <a href="https://shopcfl.com" target="_blank" rel="noopener noreferrer" className="block bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-[32px] p-6 border border-zinc-200 dark:border-zinc-800 transition-none active:scale-[0.98] shadow-sm dark:shadow-none">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter flex items-center gap-1">
              <ShoppingBag className="w-3 h-3" /> OFFICIAL SHOP
            </div>
            <ExternalLink className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
          </div>
          <h2 className="text-sm font-black uppercase leading-tight tracking-tight mb-1">SÀN GIAO DỊCH - MUA BÁN ACC CROSSFIRE LEGENDS LỚN NHẤT VIỆT NAM</h2>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-500 font-bold leading-relaxed">Shop Acc Crossfire Legends uy tín hàng đầu Việt Nam. Hệ thống giao dịch nick tự động 24/7. Cam kết bảo mật, an toàn.</p>
        </a>

        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">Cấu hình ID Nhân vật</h2>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="rounded-xl h-8 text-[10px] font-black px-4 bg-zinc-100 dark:bg-zinc-800 transition-none">
                  <Users className="w-3.5 h-3.5 mr-2" /> DANH SÁCH ID
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md dark:bg-zinc-950 rounded-[32px] border-none shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="text-lg font-black flex items-center gap-2"><PlusCircle className="w-5 h-5 text-orange-600" /> QUẢN LÝ ID</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="flex gap-2">
                    <Input placeholder="Nhập ID..." className="h-12 font-bold rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none px-4" value={tempIdInput} onChange={(e) => setTempIdInput(e.target.value)} />
                    <Button className="h-12 w-14 bg-orange-600 rounded-2xl flex-shrink-0 transition-none active:scale-95" onClick={handleAddIdFromModal} disabled={isValidating}>
                      {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
                    </Button>
                  </div>
                  {modalError && <p className="text-[10px] font-bold text-rose-500 px-2">{modalError}</p>}
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar min-h-[100px]">
                    {validatedIds.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 opacity-40">
                        <Users className="w-8 h-8 mb-2 text-zinc-500" />
                        <p className="text-[11px] font-black uppercase tracking-tighter">Danh sách đang trống</p>
                      </div>
                    ) : (
                      validatedIds.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border dark:border-zinc-800 transition-none">
                          <div>
                            <p className="text-[10px] font-bold text-zinc-400">ID: {item.id}</p>
                            <p className="text-xs font-black text-orange-600 italic">{item.name}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="h-8 bg-zinc-900 dark:bg-zinc-800 text-white font-bold text-[10px] rounded-lg px-4 transition-none active:scale-95" onClick={() => { setRoleId(item.id); setRoleName(item.name); setIsModalOpen(false); }}>DÁN</Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 transition-none active:text-rose-500" onClick={() => setValidatedIds(prev => prev.filter((_, i) => i !== idx))}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative">
            <Input placeholder="Nhập ID..." value={roleId} onChange={(e) => setRoleId(e.target.value)} onBlur={() => validateRole(roleId)} className="font-bold h-14 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl transition-none text-sm px-5 shadow-sm" />
            {isValidating && <div className="absolute right-5 top-5"><Loader2 className="w-4 h-4 animate-spin text-orange-600" /></div>}
          </div>
          {roleName && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-black text-emerald-600 uppercase">Xác nhận: {roleName}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-orange-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Danh sách Giftcode</span>
            </div>
            <button onClick={() => setCodesInput(DEFAULT_CODES.join("\n"))} className="bg-orange-600/10 dark:bg-orange-600/20 text-orange-600 border border-orange-600/20 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tighter flex items-center gap-1.5 transition-none active:scale-95 shadow-sm shadow-orange-600/5">
              <PlusCircle className="w-3 h-3" />DÙNG LIST MỚI
            </button>
          </div>
          <div className="relative">
            <Textarea placeholder="Mỗi dòng 1 mã code..." className={`font-mono text-[11px] bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[28px] transition-all duration-300 shadow-sm p-6 resize-none ${isExpanded ? 'h-[360px]' : 'h-[160px]'}`} value={codesInput} onChange={(e) => setCodesInput(e.target.value)} />
            {showExpandButton && (
              <button className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-7 px-5 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-full text-[10px] font-black shadow-sm flex items-center gap-1 transition-none" onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? "THU GỌN" : "XEM THÊM"}</button>
            )}
          </div>
        </div>

        <Button className="w-full font-black h-16 text-base bg-orange-600 hover:bg-orange-700 text-white rounded-3xl shadow-xl shadow-orange-600/20 active:scale-[0.98] transition-none uppercase tracking-[0.1em]" onClick={handleRedeem} disabled={isLoading || isValidating}>
          {isLoading ? <><Loader2 className="mr-3 animate-spin h-5 w-5" /> ĐANG XỬ LÝ...</> : "Bắt Đầu Nhập Code"}
        </Button>

        {logs.length > 0 && (
          <div className="space-y-4 pb-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Tổng", stats.total, "text-zinc-500 dark:text-zinc-400"],
                ["Thành công", stats.success, "text-emerald-600 dark:text-emerald-400"],
                ["Thất bại", stats.fail, "text-rose-600 dark:text-rose-400"]
              ].map(([l, v, c], i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center shadow-sm">
                  <p className="text-[9px] font-black uppercase text-zinc-400 mb-1 tracking-tighter">{l}</p>
                  <p className={`text-xl font-black ${c}`}>{v}</p>
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-zinc-950 rounded-[32px] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm dark:shadow-2xl">
              <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between bg-zinc-50/50 dark:bg-transparent">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-orange-600" />
                  <span className="text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-widest">Nhật ký hệ thống</span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-orange-600 dark:text-orange-500 font-mono italic">
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse" />ĐANG CẬP NHẬT
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto p-6 space-y-4 font-mono text-[11px] custom-scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className="flex items-start gap-4 border-b border-zinc-100 dark:border-zinc-900/50 pb-3 last:border-0 transition-none">
                    <span className="text-zinc-400 dark:text-zinc-600 font-bold shrink-0">{log.time}</span>
                    <div className="flex flex-col gap-1 w-full text-zinc-900 dark:text-zinc-100">
                      <div className="flex justify-between w-full font-black">
                        <span className="text-orange-600 dark:text-orange-500">{log.code}</span>
                        <span className={log.status === "Thành công" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>[{log.status.toUpperCase()}]</span>
                      </div>
                      <span className="text-zinc-500 dark:text-zinc-500 leading-tight font-medium">{log.msg}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer mounted={mounted} currentYear={currentYear} currentDomain={currentDomain} />
    </div>
  )
}
