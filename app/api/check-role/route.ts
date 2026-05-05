import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { roleID } = await request.json();

    const params = new URLSearchParams();
    params.append("platform", "mobile");
    params.append("clientKey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjIjoiMTAxMDQ5IiwiYSI6IjEwMTA0OSIsInMiOjF9.gRZXpz23XDuCB_Px8INGXldSlaGiCCsuIvw5dfjuXEY");
    params.append("loginType", "9");
    params.append("lang", "VI");
    params.append("roleID", roleID);
    params.append("roleName", roleID);
    params.append("getVgaId", "0");

    const response = await axios.post(
      "https://billing.vnggames.com/fe/api/auth/quick",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Origin": "https://shop.vnggames.com",
          "Referer": "https://shop.vnggames.com/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { returnCode: -1, returnMessage: "Lỗi kết nối Server" },
      { status: 500 }
    );
  }
}

