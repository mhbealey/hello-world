import { z } from "zod";

// Chat message schema
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(10),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

// Advisor request schema
export const advisorRequestSchema = z.object({
  selected_action_ids: z.array(z.string().uuid()).min(1),
  source_context: z.string().optional(),
  selected_time: z.string().min(1),
});

export type AdvisorRequestInput = z.infer<typeof advisorRequestSchema>;

// Export params schema
export const exportParamsSchema = z.object({
  screen: z.enum(["home", "risk", "actions", "ai", "funds"]),
  format: z.enum(["pdf"]).default("pdf"),
});

export type ExportParams = z.infer<typeof exportParamsSchema>;

// Step completion schema
export const stepCompletionSchema = z.object({
  action_id: z.string().uuid(),
  step_id: z.string().uuid(),
});

export type StepCompletionInput = z.infer<typeof stepCompletionSchema>;

// Resolution schema
export const resolutionSchema = z.object({
  action_id: z.string().uuid(),
});

export type ResolutionInput = z.infer<typeof resolutionSchema>;

// Webhook schema
export const webhookSchema = z.object({
  type: z.string(),
  payload: z.record(z.unknown()),
});

export type WebhookInput = z.infer<typeof webhookSchema>;
