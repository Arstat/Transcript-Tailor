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
- **Seamless Email Sharing**: Share the finalized summary with multiple recipients without leaving the application, using your own Gmail account via OAuth 2.0.

## Tech Stack

This project is built with a modern, robust, and scalable tech stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router) - Chosen for its performance benefits, Server Components, and streamlined developer experience.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) - A utility-first CSS framework combined with a set of beautifully designed and accessible components, allowing for rapid and consistent UI development.
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) with [Google AI](https://ai.google/) - Provides a structured and maintainable way to define and run AI-powered flows using the powerful Gemini family of models.
- **Form Management**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) - A powerful combination for creating performant, accessible, and easily validated forms.
- **Email Delivery**: [Nodemailer](https://nodemailer.com/) with [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2) - A secure and reliable method for sending emails through your Gmail account.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later)
- [npm](https://www.npmjs.com/)
- A Google Account

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

    This project requires two sets of credentials: one for AI and one for email.

    Create a `.env` file in the root of your project by copying the provided `.env.example` or creating a new one. You will need to populate it with API keys from Google AI and credentials from the Google Cloud Console.

    #### **1. Google AI API Key (for Summarization)**
    - Go to **[Google AI Studio](https://aistudio.google.com/app/apikey)**.
    - Click **"Create API key"**. You can create it in a new or existing Google Cloud project.
    - **Copy** the generated API key.
    - Add it to your `.env` file:
      ```
      GOOGLE_API_KEY="your_google_ai_api_key_here"
      ```

    #### **2. Google OAuth 2.0 Credentials (for Email)**
    Follow these steps carefully to allow the application to send emails on your behalf securely.
    1.  **Create a Google Cloud Project**: Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new project (or use the same one from the AI key step).
    2.  **Enable the Gmail API**: In your new project, navigate to "APIs & Services" > "Library", search for "Gmail API", and **Enable** it.
    3.  **Configure OAuth Consent Screen**: Go to "APIs & Services" > "OAuth consent screen".
        - Choose **External** and click "Create".
        - Fill in the required app information (app name, user support email, and developer contact).
        - **Important:** While in testing mode, you must add your own email address under the "Test users" section to be able to log in.
    4.  **Create Credentials**:
        - Go to "APIs & Services" > "Credentials".
        - Click **+ CREATE CREDENTIALS** and select "OAuth client ID".
        - For "Application type", choose **Web application**.
        - Under "Authorized redirect URIs", click **+ ADD URI** and enter this exact URL: `https://developers.google.com/oauthplayground`. 
        - **Warning:** The `redirect_uri_mismatch` error occurs if this URL is not exactly correct. Do not use `http` or add a trailing slash.
        - Click "Create". You will be shown a **Client ID** and **Client Secret**.
    5.  **Get a Refresh Token**:
        - Open the [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
        - Click the gear icon in the top right, check **"Use your own OAuth credentials"**, and paste in your Client ID and Client Secret.
        - In Step 1, find and authorize the **Gmail API** scope: `https://mail.google.com/`.
        - Click "Authorize APIs". You will be prompted to sign in and grant permission.
        - In Step 2, click **"Exchange authorization code for tokens"**. This will give you a **Refresh token**.
    6.  **Update `.env` file**: Copy the credentials into your `.env` file.

    Your final `.env` file should look like this:
    ```
    # For AI Summarization
    GOOGLE_API_KEY="your_google_ai_api_key"

    # For Sending Email
    OAUTH_CLIENT_ID="your_google_cloud_client_id"
    OAUTH_CLIENT_SECRET="your_google_cloud_client_secret"
    OAUTH_REFRESH_TOKEN="your_refresh_token_from_playground"
    EMAIL_SERVER_USER="your.email@gmail.com"
    EMAIL_FROM="your.email@gmail.com"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

### Troubleshooting Email Errors

- **`redirect_uri_mismatch`**: This error means the "Authorized redirect URI" in your Google Cloud credentials does not exactly match `https://developers.google.com/oauthplayground`. Go back to your credentials in the Google Cloud Console and ensure the URI is correct.
- **`invalid_grant`**: This almost always means your **Refresh Token** is invalid or expired.
    - **7-Day Expiration**: If your app's OAuth Consent Screen is in "Testing" mode, your refresh token will expire after 7 days.
    - **Solution**: The quickest fix is to simply generate a new one. Go back to the [OAuth Playground](https://developers.google.com/oauthplayground) and repeat Step 5 to get a new refresh token and update your `.env` file. To get a long-lasting token, you may need to "publish" your app from the OAuth consent screen page in the Google Cloud Console.

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
