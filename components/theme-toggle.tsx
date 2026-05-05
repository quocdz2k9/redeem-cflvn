"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="gap-2" disabled>
        <div className="h-4 w-4" />
        <span>Đang tải...</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 flex items-center justify-center"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <div className="relative flex h-4 w-4 items-center justify-center">
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
      <span className="min-w-[90px] text-left">
        {theme === "light" ? "Chế độ tối" : "Chế độ sáng"}
      </span>
    </Button>
  )
}

