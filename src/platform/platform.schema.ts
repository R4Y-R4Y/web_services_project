import { buildJsonSchemas } from "fastify-zod";
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

const getPlatformUniqueResponse = z.object({
    id: z.string(),
    name: z.string(),
    link: z.string(),
    description: z.string(),
    services: z.object({}),
})

const getServiceUniqueResponse = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    platform_id: z.string(),
    platform: z.object({}),
})

const getPlatformListResponse = z.array(getPlatformUniqueResponse)

const getServiceMultipleResponse = z.array(getServiceUniqueResponse)

export type GetContentPaginationInput = z.infer<typeof getContentPaginationSchema>

export type GetContentInput = z.infer<typeof getContentSchema>

export const { schemas: platformSchemas, $ref } = buildJsonSchemas({
    getContentSchema,
    getContentPaginationSchema,
    getPlatformListResponse,
    getPlatformUniqueResponse,
    getServiceMultipleResponse,
    getServiceUniqueResponse
},{$id: "Platform", target:'openApi3'});