
'use server';

import { z } from 'zod';
import { summarizeTranscriptWithPrompt } from '@/ai/flows/summarize-transcript';

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

  const { summary, recipients } = validatedFields.data;
  const recipientList = recipients.split(',').map(email => email.trim()).filter(Boolean);

  try {
    // This is a mock implementation. In a real application, you would use an email service
    // like Nodemailer, Resend, SendGrid, etc.
    console.log('--- MOCK EMAIL SEND ---');
    console.log(`To: ${recipientList.join(', ')}`);
    console.log('Subject: Your Meeting Summary');
    console.log('Body:');
    console.log(summary);
    console.log('-----------------------');
    
    return { message: `Summary shared with ${recipientList.length} recipient(s).` };
  } catch (error) {
    console.error('Sharing Error:', error);
    return { error: 'An unexpected error occurred while sharing the summary.' };
  }
}
