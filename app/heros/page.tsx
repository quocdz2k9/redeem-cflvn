"use client"
import React, { useState, useMemo } from "react"
import { 
  Search, X, ShieldCheck, 
  Info, Loader2, SearchX 
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Navbar } from "@/components/Navbar"

const HERO_DATABASE = [
  { id: "sicarios", name: "Sicarios", img: "1.png" },
  { id: "subject-alpha", name: "Subject Alpha", img: "3-%20Subject%20Alpha.png" },
  { id: "zihan", name: "Zihan", img: "character-4.jpg" },
  { id: "victoria", name: "Victoria", img: "7-%20Victoria.png" },
  { id: "white-wolf", name: "White Wolf", img: "character-9.jpg" },
  { id: "fox-howl", name: "Fox Howl", img: "character-12.jpg" },
  { id: "guan-xiaoyu", name: "Guan Xiaoyu", img: "character-5.jpg" },
  { id: "mulan", name: "Mulan", img: "character-6.jpg" },
  { id: "ulp-x", name: "ULP-X", img: "character-8.jpg" },
  { id: "jns", name: "JNS", img: "character-10.jpg" },
  { id: "mos", name: "MOS", img: "11-%20Blade.png" },
  { id: "fox-howl-summer", name: "Fox Howl Summer", img: "character-13.jpg" },
  { id: "fox-howl-christmas", name: "Fox Howl Christmas", img: "character-14.jpg" },
  { id: "omoh", name: "OMOH", img: "character-16.jpg" },
  { id: "swat", name: "SWAT", img: "character-17.jpg" },
];

