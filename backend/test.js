async function addDevice() {
    const url = 'http://localhost:3000/api/device';
    
    console.log("🚀 Memulai proses pengiriman data secara bertahap...");

    for (let i = 0; i < 20; i++) {
        const deviceData = { 
            name: `Andy${i + 1}`, 
            number: "081228895144", 
            status: "CONNECTED" 
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deviceData), // Kirim 1 objek saja per request
            });

            if (!response.ok) {
                console.error(`❌ Gagal kirim data ke-${i + 1}: Status ${response.status}`);
            } else {
                const result = await response.json();
                console.log(`✅ Berhasil [${i + 1}/20]: ${deviceData.name}`);
            }

            // Opsional: Kasih jeda sedikit (misal 100ms) agar server tidak kaget
            // await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
            console.error(`💥 Error pada data ke-${i + 1}:`, error.message);
        }
    }
    
    console.log("🏁 Semua proses pengiriman selesai.");
}

addDevice();