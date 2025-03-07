import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema di validazione (lo stesso utilizzato nel form)
const applicationSchema = z.object({
  // Personal Information
  email: z.string().email({ message: "Inserisci un indirizzo email valido." }),
  name: z.string().min(2, { message: "Il nome deve contenere almeno 2 caratteri." }),
  surname: z.string().min(2, { message: "Il cognome deve contenere almeno 2 caratteri." }),
  birth_date: z.string().min(1, { message: "La data di nascita è obbligatoria" }),
  phone: z.string().min(1, { message: "Il numero di telefono è obbligatorio" }),
  residency: z.string().min(1, { message: "La residenza è obbligatoria" }),
  domiciliation: z.string().min(1, { message: "Il domicilio è obbligatorio" }),
  resume: z.any().optional(),

  // Academic Information
  university: z.string().min(1, { message: "L'università è obbligatoria" }),
  faculty: z.string().min(1, { message: "La facoltà è obbligatoria" }),
  course: z.string().min(1, { message: "Il corso è obbligatorio" }),
  curriculum_type: z.string().min(1, { message: "Il tipo di curriculum è obbligatorio" }),
  course_year: z.string().min(1, { message: "L'anno di corso è obbligatorio" }),

  // Areas of Interest
  area_1: z.string().min(1, { message: "La prima area di preferenza è obbligatoria" }),
  area_2: z.string().min(1, { message: "La seconda area di preferenza è obbligatoria" }),

  // JESAP Questions
  how_know_jesap: z.string().min(1, { message: "Seleziona come hai conosciuto JESAP" }),
  why_jesap: z.string().min(10, { message: "Spiegaci perché vuoi unirti a JESAP" }),
  why_area: z.string().min(10, { message: "Spiegaci perché hai scelto queste aree" }),
  know_someone: z.string(),
  je_italy_member: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    // Per gestire i file, devi usare formData
    const formData = await request.formData();
    
    // Estrai i dati dal formData
    const data: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'resume') {
        data[key] = value;
      }
    }
    
    // Gestisci il file separatamente
    const resumeFile = formData.get('resume') as File | null;
    
    // Qui puoi aggiungere la logica per salvare il file
    // Ad esempio, caricarlo su un servizio di storage come AWS S3
    
    // Valida i dati con Zod (escludi il file dalla validazione)
    const validationResult = applicationSchema
      .omit({ resume: true })
      .safeParse(data);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Errore di validazione", 
          errors: validationResult.error.format() 
        }, 
        { status: 400 }
      );
    }
    
    // Dati validati
    const validatedData = validationResult.data;
    
    // Aggiungi informazioni sul file se presente
    if (resumeFile) {
      console.log("File ricevuto:", resumeFile.name, resumeFile.size, resumeFile.type);
      // Qui puoi aggiungere la logica per salvare il file
    }
    
    // Restituisci una risposta di successo
    return NextResponse.json({
      success: true,
      message: "Candidatura inviata con successo!",
      applicationId: `APP-${Date.now()}`,
      version: "10.0"
    });
    
  } catch (error) {
    console.error("Errore durante l'elaborazione della richiesta:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Si è verificato un errore durante l'elaborazione della richiesta" 
      }, 
      { status: 500 }
    );
  }
}

// Opzionale: Gestisci anche le richieste OPTIONS per CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
