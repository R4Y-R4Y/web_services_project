import { z } from "zod";

const getPlatformSingleSchema = z.object({
    name: z.string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
    }),
})

export type GetPlatformSingleInput = z.infer<typeof getPlatformSingleSchema>