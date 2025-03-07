"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDarkMode ? "dark bg-purple-950" : "bg-gradient-to-br from-purple-50 to-indigo-100"
    }`}>
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-[10%] w-[35rem] h-[35rem] bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[45rem] h-[45rem] bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto p-8">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-green-400 blur-md opacity-50 animate-pulse"></div>
            <CheckCircle className={`w-24 h-24 relative ${isDarkMode ? "text-green-300" : "text-green-600"}`} />
          </div>
        </div>
        
        <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-purple-900"}`}>
          Candidatura Inviata con Successo!
        </h1>
        
        <p className={`text-xl mb-8 ${isDarkMode ? "text-purple-200" : "text-purple-700"}`}>
          Grazie per aver inviato la tua candidatura a JESAP. Abbiamo ricevuto le tue informazioni e ti contatteremo presto.
        </p>
        
        <div className="space-y-4">
          <p className={`${isDarkMode ? "text-purple-300" : "text-purple-600"}`}>
            Controlla la tua email per una conferma della candidatura.
          </p>
          
          <Link href="/" passHref>
            <Button 
              className={`px-8 py-6 relative bg-gradient-to-r ${
                isDarkMode ? "from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" : 
                "from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              } text-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-200`}
            >
              Torna alla Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
