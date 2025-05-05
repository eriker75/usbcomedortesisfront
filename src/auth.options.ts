import axios from "axios";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:7500";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        try {
          const response = await axios.post(`${BACKEND_URL}/api/user/verify`, {
            email: profile.email
          });

          const { exists, userData } = response.data;

          const estudianteID = profile.email.endsWith("@usb.ve")
            ? profile.email.split("@")[0]
            : null;

          return {
            id: exists ? userData._id : profile.sub,
            name: `${profile.given_name} ${profile.family_name}`,
            email: profile.email,
            image: profile.picture,
            role: exists ? userData.role : "user",
            estudianteID,
            becado: exists ? userData.becado : false,
            qrCode: exists ? userData.qrCode : null
          };
        } catch (error) {
          console.error("Error al verificar usuario:", error);
          return {
            id: profile.sub,
            name: `${profile.given_name} ${profile.family_name}`,
            email: profile.email,
            image: profile.picture,
            role: "user"
          };
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return false;

      const { email, role } = user;

      if (role === "admin") return true;

      try {
        if (!email.endsWith("@usb.ve")) {
          throw new Error(
            "Solo se pueden registrar correos que terminen en usb.ve"
          );
        }

        const verifyResponse = await axios.post(
          `${BACKEND_URL}/api/user/verify`,
          {
            email
          }
        );

        const { exists } = verifyResponse.data;

        if (!exists) {
          const createResponse = await axios.post(`${BACKEND_URL}/api/user`, {
            name: user.name,
            email: user.email,
            avatar: user.image,
            role: "user"
          });

          if (createResponse.status !== 201) {
            throw new Error("Error creating user in backend");
          }
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        throw error;
      }
    },
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    }
  },
  pages: {
    signIn: "/",
    error: "/auth/error"
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET
};
