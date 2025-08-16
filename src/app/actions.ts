
'use server';

import { z } from 'zod';
import { summarizeTranscriptWithPrompt } from '@/ai/flows/summarize-transcript';
import nodemailer from 'nodemailer';

const summarizeSchema = z.object({
  transcript: z.string().min(10, { message: 'Transcript must be at least 10 characters long.' }),
  prompt: z.string().min(5, { message: 'Prompt must be at least 5 characters long.' }),
});

const shareSchema = z.object({
  summary: z.string().min(10, { message: 'Summary must be at least 10 characters long.' }),
  subject: z.string().min(3, { message: 'Subject must be at least 3 characters long.' }),
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

  const {
    EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD,
    EMAIL_FROM,
  } = process.env;

  if (!EMAIL_SERVER_HOST || !EMAIL_SERVER_PORT || !EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD || !EMAIL_FROM) {
      return { error: 'Email server is not configured. Please set up the required environment variables.' };
  }
  
  const transporter = nodemailer.createTransport({
    host: EMAIL_SERVER_HOST,
    port: Number(EMAIL_SERVER_PORT),
    secure: Number(EMAIL_SERVER_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_SERVER_USER,
      pass: EMAIL_SERVER_PASSWORD,
    },
  });

  const { summary, recipients, subject } = validatedFields.data;
  const recipientList = recipients.split(',').map(email => email.trim()).filter(Boolean);

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: recipientList.join(','),
      subject: subject,
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
