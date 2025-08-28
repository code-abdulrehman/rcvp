---
title: components
createTime: 2025/08/28 15:18:14
permalink: /article/j65ypzhb/
---
# Components

This guide covers all the React components used in the chatbot application, from basic UI elements to complex chat interfaces.

## UI Components

### Button Component

A reusable button component with different variants and states.

```tsx
// src/components/ui/Button.tsx
import React from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-500',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  return (
    <button
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
}
```

### Input Component

A form input component with validation states.

```tsx
// src/components/ui/Input.tsx
import React from 'react'
import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(
          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200',
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
```

### Loading Component

A loading spinner component with different sizes.

```tsx
// src/components/ui/Loading.tsx
import React from 'react'
import { clsx } from 'clsx'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }
  
  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <svg
        className={clsx('animate-spin text-primary-600', sizes[size])}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}
```

## Chat Components

### ChatContainer Component

The main chat interface that orchestrates all chat functionality.

```tsx
// src/components/chat/ChatContainer.tsx
import React from 'react'
import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { useChat } from '../../hooks/useChat'

export const ChatContainer: React.FC = () => {
  const {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    error
  } = useChat()

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <ChatHeader onClear={clearMessages} />
      
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} isLoading={isLoading} />
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <MessageInput onSend={sendMessage} disabled={isLoading} />
      </div>
      
      {error && (
        <div className="px-4 pb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
```

### MessageList Component

Displays the conversation messages with proper scrolling.

```tsx
// src/components/chat/MessageList.tsx
import React, { useRef, useEffect } from 'react'
import { MessageItem } from './MessageItem'
import { TypingIndicator } from './TypingIndicator'
import { Message } from '../../types/chat'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 py-8">
          <p>Start a conversation by typing a message below.</p>
        </div>
      )}
      
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      
      {isLoading && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  )
}
```

### MessageItem Component

Individual message component with different styles for user and AI messages.

```tsx
// src/components/chat/MessageItem.tsx
import React from 'react'
import { format } from 'date-fns'
import { Message } from '../../types/chat'

interface MessageItemProps {
  message: Message
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-xs lg:max-w-md px-4 py-2 rounded-lg
          ${isUser 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-100 text-gray-800'
          }
        `}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-primary-100' : 'text-gray-500'}`}>
          {format(new Date(message.timestamp), 'HH:mm')}
        </p>
      </div>
    </div>
  )
}
```

### MessageInput Component

Input component for sending new messages.

```tsx
// src/components/chat/MessageInput.tsx
import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip } from 'lucide-react'
import { Button } from '../ui/Button'

interface MessageInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-2">
      <div className="flex-1">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={1}
          maxRows={4}
          disabled={disabled}
        />
      </div>
      
      <Button
        type="submit"
        disabled={!message.trim() || disabled}
        className="px-3 py-2"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
```

### ChatHeader Component

Header component with chat title and actions.

```tsx
// src/components/chat/ChatHeader.tsx
import React from 'react'
import { Trash2, Settings } from 'lucide-react'
import { Button } from '../ui/Button'

interface ChatHeaderProps {
  onClear: () => void
  onSettings?: () => void
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onClear, onSettings }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
        <p className="text-sm text-gray-500">Powered by OpenAI GPT</p>
      </div>
      
      <div className="flex items-center space-x-2">
        {onSettings && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            className="p-2"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
```

### TypingIndicator Component

Shows when the AI is generating a response.

```tsx
// src/components/chat/TypingIndicator.tsx
import React from 'react'

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
        <div className="flex items-center space-x-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <span className="text-sm text-gray-500 ml-2">AI is typing...</span>
        </div>
      </div>
    </div>
  )
}
```

## Layout Components

### Header Component

Application header with navigation and branding.

```tsx
// src/components/layout/Header.tsx
import React from 'react'
import { MessageCircle, Github } from 'lucide-react'

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">React Chatbot</h1>
              <p className="text-sm text-gray-500">AI-Powered Conversations</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4">
            <a
              href="https://github.com/your-repo/react-chatbot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
```

### Footer Component

Application footer with links and information.

```tsx
// src/components/layout/Footer.tsx
import React from 'react'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RC</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">React Chatbot</h3>
                <p className="text-sm text-gray-600">AI-Powered Conversations</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Build intelligent chatbots with React, Tailwind CSS, and OpenAI API. 
              Create engaging conversational experiences for your users.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/guide/" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="/guide/installation" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Getting Started
                </a>
              </li>
              <li>
                <a href="/guide/components" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Components
                </a>
              </li>
              <li>
                <a href="/guide/api" className="text-gray-600 hover:text-primary-600 transition-colors">
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 transition-colors">
                  React Documentation
                </a>
              </li>
              <li>
                <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Tailwind CSS
                </a>
              </li>
              <li>
                <a href="https://openai.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 transition-colors">
                  OpenAI API
                </a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              <p>© 2025 React Chatbot. All rights reserved.</p>
              <p className="mt-1">Built with ❤️ using React, Tailwind CSS, and OpenAI API</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/your-repo/react-chatbot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/reactchatbot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/reactchatbot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@reactchatbot.com"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

## Component Best Practices

1. **Props Interface**: Always define TypeScript interfaces for component props
2. **Default Props**: Use default parameter values for optional props
3. **Event Handling**: Use proper event types and handlers
4. **Accessibility**: Include proper ARIA labels and keyboard navigation
5. **Styling**: Use Tailwind CSS classes consistently
6. **Performance**: Use React.memo for expensive components
7. **Error Boundaries**: Wrap components in error boundaries when needed

## Next Steps

Now that you understand the components, proceed to:

- [State Management](./state.md) - Learn about managing application state
- [API Integration](./api.md) - Connect components with OpenAI API
- [Styling](./styling.md) - Customize component appearance 