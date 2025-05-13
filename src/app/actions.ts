'use server';

import { analyzePancreasScan, type AnalyzePancreasScanInput, type AnalyzePancreasScanOutput } from '@/ai/flows/analyze-pancreas-scan';
import { z } from 'zod';

const PerformImageAnalysisInputSchema = z.object({
  scanDataUri: z.string().refine(val => val.startsWith('data:image/jpeg;base64,') || val.startsWith('data:image/png;base64,'), {
    message: 'Scan must be a valid JPG or PNG image data URI.',
  }),
});

export interface FormState {
  data: AnalyzePancreasScanOutput | null;
  error: string | null;
  message: string | null;
}

export async function performImageAnalysis(
  prevState: FormState | null, // Allow null for initial state
  formData: FormData
): Promise<FormState> {
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
