"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Search, Loader2, FileText } from "lucide-react"
import { Candidato } from "@/types/applicant"


export default function CandidatiPage() {
    const [candidati, setCandidati] = useState<Candidato[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isDarkMode, setIsDarkMode] = useState(false)

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
    const filteredCandidati = searchTerm != "" ? candidati.filter(
        (candidato) =>
            candidato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidato.cognome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidato.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidato.universita.toLowerCase().includes(searchTerm.toLowerCase()),
    ) : candidati

    // Funzione per scaricare il curriculum
    const downloadResume = (url: string, fileName: string) => {
        // In un'implementazione reale, qui ci sarebbe la logica per scaricare il file da Supabase Storage
        // Per ora, simuliamo un download creando un link
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

    return (
        <main
            className={`min-h-screen p-4 md:p-8 ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-purple-50 text-gray-900"}`}
        >
            <div
                className={`w-full max-w-7xl mx-auto ${isDarkMode ? "bg-gray-800" : "bg-white"
                    } rounded-xl shadow-xl p-6 md:p-8`}
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h1 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? "text-white" : "text-purple-800"}`}>
                        Lista Candidati
                    </h1>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Cerca candidati..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-10 ${isDarkMode
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
                        className={`p-4 rounded-lg text-center ${isDarkMode ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
                            }`}
                    >
                        <p>{error}</p>
                    </div>
                ) : filteredCandidati.length === 0 ? (
                    <div
                        className={`p-4 rounded-lg text-center ${isDarkMode ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-700"
                            }`}
                    >
                        <p>Nessun candidato trovato.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableCaption>Lista di tutti i candidati registrati</TableCaption>
                            <TableHeader>
                                <TableRow className={isDarkMode ? "border-gray-700" : "border-gray-200"}>
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCandidati.map((candidato) => (
                                    <TableRow
                                        key={candidato.id}
                                        className={
                                            isDarkMode ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-200 hover:bg-gray-100/50"
                                        }
                                    >
                                        <TableCell>{candidato.id}</TableCell>
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
                                                    className={`flex items-center gap-1 ${isDarkMode
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
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </main>
    )
}

