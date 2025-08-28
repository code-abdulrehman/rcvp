---
title: state
createTime: 2025/08/28 15:20:07
permalink: /article/bl3n22mi/
---
# State Management

This guide covers state management in the React chatbot application using React hooks and custom state management patterns.

## Overview

The chatbot application uses React hooks for state management, providing a simple and efficient way to handle application state without external libraries.

## Core State Types

### Chat State

```typescript
// src/types/chat.ts
export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  isTyping: boolean
}

export interface ChatActions {
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  setError: (error: string | null) => void
  setIsLoading: (loading: boolean) => void
}
```

## Custom Hooks

### useChat Hook

Main hook for managing chat state and interactions.

```typescript
// src/hooks/useChat.ts
import { useState, useCallback, useRef } from 'react'
import { Message, ChatState, ChatActions } from '../types/chat'
import { useOpenAI } from './useOpenAI'
import { useLocalStorage } from './useLocalStorage'

export const useChat = (): ChatState & ChatActions => {
  const [messages, setMessages] = useLocalStorage<Message[]>('chat-messages', [])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  
  const { sendMessageToOpenAI } = useOpenAI()
  const abortControllerRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      abortControllerRef.current = new AbortController()
      
      const response = await sendMessageToOpenAI(
        content,
        messages,
        abortControllerRef.current.signal
      )

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setIsLoading(false)
      setIsTyping(false)
      abortControllerRef.current = null
    }
  }, [messages, sendMessageToOpenAI, setMessages])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [setMessages])

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setIsLoading(false)
      setIsTyping(false)
    }
  }, [])

  return {
    messages,
    isLoading,
    error,
    isTyping,
    sendMessage,
    clearMessages,
    setError,
    setIsLoading,
    stopGeneration
  }
}
```

### useOpenAI Hook

Hook for managing OpenAI API interactions.

```typescript
// src/hooks/useOpenAI.ts
import { useCallback } from 'react'
import { Message } from '../types/chat'
import { openAIService } from '../services/openai'

export const useOpenAI = () => {
  const sendMessageToOpenAI = useCallback(async (
    content: string,
    messages: Message[],
    signal?: AbortSignal
  ): Promise<string> => {
    const conversationHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    const response = await openAIService.sendMessage({
      message: content,
      history: conversationHistory,
      signal
    })

    return response
  }, [])

  return {
    sendMessageToOpenAI
  }
}
```

### useLocalStorage Hook

Hook for persisting state in localStorage.

```typescript
// src/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}
```

### useDebounce Hook

Hook for debouncing values, useful for search inputs.

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

### useTheme Hook

Hook for managing application theme.

```typescript
// src/hooks/useTheme.ts
import { useState, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const updateResolvedTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        setResolvedTheme(systemTheme)
      } else {
        setResolvedTheme(theme)
      }
    }

    updateResolvedTheme()

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', updateResolvedTheme)

    return () => mediaQuery.removeEventListener('change', updateResolvedTheme)
  }, [theme])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
  }, [resolvedTheme])

  return {
    theme,
    setTheme,
    resolvedTheme
  }
}
```

## State Management Patterns

### Context Pattern

For sharing state across components, use React Context:

```typescript
// src/contexts/ChatContext.tsx
import React, { createContext, useContext, ReactNode } from 'react'
import { useChat } from '../hooks/useChat'

interface ChatContextType {
  messages: Message[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const chatState = useChat()

  return (
    <ChatContext.Provider value={chatState}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}
```

### Reducer Pattern

For complex state logic, use useReducer:

```typescript
// src/reducers/chatReducer.ts
import { Message } from '../types/chat'

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  isTyping: boolean
}

export type ChatAction =
  | { type: 'SEND_MESSAGE'; payload: Message }
  | { type: 'RECEIVE_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'SET_TYPING'; payload: boolean }

export const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SEND_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null
      }
    
    case 'RECEIVE_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        isLoading: false,
        isTyping: false
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isTyping: false
      }
    
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
        error: null
      }
    
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload
      }
    
    default:
      return state
  }
}
```

## Performance Optimization

### Memoization

Use React.memo for expensive components:

```typescript
// src/components/chat/MessageItem.tsx
import React from 'react'
import { Message } from '../../types/chat'

interface MessageItemProps {
  message: Message
}

export const MessageItem = React.memo<MessageItemProps>(({ message }) => {
  // Component implementation
})
```

### Callback Optimization

Use useCallback for stable function references:

```typescript
const handleSendMessage = useCallback((content: string) => {
  sendMessage(content)
}, [sendMessage])

const handleClearMessages = useCallback(() => {
  clearMessages()
}, [clearMessages])
```

## Error Handling

### Error Boundaries

Create error boundaries for component error handling:

```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-800 font-medium">Something went wrong</h2>
          <p className="text-red-600 text-sm mt-1">
            {this.state.error?.message}
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
```

## Best Practices

1. **Single Source of Truth**: Keep state in the highest common ancestor
2. **Immutable Updates**: Always create new objects/arrays when updating state
3. **Local State**: Use local state for component-specific data
4. **Persistence**: Use localStorage for important state that should survive page reloads
5. **Error Handling**: Implement proper error boundaries and error states
6. **Performance**: Use memoization and optimization techniques when needed
7. **Type Safety**: Use TypeScript for all state management

## Next Steps

Now that you understand state management, proceed to:

- [API Integration](./api.md) - Learn about integrating with OpenAI API
- [Styling](./styling.md) - Style your components with Tailwind CSS
- [Deployment](./deployment.md) - Deploy your application 