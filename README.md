# 🎞️ LearnAI: The Next-Gen AI Video Course Studio

[![Live Demo](https://img.shields.io/badge/Live-Demo-violet?style=for-the-badge&logo=vercel)](https://learn-ai-two-mocha.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Jayanthmurala/learnAi)

**LearnAI** is a high-fidelity AI Video Studio that transforms static, dense documents into cinematic, high-retention narrated video lessons. Designed for educators, creators, and professionals who need to bridge the gap between "having a PDF" and "mastering a concept."

---

## ✨ Why LearnAI?

For too long, deep knowledge has been trapped in static files that people struggle to consume. **LearnAI** solves the "Static Knowledge Barrier" by acting as an elite educational curator. It doesn't just summarize; it **architects** an experience.

### 🚀 Key Features

*   **🧠 Intelligent Blueprinting:** Uses multi-modal analysis (Gemini 1.5 Pro) to extract master topics from any PDF, DOCX, or TXT file.
*   **📜 Editorial Narratives:** Automatically generates high-energy narration scripts using a specialized **6-part pedagogy** (Hook, Relate, Concept, Demo, Career, Ending).
*   **🎬 Visual Synthesis Layer:** AI-driven discovery for cinematic B-roll assets (via Pexels) to keep learners engaged at every second.
*   **📈 Integrated SaaS Economy:** Full subscription gating with Stripe, allowing for a scalable business model (Free/Pro/Enterprise tiers).
*   **🛡️ Secure Multi-Tenancy:** Robust user data isolation with NextAuth.js and session-level database filtering.
*   **🎨 "Classic Editorial" UI:** A premium, sophisticated design system using **Fraunces** typography, subtle grain textures, and magnetic micro-animations.

---

## 🛠️ Technical Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15 (App Router)** | High-performance full-stack framework with React 19. |
| **Intelligence** | **Google Gemini & Groq (Llama 3)** | Dual-model orchestration for deep analysis and 0-latency script generation. |
| **Persistence** | **MongoDB & Mongoose** | Secure, multi-tenant persistence layer for complex course metadata. |
| **Payments** | **Stripe API** | Secure subscription management and real-time webhook handling. |
| **Styling** | **Tailwind CSS & Framer Motion** | "Classic Editorial" aesthetic with delightful interactions. |
| **Extraction** | **UnPDF / PDF-Parse** | High-precision text and structure extraction from raw documents. |

---

## 🏗️ Deployment & Scalability

*   **Cloud Platform:** Deployed on **Vercel** for low-latency global delivery and automatic edge scaling.
*   **SaaS Model:** Built-in support for different subscription tiers, usage limits, and user-level document processing.
*   **API Readiness:** Designed with standard API endpoints, prepared to integrate with external Learning Management Systems (LMS).

---

## 🏃 Getting Started

### Prerequisites
*   Node.js 20+
*   MongoDB Atlas Account
*   Stripe Account (Test Keys)
*   Google Gemini & Groq API Keys

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Jayanthmurala/learnAi.git
    cd learnAi
    ```

2.  **Install Dependencies:**
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Environment Setup:**
    Create a `.env.local` file with the following keys:
    ```env
    MONGODB_URI=your_mongodb_uri
    NEXTAUTH_SECRET=your_secret
    NEXTAUTH_URL=http://localhost:3000
    STRIPE_SECRET_KEY=your_stripe_key
    GEMINI_API_KEY=your_gemini_key
    GROQ_API_KEY=your_groq_key
    ```

4.  **Launch the Studio:**
    ```bash
    npm run dev
    ```

---

## 📧 Contact & Submission Information

*   **Candidate:** Jayanth Murala
*   **Email:** [jayanthmurala1@gmail.com](mailto:jayanthmurala1@gmail.com)
*   **Portfolio:** [jayanthmurala.vercel.app](https://jayanthmurala.vercel.app/)
*   **LinkedIn:** [linkedin.com/in/jayanth-murala-0045b2281](https://www.linkedin.com/in/jayanth-murala-0045b2281)

---
*Developed with ❤️ as an exploratory task for the AI interview round*
