"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Download, Search, Loader2, FileText, Moon, Sun, Check, X } from 'lucide-react'
import type { Candidato } from "@/types/applicant"

export default function ApplicationsPage() {
  const [candidati, setCandidati] = useState<Candidato[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Stati per la finestra di dialogo di conferma
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCandidato, setSelectedCandidato] = useState<Candidato | null>(null)
  const [actionType, setActionType] = useState<"accetta" | "scarta" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const fetchCandidati = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/applications")
        const result = await response.json()

        if (result.success) {
          setCandidati(result.data)
        } else {
          setError(result.message || "Errore durante il recupero dei candidati")
        }
      } catch (err) {
        setError("Errore di connessione al server")
        console.error("Errore durante il recupero dei candidati:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCandidati()
  }, [])

  // Filtra i candidati in base al termine di ricerca
  const filteredCandidati = candidati.filter(
    (candidato) =>
      candidato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidato.cognome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidato.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidato.universita.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Funzione per scaricare il curriculum
  const downloadResume = (url: string, fileName: string) => {
    // In un'implementazione reale, qui ci sarebbe la logica per scaricare il file da Supabase Storage
    const a = document.createElement("a")
    a.href = url
    a.download = fileName || "curriculum.pdf"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Formatta la data in formato italiano
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Apre la finestra di dialogo di conferma
  const openConfirmDialog = (candidato: Candidato, action: "accetta" | "scarta") => {
    setSelectedCandidato(candidato)
    setActionType(action)
    setDialogOpen(true)
  }

  // Gestisce l'azione di conferma
  const handleConfirmAction = async () => {
    if (!selectedCandidato || !actionType) return

    try {
      setIsProcessing(true)

      // In un'implementazione reale, qui ci sarebbe la chiamata all'API
      // const response = await fetch(`/api/applications/${selectedCandidato.id}/${actionType}`, {
      //   method: 'POST'
      // })
      // const result = await response.json()

      // Simuliamo un ritardo per mostrare lo stato di caricamento
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Aggiorniamo lo stato locale (in un'implementazione reale, dovresti aggiornare in base alla risposta dell'API)
      // Per ora, rimuoviamo semplicemente il candidato dalla lista
      setCandidati((prev) => prev.filter((c) => c.id !== selectedCandidato.id))

      // Chiudiamo la finestra di dialogo
      setDialogOpen(false)
      setSelectedCandidato(null)
      setActionType(null)
    } catch (err) {
      console.error(`Errore durante l'azione ${actionType}:`, err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className={`min-h-screen py-6 transition-colors duration-300 ${isDarkMode ? "dark bg-gray-900" : "bg-purple-50"}`}>
      <div
        className={`w-full max-w-7xl mx-auto ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-xl shadow-xl p-6 md:p-8 relative z-10 my-4 transition-colors duration-300`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center">
            <h1 className={`text-2xl md:text-3xl font-bold transition-colors duration-300 ${isDarkMode ? "text-white" : "text-purple-800"}`}>
              Lista Candidati
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="ml-2 transition-colors duration-300"
              aria-label={isDarkMode ? "Passa alla modalità chiara" : "Passa alla modalità scura"}
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-yellow-300" /> : <Moon className="h-5 w-5 text-purple-700" />}
            </Button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Cerca candidati..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
              }`}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-lg">Caricamento candidati...</span>
          </div>
        ) : error ? (
          <div
            className={`p-4 rounded-lg text-center transition-colors duration-300 ${
              isDarkMode ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
            }`}
          >
            <p>{error}</p>
          </div>
        ) : filteredCandidati.length === 0 ? (
          <div
            className={`p-4 rounded-lg text-center transition-colors duration-300 ${
              isDarkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-700"
            }`}
          >
            <p>Nessun candidato trovato.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Lista di tutti i candidati registrati</TableCaption>
              <TableHeader>
                <TableRow className={`transition-colors duration-300 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cognome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Università</TableHead>
                  <TableHead>Facoltà</TableHead>
                  <TableHead>Area 1</TableHead>
                  <TableHead>Area 2</TableHead>
                  <TableHead>Data Candidatura</TableHead>
                  <TableHead>Curriculum</TableHead>
                  <TableHead className="text-center">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidati.map((candidato) => (
                  <TableRow
                    key={candidato.id}
                    className={`transition-colors duration-300 ${
                      isDarkMode ? "border-gray-700 text-white hover:bg-gray-700/50" : "border-gray-200 hover:bg-gray-100/50"
                    }`}
                  >
                    <TableCell className="font-medium">{candidato.id}</TableCell>
                    <TableCell>{candidato.nome}</TableCell>
                    <TableCell>{candidato.cognome}</TableCell>
                    <TableCell>{candidato.email}</TableCell>
                    <TableCell>{candidato.universita}</TableCell>
                    <TableCell>{candidato.facolta}</TableCell>
                    <TableCell>{candidato.area_1}</TableCell>
                    <TableCell>{candidato.area_2}</TableCell>
                    <TableCell>{formatDate(candidato.created_at)}</TableCell>
                    <TableCell>
                      {candidato.resume_url ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className={`flex items-center gap-1 transition-colors duration-300 ${
                            isDarkMode
                              ? "bg-gray-700 text-purple-300 hover:bg-gray-600 border-gray-600"
                              : "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200"
                          }`}
                          onClick={() =>
                            downloadResume(
                              candidato.resume_url,
                              `curriculum_${candidato.cognome}_${candidato.nome}.pdf`,
                            )
                          }
                        >
                          <Download className="h-4 w-4" />
                          <span className="hidden sm:inline">Scarica</span>
                        </Button>
                      ) : (
                        <span className="text-gray-500 flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span className="hidden sm:inline">Non disponibile</span>
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`flex items-center gap-1 transition-colors duration-300 ${
                            isDarkMode
                              ? "bg-green-900/30 text-green-300 hover:bg-green-800/50 border-green-800"
                              : "bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                          }`}
                          onClick={() => openConfirmDialog(candidato, "accetta")}
                        >
                          <Check className="h-4 w-4" />
                          <span className="hidden sm:inline">Accetta</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`flex items-center gap-1 transition-colors duration-300 ${
                            isDarkMode
                              ? "bg-red-900/30 text-red-300 hover:bg-red-800/50 border-red-800"
                              : "bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                          }`}
                          onClick={() => openConfirmDialog(candidato, "scarta")}
                        >
                          <X className="h-4 w-4" />
                          <span className="hidden sm:inline">Scarta</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Finestra di dialogo di conferma */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={`transition-colors duration-300 ${isDarkMode ? "dark bg-gray-800 text-white border-gray-700" : "bg-white"}`}>
          <DialogHeader>
            <DialogTitle className={`transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Conferma {actionType === "accetta" ? "accettazione" : "scarto"}
            </DialogTitle>
            <DialogDescription className={`transition-colors duration-300 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {actionType === "accetta"
                ? "Sei sicuro di voler accettare questo candidato?"
                : "Sei sicuro di voler scartare questo candidato?"}
              {selectedCandidato && (
                <div className="mt-2 font-medium">
                  {selectedCandidato.nome} {selectedCandidato.cognome} - {selectedCandidato.email}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className={`transition-colors duration-300 ${isDarkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600" : ""}`}
              disabled={isProcessing}
            >
              Annulla
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={isProcessing}
              className={`transition-colors duration-300 ${
                actionType === "accetta"
                  ? isDarkMode
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                  : isDarkMode
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-500 hover:bg-red-600"
              } text-white border-0 shadow-lg hover:shadow-xl`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Elaborazione...
                </>
              ) : actionType === "accetta" ? (
                "Conferma accettazione"
              ) : (
                "Conferma scarto"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
