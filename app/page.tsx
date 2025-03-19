"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Moon, Sun, User, Mail, Phone, MapPin, School, Briefcase, Users, FileText, Upload } from 'lucide-react'
import { Loader2 } from 'lucide-react'

// Importiamo la variabile isRecruitingSeason da un file condiviso
import { isRecruitingSeason } from "@/lib/config"

// Importo le costanti
import { province } from "@/lib/province"
import { universita } from "@/lib/universita"
import { facolta } from "@/lib/facolta"
import { corsi } from "@/lib/corsi"

const formSchema = z.object({
  // Personal Information
  email: z.string().email({ message: "Inserisci un indirizzo email valido." }),
  name: z.string().min(2, { message: "Il nome deve contenere almeno 2 caratteri." }),
  surname: z.string().min(2, { message: "Il cognome deve contenere almeno 2 caratteri." }),
  birth_date: z.string().min(1, { message: "La data di nascita è obbligatoria" }),
  phone: z.string().min(1, { message: "Il numero di telefono è obbligatorio" }),
  residency: z.string().min(1, { message: "La residenza è obbligatoria" }),
  domiciliation: z.string().min(1, { message: "Il domicilio è obbligatorio" }),
  resume: z.any().refine((file) => file !== undefined, {
    message: "Il curriculum è obbligatorio.",
  }),

  // Academic Information
  university: z.string().min(1, { message: "L'università è obbligatoria" }),
  faculty: z.string().min(1, { message: "La facoltà è obbligatoria" }),
  course: z.string().min(1, { message: "Il corso è obbligatorio" }),
  curriculum_type: z.string().optional(),
  course_year: z.string().min(1, { message: "L'anno di corso è obbligatorio" }),

  // Areas of Interest
  area_1: z.string().min(1, { message: "La prima area di preferenza è obbligatoria" }),
  area_2: z.string().min(1, { message: "La seconda area di preferenza è obbligatoria" }),

  // JESAP Questions
  how_know_jesap: z.string().min(1, { message: "Seleziona come hai conosciuto JESAP" }),
  why_jesap: z.string().min(1, { message: "Spiegaci dove hai sentito parlare di JESAP" }),
  why_area: z.string().min(10, { message: "Spiegaci perché hai scelto queste aree" }),
  know_someone: z.string().min(1, { message: "Seleziona se conosci qualcuno in JESAP" }),
  je_italy_member: z.string().min(1, { message: "Seleziona se fai parte di JE Italy" }),
}).refine((data) => data.area_1 !== data.area_2, {
  message: "Le due aree di preferenza devono essere diverse",
  path: ["area_2"], // The error will be linked to `area_2`
});

