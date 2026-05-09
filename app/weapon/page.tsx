"use client"
import React, { useState, useMemo, useEffect } from "react"
import {
  Search, X, ShieldCheck,
  Info, Loader2, SearchX, SwatchBook,
  Zap, Crosshair, RefreshCcw, Move, Target
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Navbar } from "@/components/Navbar"

const WEAPON_DATABASE = [
  // Cận chiến (weapon-canchien)
  { id: "kukri-beast-noble-gold", name: "Kukri-Beast-Noble Gold", img: "weapon-canchien/weapon-1.png", cate: "can-chien" },
  { id: "kukri-beast", name: "Kukri-Beast", img: "weapon-canchien/weapon-2.png", cate: "can-chien" },
  { id: "b-c-axe-iron-beast", name: "B.C Axe-Iron Beast", img: "weapon-canchien/weapon-3.png", cate: "can-chien" },
  { id: "keris-born-beast", name: "Keris-Born Beast", img: "weapon-canchien/weapon-4.png", cate: "can-chien" },
  { id: "laser-dagger-born-beast", name: "Laser Dagger-Born Beast", img: "weapon-canchien/weapon-5.png", cate: "can-chien" },
  { id: "b-c-axe-transformer-beast", name: "B.C Axe-Transformer Beast", img: "weapon-canchien/weapon-6.png", cate: "can-chien" },
  { id: "shovel-born-beast", name: "Shovel-Born Beast", img: "weapon-canchien/weapon-7.png", cate: "can-chien" },
  { id: "kukri-gaming-glory", name: "Kukri-Gaming Glory", img: "weapon-canchien/weapon-8.png", cate: "can-chien" },
  { id: "kukri-mechanical-era", name: "Kukri-Mechanical Era", img: "weapon-canchien/weapon-9.png", cate: "can-chien" },
  { id: "jungle-knife-predator", name: "Jungle Knife-Predator", img: "weapon-canchien/weapon-10.png", cate: "can-chien" },
  { id: "nunchaku-angel", name: "Nunchaku-Angel", img: "weapon-canchien/weapon-11.png", cate: "can-chien" },
  { id: "greatsword-angel", name: "Greatsword-Angel", img: "weapon-canchien/weapon-12.png", cate: "can-chien" },

  // SMG (weapon-smg)
  { id: "thompson-infernal-dragon", name: "Thompson-Infernal Dragon", img: "weapon-smg/weapon-1.png", cate: "smg" },
  { id: "mk5-iron-shark", name: "MK5-Iron Shark", img: "weapon-smg/weapon-2.png", cate: "smg" },
  { id: "czs2-heartbeat-dimension", name: "CZS2-Heartbeat Dimension", img: "weapon-smg/weapon-3.png", cate: "smg" },
  { id: "qcw05-predator", name: "QCW05-Predator", img: "weapon-smg/weapon-4.png", cate: "smg" },
  { id: "steyr-tmp-demon", name: "Steyr TMP-Demon", img: "weapon-smg/weapon-5.png", cate: "smg" },
  { id: "m12s-iron-beast", name: "M12S-Iron Beast", img: "weapon-smg/weapon-6.png", cate: "smg" },
  { id: "qcw05-future-soldier", name: "QCW05-Future Soldier", img: "weapon-smg/weapon-7.png", cate: "smg" },
  { id: "dual-uzi-gold", name: "Dual UZI-Gold", img: "weapon-smg/weapon-8.png", cate: "smg" },
  { id: "thompson-gilt", name: "Thompson-Gilt", img: "weapon-smg/weapon-9.png", cate: "smg" },
  { id: "steyr-tmp-eternal-dragon", name: "Steyr TMP-Eternal Dragon", img: "weapon-smg/weapon-10.png", cate: "smg" },
  { id: "thompson-blue-pottery", name: "Thompson-Blue Pottery", img: "weapon-smg/weapon-11.png", cate: "smg" },
  { id: "steyr-tmp-ss", name: "Steyr TMP-SS", img: "weapon-smg/weapon-12.png", cate: "smg" },
  { id: "steyr-tmp-valentine", name: "Steyr TMP-Valentine", img: "weapon-smg/weapon-13.png", cate: "smg" },
  { id: "mp5-aries", name: "MP5-Aries", img: "weapon-smg/weapon-14.png", cate: "smg" },
  { id: "mp5", name: "MP5", img: "weapon-smg/weapon-15.png", cate: "smg" },

  // Grenade (weapon-nade)
  { id: "grenade-born-beast", name: "Grenade-Born Beast", img: "weapon-nade/weapon-3.png", cate: "nem" },
  { id: "grenade-mechanical-era", name: "Grenade-Mechanical Era", img: "weapon-nade/weapon-4.png", cate: "nem" },
  { id: "flashbang-mechanical-era", name: "Flashbang-Mechanical Era", img: "weapon-nade/weapon-5.png", cate: "nem" },
  { id: "flashbang-predator", name: "Flashbang-Predator", img: "weapon-nade/weapon-6.png", cate: "nem" },
  { id: "smoke-predator", name: "Smoke-Predator", img: "weapon-nade/weapon-7.png", cate: "nem" },
  { id: "flashbang-gaming-glory", name: "Flashbang-Gaming Glory", img: "weapon-nade/weapon-8.png", cate: "nem" },
  { id: "smoke-gaming-glory", name: "Smoke-Gaming Glory", img: "weapon-nade/weapon-9.png", cate: "nem" },
  { id: "flashbang-armoured-beast", name: "Flashbang-Armoured Beast", img: "weapon-nade/weapon-10.png", cate: "nem" },
  { id: "smoke-armoured-beast", name: "Smoke-Armoured Beast", img: "weapon-nade/weapon-11.png", cate: "nem" },
  { id: "grenade-armoured-beast", name: "Grenade-Armoured Beast", img: "weapon-nade/weapon-12.png", cate: "nem" },
  { id: "smoke-fury-beast", name: "Smoke-Fury Beast", img: "weapon-nade/weapon-13.png", cate: "nem" },
  { id: "flashbang-fury-beast", name: "Flashbang-Fury Beast", img: "weapon-nade/weapon-14.png", cate: "nem" },
  { id: "grenade-mini-140", name: "Grenade-Mini", img: "weapon-nade/weapon-17.png", cate: "nem" },
  { id: "grenade-ai", name: "Grenade-AI", img: "weapon-nade/weapon-18.png", cate: "nem" },
  { id: "grenade-ice-town", name: "Grenade-Ice Town", img: "weapon-nade/weapon-19.png", cate: "nem" },
  { id: "smoke-ice-town", name: "Smoke-Ice Town", img: "weapon-nade/weapon-20.png", cate: "nem" },
  { id: "grenade-emerald", name: "Grenade-Emerald", img: "weapon-nade/weapon-22.png", cate: "nem" },

  // Súng ngắm (weapon-sungngam)
  { id: "barrett-m82a1-born-beast-noble-gold", name: "Barrett M82A1-Born Beast-Noble Gold", img: "weapon-sungngam/weapon-1.png", cate: "sung-ngam" },
  { id: "barrett-m82a1-born-beast", name: "Barrett M82A1-Born Beast", img: "weapon-sungngam/weapon-2.png", cate: "sung-ngam" },
  { id: "barrett-m82a1-iron-shark", name: "Barrett M82A1-Iron Shark", img: "weapon-sungngam/weapon-3.png", cate: "sung-ngam" },
  { id: "kar-98k-blood-moon", name: "Kar 98K-Blood Moon", img: "weapon-sungngam/weapon-4.png", cate: "sung-ngam" },
  { id: "awm-infernal-dragon", name: "AWM-Infernal Dragon", img: "weapon-sungngam/weapon-5.png", cate: "sung-ngam" },
  { id: "qbu09-el-dorado", name: "QBU09-El Dorado", img: "weapon-sungngam/weapon-6.png", cate: "sung-ngam" },
  { id: "tac-angel", name: "TAC-Angel", img: "weapon-sungngam/weapon-7.png", cate: "sung-ngam" },
  { id: "qbu09-armoured-beast", name: "QBU09-Armoured Beast", img: "weapon-sungngam/weapon-8.png", cate: "sung-ngam" },
  { id: "awm-gaming-glory", name: "AWM-Gaming Glory", img: "weapon-sungngam/weapon-9.png", cate: "sung-ngam" },
  { id: "barrett-m82a1-gun-girl", name: "Barrett M82A1-Gun Girl", img: "weapon-sungngam/weapon-10.png", cate: "sung-ngam" },
  { id: "awm-ranger", name: "AWM-Ranger", img: "weapon-sungngam/weapon-11.png", cate: "sung-ngam" },
  { id: "barrett-m82a1-iron-beast", name: "Barrett M82A1-Iron Beast", img: "weapon-sungngam/weapon-12.png", cate: "sung-ngam" },
  { id: "awm-gilt", name: "AWM-Gilt", img: "weapon-sungngam/weapon-13.png", cate: "sung-ngam" },
  { id: "m200-ultimate-gold", name: "M200-Ultimate Gold", img: "weapon-sungngam/weapon-14.png", cate: "sung-ngam" },

  // Shotgun (weapon-shotgun)
  { id: "aa12-gaming-glory", name: "AA12-Gaming Glory", img: "weapon-shotgun/weapon-1.png", cate: "shotgun" },
  { id: "dual-desperado-armoured-beast", name: "Dual Desperado-Armoured Beast", img: "weapon-shotgun/weapon-2.png", cate: "shotgun" },
  { id: "armsel-striker-el-dorado", name: "Armsel Striker-El Dorado", img: "weapon-shotgun/weapon-3.png", cate: "shotgun" },
  { id: "m1216-blood-moon", name: "M1216-Blood Moon", img: "weapon-shotgun/weapon-4.png", cate: "shotgun" },
  { id: "aa12-iron-beast", name: "AA12-Iron Beast", img: "weapon-shotgun/weapon-5.png", cate: "shotgun" },
  { id: "ksg-born-beast", name: "KSG-Born Beast", img: "weapon-shotgun/weapon-6.png", cate: "shotgun" },
  { id: "spas-12-blue-honor", name: "SPAS-12-Blue Honor", img: "weapon-shotgun/weapon-7.png", cate: "shotgun" },
  { id: "armsel-striker-phoenix-gold", name: "Armsel Striker-Phoenix-Gold", img: "weapon-shotgun/weapon-8.png", cate: "shotgun" },
  { id: "jack-hammer-gold", name: "Jack Hammer-Gold", img: "weapon-shotgun/weapon-9.png", cate: "shotgun" },
  { id: "aa12-buster", name: "AA12-Buster", img: "weapon-shotgun/weapon-10.png", cate: "shotgun" },
  { id: "687-eell-diamond-pigeon-oboe", name: "687 EELL Diamond Pigeon-Oboe", img: "weapon-shotgun/weapon-11.png", cate: "shotgun" },
  { id: "xm1014-royal-fire", name: "XM1014-Royal Fire", img: "weapon-shotgun/weapon-12.png", cate: "shotgun" },
  { id: "serbu-super-shorty-knight-blue", name: "Serbu Super Shorty-Knight Blue", img: "weapon-shotgun/weapon-13.png", cate: "shotgun" },
  { id: "jack-hammer-mutant-killer", name: "Jack Hammer-Mutant Killer", img: "weapon-shotgun/weapon-14.png", cate: "shotgun" },
  { id: "m37-stakeout-slug-ghetto", name: "M37 Stakeout-Slug Ghetto", img: "weapon-shotgun/weapon-15.png", cate: "shotgun" },
  { id: "jack-hammer-capricorn", name: "Jack Hammer-Capricorn", img: "weapon-shotgun/weapon-16.png", cate: "shotgun" },
  { id: "hawk-type-92-jupiter", name: "Hawk Type 92-Jupiter", img: "weapon-shotgun/weapon-17.png", cate: "shotgun" },
  { id: "spas-12", name: "SPAS-12", img: "weapon-shotgun/weapon-18.png", cate: "shotgun" },
  { id: "xm1014", name: "XM1014", img: "weapon-shotgun/weapon-19.png", cate: "shotgun" },
  { id: "jack-hammer", name: "Jack Hammer", img: "weapon-shotgun/weapon-20.png", cate: "shotgun" },

  // Súng máy (weapon-sungmay)
  { id: "gatling-gun-snake", name: "Gatling Gun-Snake", img: "weapon-sungmay/weapon-1.png", cate: "sung-may" },
  { id: "rpk-inferno-dragon", name: "RPK-Inferno Dragon", img: "weapon-sungmay/weapon-2.png", cate: "sung-may" },
  { id: "dual-gatling-gun-bastion", name: "Dual Gatling Gun-Bastion", img: "weapon-sungmay/weapon-3.png", cate: "sung-may" },
  { id: "lewis-gun-blood-moon", name: "Lewis Gun-Blood Moon", img: "weapon-sungmay/weapon-5.png", cate: "sung-may" },
  { id: "mg3-gold", name: "MG3-Gold", img: "weapon-sungmay/weapon-6.png", cate: "sung-may" },
  { id: "lewis-gun-star-ark-alpha", name: "Lewis Gun-Star Ark-Alpha", img: "weapon-sungmay/weapon-7.png", cate: "sung-may" },
  { id: "gatling-gun-volcano", name: "Gatling Gun-Volcano", img: "weapon-sungmay/weapon-8.png", cate: "sung-may" },
  { id: "mg3-wukong", name: "MG3-Wukong", img: "weapon-sungmay/weapon-9.png", cate: "sung-may" },
  { id: "gatlin-gun-blue-pottery", name: "Gatlin Gun-Blue Pottery", img: "weapon-sungmay/weapon-10.png", cate: "sung-may" },
  { id: "rpk-sagittarius", name: "RPK-Sagittarius", img: "weapon-sungmay/weapon-11.png", cate: "sung-may" },
  { id: "gatling-gun-ultimate-silver", name: "Gatling Gun-Ultimate Silver", img: "weapon-sungmay/weapon-12.png", cate: "sung-may" },
  { id: "m60-a", name: "M60-A", img: "weapon-sungmay/weapon-13.png", cate: "sung-may" },

  // Súng trường (weapon-sungtruong)
  { id: "m4a1-iron-beast-noble-gold", name: "M4A1-Iron Beast-Noble Gold", img: "weapon-sungtruong/weapon-1.png", cate: "sung-truong" },
  { id: "ak47-beast", name: "AK47-Beast", img: "weapon-sungtruong/weapon-2.png", cate: "sung-truong" },
  { id: "m4a1-born-beast", name: "M4A1-Born Beast", img: "weapon-sungtruong/weapon-3.png", cate: "sung-truong" },
  { id: "m4a1-iron-beast", name: "M4A1-Iron Beast", img: "weapon-sungtruong/weapon-4.png", cate: "sung-truong" },
  { id: "ak47-spring-alpha", name: "AK47-Spring-Alpha", img: "weapon-sungtruong/weapon-5.png", cate: "sung-truong" },
  { id: "scar-light-n22", name: "SCAR Light-N22", img: "weapon-sungtruong/weapon-6.png", cate: "sung-truong" },
  { id: "qbz03-jewelry", name: "QBZ03-Jewelry", img: "weapon-sungtruong/weapon-7.png", cate: "sung-truong" },
  { id: "9a91-ranger", name: "9A91-Ranger", img: "weapon-sungtruong/weapon-8.png", cate: "sung-truong" },
  { id: "ak47-chameleon", name: "AK47-Chameleon", img: "weapon-sungtruong/weapon-9.png", cate: "sung-truong" },
  { id: "ak47-ranger", name: "AK47-Ranger", img: "weapon-sungtruong/weapon-10.png", cate: "sung-truong" }
];

