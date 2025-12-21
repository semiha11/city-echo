// import { PrismaAdapter } from "@auth/prisma-adapter"; // Commented out to isolate issue
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";
import fs from 'fs';

export const authOptions: AuthOptions = {
    // adapter: PrismaAdapter(prisma) as any, // Not needed for credentials
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const log = (msg: string) => {
                    try {
                        const line = new Date().toISOString() + ' ' + msg + '\n';
                        fs.appendFileSync('auth-debug.log', line);
                        console.log(msg);
                    } catch (e) { console.error("Log failed", e); }
                };

                log(`Login attempt for: ${credentials?.email}`);

                try {
                    if (!credentials?.email || !credentials?.password) {
                        log("Missing credentials");
                        throw new Error("Invalid credentials");
                    }

                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    });

                    log(`User lookup result: ${user ? "Found" : "Not Found"}`);

                    if (!user || !user.password_hash) {
                        log("User missing or no hash");
                        throw new Error("User not found");
                    }

                    const isCorrectPassword = await bcrypt.compare(
                        credentials.password,
                        user.password_hash
                    );

                    log(`Password check: ${isCorrectPassword ? "VALID" : "INVALID"}`);

                    if (!isCorrectPassword) {
                        log("Password mismatch");
                        throw new Error("Invalid credentials");
                    }

                    log("Login successful, returning user");
                    return {
                        id: user.id,
                        name: user.username,
                        email: user.email,
                        image: user.image,
                        role: user.role
                    };
                } catch (error) {
                    log(`Authorize Exception: ${error}`);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user }) {
            const fs = require('fs');
            const log = (msg: string) => {
                try { fs.appendFileSync('auth-debug.log', new Date().toISOString() + ' ' + msg + '\n'); } catch (e) { }
            };

            if (user) {
                log(`JWT Callback: User ${user.email} signed in. Setting token data.`);
                token.id = user.id;
                token.role = (user as any).role;
                // token.picture = user.image; // Ensure picture is synced if needed
            } else {
                log("JWT Callback: Token refresh/check.");
            }
            return token;
        },
        async session({ session, token }) {
            const fs = require('fs');
            const log = (msg: string) => {
                try { fs.appendFileSync('auth-debug.log', new Date().toISOString() + ' ' + msg + '\n'); } catch (e) { }
            };

            log(`Session Callback: Token ID ${token?.id ? 'Generic' : 'Missing'}`); // Don't log full ID for security in prod, but ok here

            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                log(`Session Populated: Role=${(session.user as any).role}`);
            }
            return session;
        }
    },
    // Force secret here to avoid env issues
    secret: "zV22PNw8gg+IKhWotNcQmkH2u6jBEs2qPhHWUQSdX3A=",
    debug: true,
    cookies: {
        sessionToken: {
            name: `cityecho.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false // Force false for localhost
            }
        }
    }
};
