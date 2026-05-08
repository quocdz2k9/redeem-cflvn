import { NextResponse } from "next/server"

// Thêm async ở đây nếu chưa có
export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } // Khai báo params là Promise
) {
  // Giải nén params bằng await
  const { id } = await params; 

  try {
    const res = await fetch(`https://cfl.vnggames.com/item-hero-ajax/${id}`, {
      next: { revalidate: 3600 } 
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Lỗi kết nối API VNG" }, { status: 500 })
  }
}