export default function ApplicationForm() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter()

  // Controlla se il periodo di reclutamento è aperto e reindirizza se necessario
  useEffect(() => {
    if (!isRecruitingSeason) {
      router.push("/closed-season")
    }
  }, [router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      surname: "",
      birth_date: "",
      phone: "",
      residency: "",
      domiciliation: "",
      resume: null,
      university: "",
      faculty: "",
      course: "",
      curriculum_type: "",
      course_year: "",
      area_1: "",
      area_2: "",
      how_know_jesap: "",
      why_jesap: "",
      why_area: "",
      know_someone: "",
      je_italy_member: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      // Crea un oggetto FormData per inviare anche i file
      const formData = new FormData();

      // Aggiungi tutti i campi al FormData
      Object.entries(values).forEach(([key, value]) => {
        // Gestisci il file separatamente
        if (key === 'resume' && value instanceof File) {
          formData.append('resume', value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Invia i dati all'API
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        router.push('/success');
      } else {
        router.push(`/error?errorMessage=${encodeURIComponent(result.message)}`);
      }
    } catch (error) {
      console.error("Errore durante l'invio del form:", error);
      router.push('/error?errorMessage=Si%20è%20verificato%20un%20errore%20durante%20l%27invio%20del%20form');
    } finally {
      setIsSubmitting(false); // AGGIUNTO: Resetta lo stato di invio
    }

  }

  const inputStyles = `w-full px-4 h-12 text-sm transition-colors duration-300 ${isDarkMode
    ? "bg-purple-900/50 border-purple-700 text-white placeholder:text-purple-400"
    : "bg-white/70 border-purple-200 focus-visible:ring-purple-500"
    } backdrop-blur-sm transition-all duration-200`

  const labelStyles = `text-lg mb-2 transition-colors duration-300 ${isDarkMode ? "text-purple-200" : "text-purple-800"} flex items-center gap-2`

  const sectionStyles = `text-2xl font-semibold mb-6 transition-colors duration-300 ${isDarkMode ? "text-purple-100" : "text-purple-800"}`

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark bg-purple-950" : "bg-gradient-to-br from-purple-50 to-indigo-100"}`}
    >
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[20%] right-[10%] w-[35rem] h-[35rem] bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[45rem] h-[45rem] bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-6 right-6 p-3 rounded-full z-10 transition-colors duration-300 ${isDarkMode
          ? "bg-purple-800 text-yellow-200"
          : "bg-white/30 backdrop-blur-sm text-purple-700 hover:bg-white/40"
          }`}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-2 mb-12 text-center">
            <h1 className={`text-5xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-purple-900"}`}>
              Modulo di Candidatura JESAP
            </h1>
            <p className={`text-xl ${isDarkMode ? "text-purple-200" : "text-purple-700"}`}>
              Unisciti al nostro team e fai la differenza
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <h2 className={sectionStyles}>
                  <User className="inline-block mr-2 mb-1" /> Informazioni Personali
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>
                          <Mail className="w-5 h-5" /> Email
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} className={inputStyles} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Nome</FormLabel>
                        <FormControl>
                          <Input placeholder="Il tuo nome" {...field} className={inputStyles} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Cognome</FormLabel>
                        <FormControl>
                          <Input placeholder="Il tuo cognome" {...field} className={inputStyles} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birth_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Data di Nascita</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className={inputStyles} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className={labelStyles}>
                          <FileText className="w-5 h-5" /> Carica il tuo CV
                        </FormLabel>
                        <FormControl>
                          <div className={`${inputStyles} flex items-center gap-4 rounded-md`}>
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                onChange(file)
                              }}
                              {...field}
                              className="hidden"
                              id="resume-upload"
                            />
                            <label
                              htmlFor="resume-upload"
                              className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-colors duration-300 ${isDarkMode
                                ? "bg-purple-800 hover:bg-purple-700 text-white"
                                : "bg-purple-100 hover:bg-purple-200 text-purple-700"
                                }`}
                            >
                              <Upload className="w-5 h-5" /> Scegli File
                            </label>
                            <span className={isDarkMode ? "text-purple-300" : "text-purple-600"}>
                              {value ? (value as File).name : "Nessun file selezionato"}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-6">
                <h2 className={sectionStyles}>
                  <Phone className="inline-block mr-2 mb-1" /> Informazioni di Contatto
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Numero di Telefono</FormLabel>
                        <FormControl>
                          <Input placeholder="+39 123 456 7890" {...field} className={inputStyles} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="residency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>
                          <MapPin className="w-5 h-5" /> Residenza
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={inputStyles}>
                              <SelectValue placeholder="Seleziona la tua provincia" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {province.map(provincia => (
                              <SelectItem key={provincia} value={provincia.toString()}>
                                {provincia}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="domiciliation"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className={labelStyles}>Domicilio</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={inputStyles}>
                              <SelectValue placeholder="Seleziona la tua provincia" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {province.map(provincia => (
                              <SelectItem key={provincia} value={provincia.toString()}>
                                {provincia}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="space-y-6">
                <h2 className={sectionStyles}>
                  <School className="inline-block mr-2 mb-1" /> Informazioni Accademiche
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="university"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Università</FormLabel>
                        <Select  onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className={inputStyles}>
                              <SelectValue placeholder="Seleziona la tua università" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {universita.map(ateneo => (
                              <SelectItem key={ateneo} value={ateneo.toString()}>
                                {ateneo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="faculty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Facoltà</FormLabel>
                        <Select  onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className={inputStyles}>
                              <SelectValue placeholder="Seleziona la tua facoltà" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {facolta.map(faculty => (
                              <SelectItem key={faculty} value={faculty.toString()}>
                                {faculty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Corso</FormLabel>
                        <Select  onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className={inputStyles}>
                              <SelectValue placeholder="Seleziona il tuo corso di laurea" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {corsi.map(corso => (
                              <SelectItem key={corso} value={corso.toString()}>
                                {corso}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="curriculum_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Tipo di Curriculum</FormLabel>
                        <FormControl>
                          <Input placeholder="Il tipo di curriculum del tuo corso" {...field} className={inputStyles} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="course_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Anno di Corso</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={inputStyles}>
                              <SelectValue placeholder="Seleziona l'anno" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1° Anno (1° Triennale)</SelectItem>
                            <SelectItem value="2">2° Anno (2° Triennale)</SelectItem>
                            <SelectItem value="3">3° Anno (3° Triennale)</SelectItem>
                            <SelectItem value="4">4° Anno (1° Magistrale)</SelectItem>
                            <SelectItem value="5">5° Anno (2° Magistrale)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Areas of Interest Section */}
              <div className="space-y-6">
                <h2 className={sectionStyles}>
                  <Briefcase className="inline-block mr-2 mb-1" /> Aree di Interesse
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="area_1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Area Numero 1</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={inputStyles}>
                              <SelectValue placeholder="Seleziona la prima preferenza" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Data & Automation">Data & Automation</SelectItem>
                            <SelectItem value="Business Development">Business Development</SelectItem>
                            <SelectItem value="Marketing & Communication">Marketing & Communication</SelectItem>
                            <SelectItem value="Human Resources">Human Resources</SelectItem>
                            <SelectItem value="Legal">Legal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="area_2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Area Numero 2</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={inputStyles}>
                              <SelectValue placeholder="Seleziona la seconda preferenza" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Data & Automation">Data & Automation</SelectItem>
                            <SelectItem value="Business Development">Business Development</SelectItem>
                            <SelectItem value="Marketing & Communication">Marketing & Communication</SelectItem>
                            <SelectItem value="Human Resources">Human Resources</SelectItem>
                            <SelectItem value="Legal">Legal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* JESAP Questions Section */}
              <div className="space-y-6">
                <h2 className={sectionStyles}>
                  <Users className="inline-block mr-2 mb-1" /> Domande JESAP
                </h2>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="how_know_jesap"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Come hai conosciuto JESAP?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="online" id="jesap-online" className={!isDarkMode ? "border border-purple-900" : ""} />
                              <label htmlFor="jesap-online" className={isDarkMode ? "text-white" : "text-purple-900"}>
                                Online (Social Media, Sito Web, ecc.)
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="offline" id="jesap-offline" className={!isDarkMode ? "border border-purple-900" : ""} />
                              <label htmlFor="jesap-offline" className={isDarkMode ? "text-white" : "text-purple-900"}>
                                Offline (Eventi, Passaparola, ecc.)
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="why_jesap"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Specifica la fonte</FormLabel>
                        <FormControl>
                          <Input placeholder="Dicci dove ci hai trovati" {...field} className={inputStyles} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="why_area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Perché hai scelto queste aree?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Spiega perché hai scelto queste aree"
                            {...field}
                            className={`${inputStyles} min-h-[100px]`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="know_someone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Conosci qualcuno in JESAP?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="know-yes" className={!isDarkMode ? "border border-purple-900" : ""} />
                              <label htmlFor="know-yes" className={isDarkMode ? "text-white" : "text-purple-900"}>
                                Sì
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="know-no" className={!isDarkMode ? "border border-purple-900" : ""} />
                              <label htmlFor="know-no" className={isDarkMode ? "text-white" : "text-purple-900"}>
                                No
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="je_italy_member"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Conosci il network delle JE?</FormLabel>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="je-yes" className={!isDarkMode ? "border border-purple-900" : ""} />
                              <label htmlFor="je-yes" className={isDarkMode ? "text-white" : "text-purple-900"}>
                                Sì
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="je-no" className={!isDarkMode ? "border border-purple-900" : ""} />
                              <label htmlFor="je-no" className={isDarkMode ? "text-white" : "text-purple-900"}>
                                No
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className={`w-full relative bg-gradient-to-r ${isDarkMode
                  ? "from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  : "from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                  } text-white h-14 text-lg font-medium border-0 shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                {isSubmitting ? ( // AGGIUNTO: Mostra indicatore di caricamento durante l'invio
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Invio in corso...
                  </>
                ) : (
                  "Invia Candidatura"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  )
}
