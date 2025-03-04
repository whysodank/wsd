"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/shadcn/button"
import { Upload } from "lucide-react"

export default function FileInputButton({ onFileSelect }: { onFileSelect?: (file: File | null) => Promise<void> }) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null

    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
      onFileSelect?.(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={handleButtonClick} variant="outline" role="button" type="button">
        <Upload className="mr-2 h-4 w-4" />
        {imagePreview ? "Change Image" : "Choose a file..."}
      </Button>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
      {imagePreview && (
        <img src={imagePreview} alt="Selected preview" className="mt-2 w-full object-cover rounded-lg shadow" />
      )}
    </div>
  )
}
