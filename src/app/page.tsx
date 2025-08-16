import { TranscriptForm } from './transcript-form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-3xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
            Transcript Tailor
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Upload a transcript, provide a prompt, and let AI craft the perfect
            summary.
          </p>
        </header>
        <TranscriptForm />
      </div>
    </main>
  );
}
