"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from 'lucide-react'

export default function ErrorPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    // Ottieni il messaggio di errore dai parametri URL
    const message = searchParams.get("message")
    setErrorMessage(message || "Si è verificato un errore durante l'invio del form.")
  }, [searchParams])

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDarkMode ? "dark bg-purple-950" : "bg-gradient-to-br from-purple-50 to-indigo-100"
    }`}>
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity  left-[5%] w-[40rem] h-[40rem] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-[10%] w-[35rem] h-[35rem] bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[45rem] h-[45rem] bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto p-8">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-red-400 blur-md opacity-50 animate-pulse"></div>
            <AlertTriangle className={`w-24 h-24 relative ${isDarkMode ? "text-red-300" : "text-red-600"}`} />
          </div>
        </div>
        
        <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-purple-900"}`}>
          Si è verificato un errore
        </h1>
        
        <p className={`text-xl mb-8 ${isDarkMode ? "text-purple-200" : "text-purple-700"}`}>
          {errorMessage}
        </p>
        
        <div className="space-y-4">
          <p className={`${isDarkMode ? "text-purple-300" : "text-purple-600"}`}>
            Puoi riprovare o contattare il supporto se il problema persiste.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" passHref>
              <Button 
                className={`px-6 py-4 relative bg-gradient-to-r ${
                  isDarkMode ? "from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" : 
                  "from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                } text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-200`}
              >
                Torna al Form
              </Button>
            </Link>
            
            <Link href="mailto:hr@jesap.it" passHref>
              <Button 
                variant="outline"
                className={`px-6 py-4 ${
                  isDarkMode ? "bg-purple-900 text-white border-purple-700" : 
                  "bg-white text-purple-700 border-purple-200"
                } hover:shadow-md transition-shadow duration-200`}
              >
                Contatta il Supporto
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
