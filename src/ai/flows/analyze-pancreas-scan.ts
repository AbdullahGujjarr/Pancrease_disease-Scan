// use server'
'use server';

/**
 * @fileOverview Analyzes a pancreas scan image to detect signs of four major pancreatic diseases.
 *
 * - analyzePancreasScan - A function that handles the pancreas scan analysis process.
 * - AnalyzePancreasScanInput - The input type for the analyzePancreasScan function.
 * - AnalyzePancreasScanOutput - The return type for the analyzePancreasScan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePancreasScanInputSchema = z.object({
  scanDataUri: z
    .string()
    .describe(
      "A pancreas scan image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzePancreasScanInput = z.infer<typeof AnalyzePancreasScanInputSchema>;

const AnalyzePancreasScanOutputSchema = z.object({
  pancreaticCancerProbability: z
    .number()
    .describe('The probability score indicating the presence or severity of Pancreatic Cancer.'),
  chronicPancreatitisProbability: z
    .number()
    .describe('The probability score indicating the presence or severity of Chronic Pancreatitis.'),
  pancreaticCystsProbability: z
    .number()
    .describe('The probability score indicating the presence or severity of Pancreatic Cysts.'),
  acutePancreatitisProbability: z
    .number()
    .describe('The probability score indicating the presence or severity of Acute Pancreatitis.'),
});
export type AnalyzePancreasScanOutput = z.infer<typeof AnalyzePancreasScanOutputSchema>;

export async function analyzePancreasScan(input: AnalyzePancreasScanInput): Promise<AnalyzePancreasScanOutput> {
  return analyzePancreasScanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePancreasScanPrompt',
  input: {schema: AnalyzePancreasScanInputSchema},
  output: {schema: AnalyzePancreasScanOutputSchema},
  prompt: `You are an expert radiologist specializing in the diagnosis of pancreatic diseases. Analyze the provided pancreas scan image and provide probability scores for the presence or severity of each of the following conditions:

- Pancreatic Cancer
- Chronic Pancreatitis
- Pancreatic Cysts
- Acute Pancreatitis

Ensure that the probabilities are represented as numerical values between 0 and 1.

Pancreas Scan Image: {{media url=scanDataUri}}`,
});

const analyzePancreasScanFlow = ai.defineFlow(
  {
    name: 'analyzePancreasScanFlow',
    inputSchema: AnalyzePancreasScanInputSchema,
    outputSchema: AnalyzePancreasScanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
