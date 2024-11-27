## ChatPDF Clone

ChatPDF Clone is an intuitive tool for interacting with PDF content using natural language. Powered by Next.js, ShadCN, Tailwind CSS, LangChain, OpenAI, Firebase and Pinecone DB, this application allows users to upload PDFs and engage in conversational queries about the content.
___

## Features
•	PDF Upload: Easily upload PDF files for processing and content extraction.

•	AI-Powered Chat: Ask natural language questions and receive accurate, context-aware answers based on the PDF content.

•	Semantic Search: Quickly find relevant content using Pinecone’s vector database for semantic search.

•	Modern UI: Beautiful, responsive design built with ShadCN and Tailwind CSS.

•	Highly Scalable: Backend powered by LangChain, OpenAI and Firebase ensuring efficient and accurate responses.
___

## Tech Stack
•	Frontend: [Next.js](https://nextjs.org/), [ShadCN](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com)

•	Backend: [LangChain](https://www.langchain.com/), [OpenAI GPT](https://openai.com/), [Pinecone DB](https://www.pinecone.io/), [Vercel AI Sdk](https://sdk.vercel.ai/), [Firebase](https://firebase.google.com)

•	Styling: [ShadCN](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com)
___

## Installation

### Prerequisites

•	Node.js v18+

•	npm or yarn

•	API keys for OpenAI and Pinecone
___

### Steps

**1. Clone the repository:**

````bash
git clone https://github.com/yekoko/ChatPDF-clone.git
cd ChatPDF-clone
````

**2. Install dependencies:**
````bash
npm install  
````

**3. Set up environment variables:**
Create a .env file in the root directory with the following variables:

````
# AWS S3
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your-api-key  
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your-api-key  
NEXT_PUBLIC_AWS_S3_BUCKET_NAME=your-api-key  
NEXT_PUBLIC_AWS_S3_BUCKET_REGION=your-api-key  

# PineconeDB
NEXT_PUBLIC_PINECONE_DB_API_KEY=your-api-key  
NEXT_PUBLIC_PINECONE_DB_REGION=your-api-key  
NEXT_PUBLIC_PINECONE_INDEX=your-api-key  

# OpenAI
NEXT_PUBLIC_OPENAI_KEY=your-api-key

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-api-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-api-key
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-api-key
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-api-key
NEXT_PUBLIC_FIREBASE_APP_ID=your-api-key
````

**4. Run the development server:**

````
npm run dev
````

**5. Access the application:**
Open http://localhost:3000 in your browser.
___

## Usage

1. Upload PDF: Drag and drop a PDF file or select it from your device.

2. Chat with AI: Ask questions about the document content through a chat interface.

3. Search Content: Use the semantic search feature to quickly find specific sections.
___

## Key Libraries and Dependencies
•	**Next.js**: React framework for building fast and scalable web applications.

•	**ShadCN**: UI library for Next.js, tailored with Tailwind CSS.

•	**Tailwind CSS**: Utility-first CSS framework for modern designs.

•	**LangChain**: Framework for conversational AI and interaction logic.

•	**OpenAI API**: GPT models for natural language understanding and generation.

•	**Pinecone DB**: High-performance vector database for semantic search.

•   **Firebase**: Using Authentication for secure user login and **Firestore** for scalable real-time NoSQL database storage and synchronization.

•	**Vercel AI SDK**: Simplifies serverless deployment and integrates AI features like streaming APIs, edge functions, and more into Next.js applications.
___

## Deployment

**1.Build the application for production:**
````
npm run build
````
**2. Start the production server:**
```
npm start  
```

**3. Deployment options:**

•	Deploy on [Vercel](https://vercel.com/) for seamless integration with Next.js.

•	Use any cloud platform (e.g., AWS, Netlify, or Render).
___

## License
This project is licensed under the MIT License.
___

## Acknowledgements
•	[**Next.js**](https://nextjs.org)

•	[**ShadCN**](https://ui.shadcn.com)

•	[**Tailwind CSS**](https://tailwindcss.com)

•	[**LangChain**](https://www.langchain.com)

•	[**OpenAI**](https://openai.com)

•	[**Pinecone**](https://www.pinecone.io)

•	[**Vercel AI Sdk**](https://sdk.vercel.ai/)

•	[**Firebase**](https://firebase.google.com)

