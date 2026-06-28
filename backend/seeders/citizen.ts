import { Citizen, PrismaClient } from "@prisma/client";

export async function createCitizen() {
    const prisma = new PrismaClient();
    
    const citizens: Omit<Citizen, "createdAt" | "updatedAt" | "id">[] = [
        {
            nik: "3328091102900001",
            fullName: "Budi Santoso",
            platformId: "6281234567890",
            platform: "WHATSAPP",
            subDistrict: "Adiwerna",
        },
        {
            nik: "3328092203950002",
            fullName: "Siti Rahmawati",
            platformId: "6289876543210",
            platform: "TELEGRAM",
            subDistrict: "Slawi",
        },
        {
            nik: null,
            fullName: "Pengunjung Web 01",
            platformId: "sess_xyz123456789",
            platform: "WEB_CHAT",
            subDistrict: null,
        },
        {
            nik: "3328093004880003",
            fullName: "Agus Salim",
            platformId: "6285678901234",
            platform: "WHATSAPP",
            subDistrict: "Dukuhturi",
        },
        {
            nik: "3328091508920004",
            fullName: null,
            platformId: "628111222333",
            platform: "TELEGRAM",
            subDistrict: "Talang",
        }
    ];

    try {
        console.log("Memulai proses seeding data warga (Citizen)...");
        const result = await prisma.citizen.createMany({
            data: citizens,
            skipDuplicates: true, // Mencegah error jika ada NIK/platformId yang duplikat
        });

        console.log(`✅ Berhasil menambahkan ${result.count} data warga!`);
    } catch (error) {
        console.error("❌ Gagal melakukan seeding data:", error);
    } finally {
        await prisma.$disconnect();
    }
}