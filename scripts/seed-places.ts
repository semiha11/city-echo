
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const places = [
    // ANKARA (39.9334, 32.8597)
    {
        title: "Aspava (Yıldız)",
        city: "Ankara",
        district: "Çankaya",
        description: "Ankara'nın meşhur ikramlı restoran kültürü.",
        category: "RESTAURANT",
        address: "Esat, Çankaya/Ankara",
        latitude: 39.904,
        longitude: 32.864
    },
    {
        title: "Anıtkabir",
        city: "Ankara",
        district: "Çankaya",
        description: "Atatürk'ün ebedi istirahatgahı ve tarihi müze alanı.",
        category: "MUSEUM",
        address: "Anıttepe, Çankaya/Ankara",
        latitude: 39.925,
        longitude: 32.836
    },
    {
        title: "Ankamall",
        city: "Ankara",
        district: "Yenimahalle",
        description: "Ankara'nın en köklü ve büyük alışveriş merkezlerinden biri.",
        category: "MALL",
        address: "Akköprü, Yenimahalle/Ankara",
        latitude: 39.951,
        longitude: 32.829
    },

    // ISTANBUL (41.0082, 28.9784)
    {
        title: "Çiya Sofrası",
        city: "İstanbul",
        district: "Kadıköy",
        description: "Anadolu'nun unutulmaya yüz tutmuş lezzetlerini sunan meşhur restoran.",
        category: "RESTAURANT",
        address: "Caferağa, Kadıköy/İstanbul",
        latitude: 40.989,
        longitude: 29.025
    },
    {
        title: "Galata Kulesi",
        city: "İstanbul",
        district: "Beyoğlu",
        description: "İstanbul'un simgesi olan tarihi kule ve seyir noktası.",
        category: "MUSEUM", // Historical Site mapping
        address: "Bereketzade, Beyoğlu/İstanbul",
        latitude: 41.025,
        longitude: 28.974
    },
    {
        title: "Zorlu Center",
        city: "İstanbul",
        district: "Beşiktaş",
        description: "Lüks mağazaları ve mimarisiyle ünlü yaşam merkezi.",
        category: "MALL",
        address: "Levazım, Beşiktaş/İstanbul",
        latitude: 41.066,
        longitude: 29.016
    },

    // IZMIR (38.4237, 27.1428)
    {
        title: "Tarihi Cevat'ın Yeri",
        city: "İzmir",
        district: "Güzelbahçe",
        description: "İzmir'in meşhur deniz ürünleri ve taze Efe lezzetleri.",
        category: "RESTAURANT",
        address: "Güzelbahçe/İzmir",
        latitude: 38.370,
        longitude: 26.890
    },
    {
        title: "Efes Antik Kenti",
        city: "İzmir",
        district: "Selçuk",
        description: "Dünyaca ünlü antik Roma kenti ve açık hava müzesi.",
        category: "MUSEUM", // Historical Site
        address: "Selçuk/İzmir",
        latitude: 37.941,
        longitude: 27.341
    },
    {
        title: "İstinyePark İzmir",
        city: "İzmir",
        district: "Balçova",
        description: "Şehrin en modern ve şık alışveriş destinasyonu.",
        category: "MALL",
        address: "Balçova/İzmir",
        latitude: 38.390,
        longitude: 27.060
    },

    // ANTALYA (36.8969, 30.7133)
    {
        title: "7 Mehmet",
        city: "Antalya",
        district: "Muratpaşa",
        description: "Antalya mutfağını modernize eden ödüllü ve köklü restoran.",
        category: "RESTAURANT",
        address: "Meltem, Muratpaşa/Antalya",
        latitude: 36.885,
        longitude: 30.680
    },
    {
        title: "Düden Şelalesi",
        city: "Antalya",
        district: "Kepez",
        description: "Şehrin içinden denize dökülen büyüleyici doğal güzellik.",
        category: "PARK", // Nature
        address: "Çağlayan, Muratpaşa/Antalya",
        latitude: 36.965,
        longitude: 30.730
    },
    {
        title: "TerraCity",
        city: "Antalya",
        district: "Muratpaşa",
        description: "Antalya'nın en popüler ve büyük alışveriş merkezi.",
        category: "MALL",
        address: "Fener, Muratpaşa/Antalya",
        latitude: 36.852,
        longitude: 30.755
    },

    // BURSA (40.1885, 29.0610)
    {
        title: "Kebapçı İskender (Mavi Dükkan)",
        city: "Bursa",
        district: "Osmangazi",
        description: "Meşhur Bursa İskender kebabının doğduğu tarihi nokta.",
        category: "RESTAURANT",
        address: "Osmangazi/Bursa",
        latitude: 40.185,
        longitude: 29.065
    },
    {
        title: "Uludağ Milli Parkı",
        city: "Bursa",
        district: "Osmangazi",
        description: "Türkiye'nin kış turizmi ve doğa sporları merkezi.",
        category: "PARK", // Nature
        address: "Uludağ/Bursa",
        latitude: 40.090,
        longitude: 29.130
    },
    {
        title: "Korupark",
        city: "Bursa",
        district: "Nilüfer",
        description: "Bursa'nın geniş mağaza karmasına sahip büyük alışveriş merkezi.",
        category: "MALL",
        address: "Nilüfer/Bursa",
        latitude: 40.245,
        longitude: 28.950
    }
];

async function main() {
    console.log("Starting seed...");

    // Find or Create User
    let user = await prisma.user.findFirst();
    if (!user) {
        console.log("No user found. Creating Admin user...");
        user = await prisma.user.create({
            data: {
                name: "Admin User",
                email: "admin@cityecho.com",
                username: "admin",
                role: "ADMIN"
            }
        });
    }
    console.log(`Using User ID: ${user.id}`);

    for (const place of places) {
        const exists = await prisma.place.findFirst({
            where: {
                title: place.title,
                city: place.city
            }
        });

        if (exists) {
            console.log(`Skipping existing place: ${place.title}`);
            continue;
        }

        await prisma.place.create({
            data: {
                ...place,
                user_id: user.id
            }
        });
        console.log(`Created: ${place.title}`);
    }

    console.log("Seeding completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
