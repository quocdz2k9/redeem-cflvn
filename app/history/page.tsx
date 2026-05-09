"use client"

import React, { useState, useEffect, useMemo } from "react"
import { 
  History, 
  Search, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Download
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { toast } from "sonner"

// Định nghĩa kiểu dữ liệu cho log
interface LogEntry {
  code: string
  status: string
  msg: string
  time: string
  roleId: string
  roleName: string
  date: string // Thêm ngày để dễ quản lý
}

export default function HistoryPage() {
  const [mounted, setMounted] = useState(false)
  const [history, setHistory] = useState<LogEntry[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Load dữ liệu từ localStorage
  useEffect(() => {
    setMounted(true)
    const savedLogs = localStorage.getItem("cfl_redeem_history")
    if (savedLogs) {
      try {
        setHistory(JSON.parse(savedLogs))
      } catch (e) {
        console.error("Lỗi parse history")
      }
    }
  }, [])

  // Xử lý bộ lọc và tìm kiếm
  const filteredHistory = useMemo(() => {
    return history.filter(item => {
      const matchesSearch = 
        item.code.toLowerCase().includes(search.toLowerCase()) || 
        item.roleId.includes(search) || 
        item.roleName.toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "success" && item.status === "Thành công") ||
        (statusFilter === "fail" && (item.status === "Thất bại" || item.status === "Lỗi"))

      return matchesSearch && matchesStatus
    })
  }, [history, search, statusFilter])

  // Phân trang
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const currentData = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const clearHistory = () => {
    if (confirm("Bạn có chắc chắn muốn xoá toàn bộ lịch sử?")) {
      localStorage.removeItem("cfl_redeem_history")
      setHistory([])
      toast.success("Đã xoá lịch sử")
    }
  }

  // Lưu ý: Để đồng bộ, bạn cần vào app/page.tsx, đoạn handleRedeem, 
  // sau khi setLogs xong thì lưu thêm vào localStorage: "cfl_redeem_history"

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100">
      <Navbar />
      
      <main className="flex-1 p-4 max-w-4xl mx-auto w-full space-y-6 mt-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-6 rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center">
              <History className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter">Lịch Sử Nhập Code</h1>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tổng cộng: {filteredHistory.length} bản ghi</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-xl font-bold text-[10px] h-10 border-zinc-200 dark:border-zinc-800"
              onClick={() => {
                const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `cfl-history-${new Date().toLocaleDateString()}.json`;
                a.click();
              }}
            >
              <Download className="w-3.5 h-3.5 mr-2" /> XUẤT FILE
            </Button>
           <Button
  variant="destructive"
  size="default" // Đổi từ sm sang default để có không gian chứa text tốt hơn
  className="rounded-xl font-black uppercase italic tracking-tighter text-[11px] h-10 px-4 bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/20 active:scale-95 transition-all border-none"
  onClick={clearHistory}
>
  <Trash2 className="w-4 h-4 mr-2" /> 
  <span>XOÁ HẾT</span>
</Button>

          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input 
              placeholder="Tìm kiếm mã code, ID hoặc tên nhân vật..." 
              className="pl-11 h-12 rounded-2xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 font-medium"
              value={search}
              onChange={(e) => {setSearch(e.target.value); setCurrentPage(1)}}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="w-full h-12 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-4 text-xs font-bold outline-none focus:ring-2 ring-orange-500/20"
              value={statusFilter}
              onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1)}}
            >
              <option value="all">TẤT CẢ TRẠNG THÁI</option>
              <option value="success">THÀNH CÔNG</option>
              <option value="fail">THẤT BẠI / LỖI</option>
            </select>
          </div>
        </div>

        {/* Table/List */}
        <div className="bg-white dark:bg-zinc-950 rounded-[32px] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-900">
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Thời gian</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Nhân vật</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Mã Giftcode</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {currentData.length > 0 ? (
                  currentData.map((log, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black font-mono">{log.time}</span>
                          <span className="text-[9px] text-zinc-400 font-bold">{log.date || 'Gần đây'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-orange-600 italic">{log.roleName}</span>
                          <span className="text-[10px] text-zinc-400 font-bold">ID: {log.roleId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md text-[11px] font-black text-zinc-600 dark:text-zinc-300">
                          {log.code}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${
                            log.status === "Thành công" ? "text-emerald-600" : "text-rose-600"
                          }`}>
                            {log.status === "Thành công" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {log.status}
                          </div>
                          <span className="text-[9px] text-zinc-500 font-medium truncate max-w-[150px]">{log.msg}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <Clock className="w-12 h-12 mb-2" />
                        <p className="text-sm font-black uppercase">Không tìm thấy dữ liệu</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/20 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
              <p className="text-[10px] font-bold text-zinc-400 uppercase">
                Trang {currentPage} / {totalPages}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-lg"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer 
        mounted={mounted} 
        currentYear={new Date().getFullYear()} 
        currentDomain={typeof window !== 'undefined' ? window.location.hostname.toUpperCase() : ""} 
      />
    </div>
  )
}

