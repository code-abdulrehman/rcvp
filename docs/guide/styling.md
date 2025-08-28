---
title: styling
createTime: 2025/08/28 15:24:39
permalink: /article/k0zf6tnn/
---
# Styling with Tailwind CSS

This guide covers styling the React chatbot application using Tailwind CSS for a modern, responsive design.

## Overview

The application uses Tailwind CSS for styling, providing utility-first CSS classes for rapid development and consistent design.

## Tailwind Configuration

### Base Configuration

```javascript
// tailwind.config.js
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
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
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
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'typing': 'typing 1s steps(40, end)',
        'blink': 'blink 1s infinite',
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
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### Global Styles

```css
/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Inter', system-ui, sans-serif;
  }
  
  body {
    @apply bg-gray-50 text-gray-900 antialiased;
  }
  
  * {
    @apply border-gray-200;
  }
}

@layer components {
  /* Button Components */
  .btn {
    @apply inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  .btn-primary {
    @apply btn bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 shadow-sm hover:shadow-md;
  }
  
  .btn-secondary {
    @apply btn bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500;
  }
  
  .btn-outline {
    @apply btn border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500;
  }
  
  .btn-ghost {
    @apply btn hover:bg-gray-100 text-gray-700 focus:ring-gray-500;
  }
  
  .btn-sm {
    @apply px-3 py-1.5 text-sm;
  }
  
  .btn-md {
    @apply px-4 py-2 text-sm;
  }
  
  .btn-lg {
    @apply px-6 py-3 text-base;
  }
  
  /* Input Components */
  .input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200;
  }
  
  .input-error {
    @apply border-red-300 focus:ring-red-500 focus:border-red-500;
  }
  
  /* Card Components */
  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200;
  }
  
  .card-header {
    @apply px-6 py-4 border-b border-gray-200;
  }
  
  .card-body {
    @apply px-6 py-4;
  }
  
  .card-footer {
    @apply px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg;
  }
  
  /* Message Components */
  .message {
    @apply max-w-xs lg:max-w-md px-4 py-2 rounded-lg;
  }
  
  .message-user {
    @apply message bg-primary-600 text-white;
  }
  
  .message-assistant {
    @apply message bg-gray-100 text-gray-800;
  }
  
  /* Loading Components */
  .loading-spinner {
    @apply animate-spin rounded-full border-2 border-gray-300 border-t-primary-600;
  }
  
  .loading-dots {
    @apply flex space-x-1;
  }
  
  .loading-dot {
    @apply w-2 h-2 bg-gray-400 rounded-full animate-bounce;
  }
  
  /* Typography */
  .text-gradient {
    @apply bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent;
  }
  
  .text-shadow {
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

@layer utilities {
  /* Custom Utilities */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .text-balance {
    text-wrap: balance;
  }
  
  .backdrop-blur {
    backdrop-filter: blur(8px);
  }
}
```

## Component Styling

### Chat Container

```tsx
// src/components/chat/ChatContainer.tsx
export const ChatContainer: React.FC = () => {
  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <ChatHeader />
      <div className="flex-1 overflow-hidden">
        <MessageList />
      </div>
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <MessageInput />
      </div>
    </div>
  )
}
```

### Message Items

```tsx
// src/components/chat/MessageItem.tsx
export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`
        message ${isUser ? 'message-user' : 'message-assistant'}
        ${isUser ? 'shadow-md' : 'shadow-sm'}
        transition-all duration-200 hover:shadow-lg
      `}>
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
        <p className={`
          text-xs mt-2 opacity-75
          ${isUser ? 'text-primary-100' : 'text-gray-500'}
        `}>
          {format(new Date(message.timestamp), 'HH:mm')}
        </p>
      </div>
    </div>
  )
}
```

### Message Input

```tsx
// src/components/chat/MessageInput.tsx
export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-3">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="input resize-none pr-12 min-h-[44px] max-h-32"
          rows={1}
          disabled={disabled}
        />
        <div className="absolute right-3 bottom-2 text-gray-400 text-xs">
          {message.length}/1000
        </div>
      </div>
      
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="btn-primary btn-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  )
}
```

### Typing Indicator

```tsx
// src/components/chat/TypingIndicator.tsx
export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="message-assistant">
        <div className="flex items-center space-x-2">
          <div className="loading-dots">
            <div className="loading-dot" style={{ animationDelay: '0ms' }} />
            <div className="loading-dot" style={{ animationDelay: '150ms' }} />
            <div className="loading-dot" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-gray-500">AI is typing...</span>
        </div>
      </div>
    </div>
  )
}
```

## Responsive Design

### Mobile-First Approach

```tsx
// src/components/layout/Layout.tsx
export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
```

### Responsive Chat Container

```tsx
// src/components/chat/ChatContainer.tsx
export const ChatContainer: React.FC = () => {
  return (
    <div className="
      flex flex-col 
      h-[500px] sm:h-[600px] lg:h-[700px]
      w-full max-w-sm sm:max-w-2xl lg:max-w-4xl 
      mx-auto 
      bg-white 
      rounded-lg sm:rounded-xl 
      shadow-sm sm:shadow-lg 
      border border-gray-200 
      overflow-hidden
    ">
      {/* Component content */}
    </div>
  )
}
```

## Dark Mode Support

### Theme Configuration

```typescript
// src/hooks/useTheme.ts
export const useTheme = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'system'>('theme', 'system')
  
  useEffect(() => {
    const root = document.documentElement
    
    if (theme === 'dark' || 
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])
  
  return { theme, setTheme }
}
```

### Dark Mode Styles

```css
/* src/index.css */
@layer base {
  .dark {
    @apply bg-gray-900 text-gray-100;
  }
  
  .dark body {
    @apply bg-gray-900 text-gray-100;
  }
}

