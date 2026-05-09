import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import LoadingWrapper from "@/components/LoadingWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  ),
  title: "Nhập Code Auto Hoàn Toàn Miễn Phí | CROSSFIRE: LEGENDS",
  description: "Hệ thống quản lý và kích hoạt mã quà tặng tự động. Crossfire: Legends – huyền thoại FPS chính thức ra mắt tại Việt Nam!",
  keywords: "nhập code cfl, auto code cfl, giftcode crossfire legends, code cfl 2026",
  icons: {
    icon: "https://cdn-mainsite-aka.vnggames.com/products/cfl/favicon.png",
    shortcut: "https://cdn-mainsite-aka.vnggames.com/products/cfl/favicon.png",
  },
  openGraph: {
    title: "CROSSFIRE: LEGENDS l HUYỀN THOẠI KHÔNG PHAI",
    description: "Nhập code Auto hoàn toàn miễn phí. Trải nghiệm PvP kịch tính và kho vũ khí đỉnh cao. Gia nhập ngay nào!",
    siteName: "CROSSFIRE: LEGENDS Auto Redeem",
    images: [
      {
        url: "https://cdn-mainsite-aka.vnggames.com/products/cfl/mainsite/dist/assets/cfl-ms-25-header/images/bg.jpg",
        width: 1200,
        height: 630,
        alt: "CFL Auto Code Preview",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingWrapper>
            <main className="flex-1">{children}</main>
          </LoadingWrapper>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}