export default function HeroesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedHero, setSelectedHero] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeSkin, setActiveSkin] = useState("1")

  const filteredHeroes = useMemo(() => {
    return HERO_DATABASE.filter(hero => 
      hero.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const fetchHeroDetail = async (id: string) => {
    setLoading(true)
    setActiveSkin("1")
    try {
      const res = await fetch(`/api/heroes/${id}`)
      const data = await res.json()
      if (data.code === 1) setSelectedHero(data)
    } catch (e) {
      console.error("Lỗi kết nối API")
    } finally {
      setLoading(false)
    }
  }

  const getCurrentSkinImg = () => {
    return selectedHero?.otherImgArr?.[activeSkin]?.skinimg || selectedHero?.otherImgArr?.["1"]?.skinimg
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 pb-20">
      <Navbar />

      <main className="max-w-2xl mx-auto p-4 mt-6 space-y-6">
        <div className="px-1 mb-2">
           <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">Khám phá nhân vật</span>
           <h1 className="text-2xl font-black italic uppercase tracking-tighter mt-1">THƯ VIỆN <span className="text-orange-600">HEROES</span></h1>
        </div>

        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-600 w-5 h-5 transition-colors" />
          <Input 
            placeholder="Tìm kiếm tên nhân vật..." 
            className="h-16 pl-14 pr-12 bg-white dark:bg-zinc-900 border-none rounded-[24px] shadow-sm font-bold text-base focus-visible:ring-2 focus-visible:ring-orange-600/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-full transition-all active:scale-90">
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          )}
        </div>

        {filteredHeroes.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center opacity-40">
            <SearchX className="w-12 h-12 mb-4" />
            <p className="font-black uppercase tracking-widest text-[11px]">Không tìm thấy nhân vật</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredHeroes.map((hero) => (
            <div 
              key={hero.id}
              onClick={() => fetchHeroDetail(hero.id)}
              className="group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-2 pb-5 text-center cursor-pointer hover:border-orange-600 hover:shadow-xl hover:shadow-orange-600/5 transition-all active:scale-95 shadow-sm"
            >
              <div className="aspect-[4/5] rounded-[24px] overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-4">
                <img 
                  src={`https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Heros/sub/${hero.img}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={hero.name}
                />
              </div>
              <h3 className="font-black uppercase italic text-[12px] tracking-tighter group-hover:text-orange-600 px-2 line-clamp-1">{hero.name}</h3>
            </div>
          ))}
        </div>
      </main>

      <Dialog open={!!selectedHero} onOpenChange={() => setSelectedHero(null)}>
        <DialogContent className="sm:max-w-[400px] w-[94vw] rounded-[32px] border-none bg-white dark:bg-zinc-950 p-0 overflow-hidden shadow-2xl focus:outline-none">
          <DialogTitle className="sr-only">{selectedHero?.title || "Chi tiết nhân vật"}</DialogTitle>
          
          {selectedHero && (
            <div className="relative flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
              
              <div className="relative h-[280px] w-full shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                <picture className="absolute inset-0 w-full h-full">
                  <source media="(max-width: 640px)" srcSet="https://cdn-mainsite-aka.vnggames.com/products/cfl/mainsite/dist/assets/libraryMainsite-t-popup/images/bg-mb.png" />
                  <img 
                    src="https://cdn-mainsite-aka.vnggames.com/products/cfl/mainsite/dist/assets/libraryMainsite-t-popup/images/bg.png" 
                    className="w-full h-full object-cover opacity-60 dark:opacity-40" 
                    alt="Background" 
                  />
                </picture>

                <div className="absolute inset-0 flex items-end justify-center">
                   <img 
                    src={getCurrentSkinImg()} 
                    className="h-[95%] w-auto object-contain z-10 drop-shadow-[0_10px_25px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-10 duration-500 transition-all"
                    alt="Hero Character"
                  />
                </div>

                {/* FIX: Đẩy Badge lên cao một chút (bottom-10) để không bị dính vào phần Info bên dưới */}
                <div className="absolute bottom-10 left-6 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-xl border border-white/10 shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    {selectedHero.otherImgArr?.title || "Vĩnh viễn"}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6 relative bg-white dark:bg-zinc-950 rounded-t-[32px] -mt-6 z-30 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                <div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white leading-none">
                    {selectedHero.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-0.5 w-8 bg-orange-600 rounded-full" />
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em]">CFL Hero Profile</span>
                  </div>
                </div>

                <div className="space-y-3">
                   <div className="text-[9px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest px-1 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 bg-orange-600 rounded-full" /> Danh sách ngoại trang
                   </div>
                   <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                      {["1", "2", "3", "4", "5", "6"].map((key) => {
                        const skin = selectedHero.otherImgArr?.[key];
                        if (!skin || !skin.skinicon) return null;
                        return (
                          <button
                            key={key}
                            onClick={() => setActiveSkin(key)}
                            className={`relative shrink-0 w-14 h-14 rounded-2xl border-2 transition-all p-1 ${
                              activeSkin === key 
                                ? "border-orange-600 bg-orange-50 dark:bg-orange-600/10 scale-105 shadow-lg shadow-orange-600/10" 
                                : "border-zinc-100 dark:border-zinc-800 opacity-40 grayscale hover:grayscale-0 hover:opacity-100"
                            }`}
                          >
                            <img src={skin.skinicon} className="w-full h-full object-cover rounded-xl" alt={`Skin ${key}`} />
                          </button>
                        );
                      })}
                   </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-[28px] p-5 border border-zinc-100 dark:border-zinc-800/50 relative overflow-hidden group">
                  <Info className="absolute -right-2 -top-2 w-12 h-12 text-orange-600/5" />
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-600">Tiểu sử nhân vật</span>
                  </div>
                  <div className="text-[11px] font-bold leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {selectedHero.description}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedHero(null)}
                className="absolute top-4 right-4 w-9 h-9 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-xl flex items-center justify-center shadow-lg border dark:border-zinc-800 z-50 hover:text-orange-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* LOADING OVERLAY - Đã cập nhật text */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-[32px] shadow-2xl flex flex-col items-center gap-3 border dark:border-zinc-800">
            <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            <span className="text-[9px] font-black uppercase tracking-widest text-orange-600">Đang tải hồ sơ...</span>
          </div>
        </div>
      )}
    </div>
  )
}

