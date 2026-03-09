# Product Requirements Document (PRD): LearnAI

## 1. Vision & Purpose
**LearnAI** is an AI-powered educational synthesis platform designed to transform static, dense information—such as textbooks, research papers, and technical guides—into immersive, narrated video lessons and interactive courses. 

The goal is to democratize high-quality education by automating the curriculum development process, making learning more engaging through cinematic visuals and multi-agent AI narration.

---

## 2. Target Audience
- **Self-Learners:** Students or professionals looking to quickly digest complex topics.
- **Content Creators:** Educators wishing to scale their course production without a full recording studio.
- **Enterprise Teams:** Organizations needing to convert internal documentation into training modules.

---

## 3. Core Features

### 3.1 AI Document Synthesis
- **Multimodal Analysis:** Primary processing via Google Gemini (Native API) to handle complex PDF structures and visual elements.
- **Text Extraction Fallback:** Secondary processing via Groq AI with local PDF parsing (`unpdf`) for robust text extraction.
- **Automatic Curriculum Generation:** Extracts 5-7 core concepts, generates lesson titles, scripts (approx. 250 words), and visual prompts for AI rendering.

### 3.2 Cinematic Video Lessons (Remotion Engine)
- **Automated Video Rendering:** Uses the Remotion framework to produce video content from synthesized scripts.
- **Multi-agent Narration:** Cinematic voice synthesis with support for 120+ narrators and 50+ languages.
- **Visual Prompting:** AI-generated visuals to accompany the narration based on lesson context.

### 3.3 Interactive Learning
- **Instant Quizzes:** Automatically generates assessments after each lesson to verify comprehension.
- **Dashboard Tracking:** User-centric dashboard to manage courses, view progress, and access generated videos.

---

## 4. Technical Architecture

### 4.1 Frontend & UI
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS with a "Premium Studio" aesthetic (Deep slates, vivid violets, glassmorphism).
- **Animations:** Framer Motion for smooth transitions and interactive elements.
- **Icons:** Lucide React.

### 4.2 Backend & Data
- **Environment:** Next.js Server Actions for secure, fast execution.
- **Database:** MongoDB (via Mongoose) for persistence of documents, courses, and user data.
- **Storage:** Currently local file-system (Target for upgrade: Cloud Storage like S3/Supabase).

### 4.3 AI & Rendering Engine
- **Intelligence:** Google Gemini (Primary), Groq (Fallback/Secondary).
- **Rendering:** Remotion for programmatic video generation.

---

## 5. User Flow

1. **Onboarding:** User lands on the cinematic Landing Page and joins the "Studio" via Auth.
2. **Ingestion:** User uploads a document (PDF/Text) and specifies a title and learning level.
3. **Processing:** LearnAI analyzes the document, generates a curriculum, and scripts.
4. **Synthesis:** The system renders video lessons for each concept.
5. **Consumption:** User watches lessons in the video player and completes interactive quizzes.
6. **Management:** User tracks all generated courses and certificates via the Dashboard.

---

## 6. Known Limitations & Roadmap
### Current Limitations
- Local storage dependency.
- AI fallback might lose visual context from PDFs.
- Video rendering is compute-intensive.

### Roadmap (Upcoming)
- **Multi-agent Video rendering** (Live now!)
- **Cloud Persistence:** S3/Supabase integration for global file access.
- **Enterprise SSO:** For corporate training environments.
- **Custom AI Narrators:** Ability to clone local voices for personalized lessons.
