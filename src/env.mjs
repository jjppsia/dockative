import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
	server: {
		CLERK_SECRET_KEY: z.string().min(1),
		DATABASE_URL: z.string().min(1),
		OPENAI_API_KEY: z.string().min(1),
		PINECONE_API_KEY: z.string().min(1),
		PINECONE_ENVIRONMENT: z.string().min(1),
		UPLOADTHING_SECRET: z.string().min(1),
		UPLOADTHING_APP_ID: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
	},
})
