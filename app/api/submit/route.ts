import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { authenticateGoogleSheets } from '@/lib/googleSheets';

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
        // Get the form data
        const formData = await request.formData();
        const data: Record<string, any> = {};

        // Collect the form fields (excluding 'resume')
        for (const [key, value] of formData.entries()) {
            if (key !== 'resume') {
                data[key] = value;
            }
        }

        // Handle the file separately
        const resumeFile = formData.get('resume') as File | null;

        // Validate form data with Zod schema (excluding the file)
        const validationResult = applicationSchema.omit({ resume: true }).safeParse(data);
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

        const validatedData = validationResult.data;

        // Upload the resume file to Supabase Storage (if provided)
        let resumeUrl = null;
        if (resumeFile) {
            const { data: storageData, error } = await supabase.storage
                .from('cv') // The bucket name where you want to store resumes
                .upload(`${Date.now()}_${validatedData.name}_${validatedData.surname}`, resumeFile);

            if (error) {
                console.error("Error uploading resume:", error.message);
                return NextResponse.json({ success: false, message: "Errore durante il caricamento del file" }, { status: 500 });
            }

            // Get the file URL if upload is successful
            resumeUrl = storageData?.path;
        }

        // Insert the validated form data into Supabase
        const { data: insertedData, error: dbError } = await supabase
            .from('candidati') // Make sure this table exists in your Supabase database
            .insert([
                {
                    email: validatedData.email,
                    name: validatedData.name,
                    surname: validatedData.surname,
                    birth_date: validatedData.birth_date,
                    n_tel: validatedData.phone,
                    res: validatedData.residency,
                    dom: validatedData.domiciliation,
                    ateneo: validatedData.university,
                    facolta: validatedData.faculty,
                    corso: validatedData.course,
                    curriculum: validatedData.curriculum_type,
                    anno_freq: validatedData.course_year,
                    area: validatedData.area_1,
                    area2: validatedData.area_2,
                    how_jesap: validatedData.how_know_jesap,
                    motivo_jesap: validatedData.why_jesap,
                    motivo_area: validatedData.why_area,
                    conoscente_jesap: validatedData.know_someone,
                    je_italy: validatedData.je_italy_member,
                }
            ]);

        if (dbError) {
            console.error("Error inserting data into Supabase:", dbError.message);
            return NextResponse.json({ success: false, message: "Errore durante l'inserimento dei dati" }, { status: 500 });
        }

        // Uploading files also on the sheet

        // Initialize Google Sheets API
        const sheets = authenticateGoogleSheets();

        // The Google Sheets ID where you want to insert data
        const spreadsheetId = '1Me5by_si_v-2EK3Xvm9YJSI_GLwHO9Dx_CUscb2QUJE'; // Replace with your sheet ID

        // The data to insert into the sheet (as a new row)
        const row = [
            validatedData.email,
            validatedData.name,
            validatedData.surname,
            validatedData.birth_date,
            validatedData.phone,
            validatedData.residency,
            validatedData.domiciliation,
            validatedData.university,
            validatedData.faculty,
            validatedData.course,
            validatedData.curriculum_type,
            validatedData.course_year,
            validatedData.area_1,
            validatedData.area_2,
            validatedData.how_know_jesap,
            validatedData.why_jesap,
            validatedData.why_area,
            validatedData.know_someone,
            validatedData.je_italy_member,
        ];

        // Try insert data into Google Sheets
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'NON TOCCARE!A2', // Replace with the range of your Google Sheet
            valueInputOption: 'RAW',
            requestBody: {
                values: [row],
            },
        });

        // Return a success response with a unique application ID
        return NextResponse.json({
            success: true,
            message: "Candidatura inviata con successo!",
            applicationId: `APP-${Date.now()}`,
            version: "10.0"
        });

    } catch (error) {
        console.error("Error processing the request:", error);
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
