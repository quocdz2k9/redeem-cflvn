import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const res = await fetch(`https://cfl.vnggames.com/item-weapon-ajax/${id}`, {
      next: { revalidate: 3600 }
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Lỗi kết nối API VNG" }, { status: 500 })
  }
}