const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "sung-truong", label: "Súng Trường" },
  { id: "sung-may", label: "Súng Máy" },
  { id: "shotgun", label: "Shotgun" },
  { id: "nem", label: "Ném" },
  { id: "can-chien", label: "Cận Chiến" },
  { id: "smg", label: "SMG" },
  { id: "sung-ngam", label: "Súng Ngắm" },
  { id: "vk-phu", label: "VK Phụ" }
];

export default function WeaponsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWeapon, setSelectedWeapon] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"stats" | "skins">("stats")
  const [currentCate, setCurrentCate] = useState("all")

  const filteredWeapons = useMemo(() => {
    return WEAPON_DATABASE.filter(w => {
      const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCate = currentCate === "all" || w.cate === currentCate;
      return matchesSearch && matchesCate;
    })
  }, [searchQuery, currentCate])

  const fetchWeaponDetail = async (id: string) => {
    setLoading(true)
    setActiveTab("stats")
    try {
      const res = await fetch(`/api/weapons/${id}`)
      const data = await res.json()
      if (data.title) setSelectedWeapon(data)
    } catch (e) {
      console.error("Lỗi API")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 pb-20">
      <Navbar />

      <main className="max-w-2xl mx-auto p-4 mt-6 space-y-6">
        <div className="px-1 mb-2">
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">Trang bị vũ khí</span>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter mt-1">KHO <span className="text-orange-600">WEAPONS</span></h1>
        </div>

        {/* SEARCH BOX */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-600 w-5 h-5 transition-colors" />
          <Input
            placeholder="Tìm kiếm tên vũ khí..."
            className="h-16 pl-14 pr-12 bg-white dark:bg-zinc-900 border-none rounded-[24px] shadow-sm font-bold text-base focus-visible:ring-2 focus-visible:ring-orange-600/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-5 top-1/2 -translate-y-1/2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-full">
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          )}
        </div>

        {/* CATEGORY TABS */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCurrentCate(cat.id)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-tighter transition-all active:scale-95 shadow-sm border ${
                currentCate === cat.id 
                ? "bg-orange-600 text-white border-orange-600 shadow-orange-600/20" 
                : "bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* WEAPON GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredWeapons.length > 0 ? filteredWeapons.map((weapon) => (
            <div
              key={weapon.id}
              onClick={() => fetchWeaponDetail(weapon.id)}
              className="group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-2 pb-5 text-center cursor-pointer hover:border-orange-600 transition-all active:scale-95 shadow-sm"
            >
              <div className="aspect-square rounded-[24px] overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-4 flex items-center justify-center p-4">
                <img
                  src={`https://cdn-mainsite-aka.vnggames.com/upload/cfl/source/Weapon/sub-thumbnail/${weapon.img}`}
                  className="w-full h-auto object-contain group-hover:scale-110 transition-transform duration-700"
                  alt={weapon.name}
                />
              </div>
              <h3 className="font-black uppercase italic text-[11px] tracking-tighter group-hover:text-orange-600 px-2 line-clamp-1">{weapon.name}</h3>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center opacity-40">
              <SearchX className="w-12 h-12 mx-auto mb-4" />
              <p className="text-xs font-black uppercase tracking-widest">Không tìm thấy vũ khí nào</p>
            </div>
          )}
        </div>
      </main>

      {/* DETAIL DIALOG */}
      <Dialog open={!!selectedWeapon} onOpenChange={() => setSelectedWeapon(null)}>
        <DialogContent className="sm:max-w-[420px] w-[94vw] rounded-[32px] border-none bg-white dark:bg-zinc-950 p-0 overflow-hidden shadow-2xl">
          <DialogTitle className="sr-only">{selectedWeapon?.title}</DialogTitle>

          {selectedWeapon && (
            <div className="relative flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar">
              {/* HEADER IMAGE */}
              <div className="relative h-[240px] w-full shrink-0 bg-zinc-100 dark:bg-zinc-900">
                <img
                  src="https://cdn-mainsite-aka.vnggames.com/products/cfl/mainsite/dist/assets/libraryMainsite-t-popup/images/bg-weapon.png"
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                  alt="bg"
                />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <img
                    src={selectedWeapon.otherImgArr?.subImg || selectedWeapon.otherImgArr?.["1"]?.skinimg}
                    className="max-h-full w-auto object-contain z-10 drop-shadow-2xl animate-in zoom-in-75 duration-500"
                    alt="weapon"
                  />
                </div>
                <div className="absolute bottom-10 left-6 z-20 flex items-center gap-2 bg-orange-600 text-white px-3 py-1.5 rounded-xl shadow-lg shadow-orange-600/20">
                  <span className="text-[10px] font-black uppercase italic tracking-widest">{selectedWeapon.cateTitle}</span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6 space-y-6 bg-white dark:bg-zinc-950 rounded-t-[32px] -mt-6 z-30">
                <div>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white">{selectedWeapon.title}</h2>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => setActiveTab("stats")}
                      className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === "stats" ? "border-orange-600 text-orange-600" : "border-transparent text-zinc-400"}`}
                    >
                      Chỉ số
                    </button>
                    <button
                      onClick={() => setActiveTab("skins")}
                      className={`text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${activeTab === "skins" ? "border-orange-600 text-orange-600" : "border-transparent text-zinc-400"}`}
                    >
                      Ngoại trang
                    </button>
                  </div>
                </div>

                {activeTab === "stats" ? (
                  <div className="grid grid-cols-1 gap-4">
                    <StatBar label="Sát thương" value={selectedWeapon.startsArr?.damage} icon={<Zap />} />
                    <StatBar label="Độ nhẹ" value={selectedWeapon.startsArr?.lightness} icon={<Move />} />
                    {selectedWeapon.cateCode === "can-chien" ? (
                      <StatBar label="Phạm vi" value={selectedWeapon.startsArr?.scope} icon={<Target />} />
                    ) : (
                      <>
                        <StatBar label="Chính xác" value={selectedWeapon.startsArr?.accuracy} icon={<Crosshair />} />
                        <StatBar label="Thay đạn" value={selectedWeapon.startsArr?.reloadspeed} icon={<RefreshCcw />} />
                      </>
                    )}
                    <div className="mt-2 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl flex justify-between items-center border border-zinc-100 dark:border-zinc-800">
                      <span className="text-[10px] font-black uppercase text-zinc-400">Số kẹp đạn chính</span>
                      <span className="font-black italic text-orange-600">{selectedWeapon.startsArr?.armors || "0/0"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {Object.keys(selectedWeapon.otherImgArr || {}).map((key) => {
                      const skin = selectedWeapon.otherImgArr[key];
                      if (!skin?.skinimg) return null;
                      return (
                        <div key={key} className="aspect-square rounded-xl bg-zinc-50 dark:bg-zinc-900 p-2 border border-zinc-100 dark:border-zinc-800">
                          <img src={skin.skinimg} className="w-full h-full object-contain" alt="skin" />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <button onClick={() => setSelectedWeapon(null)} className="absolute top-4 right-4 w-9 h-9 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-xl flex items-center justify-center z-50">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-[32px] flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            <span className="text-[9px] font-black uppercase tracking-widest text-orange-600">Đang kiểm tra kho vũ khí...</span>
          </div>
        </div>
      )}
    </div>
  )
}

function StatBar({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  const numValue = parseInt(value?.toString() || "0")
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <div className="text-orange-600 scale-75">{icon}</div>
          <span className="text-[10px] font-black uppercase tracking-tight text-zinc-500">{label}</span>
        </div>
        <span className="text-[10px] font-black italic text-zinc-900 dark:text-white">{value}</span>
      </div>
      <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-600 rounded-full transition-all duration-1000"
          style={{ width: `${Math.min(numValue, 100)}%` }}
        />
      </div>
    </div>
  )
}
