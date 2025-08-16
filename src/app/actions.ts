
'use server';

import { z } from 'zod';
import { summarizeTranscriptWithPrompt } from '@/ai/flows/summarize-transcript';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

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
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    OAUTH_REFRESH_TOKEN,
    EMAIL_SERVER_USER,
    EMAIL_FROM,
  } = process.env;

  if (!OAUTH_CLIENT_ID || !OAUTH_CLIENT_SECRET || !OAUTH_REFRESH_TOKEN || !EMAIL_SERVER_USER || !EMAIL_FROM) {
      return { error: 'Email server is not configured. Please set up the required OAuth 2.0 environment variables.' };
  }

  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2(
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground" // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token: OAUTH_REFRESH_TOKEN,
  });

  try {
    const { token: accessToken } = await oauth2Client.getAccessToken();
    if (!accessToken) {
      return { error: 'Failed to create access token for email.' };
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: EMAIL_SERVER_USER,
            clientId: OAUTH_CLIENT_ID,
            clientSecret: OAUTH_CLIENT_SECRET,
            refreshToken: OAUTH_REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });

    const { summary, recipients, subject } = validatedFields.data;
    const recipientList = recipients.split(',').map(email => email.trim()).filter(Boolean);

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
