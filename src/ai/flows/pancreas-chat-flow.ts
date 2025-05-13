
'use server';
/**
 * @fileOverview A pancreas health and Pancreas Vision assistant chatbot.
 *
 * - askPancreasAssistant - A function that handles user queries.
 * - PancreasAssistantInput - The input type for the askPancreasAssistant function.
 * - PancreasAssistantOutput - The return type for the askPancreasAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PancreasAssistantInputSchema = z.object({
  query: z.string().describe('The user query about pancreatic health or Pancreas Vision tool.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    parts: z.array(z.object({
      text: z.string()
    }))
  })).optional().describe('Previous conversation history.')
});
export type PancreasAssistantInput = z.infer<typeof PancreasAssistantInputSchema>;

const PancreasAssistantOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user query.'),
});
export type PancreasAssistantOutput = z.infer<typeof PancreasAssistantOutputSchema>;

export async function askPancreasAssistant(input: PancreasAssistantInput): Promise<PancreasAssistantOutput> {
  return askPancreasAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pancreasAssistantPrompt',
  input: {schema: PancreasAssistantInputSchema},
  output: {schema: PancreasAssistantOutputSchema},
  prompt: `You are "PancreaBot", a friendly and helpful AI assistant for the "Pancreas Vision" application.
Your role is to provide information about pancreatic health, common pancreatic diseases (like Pancreatic Cancer, Chronic Pancreatitis, Pancreatic Cysts, Acute Pancreatitis), their symptoms, risk factors, and prevention strategies based on general knowledge.
You can also answer questions about how the "Pancreas Vision" AI tool works, what it analyzes, and how to use it.

**IMPORTANT RULES:**
1.  **DO NOT PROVIDE MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT RECOMMENDATIONS.** If a user asks for medical advice or describes personal symptoms seeking a diagnosis, politely decline and strongly advise them to consult a qualified healthcare professional. Example refusal: "I cannot provide medical advice or diagnosis. It's very important to discuss any health concerns or symptoms with a doctor or other qualified healthcare provider."
2.  **Stick to Pancreas-Related Topics:** Only answer questions related to the pancreas, pancreatic diseases, pancreatic health, prevention, symptoms, and the Pancreas Vision tool.
3.  **Decline Irrelevant Questions:** If the user asks a question outside of these topics (e.g., about the weather, politics, other medical conditions not related to the pancreas), politely state that you can only help with pancreas-related queries. Example refusal: "I'm designed to help with questions about pancreatic health and the Pancreas Vision tool. How can I assist you with those topics?"
4.  **Be Concise and Clear:** Provide information in an easy-to-understand manner.
5.  **Acknowledge AI Nature:** Remind users that you are an AI and the information is for educational purposes.

You will be given the user's current query and optionally, the recent chat history. Use the history to maintain context if relevant.

User Query: {{{query}}}
`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  }
});

const askPancreasAssistantFlow = ai.defineFlow(
  {
    name: 'askPancreasAssistantFlow',
    inputSchema: PancreasAssistantInputSchema,
    outputSchema: PancreasAssistantOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input, {history: input.chatHistory}); // Pass history if available
    return output!;
  }
);
