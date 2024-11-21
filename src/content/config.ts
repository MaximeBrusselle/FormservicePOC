import { z, defineCollection } from "astro:content";

const customerCollection = defineCollection({
    type: "content",
    schema: z.object({
        id: z.number(),
        name: z.string(),
        description: z.string().optional().default(""),
        image: z.string().url().optional(),
    }),
});

export const collections = {
    customers: customerCollection,
};
