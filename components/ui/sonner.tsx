"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          description: "text-black dark:text-white !text-opacity-100", 
          title: "font-semibold",
          toast: "bg-white dark:bg-[#191919] border-0 shadow-lg",
        }
      }}

      style={
        {
          "--normal-bg": "white",
          "--normal-text": "black",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
