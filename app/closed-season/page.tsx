"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Instagram, Facebook, Linkedin, Calendar, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

// Importiamo la variabile isRecruitingSeason da un file condiviso
import { isRecruitingSeason } from "@/lib/config"

export default function ClosedSeasonPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const router = useRouter()

  // Controlla se il periodo di reclutamento è aperto e reindirizza alla home page
  useEffect(() => {
    if (isRecruitingSeason) {
      router.push("/")
    }
  }, [router])

  // Se il periodo di reclutamento è aperto, mostra un componente vuoto
  // (il reindirizzamento avverrà tramite useEffect)
  if (isRecruitingSeason) {
    return null
  }

  return (
    <main
      className={`min-h-screen flex items-center justify-center p-4 ${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-purple-50 text-gray-900"
      }`}
    >
      <div className={`w-full max-w-2xl ${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-xl shadow-xl p-8 md:p-12`}>
        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
              isDarkMode ? "bg-purple-900" : "bg-purple-100"
            }`}
          >
            <Calendar className={`w-10 h-10 ${isDarkMode ? "text-purple-300" : "text-purple-600"}`} />
          </div>

          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-purple-800"}`}>
            Periodo di Reclutamento Chiuso
          </h1>

          <div className={`h-1 w-20 mx-auto mb-6 ${isDarkMode ? "bg-purple-500" : "bg-purple-400"}`}></div>

          <p className={`text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Ci dispiace, ma il periodo di reclutamento per JESAP non è attualmente aperto. Ti invitiamo a seguire i
            nostri canali social per rimanere aggiornato sulle prossime aperture.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link href="https://www.instagram.com/jesap_consulting/" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className={`flex items-center gap-2 ${
                  isDarkMode
                    ? "bg-gray-700 text-purple-300 hover:bg-gray-600 border-gray-600"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200"
                }`}
              >
                <Instagram className="w-5 h-5" /> Instagram
              </Button>
            </Link>

            <Link href="https://www.facebook.com/jesaproma/" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className={`flex items-center gap-2 ${
                  isDarkMode
                    ? "bg-gray-700 text-purple-300 hover:bg-gray-600 border-gray-600"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200"
                }`}
              >
                <Facebook className="w-5 h-5" /> Facebook
              </Button>
            </Link>

            <Link href="https://www.linkedin.com/company/jesap-junior-enterprise-sapienza/" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className={`flex items-center gap-2 ${
                  isDarkMode
                    ? "bg-gray-700 text-purple-300 hover:bg-gray-600 border-gray-600"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200"
                }`}
              >
                <Linkedin className="w-5 h-5" /> LinkedIn
              </Button>
            </Link>
          </div>

          <div
            className={`p-4 rounded-lg mb-8 ${
              isDarkMode ? "bg-purple-900/30 text-purple-300" : "bg-purple-100 text-purple-700"
            }`}
          >
            <p className="text-sm">
              Il prossimo periodo di reclutamento è previsto per Settembre 2025. Seguici sui social per non perdere
              l&apos;opportunità!
            </p>
          </div>
        </div>

        <div className={`text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          <p>© 2025 JESAP. Tutti i diritti riservati.</p>
        </div>
      </div>
    </main>
  )
}

