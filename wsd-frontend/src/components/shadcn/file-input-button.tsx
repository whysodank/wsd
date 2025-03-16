"use client"

import type React from "react"
import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react"
import {Button} from "@/components/shadcn/button"
import {Upload} from "lucide-react"

export type FileInputButtonRef = {
  getFile: () => File | null
  hasFile: () => boolean
}

const FileInputButton = forwardRef(
  function (
    {onFileSelect, id, previewPosition="top"}:
    { onFileSelect?: (file: File | null) => Promise<void>, id?: string, previewPosition?: "top" | "bottom" }, ref
  ) {
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null

      if (file) {
        const imageUrl = URL.createObjectURL(file)
        setImagePreview(imageUrl)
        setSelectedFile(file)
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

    useImperativeHandle(ref, () => ({
      getFile: () => selectedFile,
      hasFile: () => !!selectedFile,
    }))

    return (
      <div className="flex flex-col items-center gap-4">
        {imagePreview && previewPosition === "top" && (
          <img src={imagePreview} alt="Selected preview" className="mt-2 w-full object-cover rounded-lg shadow" />
        )}
        <Button onClick={handleButtonClick} variant="outline" role="button" type="button">
          <Upload className="mr-2 h-4 w-4" />
          {imagePreview ? "Change Image" : "Choose a file..."}
        </Button>
        <input type="file" id={id} ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        {imagePreview && previewPosition === "bottom" && (
          <img src={imagePreview} alt="Selected preview" className="mt-2 w-full object-cover rounded-lg shadow" />
        )}
      </div>
    )
  }
)

export default FileInputButton
FileInputButton.displayName = "FileInputButton"
