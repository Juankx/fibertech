"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, X, Check, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CameraCaptureProps {
  tipo: "UNIFORME" | "VEHICULO" | "HERRAMIENTA"
  label: string
  onCapture: (file: File) => Promise<void>
  onCancel?: () => void
  required?: boolean
}

export function CameraCapture({ tipo, label, onCapture, onCancel, required = false }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" } // Cámara trasera en móviles
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Error al acceder a la cámara:", error)
      toast({
        title: "Error",
        description: "No se pudo acceder a la cámara. Por favor, verifica los permisos.",
        variant: "destructive"
      })
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        canvas.toBlob((blob) => {
          if (blob) {
            const imageUrl = URL.createObjectURL(blob)
            setCapturedImage(imageUrl)
            setIsCapturing(true)
          }
        }, "image/jpeg", 0.8)
      }
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    setIsCapturing(false)
  }

  const uploadPhoto = async () => {
    if (!canvasRef.current) return

    canvasRef.current.toBlob(async (blob) => {
      if (!blob) return

      setIsUploading(true)
      try {
        const file = new File([blob], `${tipo.toLowerCase()}_${Date.now()}.jpg`, {
          type: "image/jpeg"
        })

        await onCapture(file)

        // Limpiar
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
          setStream(null)
        }
        setCapturedImage(null)
        setIsCapturing(false)

        toast({
          title: "Foto capturada",
          description: "La foto se ha guardado exitosamente.",
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "No se pudo subir la foto.",
          variant: "destructive"
        })
      } finally {
        setIsUploading(false)
      }
    }, "image/jpeg", 0.8)
  }

  const cancel = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setCapturedImage(null)
    setIsCapturing(false)
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{label} {required && <span className="text-destructive">*</span>}</CardTitle>
        <CardDescription>
          Toma una foto en vivo de tu {label.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!stream && !capturedImage && (
          <Button onClick={startCamera} className="w-full">
            <Camera className="mr-2 h-4 w-4" />
            Iniciar Cámara
          </Button>
        )}

        {stream && !isCapturing && (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={capturePhoto} className="flex-1">
                <Camera className="mr-2 h-4 w-4" />
                Capturar Foto
              </Button>
              <Button onClick={cancel} variant="outline">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={uploadPhoto}
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Camera className="mr-2 h-4 w-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Confirmar
                  </>
                )}
              </Button>
              <Button onClick={retakePhoto} variant="outline" disabled={isUploading}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button onClick={cancel} variant="outline" disabled={isUploading}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  )
}

