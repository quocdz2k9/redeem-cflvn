"use client"

import React, { useState, useMemo } from "react"
import { Navbar } from "@/components/Navbar"
import { 
  Search, X, Map as MapIcon, 
  Layers, ChevronRight, Maximize2, 
  Info, SearchX, Gamepad2 
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

const MAP_DATABASE = [
  {
    id: 1,
    name: "Tàu Chở Hàng",
    sub: "Đấu đội, Luyện với máy",
    description: "Tàu Chở Hàng: Tiếng ầm ầm của máy bay trực thăng tuần tra cùng những con sóng không ngừng đập vào container, báo hiệu cuộc chiến ở đây đang dần trở nên khốc liệt!",
    images: [
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%201/1.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%201/2.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%201/3.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%201/4.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%201/5.png"
    ]
  },
  {
    id: 2,
    name: "TD Đấu Hẻm",
    sub: "Đấu đơn, Đấu đội, Luyện với máy",
    description: "TD Đấu Hẻm là bản đồ nhỏ, kịch tính, tập trung vào giao tranh tầm gần nơi kỹ năng phản xạ nhanh tỏa sáng.",
    images: [
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%202/1.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%202/2.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%202/3.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%202/4.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%202/5.png"
    ]
  },
  {
    id: 3,
    name: "Ngã Tư Tử Thần",
    sub: "Đấu đội",
    description: "Ngã Tư Tử Thần là bản đồ thiên về giao tranh trực diện, thích hợp cho cả đấu súng tầm xa lẫn tầm gần.",
    images: [
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%203/1.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%203/2.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%203/3.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%203/4.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%203/5.png"
    ]
  },
  {
    id: 4,
    name: "Đảo Dừa Thanh Mát",
    sub: "Đấu đội, Luyện với máy",
    description: "Đảo Dừa Thanh Mát là bản đồ có thiết kế tươi sáng, gần gũi, phù hợp cho các trận đấu nhanh.",
    images: [
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%204/1.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%204/2.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%204/3.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%204/4.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%204/5.png"
    ]
  },
  {
    id: 5,
    name: "Bão Sa Mạc",
    sub: "Đấu đơn, Đặt Bom",
    description: "Bão Sa Mạc: Khói lửa chiến trường và tiếng động cơ chiến đấu tạo nên không khí căng thẳng tại thị trấn sa mạc.",
    images: [
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%205/1.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%205/2.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%205/3.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%205/Sa%20ma%CC%A3c%204.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%205/5.png"
    ]
  },
  {
    id: 6,
    name: "Trạm Phát Sóng",
    sub: "Đấu đơn, Đặt Bom",
    description: "Trạm Phát Sóng: Thành phố từng rực rỡ ánh đèn giờ đây bị bao trùm bởi khói lửa, với vết đạn in hằn trên tường.",
    images: [
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%206/1.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%206/2.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%206/Tra%CC%A3m%20pha%CC%81t%20so%CC%81ng%203.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%206/4.png",
      "https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Map/Map%206/5.png"
    ]
  }
];

export default function MapsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMap, setSelectedMap] = useState<any>(null)
  const [activeImageIdx, setActiveImageIdx] = useState(0)

  const filteredMaps = useMemo(() => {
    return MAP_DATABASE.filter(map =>
      map.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      map.sub.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const openMap = (map: any) => {
    setSelectedMap(map)
    setActiveImageIdx(0)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 pb-20">
      <Navbar />
      
      <main className="max-w-4xl mx-auto p-4 mt-6 space-y-8">
        {/* Header Section */}
        <div className="px-1">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.3em]">Hệ thống chiến trường</span>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter mt-1 leading-none">
            THƯ VIỆN <span className="text-orange-600">MAPS</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-2xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-600 w-5 h-5 transition-colors" />
          <Input
            placeholder="Tìm tên bản đồ hoặc chế độ..."
            className="h-16 pl-14 pr-12 bg-white dark:bg-zinc-900 border-none rounded-[24px] shadow-sm font-bold text-base focus-visible:ring-2 focus-visible:ring-orange-600/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-full active:scale-90 transition-all">
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          )}
        </div>

        {/* Grid List */}
        {filteredMaps.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center opacity-40">
            <SearchX className="w-12 h-12 mb-4" />
            <p className="font-black uppercase tracking-widest text-[11px]">Không tìm thấy bản đồ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMaps.map((map) => (
              <div 
                key={map.id}
                onClick={() => openMap(map)}
                className="group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-3 flex gap-4 cursor-pointer hover:border-orange-600 hover:shadow-xl hover:shadow-orange-600/5 transition-all active:scale-[0.98] shadow-sm relative overflow-hidden"
              >
                <div className="w-32 h-32 shrink-0 rounded-[24px] overflow-hidden bg-zinc-100 dark:bg-zinc-900 border dark:border-zinc-800">
                  <img 
                    src={map.images[0]} 
                    alt={map.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="flex flex-col justify-center py-2 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-orange-600 tracking-tighter">#{String(map.id).padStart(2, '0')}</span>
                    <div className="h-[1px] w-4 bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                  <h3 className="font-black uppercase italic text-lg tracking-tighter group-hover:text-orange-600 transition-colors line-clamp-1">{map.name}</h3>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide line-clamp-1 mt-1">{map.sub}</p>
                  <div className="flex items-center gap-1 mt-3 text-orange-600 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                    <span className="text-[9px] font-black uppercase">Xem chi tiết</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Map Gallery Dialog */}
      <Dialog open={!!selectedMap} onOpenChange={() => setSelectedMap(null)}>
        <DialogContent className="sm:max-w-[700px] w-[95vw] rounded-[32px] border-none bg-white dark:bg-zinc-950 p-0 overflow-hidden shadow-2xl focus:outline-none">
          <DialogTitle className="sr-only">{selectedMap?.name}</DialogTitle>
          
          {selectedMap && (
            <div className="flex flex-col">
              {/* Main Image View */}
              <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                <img 
                  src={selectedMap.images[activeImageIdx]} 
                  className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500"
                  alt="Map Preview"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedMap(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-md hover:bg-black/40 text-white rounded-2xl flex items-center justify-center transition-all z-50"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Map Info Overlay */}
                <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="px-2 py-0.5 bg-orange-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Map Profile</div>
                    <span className="text-[9px] font-bold opacity-60 uppercase tracking-widest italic">{selectedMap.sub}</span>
                  </div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">{selectedMap.name}</h2>
                </div>
              </div>

              {/* Thumbnails & Content */}
              <div className="p-6 space-y-6">
                {/* Mini Gallery */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {selectedMap.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative shrink-0 w-20 aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                        activeImageIdx === idx 
                        ? "border-orange-600 scale-105 shadow-lg shadow-orange-600/20" 
                        : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt="thumb" />
                    </button>
                  ))}
                </div>

                {/* Description Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-3">
                    <div className="flex items-center gap-2 text-orange-600">
                      <Info className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Thông tin chiến trường</span>
                    </div>
                    <p className="text-[12px] font-bold text-zinc-500 dark:text-zinc-400 leading-relaxed italic border-l-2 border-orange-600/20 pl-4">
                      "{selectedMap.description}"
                    </p>
                  </div>
                  
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 border dark:border-zinc-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Chế độ hỗ trợ</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMap.sub.split(", ").map((mode: string) => (
                        <span key={mode} className="px-2 py-1 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-lg text-[9px] font-bold text-zinc-600 dark:text-zinc-300">
                          {mode}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
