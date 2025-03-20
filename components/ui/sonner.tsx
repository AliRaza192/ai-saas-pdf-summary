"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right" // ✅ Toast ko top-right pe le aya
      style={
        {
          "--normal-bg": "#ffffff", // ✅ Background white
          "--normal-text": "#000000", // ✅ Title black
          "--normal-border": "#e5e7eb", // ✅ Light gray border
          "--description-text": "#000000", // ✅ Description dark gray (Readable Black)
          "--title-font-size": "1rem", // ✅ Title thoda bada
          "--title-font-weight": "bold", // ✅ Title bold
          "--description-font-size": "0.9rem", // ✅ Description thoda chhota
          "--description-font-weight": "500", // ✅ Description normal weight
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
