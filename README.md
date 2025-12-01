<div align="center">
  <h1>🧠 Talacards</h1>
  <p>An AI-powered flashcard generator that transforms your PDFs and text into interactive study materials.</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Bun](https://img.shields.io/badge/Runtime-Bun-333.svg?logo=bun&style=flat)](https://bun.sh/)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![PDF.js](https://img.shields.io/badge/PDF.js-FF0000?style=flat&logo=mozilla&logoColor=white)](https://mozilla.github.io/pdf.js/)
  
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn/ui-000000?style=flat" alt="shadcn/ui" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white" alt="ESLint" />
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=white" alt="Prettier" />
</div>

## 🚀 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or [Node.js](https://nodejs.org/) 18+
- [Git](https://git-scm.com/)

### Installation

#### Using Bun (Recommended)
```bash
# 1. Clone the repository
git clone https://github.com/ravvdevv/Talacards.git
cd Talacards

# 2. Install dependencies
bun install

# 3. Start the development server
bun run dev
```

#### Using npm
```bash
# 1. Clone the repository
git clone https://github.com/ravvdevv/Talacards.git
cd Talacards

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## ✨ Features

- 🤖 **AI-Powered Flashcard Generation:** Generate flashcards automatically from any academic text or PDF content using an intelligent AI assistant.
- 📄 **PDF Text Extraction:** Upload PDF documents and have their text content extracted for flashcard creation.
- 🎮 **Interactive Study Mode:** Review your generated flashcards with a user-friendly, interactive flip-card interface.
- 💾 **Client-Side Persistence:** Flashcards are automatically saved and loaded from your browser's local storage for continued study sessions.
- ✂️ **Smart Input Handling:** Automatic truncation of overly long text inputs to prevent API errors, with clear user warnings.
- 🚫 **Robust Error Handling:** Specific error messages for AI API failures, including notifications for excessively large PDF inputs.
- ⬇️ **Download Flashcards as TXT:** Export your flashcards as a plain text file, formatted as question-answer pairs.
- 🖨️ **Download Flashcards as PDF:** Generate and download a printable PDF sheet of your flashcards, designed for offline study.

## 🛠 Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Package Manager**: [Bun](https://bun.sh/) (or npm)
- **Linting**: [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)
- **PDF Parsing**: [PDF.js (pdfjs-dist)](https://mozilla.github.io/pdf.js/)
- **PDF Generation**: [jsPDF](https://jspdf.org/) + [html2canvas](https://html2canvas.hertzen.com/)
- **Icons**: [Lucide React](https://lucide.dev/icons/)
- **AI Integration**: External API via `https://text.pollinations.ai/openai` (OpenAI API compatible)


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Raven](https://github.com/ravvdevv)