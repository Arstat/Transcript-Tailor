
'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import { summarizeTranscriptWithPrompt } from '@/ai/flows/summarize-transcript';

const resend = new Resend(process.env.RESEND_API_KEY);

const summarizeSchema = z.object({
  transcript: z.string().min(10, { message: 'Transcript must be at least 10 characters long.' }),
  prompt: z.string().min(5, { message: 'Prompt must be at least 5 characters long.' }),
});

const shareSchema = z.object({
  summary: z.string().min(10, { message: 'Summary must be at least 10 characters long.' }),
  recipients: z.string().refine((value) => {
    if (!value) return false;
    return value.split(',').every(email => z.string().email().safeParse(email.trim()).success);
  }, { message: 'Please provide a valid, comma-separated list of emails.' }),
});


export async function summarizeAction(values: z.infer<typeof summarizeSchema>): Promise<{ summary?: string; error?: string; }> {
  const validatedFields = summarizeSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const { summary } = await summarizeTranscriptWithPrompt(validatedFields.data);
    return { summary };
  } catch (error) {
    console.error('Summarization Error:', error);
    return { error: 'An unexpected error occurred while generating the summary.' };
  }
}

export async function shareAction(values: z.infer<typeof shareSchema>): Promise<{ message?: string; error?: string; }> {
  const validatedFields = shareSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid input for sharing.' };
  }
  
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
    return { error: 'Resend API key is not configured. Please add it to your .env file.' };
  }

  const { summary, recipients } = validatedFields.data;
  const recipientList = recipients.split(',').map(email => email.trim()).filter(Boolean);

  try {
    await resend.emails.send({
      from: 'Transcript Tailor <onboarding@resend.dev>',
      to: recipientList,
      subject: 'Your Meeting Summary',
      text: summary,
      html: `<p>${summary.replace(/\n/g, '<br>')}</p>`,
    });
    
    return { message: `Summary shared with ${recipientList.length} recipient(s).` };
  } catch (error) {
    console.error('Sharing Error:', error);
    if (error instanceof Error) {
        return { error: `Failed to send email: ${error.message}` };
    }
    return { error: 'An unexpected error occurred while sharing the summary.' };
  }
}
