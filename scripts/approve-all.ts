
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Approving all places...");
    const result = await prisma.place.updateMany({
        data: {
            isApproved: true
        }
    });
    console.log(`Approved ${result.count} places.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
