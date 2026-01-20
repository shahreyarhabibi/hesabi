<div align="center">
  <img src="public/logo.png" alt="Hesabi Logo" width="120" height="120" />
  
  # Hesabi
  
  ### Know Where Your Money Goes
  
  A modern, intuitive personal finance management application built with Next.js 
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
  [![Turso](https://img.shields.io/badge/Turso-SQLite-4FF8D2?logo=turso)](https://turso.tech/)
  
  [Live Demo](https://hesabi.vercel.app) · [Report Bug](https://github.com/shahreyarhabibi/hesabi/issues) · [Request Feature](https://github.com/shahreyarhabibi/hesabi/issues)
  
  <img src="public/screenshots/dashboard.png" alt="Hesabi Dashboard" width="800" />
</div>

---

## ✨ Features

### 📊 **Dashboard**

- Real-time overview of your financial health
- Income vs. expense visualization
- Recent transactions at a glance
- Budget progress tracking

### 💳 **Transaction Management**

- Track income and expenses
- Categorize transactions with custom categories
- Search, filter, and sort transactions
- Recurring transaction support

### 📈 **Budgets**

- Create monthly, weekly, or yearly budgets
- Visual progress bars
- Category-based budget tracking
- Overspending alerts

### 🐷 **Savings Pots**

- Set savings goals
- Track progress towards targets
- Add or withdraw money
- Custom colors and icons

### 🔐 **Authentication**

- Email/password registration
- Google OAuth integration
- GitHub OAuth integration
- Email verification with OTP
- Secure session management

### 🎨 **User Experience**

- Beautiful, responsive design
- Dark and light mode support
- Customizable avatars
- Multi-currency support (USD, EUR, GBP, AFN, IRR, INR, PKR)

---

## 🛠️ Tech Stack

| Category           | Technology                                      |
| ------------------ | ----------------------------------------------- |
| **Framework**      | [Next.js](https://nextjs.org/) (App Router)     |
| **Language**       | JavaScript (ES6+)                               |
| **Styling**        | [Tailwind CSS](https://tailwindcss.com/)        |
| **Database**       | [Turso](https://turso.tech/) (Edge SQLite)      |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/)        |
| **Charts**         | [Recharts](https://recharts.org/)               |
| **Icons**          | [Lucide React](https://lucide.dev/)             |
| **Email**          | [MailerSend](https://www.mailersend.com/)       |
| **Animations**     | [Framer Motion](https://www.framer.com/motion/) |
| **Deployment**     | [Vercel](https://vercel.com/)                   |

---

# 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Turso account (for database)
- Google/GitHub OAuth credentials (optional)
- MailerSend account (for email verification)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shahreyarhabibi/hesabi.git
   cd hesabi
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**
   Create a `.env.local` file with the following content:

````plaintext
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
TURSO_DATABASE_URL=your-turso-url
TURSO_AUTH_TOKEN=your-turso-token
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret
GITHUB_CLIENT_ID=your-github-id
GITHUB_CLIENT_SECRET=your-github-secret
MAILERSEND_API_KEY=your-mailersend-key```
See `.env.example` for all options.
4. Run migrations:
```bash
npm run migrate:turso```
5. Run the development server:
```bash
npm run dev```
6. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

---
## 🤝 Contributing
Contributions are welcome! Please follow these steps:
- Fork the repository.
- Create your feature branch (`git checkout -b feature/AmazingFeature`).
- Commit your changes (`git commit -m 'Add some AmazingFeature'`).
- Push to the branch (`git push origin feature/AmazingFeature`).
- Open a Pull Request.

---
## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---
## 👨‍💻 Author
div align="center" <img src="public/developer.jpg" alt="Ali Reza Habibi" width="100" style="border-radius: 50%;" />
Ali Reza Habibi
Software Engineer
gitHub
LinkedIn
Portfolio
div>
🙏 Acknowledgments
Next.js - The React Framework
Turso - Edge Database
Tailwind CSS - Utility-first CSS
Lucide - Beautiful Icons
Recharts - Chart Library
div align="center" > Made with ❤️ by Ali Reza Habibi ⭐ Star this repository if you find it helpful!
div>
````
