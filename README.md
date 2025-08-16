# Transcript Tailor

Transcript Tailor is an AI-powered application that helps you quickly summarize and share meeting notes or call transcripts. Upload a text file, provide a custom prompt, and let the AI generate a concise summary. You can then edit the summary and share it via email directly from the app.

## Features

- **File Upload**: Upload `.txt` files containing your meeting notes or transcripts.
- **Custom Prompts**: Guide the AI summarization with specific instructions (e.g., "focus on action items", "create a high-level executive summary").
- **AI Summarization**: Utilizes a powerful language model to generate summaries based on your input.
- **Editable Results**: The generated summary is displayed in an editable text area, allowing for manual refinements.
- **Email Sharing**: Easily share the final summary with multiple recipients.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components
- **AI**: [Google AI](https://ai.google/) via Genkit
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/transcript-tailor.git
    cd transcript-tailor
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    This project uses Genkit with Google AI. You will need to obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

    Create a `.env.local` file in the root of your project and add your API key:
    ```
    GOOGLE_API_KEY=your_google_ai_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## How to Use

1.  Click the "Upload .txt file" button to select a transcript file from your computer.
2.  (Optional) Modify the custom prompt in the text area to guide the AI's summary.
3.  Click "Generate Summary". The app will process the transcript and display the AI-generated summary.
4.  The summary appears in an editable text box. You can make any changes you like.
5.  Enter a comma-separated list of recipient email addresses in the "Recipient Emails" field.
6.  Click "Share via Email". The application will simulate sending the email (check your server console for the output).
