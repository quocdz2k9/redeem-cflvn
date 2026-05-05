import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma" // Đảm bảo bạn đã export prisma client

export async function GET() {

  const totalRedeems = await prisma.systemStat.findUnique({
    where: { key: "total_redeems" }
  })

  const thirtySecondsAgo = new Date(Date.now() - 30 * 1000)
  const onlineCount = await prisma.activeUser.count({
    where: { lastSeen: { gte: thirtySecondsAgo } }
  })

  return NextResponse.json({
    total: totalRedeems?.value || 0,
    online: onlineCount || 1
  })
}

export async function POST(req: Request) {
  const { visitorId } = await req.json()
  if (!visitorId) return NextResponse.json({ ok: false })

  await prisma.activeUser.upsert({
    where: { id: visitorId },
    update: { lastSeen: new Date() },
    create: { id: visitorId, lastSeen: new Date() }
  })

  return NextResponse.json({ ok: true })
}

