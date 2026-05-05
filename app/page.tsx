"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "sonner"
import { Loader2, Users, ClipboardList, Trash2, PlusCircle, LayoutDashboard, Terminal, Clock, Coffee, Heart, ShoppingBag, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"

const DEFAULT_CODES = [
  "CFLCAMXUC03", "CFLALLSTAR", "MUNGLE3004", "CFLSHOOTFORWIN", "MELOWINNER",
  "CFL500VOTE", "TOIYEUCFL", "1000CFLVOTE", "LIKE500KCFL", "CFLTOP1APP",
  "CFLTOP1GG", "TOP1APPLECFL", "BAOLAOBLABLA", "SMILEGGCOLEN", "VOTAYSMILEGG",
  "SMILEGGWIN", "SMILEGGCFL", "SMILEGG500VIEW", "SMILEGGSMILE", "BAOLAOCFL4",
  "BAOLAOLIVESTR", "BAOLAO10DIEM", "ZOZOMAIDINH", "SIEUNHANZOZO", "ZOZOCFL20",
  "XATHUZOZO", "ZOZOREACH500", "ZOZOVODICH", "TOANDANF11", "2026CFLKHAIHOA",
  "HUYENTHOAICF", "LIKE1KOBCFL", "HANOI1KXCAUVS", "HANOI2KX5AUVS", "HANOI3KXCPMMN",
  "DANANG1KMX92WK", "HCM1KASPO29S", "HCM3KASMCSS", "HCM4KAS99DNS", "APRIL1500FOOL",
  "APRILFOOL1000", "HAPPYAPRILFOOL", "BAOLAOFOOL", "BAOLAOSPY", "BAOLAOMASOI",
  "BAOLAOC4BL", "BAOLAOGRC4", "BAOLAOVUIVE", "CFLGAMEVERSE", "CFLFORYOURDAY",
  "CFLVOTINGTIME", "MEEEELOOO", "VUYPWAMELO", "HELLOMELO", "MELOTOP1CFL",
  "500MELO500", "HCM2KASP929S", "CFLPLAYNOW", "CFLMAIDINH02", "THANTOCCFL01"
];

const ERROR_MESSAGES: Record<string, string> = {
  "Success": "Nhập code thành công!",
  "Active code: campaign status not active": "Sự kiện đã kết thúc hoặc chưa bắt đầu",
  "Active code fail": "Mã quà tặng không chính xác",
  "Active code: other error": "Hệ thống bận, vui lòng thử lại sau",
  "Active code: user code management quantity exhausted": "Bạn đã nhận loại mã này rồi",
  "Account not online or not exist": "Nhân vật không tồn tại hoặc đang offline",
  "Tất cả server đã đạt giới hạn": "Hết lượt nhập code hôm nay, hãy quay lại vào ngày mai!",
  "Tất cả server đang bận": "Máy chủ đang quá tải, vui lòng đợi trong giây lát",
  "Code expired": "Mã này đã hết hạn sử dụng",
  "Code limit reached": "Mã này đã đạt giới hạn lượt nhập",
  "Invalid format": "Định dạng mã không hợp lệ",
  "Server mismatch": "Mã không áp dụng cho máy chủ này"
};

export default function Home() {
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

  const stats = useMemo(() => ({
    total: logs.length,
    success: logs.filter(l => l.status === "Thành công").length,
    fail: logs.filter(l => l.status === "Thất bại" || l.status === "Lỗi").length
  }), [logs])

  useEffect(() => {
    setMounted(true)
    const lineCount = codesInput.split("\n").filter(line => line.trim() !== "").length
    setShowExpandButton(lineCount > 6)
  }, [codesInput])

  const isNumeric = (val: string) => /^\d+$/.test(val);

  const checkRoleApi = async (id: string) => {
    const res = await fetch("/api/check-role", {
      method: "POST",
      body: JSON.stringify({ roleID: id })
    })
    return await res.json()
  }

  const validateRole = async (id: string) => {
    if (!id || id === roleId) return;
    if (!isNumeric(id)) {
      setRoleName("")
      toast.error("ID nhân vật không tồn tại")
      return;
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
      await new Promise(r => setTimeout(r, 1000))
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
    setIsLoading(false)
    toast.success("Xử lý hoàn tất!")
  }

  // --- Sửa logic ở đây để tránh lỗi Prerender ---
  const currentDomain = mounted ? window.location.hostname.toUpperCase() : "AUTONHAPCODECFL.VN";
  const currentYear = mounted ? new Date().getFullYear() : 2026; 

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
      <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-zinc-950 border-b dark:border-zinc-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-black tracking-tighter uppercase italic">CODE<span className="text-orange-600">CFL</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-zinc-200 dark:border-zinc-800 text-orange-600 flex items-center justify-center gap-2 h-9 px-3 transition-none active:scale-95"
              >
                <div className="flex h-4 w-4 items-center justify-center">
                  <Coffee className="h-4 w-4" />
                </div>
                <span className="min-w-[90px] text-left font-bold text-[11px] uppercase tracking-tighter">
                  Ủng hộ Admin
                </span>
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
                <DialogDescription className="text-[11px] font-bold leading-relaxed">
                  Nếu thấy tool hữu ích, hãy mời admin một ly cà phê để duy trì máy chủ và phát triển thêm nhiều tính năng mới nhé!
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center space-y-4 py-4">
                <img src="https://img.vietqr.io/image/VPB-0825966162-compact.png" alt="QR" className="w-44 h-44 rounded-2xl border dark:border-zinc-800 p-1 bg-white" />
                <div className="w-full px-6 space-y-2 font-bold">
                  {[["Ngân hàng", "VP Bank"], ["Chủ TK", "TRAN MINH QUOC"], ["Số TK", "0825966162"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border dark:border-zinc-800 text-[11px]">
                      <span className="text-zinc-400 uppercase tracking-tighter">{k}</span>
                      <span className="uppercase">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <ThemeToggle />
        </div>
      </nav>

      <main className="flex-1 p-4 max-w-2xl mx-auto w-full space-y-6 mt-4">
        <a
          href="https://shopcfl.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-[32px] p-6 border border-zinc-200 dark:border-zinc-800 transition-none active:scale-[0.98] shadow-sm dark:shadow-none"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter flex items-center gap-1">
              <ShoppingBag className="w-3 h-3" /> OFFICIAL SHOP
            </div>
            <ExternalLink className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
          </div>
          <h2 className="text-sm font-black uppercase leading-tight tracking-tight mb-1">
            SÀN GIAO DỊCH - MUA BÁN ACC CROSSFIRE LEGENDS LỚN NHẤT VIỆT NAM
          </h2>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-500 font-bold leading-relaxed">
            Shop Acc Crossfire Legends uy tín hàng đầu Việt Nam. Hệ thống giao dịch nick tự động 24/7. Cam kết bảo mật, an toàn.
          </p>
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
                  <DialogTitle className="text-lg font-black flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-orange-600" /> QUẢN LÝ ID
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nhập ID..."
                      className="h-12 font-bold rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none px-4"
                      value={tempIdInput}
                      onChange={(e) => setTempIdInput(e.target.value)}
                    />
                    <Button
                      className="h-12 w-14 bg-orange-600 rounded-2xl flex-shrink-0 transition-none active:scale-95"
                      onClick={handleAddIdFromModal}
                      disabled={isValidating}
                    >
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
                            <Button
                              size="sm"
                              className="h-8 bg-zinc-900 dark:bg-zinc-800 text-white font-bold text-[10px] rounded-lg px-4 transition-none active:scale-95"
                              onClick={() => { setRoleId(item.id); setRoleName(item.name); setIsModalOpen(false); }}
                            >
                              DÁN
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-zinc-400 transition-none active:text-rose-500"
                              onClick={() => setValidatedIds(prev => prev.filter((_, i) => i !== idx))}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
            <Input
              placeholder="Nhập ID..."
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              onBlur={() => validateRole(roleId)}
              className="font-bold h-14 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl transition-none text-sm px-5 shadow-sm"
            />
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
            <button
              onClick={() => setCodesInput(DEFAULT_CODES.join("\n"))}
              className="bg-orange-600/10 dark:bg-orange-600/20 text-orange-600 border border-orange-600/20 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tighter flex items-center gap-1.5 transition-none active:scale-95 shadow-sm shadow-orange-600/5"
            >
              <PlusCircle className="w-3 h-3" />
              DÙNG LIST MỚI
            </button>
          </div>
          <div className="relative">
            <Textarea
              placeholder="Mỗi dòng 1 mã code..."
              className={`font-mono text-[11px] bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[28px] transition-all duration-300 shadow-sm p-6 resize-none ${isExpanded ? 'h-[360px]' : 'h-[160px]'}`}
              value={codesInput}
              onChange={(e) => setCodesInput(e.target.value)}
            />
            {showExpandButton && (
              <button className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-7 px-5 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-full text-[10px] font-black shadow-sm flex items-center gap-1 transition-none" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "THU GỌN" : "XEM THÊM"}
              </button>
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
                  <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse" />
                  ĐANG CẬP NHẬT
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto p-6 space-y-4 font-mono text-[11px] custom-scrollbar">
                {logs.map((log, i) => (
                  <div key={i} className="flex items-start gap-4 border-b border-zinc-100 dark:border-zinc-900/50 pb-3 last:border-0 transition-none">
                    <span className="text-zinc-400 dark:text-zinc-600 font-bold shrink-0">{log.time}</span>
                    <div className="flex flex-col gap-1 w-full text-zinc-900 dark:text-zinc-100">
                      <div className="flex justify-between w-full font-black">
                        <span className="text-orange-600 dark:text-orange-500">{log.code}</span>
                        <span className={log.status === "Thành công" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                          [{log.status.toUpperCase()}]
                        </span>
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
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              Facebook
            </a>
            <div className="w-[1px] h-3 bg-zinc-300 dark:bg-zinc-700" />
            <a
              href={mounted ? `mailto:contact@${window.location.hostname}` : "#"}
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
    </div>
  )
}
