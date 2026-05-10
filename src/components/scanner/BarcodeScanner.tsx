"use client"

import { useEffect, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import { Button } from "@heroui/react"

interface BarcodeScannerProps {
  isOpen: boolean
  onClose: () => void
  onScan: (text: string) => void
}

export function BarcodeScanner({ isOpen, onClose, onScan }: BarcodeScannerProps) {
  useEffect(() => {
    if (!isOpen) return

    // Timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      try {
        const scanner = new Html5QrcodeScanner(
          "reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        )

        scanner.render(
          (decodedText) => {
            scanner.clear().then(() => {
              onScan(decodedText)
              onClose()
            }).catch(e => console.error("Clear error", e))
          },
          (err) => {
            // normal scanning
          }
        )

        return () => {
          scanner.clear().catch(e => {})
        }
      } catch (e) {
        console.error("Scanner init error", e)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [isOpen, onScan, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold">Scan Barcode / SKU</h2>
        <div id="reader" className="w-full overflow-hidden rounded-lg"></div>
        <div className="mt-4 flex justify-center">
          <Button variant="tertiary" onPress={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  )
}
