import { z } from "zod";


const getContentSchema = z.object({
    name: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
    })
})

const getContentPaginationSchema = z.object({
    name: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
    }),
    page: z.number({
        required_error: 'Page is required',
        invalid_type_error: 'Page must be a number',
    })
})

export type GetContentPaginationInput = z.infer<typeof getContentPaginationSchema>

export type GetContentInput = z.infer<typeof getContentSchema>