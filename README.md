# AI-Powered Summarizer

AI-Powered Summarizer is an intelligent application designed to streamline the process of summarizing and sharing meeting notes or call transcripts. By leveraging a powerful AI model, it transforms lengthy text into concise, easy-to-digest summaries. Users can upload a text file, provide a custom prompt to guide the summarization, edit the result, and share it via email directly from the app.

## Project Philosophy

The core idea behind this project is to build a simple, yet powerful tool that solves a common problem: information overload from long transcripts. The approach is to provide a user-friendly interface that abstracts away the complexity of the AI model, making it accessible to everyone.

The development process focuses on:
- **Component-Based Architecture:** Building the UI with reusable React components for maintainability.
- **Server-First Logic:** Utilizing Next.js Server Actions to handle form submissions and AI processing securely on the server.
- **Type Safety:** Using TypeScript to catch errors early and improve code quality.
- **Progressive Enhancement:** The application is functional and provides a good user experience, with a clear path for adding more features in the future.

## Features

- **Intuitive File Upload**: Easily upload `.txt` files containing your meeting notes or transcripts.
- **Customizable AI Prompts**: Tailor the AI's output by providing specific instructions. For example, you can ask it to "focus on action items," "create a high-level executive summary," or "extract all questions asked."
- **Powerful AI Summarization**: Employs Google's Gemini model via Genkit to generate high-quality summaries based on the provided transcript and prompt.
- **Interactive Editing**: The generated summary is not final. It's presented in an editable text area, allowing for quick manual refinements and corrections.
- **Seamless Email Sharing**: Share the finalized summary with multiple recipients without leaving the application.

## Tech Stack

This project is built with a modern, robust, and scalable tech stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router) - Chosen for its performance benefits, Server Components, and streamlined developer experience.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) - A utility-first CSS framework combined with a set of beautifully designed and accessible components, allowing for rapid and consistent UI development.
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) with [Google AI](https://ai.google/) - Provides a structured and maintainable way to define and run AI-powered flows using the powerful Gemini family of models.
- **Form Management**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) - A powerful combination for creating performant, accessible, and easily validated forms.
- **Email Delivery**: [Resend](https://resend.com) - A developer-friendly email API for reliable and scalable email sending.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-powered-summarizer.git
    cd ai-powered-summarizer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    This project uses Genkit with Google AI and Resend for emails. You will need to obtain API keys from both services.

    Create a `.env` file in the root of your project and add your API keys:
    ```
    GOOGLE_API_KEY="your_google_ai_api_key_here"
    RESEND_API_KEY="your_resend_api_key_here"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## How to Use

1.  Click the **Upload File** button to select a `.txt` transcript file from your computer.
2.  (Optional) Modify the **Custom Prompt** to guide the AI's summary.
3.  Click **Generate Summary**.
4.  The AI-generated summary will appear in the **Review & Share** section. You can edit the text directly.
5.  Enter a comma-separated list of recipient email addresses in the **Recipient Emails** field.
6.  Click **Share via Email**.

## Project Structure

The codebase is organized to be clean and scalable:

-   `src/app/`: Contains the main application pages, server actions (`actions.ts`), and global styles.
-   `src/ai/`: Holds all the Genkit-related code.
    -   `src/ai/flows/`: Contains the AI flows that define the logic for interacting with the language model.
-   `src/components/`: Shared React components used throughout the application, including the UI components from `shadcn/ui`.
-   `src/hooks/`: Custom React hooks, such as `use-toast` for notifications.
-   `src/lib/`: Utility functions.
-   `public/`: Static assets.

This structure separates concerns, making it easier to navigate, maintain, and extend the application.
