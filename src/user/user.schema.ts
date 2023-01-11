import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const createUserSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  name: z.string().min(5,"Must be 5 or more characters long").regex(new RegExp("^[a-zA-Z0-9]+$"), "Must be alphanumeric"),
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }).min(5,),
});

const refreshSchema = z.object({
  refreshToken: z.string()
})

const createUserResponseSchema = z.object({
  id: z.string(),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  name: z.string().min(5,"Must be 5 or more characters long").regex(new RegExp("^[a-zA-Z0-9]+$"), "Must be alphanumeric"),
});

const loginRequestSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  password: z.string(),
});

const loginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

const updateUserRequestSchema = z.object({
    email: z.string().email().optional(),
    currentEmail: z.string().email().optional(),
    password: z.string().optional(),
    currentPassword: z.string().min(5,"Must be 5 or more characters long").optional(),
    name: z.string().regex(new RegExp("^[a-zA-Z0-9]+$")).optional()
})

const updateUserResponseSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  password: z.string().optional(),
})



export type UpdateUserInput = z.infer<typeof updateUserRequestSchema>

export type RegisterUserInput = z.infer<typeof createUserSchema>;

export type SigninUserInput = z.infer<typeof loginRequestSchema>;

export type RefreshInput = z.infer<typeof refreshSchema>

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  createUserResponseSchema,
  loginRequestSchema,
  loginResponseSchema,
  updateUserRequestSchema,
  updateUserResponseSchema,
  refreshSchema
},{$id: "User", target:'openApi3'});