import { z } from "zod";


const getContentSchema = z.object({
    name: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
    })
})

export type GetContentInput = z.infer<typeof getContentSchema>