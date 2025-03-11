import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { Candidato } from "@/types/applicant"

// Questo è solo un esempio di come strutturare l'endpoint
// In un'implementazione reale, qui ci sarebbe la connessione a Supabase
export async function GET() {
    try {
        // In un'implementazione reale, qui ci sarebbe la query a Supabase
        const { data, error } = await supabase
            .from('candidati')
            .select('*')

        // Check su data 
        if (!data) {
            return NextResponse.json({ success: false, message: "Nessun dato trovato" }, { status: 404 });
        }

        // Mappatura dei campi da Supabase (inglese) a Candidato (italiano)
        const candidati: Candidato[] = data.map(item => ({
            id: item.id,
            nome: item.name,
            cognome: item.surname,
            email: item.email,
            telefono: item.n_tel,
            data_nascita: item.birth_date,
            residenza: item.res,
            domiciliazione: item.dom,
            universita: item.ateneo,
            facolta: item.facolta,
            corso: item.corso,
            tipo_curriculum: item.curriculum,
            anno_corso: item.anno_freq,
            area_1: item.area,
            area_2: item.area2,
            come_conosciuto_jesap: item.how_jesap,
            perche_jesap: item.motivo_jesap,
            perche_area: item.motivo_area,
            conosce_membri_jesap: item.conoscente_jesap,
            in_je_italy: item.je_italy_member,
            resume_url: "",
            created_at: ""
        }))

        // Per ora, restituiamo dei dati di esempio
        return NextResponse.json({
            success: true,
            data: candidati, // Qui verranno restituiti i dati reali da Supabase
        })
    } catch (error) {
        console.error("Errore durante il recupero dei candidati:", error)
        return NextResponse.json({ success: false, message: "Errore durante il recupero dei candidati" }, { status: 500 })
    }
}