@layer components {
  .dark .card {
    @apply bg-gray-800 border-gray-700;
  }
  
  .dark .message-assistant {
    @apply bg-gray-700 text-gray-100;
  }
  
  .dark .input {
    @apply bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400;
  }
}
```

## Animation Classes

### Fade Animations

```css
@layer utilities {
  .animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out;
  }
  
  .animate-fade-in-down {
    animation: fadeInDown 0.5s ease-out;
  }
  
  .animate-fade-in-left {
    animation: fadeInLeft 0.5s ease-out;
  }
  
  .animate-fade-in-right {
    animation: fadeInRight 0.5s ease-out;
  }
}
```

### Hover Effects

```tsx
// Example hover effects
<div className="
  transform transition-all duration-200 
  hover:scale-105 hover:shadow-lg 
  active:scale-95
">
  {/* Content */}
</div>
```

## Custom Components

### Gradient Button

```tsx
// src/components/ui/GradientButton.tsx
export const GradientButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="
        relative px-6 py-3 
        bg-gradient-to-r from-primary-600 to-primary-700 
        hover:from-primary-700 hover:to-primary-800 
        text-white font-medium rounded-lg 
        transform transition-all duration-200 
        hover:scale-105 hover:shadow-lg 
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      "
      {...props}
    >
      {children}
    </button>
  )
}
```

### Glass Effect Card

```tsx
// src/components/ui/GlassCard.tsx
export const GlassCard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="
      backdrop-blur-md bg-white/80 dark:bg-gray-800/80 
      border border-white/20 dark:border-gray-700/20 
      rounded-xl shadow-xl
    ">
      {children}
    </div>
  )
}
```

## Best Practices

1. **Consistent Spacing**: Use Tailwind's spacing scale consistently
2. **Responsive Design**: Always consider mobile-first approach
3. **Accessibility**: Ensure proper contrast ratios and focus states
4. **Performance**: Use CSS transforms for animations
5. **Maintainability**: Create reusable component classes
6. **Dark Mode**: Support both light and dark themes
7. **Loading States**: Provide visual feedback for async operations

## Next Steps

Now that you understand styling, proceed to:

- [Deployment](./deployment.md) - Deploy your styled application
- [Testing](./testing.md) - Test your components and styling
- [Performance](./performance.md) - Optimize your application 