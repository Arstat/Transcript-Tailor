
'use client';

import { useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { summarizeAction, shareAction } from './actions';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Upload, Mail, FileText } from 'lucide-react';

const summarizeSchema = z.object({
  transcript: z.string().min(1, { message: 'Please upload a transcript file.' }),
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

export function TranscriptForm() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();

  const summarizeForm = useForm<z.infer<typeof summarizeSchema>>({
    resolver: zodResolver(summarizeSchema),
    defaultValues: {
      transcript: '',
      prompt: 'Summarize this meeting into key bullet points and action items.',
    },
  });

  const shareForm = useForm<z.infer<typeof shareSchema>>({
    resolver: zodResolver(shareSchema),
    defaultValues: {
      summary: '',
      subject: '',
      recipients: '',
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/plain') {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a plain text (.txt) file.',
        });
        setFileName(null);
        summarizeForm.setValue('transcript', '');
        event.target.value = ''; // Reset file input
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        summarizeForm.setValue('transcript', text, { shouldValidate: true });
      };
      reader.readAsText(file);
    }
  };
  
  const onSummarizeSubmit = async (values: z.infer<typeof summarizeSchema>) => {
    const result = await summarizeAction(values);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.summary) {
      setSummary(result.summary);
      shareForm.setValue('summary', result.summary);
      shareForm.setValue('subject', `Summary for ${fileName || 'Transcript'}`);
      toast({
        title: 'Success!',
        description: 'Your summary has been generated.',
      });
    }
  };

  const onShareSubmit = async (values: z.infer<typeof shareSchema>) => {
    const result = await shareAction(values);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else if (result.message) {
      toast({
        title: 'Email Sent!',
        description: result.message,
      });
      shareForm.reset({ summary: values.summary, subject: values.subject, recipients: '' });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center font-bold text-lg">1</span>
            Generate Summary
          </CardTitle>
          <CardDescription>
            Upload your meeting transcript and provide a prompt to create a custom summary.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...summarizeForm}>
            <form onSubmit={summarizeForm.handleSubmit(onSummarizeSubmit)} className="space-y-6">
              <FormItem>
                <FormLabel>Meeting Transcript (.txt file)</FormLabel>
                <FormControl>
                    <Input id="file-upload" type="file" accept=".txt" onChange={handleFileChange} className="sr-only" />
                </FormControl>
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline" asChild>
                    <Label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {fileName ? 'Change File' : 'Upload File'}
                    </Label>
                  </Button>
                   {fileName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in">
                      <FileText className="h-4 w-4" />
                      <span>{fileName}</span>
                    </div>
                  )}
                </div>
                 <FormField
                    control={summarizeForm.control}
                    name="transcript"
                    render={({ field }) => (
                        <FormControl>
                           <Textarea {...field} className="hidden" />
                        </FormControl>
                    )}
                 />
                 <FormMessage>{summarizeForm.formState.errors.transcript?.message}</FormMessage>
              </FormItem>

              <FormField
                control={summarizeForm.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Summarize in bullet points for executives"
                        className="resize-y min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={summarizeForm.formState.isSubmitting}>
                {summarizeForm.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Summary
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {summary !== null && (
        <Card className="w-full shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center font-bold text-lg">2</span>
              Review & Share
            </CardTitle>
            <CardDescription>
              Edit your summary below and share it via email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...shareForm}>
              <form onSubmit={shareForm.handleSubmit(onShareSubmit)} className="space-y-6">
                <FormField
                  control={shareForm.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Editable Summary</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[250px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={shareForm.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Summary for our meeting"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={shareForm.control}
                  name="recipients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Emails (comma-separated)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="user1@example.com, user2@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={shareForm.formState.isSubmitting}>
                  {shareForm.formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  Share via Email
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
