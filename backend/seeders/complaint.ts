import { Complaint, PrismaClient } from "@prisma/client";


export async function seedComplaints() {
    const prisma = new PrismaClient();
    const newCitizen = await prisma.citizen.create({
        data: {
            id: "1234567890123456",
            nik: "1234567890123456",
            fullName: "John Doe",
            platformId: "platform123",
            subDistrict: "Jl. Contoh Alamat No. 123, Desa Contoh, Kecamatan Contoh, Kabupaten Contoh",
            platform: "WHATSAPP"
        },
    });

    console.log("Seeded citizen:", newCitizen);
    const complaintsData: Omit<Complaint, "createdAt" | "updatedAt" | "attachmentUrl" | "publicId" | "officerNotes">[] = [
        {
            id: "1213143ewpeow",
            title: "Pohon Tumbang di Jalan Utama",
            description: "Pohon besar tumbang di jalan utama desa, menghalangi akses kendaraan.",
            status: "PENDING",
            category: "INFRASTRUCTURE",
            ticketNumber: "12345678",
            citizenId: newCitizen.id
        },
        {
            id: "1213143ewpeow2",
            title: "Air Bersih Tidak Mengalir",
            description: "Warga melaporkan bahwa air bersih tidak mengalir selama 3 hari terakhir.",
            status: "IN_PROGRESS",
            category: "OTHERS",
            ticketNumber: "87654321",
            citizenId: newCitizen.id
        },
        {
            id: "1213143ewpeow3",
            ticketNumber: "12345672",
            title: "Lampu Jalan Mati",
            description: "Beberapa lampu jalan di RT 05 tidak menyala pada malam hari.",
            status: "RESOLVED",
            category: "INFRASTRUCTURE",
            citizenId: newCitizen.id
        }
    ];

    await prisma.complaint.createMany({
        data: complaintsData,
        skipDuplicates: true, // Skip if the complaint already exists
    });

    console.log("Seeded complaints data.");
    await prisma.$disconnect();
}

seedComplaints().catch((e) => {
    console.error(e);
    process.exit(1);
});