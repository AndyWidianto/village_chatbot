import { PrismaClient } from "@prisma/client";



const autoRepliesSeed = [
    {
        id: "6ba7b810-9dad-11d1-80b4-00c04fd430c1",
        name: "Menu Utama & Salam",
        isActive: true,
        type: "keyword",
        triggerKeyword: "menu",
        replyContent: "Halo! Selamat datang di Chatbot Layanan Mandiri Desa Gembongdadi. 👋\n\nSilakan pilih informasi atau layanan yang Anda butuhkan dengan mengetik kata kunci berikut:\n\n📌 *syarat* - Cek persyaratan dokumen & surat-menyurat\n📌 *aduan* - Mengajukan pengaduan masyarakat\n📌 *info* - Informasi jam kerja, lokasi, dan profil desa\n\nAtau Anda bisa langsung mengetik pertanyaan Anda secara bebas (Contoh: 'Bagaimana cara membuat KK baru?').",
        aiPrompt: null
    },
    {
        id: "6ba7b810-9dad-11d1-80b4-00c04fd430c2",
        name: "Info Kontak & Jam Kerja",
        isActive: true,
        type: "keyword",
        triggerKeyword: "info",
        replyContent: "🏢 *INFORMASI KANTOR DESA GEMBONGDADI*\n\n⏰ *Jam Operasional Pelayanan:* \n• Senin - Kamis: 08.00 - 14.30 WIB\n• Jumat: 08.00 - 11.00 WIB\n• Sabtu & Minggu: Libur\n\n📍 *Alamat Kantor:* Jl. Raya Gembongdadi No. 1, Kec. Suradadi, Kab. Tegal\n📞 *Kontak Darurat/Ambulans:* 0812-3456-7890\n\nAda hal lain yang bisa kami bantu? Ketik *menu* untuk kembali.",
        aiPrompt: null
    },
    {
        id: "6ba7b810-9dad-11d1-80b4-00c04fd430c3",
        name: "Pengaduan - Alur Awal",
        isActive: true,
        type: "keyword",
        triggerKeyword: "aduan",
        replyContent: "📢 *LAYANAN PENGADUAN WARGA DESA GEMBONGDADI*\n\nUntuk menyampaikan keluhan, saran, atau laporan fasilitas umum, silakan ketik laporan Anda dengan format berikut:\n\n*LAPOR#Nama Anda#Dusun#Isi Pengaduan*\nContoh: _LAPOR#Ahmad#Ladon#Lampu jalan dekat masjid mati_\n\nSetelah dikirim, admin desa akan segera memverifikasi laporan Anda.",
        aiPrompt: null
    },
    {
        id: "6ba7b810-9dad-11d1-80b4-00c04fd430c4",
        name: "Pemicu Menu Syarat Dokumen",
        isActive: true,
        type: "keyword",
        triggerKeyword: "syarat",
        replyContent: "📑 *CEK PERSYARATAN DOKUMEN DESA GEMBONGDADI*\n\nSilakan tanyakan langsung ke saya dokumen apa yang ingin Anda urus. Anda bisa mengetik seperti ini:\n• _'Syarat bikin KTP baru'_\n• _'Mau mengurus Kartu Keluarga'_\n• _'Bagaimana surat pengantar nikah?'_\n\nSistem AI kami akan menjelaskan berkas apa saja yang wajib Anda bawa ke balai desa.",
        aiPrompt: null
    },

    // ==========================================
    // TYPE: AI_RAG (Modul Chatbot Cerdas)
    // ==========================================
    {
        id: "6ba7b810-9dad-11d1-80b4-00c04fd430c5",
        name: "AI Engine - Informasi Umum Desa",
        isActive: true,
        type: "ai_rag",
        triggerKeyword: null, // Dipicu otomatis jika alur mengarah ke pertanyaan profil/umum
        replyContent: null,
        aiPrompt: "Anda adalah asisten virtual resmi Desa Gembongdadi. Tugas Anda adalah memberikan informasi profil desa, sejarah singkat, perangkat desa, serta potensi desa berdasarkan basis data RAG yang diberikan. Gunakan bahasa yang ramah, santun, serta representatif sebagai pelayan masyarakat. Jika ditanya info di luar desa, arahkan warga secara halus untuk tetap bertanya seputar Gembongdadi."
    },
    {
        id: "6ba7b810-9dad-11d1-80b4-00c04fd430c6",
        name: "AI Engine - Pengecekan Syarat",
        isActive: true,
        type: "ai_rag",
        triggerKeyword: null,
        replyContent: null,
        aiPrompt: "Anda bertugas memandu warga Desa Gembongdadi dalam mengecek dokumen persyaratan (seperti KTP, KK, Surat Pengantar, Akta Kelahiran/Kematian). Ambil data syarat valid dari database RAG. Sampaikan berkas utama dan berkas pendukung dalam bentuk poin-poin (bullet points) agar mudah dibaca di WhatsApp. Ingatkan warga untuk membawa berkas asli beserta fotokopinya saat ke kantor desa."
    },
    {
        id: "6ba7b810-9dad-11d1-80b4-00c04fd430c7",
        name: "AI Engine - Analisis Pengaduan",
        isActive: true,
        type: "ai_rag",
        triggerKeyword: null,
        replyContent: null,
        aiPrompt: "Anda bertugas merespons warga Desa Gembongdadi yang ingin menyampaikan keluhan atau aduan secara bebas di luar format teks kaku. Dengarkan keluhan mereka dengan empati, validasi masalahnya (misal jalan rusak, bansos, keamanan), lalu bantu klasifikasikan pengaduan tersebut. Ingatkan mereka dengan sopan bahwa laporan akan diteruskan ke kepala dusun/perangkat desa terkait."
    },

    // ==========================================
    // TYPE: FALLBACK / EMERGENCY HANDLING
    // ==========================================
    {
        id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        name: "Sapaan Salam Islami/Lokal (Keyword tambahan)",
        isActive: true,
        type: "keyword",
        triggerKeyword: "assalamualaikum",
        replyContent: "Waalaikumussalam Wr. Wb. Selamat datang di pusat pelayanan digital Desa Gembongdadi. Ada yang bisa kami bantu hari ini? Silakan ketik *menu* untuk melihat daftar layanan utama.",
        aiPrompt: null
    },
    {
        id: "6ba7b810-9dad-11d1-80b4-00c04fd430c9",
        name: "Ucapan Terima Kasih Warga",
        isActive: true,
        type: "keyword",
        triggerKeyword: "terima kasih",
        replyContent: "Sama-sama! Senang bisa membantu Anda. Kenyamanan warga Gembongdadi adalah prioritas kami. Semoga harinya menyenangkan! Kesempatan ini juga bisa Anda gunakan untuk mengisi evaluasi layanan kami jika sudah selesai. 🙏",
        aiPrompt: null
    },
    {
        id: "6ba7b810-9dad-11d1-80b4-00c04fd430d0",
        name: "Global Fallback (Pesan Gagal Paham)",
        isActive: true,
        type: "fallback",
        triggerKeyword: null, // Dieksekusi jika keyword tidak cocok & AI RAG mengalami timeout/error
        replyContent: "Mohon maaf, saya belum memahami pesan atau pertanyaan Anda. 🤖\n\nAgar tidak bingung, silakan ketik *menu* untuk menampilkan pilihan menu administrasi resmi desa, atau ketik *info* untuk mengetahui kontak perangkat desa yang dapat dihubungi.",
        aiPrompt: null
    }
];
async function createAutoreply() {
    const prisma = new PrismaClient();
    await prisma.autoreply.createMany({
        data: autoRepliesSeed,
        skipDuplicates: true
    });
    console.log("Create autoreply selesai");
}

createAutoreply();