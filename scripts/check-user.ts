import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'semihagokmen2@gmail.com';
    const rawPassword = 'neymar11';

    console.log(`🔍 Checking user: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.error('❌ User NOT found in database!');
        return;
    }

    console.log('✅ User found:', user.id);
    console.log('   Name:', user.name);
    console.log('   Role:', user.role);
    console.log('   Hash exists:', !!user.password_hash);

    if (user.password_hash) {
        const isValid = await bcrypt.compare(rawPassword, user.password_hash);
        console.log(`🔐 Password '${rawPassword}' match: ${isValid ? 'YES ✅' : 'NO ❌'}`);

        // Also check '123123' just in case
        const isOldValid = await bcrypt.compare('123123', user.password_hash);
        console.log(`🔐 Password '123123' match: ${isOldValid ? 'YES ✅' : 'NO ❌'}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
