import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri = process.env.BETTER_AUTH_DB_URI as string;

// MongoDB ক্লায়েন্ট ইনিশিয়ালাইজেশন
const client = new MongoClient(uri);
const db = client.db('bazar-dor');

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: { 
    google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
        
    github: { 
      clientId: process.env.GITHUB_CLIENT_ID || "", 
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "", 
    }, 
  },
});

