// server';
'use server';

import { analyzePancreasScan, type AnalyzePancreasScanInput, type AnalyzePancreasScanOutput } from '@/ai/flows/analyze-pancreas-scan';
// Removed chatbot import: import { askPancreasAssistant, type PancreasAssistantInput, type PancreasAssistantOutput } from '@/ai/flows/pancreas-chat-flow';
import { z } from 'zod';

const PerformImageAnalysisInputSchema = z.object({
  scanDataUri: z.string().refine(val => val.startsWith('data:image/jpeg;base64,') || val.startsWith('data:image/png;base64,'), {
    message: 'Scan must be a valid JPG or PNG image data URI.',
  }),
});

// Renamed from FormState to AnalysisFormState
export interface AnalysisFormState {
  data: AnalyzePancreasScanOutput | null;
  error: string | null;
  message: string | null;
}

export async function performImageAnalysis(
  prevState: AnalysisFormState | null,
  formData: FormData
): Promise<AnalysisFormState> {
  const scanDataUri = formData.get('scanDataUri') as string;

  const validatedFields = PerformImageAnalysisInputSchema.safeParse({ scanDataUri });

  if (!validatedFields.success) {
    return {
      data: null,
      error: validatedFields.error.flatten().fieldErrors.scanDataUri?.join(', ') || 'Invalid input provided for scan data URI.',
      message: null,
    };
  }

  try {
    const result = await analyzePancreasScan({ scanDataUri: validatedFields.data.scanDataUri });
    return { data: result, error: null, message: 'Analysis successful. Results are displayed below.' };
  } catch (error) {
    console.error('Error during AI analysis:', error);
    const errorMessage = (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') 
        ? error.message
        : 'An unexpected error occurred during analysis. Please try again.';
    return { data: null, error: errorMessage, message: null };
  }
}


// Chatbot Action and related code removed
/*
const AskPancreasAssistantInputSchema = z.object({
  query: z.string().min(1, "Query cannot be empty."),
  chatHistory: z.string().optional(), // JSON string of chat history
});

export interface ChatbotFormState {
  response: string | null;
  error: string | null;
  userQuery: string | null; 
}

export async function askPancreasAssistantAction(
  prevState: ChatbotFormState | null,
  formData: FormData
): Promise<ChatbotFormState> {
  const query = formData.get('query') as string;
  const rawChatHistory = formData.get('chatHistory') as string | undefined;

  const validatedFields = AskPancreasAssistantInputSchema.safeParse({ query, chatHistory: rawChatHistory });

  if (!validatedFields.success) {
    return {
      response: null,
      error: validatedFields.error.flatten().fieldErrors.query?.join(', ') || 'Invalid query.',
      userQuery: query,
    };
  }

  let parsedChatHistory: PancreasAssistantInput['chatHistory'] = [];
  if (validatedFields.data.chatHistory) {
    try {
      parsedChatHistory = JSON.parse(validatedFields.data.chatHistory);
    } catch (e) {
      console.error("Failed to parse chat history:", e);
      // Continue without history if parsing fails
    }
  }
  
  try {
    const assistantInput: PancreasAssistantInput = { 
      query: validatedFields.data.query,
      chatHistory: parsedChatHistory
    };
    const result = await askPancreasAssistant(assistantInput);
    return { response: result.response, error: null, userQuery: validatedFields.data.query };
  } catch (error) {
    console.error('Error during Chatbot AI call:', error);
     const errorMessage = (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') 
        ? error.message
        : 'An unexpected error occurred while talking to the assistant. Please try again.';
    return { response: null, error: errorMessage, userQuery: validatedFields.data.query };
  }
}
*/
