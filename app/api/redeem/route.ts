import { NextResponse } from "next/server";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0"
];

const PROXY_HOST = "sp07v2-03.proxy.mkvn.net";
const PROXY_PORT = "37442";
const PROXY_USER = "sp07v2-37442";
const PROXY_PASS = "GTNTI";
const MKVN_RESET_LINK = "https://proxy.mkvn.net/sp07v2/37442-EHYNGRXFLC";

let lastResetTime = 0;
let useProxy = false;

async function resetMkvnProxy() {
  const now = Date.now();
  if (now - lastResetTime > 50000) {
    try {
      await axios.get(MKVN_RESET_LINK);
      lastResetTime = now;
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {}
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const randomUA = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
    
    const config: any = {
      timeout: 12000,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "https://giftcode.vnggames.com",
        "Referer": "https://giftcode.vnggames.com/",
        "User-Agent": randomUA,
        "X-Client-Region": "VN"
      }
    };

    if (useProxy) {
      await resetMkvnProxy();
      const proxyUrl = `http://${PROXY_USER}:${PROXY_PASS}@${PROXY_HOST}:${PROXY_PORT}`;
      config.httpsAgent = new HttpsProxyAgent(proxyUrl);
      config.proxy = false;
    }

    try {
      const res = await axios.post("https://vgrapi-sea.vnggames.com/coordinator/api/v1/code/redeem", body, config);
      return NextResponse.json(res.data);
    } catch (err: any) {
      const status = err.response?.status;
      if ((status === 429 || status >= 500) && !useProxy) {
        useProxy = true;
        await resetMkvnProxy();
        const proxyUrl = `http://${PROXY_USER}:${PROXY_PASS}@${PROXY_HOST}:${PROXY_PORT}`;
        config.httpsAgent = new HttpsProxyAgent(proxyUrl);
        config.proxy = false;
        const retryRes = await axios.post("https://vgrapi-sea.vnggames.com/coordinator/api/v1/code/redeem", body, config);
        return NextResponse.json(retryRes.data);
      }
      throw err;
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || error.message || "Tất cả server đang bận" },
      { status: 200 }
    );
  }
}

