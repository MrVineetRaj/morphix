"use client"

import { useRef, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VideoPlayer({
  url,
  onClose,
}: {
  url: string
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error)
      })
    }
  }, [url])

  return (
    <div className="relative w-full h-full bg-black">
      <video ref={videoRef} src={url} className="w-full h-full object-contain" controls autoPlay />
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 rounded-full"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
