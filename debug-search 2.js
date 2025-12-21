
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const normalizeTurkish = (text) => {
    return text
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/i̇/g, 'i') // Handle decomposed i
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c');
};

async function main() {
    console.log("--- Normalization Test ---");
    const cities = ["İstanbul", "İzmir", "Şişli", "Çeşme", "Ağrı"];
    cities.forEach(c => {
        console.log(`Original: ${c}, Lower: ${c.toLowerCase()}, Normalized: ${normalizeTurkish(c)}`);
    });

    console.log("\n--- Query Test 'is' ---");
    const q = "is";
    const nQ = normalizeTurkish(q);
    console.log(`Query: ${q}, Normalized: ${nQ}`);

    cities.forEach(c => {
        const nC = normalizeTurkish(c);
        console.log(`Match '${c}' (${nC}) with '${nQ}': ${nC.includes(nQ)}`);
    });

    console.log("\n--- DB Check ---");
    const places = await prisma.place.findMany({
        where: { isApproved: true },
        select: { title: true, city: true, category: true }
    });
    console.log(`Total Approved Places: ${places.length}`);
    places.forEach(p => {
        console.log(`Place: ${p.title}, City: ${p.city}, Cat: ${p.category}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
