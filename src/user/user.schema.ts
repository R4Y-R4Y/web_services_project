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

const createUserResponseSchema = z.object({
  id: z.string(),
  ...userCore,
  accessToken: z.string(),
  refreshToken: z.string()
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
    email: z.optional(z.string().email()),
    password: z.optional(z.string().email()),
})

const updateUserResponseSchema = z.object({
  id: z.string(),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().email()),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export type RegisterUserInput = z.infer<typeof createUserSchema>;

export type SigninUserInput = z.infer<typeof loginSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  createUserSchema,
  createUserResponseSchema,
  loginSchema,
  loginResponseSchema,
  updateUserRequestSchema: updateUserSchema,
  updateUserResponseSchema
});