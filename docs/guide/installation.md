---
title: installation
createTime: 2025/08/28 15:14:25
permalink: /article/yduqh6vs/
---
 
# Installation & Setup

This guide will help you set up the React chatbot project from scratch.

## Prerequisites

Make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** or **pnpm**
- **Git** for version control
- **VS Code** (recommended editor)

## Step 1: Create React Project

```bash
# Using Create React App
npx create-react-app react-chatbot --template typescript

# Or using Vite (recommended)
npm create vite@latest react-chatbot -- --template react-ts

# Navigate to project directory
cd react-chatbot
```

## Step 2: Install Dependencies

```bash
# Install core dependencies
npm install react react-dom
npm install @types/react @types/react-dom

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npm install @tailwindcss/forms @tailwindcss/typography

# Install additional utilities
npm install clsx lucide-react
npm install react-hot-toast
npm install date-fns

# Install development dependencies
npm install -D @types/node
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

## Step 3: Configure Tailwind CSS

Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

Update `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: system-ui, sans-serif;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  
  .input-field {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent;
  }
}
```

## Step 4: Environment Setup

Create `.env` file in the root directory:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_MODEL=gpt-3.5-turbo
VITE_MAX_TOKENS=1000
```

Create `.env.example`:

```env
VITE_OPENAI_API_KEY=
VITE_OPENAI_MODEL=gpt-3.5-turbo
VITE_MAX_TOKENS=1000
```

## Step 5: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

## Step 6: Project Structure

Create the following folder structure:

```
src/
├── components/
│   ├── ui/
│   ├── chat/
│   └── layout/
├── hooks/
├── services/
├── types/
├── utils/
└── store/
```

## Step 7: Start Development

```bash
# Start development server
npm run dev

# Or for Create React App
npm start
```

Your application should now be running at `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA).

## Next Steps

Now that your environment is set up, proceed to:

- [Project Structure](./structure.md) - Learn about the codebase organization
- [Components](./components.md) - Build the UI components
- [State Management](./state.md) - Implement state handling

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in your package.json scripts
2. **API key not working**: Make sure your OpenAI account has credits
3. **Tailwind not working**: Restart your development server
4. **TypeScript errors**: Check your tsconfig.json configuration

### Getting Help

If you encounter any issues:

1. Check the console for error messages
2. Verify all dependencies are installed correctly
3. Ensure your environment variables are set properly
4. Check the [API documentation](./api.md) for OpenAI integration 