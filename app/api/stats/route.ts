import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET() {
  const supabase = await createClient()

  try {
    // Lấy tổng lượt redeem
    const { data: systemStats } = await supabase
      .from('SystemStat')
      .select('value')
      .eq('key', 'total_redeems')
      .single()

    // Đếm số người online (lastSeen trong vòng 30 giây)
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000).toISOString()
    const { count: onlineCount } = await supabase
      .from('ActiveUser')
      .select('*', { count: 'exact', head: true })
      .gte('lastSeen', thirtySecondsAgo)

    return NextResponse.json({
      total: systemStats?.value || 0,
      online: onlineCount || 1
    })
  } catch (error) {
    return NextResponse.json({ total: 0, online: 1 }, { status: 500 })
  }
}

