import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const userCore = {
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email(),
  name: z.string(),
};

const createUserSchema = z.object({
  ...userCore,
  password: z.string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  }),
});

const refreshSchema = z.object({
  refreshToken: z.string()
})

const createUserResponseSchema = z.object({
  id: z.string(),
  ...userCore,
});

const loginSchema = z.object({
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

const updateUserSchema = z.object({
    email: z.string().email().optional(),
    password: z.string().optional(),
    currentEmail: z.string().email().optional(),
    currentPassword: z.string().optional(),
})

const updateUserResponseSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  password: z.string().email().optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export type RegisterUserInput = z.infer<typeof createUserSchema>;

export type SigninUserInput = z.infer<typeof loginSchema>;

export type RefreshInput = z.infer<typeof refreshSchema>

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  createUserResponseSchema,
  loginSchema,
  loginResponseSchema,
  updateUserRequestSchema: updateUserSchema,
  updateUserResponseSchema,
  refreshSchema
});