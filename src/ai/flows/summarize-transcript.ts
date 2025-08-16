'use server';

/**
 * @fileOverview Summarizes a transcript using a custom prompt.
 *
 * - summarizeTranscriptWithPrompt - A function that summarizes the transcript with a prompt.
 * - SummarizeTranscriptWithPromptInput - The input type for the summarizeTranscriptWithPrompt function.
 * - SummarizeTranscriptWithPromptOutput - The return type for the summarizeTranscriptWithPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTranscriptWithPromptInputSchema = z.object({
  transcript: z.string().describe('The transcript to summarize.'),
  prompt: z.string().describe('The prompt to use for summarization.'),
});
export type SummarizeTranscriptWithPromptInput = z.infer<
  typeof SummarizeTranscriptWithPromptInputSchema
>;

const SummarizeTranscriptWithPromptOutputSchema = z.object({
  summary: z.string().describe('The summarized transcript.'),
});
export type SummarizeTranscriptWithPromptOutput = z.infer<
  typeof SummarizeTranscriptWithPromptOutputSchema
>;

export async function summarizeTranscriptWithPrompt(
  input: SummarizeTranscriptWithPromptInput
): Promise<SummarizeTranscriptWithPromptOutput> {
  return summarizeTranscriptWithPromptFlow(input);
}

const summarizeTranscriptWithPromptPrompt = ai.definePrompt({
  name: 'summarizeTranscriptWithPromptPrompt',
  input: {schema: SummarizeTranscriptWithPromptInputSchema},
  output: {schema: SummarizeTranscriptWithPromptOutputSchema},
  prompt: `Summarize the following transcript based on the prompt provided.\n\nTranscript: {{{transcript}}}\n\nPrompt: {{{prompt}}}`,
});

const summarizeTranscriptWithPromptFlow = ai.defineFlow(
  {
    name: 'summarizeTranscriptWithPromptFlow',
    inputSchema: SummarizeTranscriptWithPromptInputSchema,
    outputSchema: SummarizeTranscriptWithPromptOutputSchema,
  },
  async input => {
    const {output} = await summarizeTranscriptWithPromptPrompt(input);
    return output!;
  }
);
