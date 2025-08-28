---
title: api
createTime: 2025/08/28 15:22:23
permalink: /article/rjg392xu/
---
# API Integration

This guide covers the integration with OpenAI API for intelligent chatbot responses.

## Overview

The chatbot application integrates with OpenAI's GPT models to provide intelligent, contextual responses to user messages.

## OpenAI Service

### Service Configuration

```typescript
// src/services/openai.ts
interface OpenAIConfig {
  apiKey: string
  model: string
  maxTokens: number
  temperature: number
  baseURL?: string
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface OpenAIMessage {
  message: string
  history: ChatMessage[]
  signal?: AbortSignal
}

class OpenAIService {
  private config: OpenAIConfig

  constructor(config: OpenAIConfig) {
    this.config = config
  }

  async sendMessage({ message, history, signal }: OpenAIMessage): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant. Provide clear, concise, and accurate responses.'
      },
      ...history,
      { role: 'user', content: message }
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        stream: false
      }),
      signal
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error?.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'No response received'
  }

  async streamMessage({ message, history, signal }: OpenAIMessage): Promise<ReadableStream> {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant. Provide clear, concise, and accurate responses.'
      },
      ...history,
      { role: 'user', content: message }
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        stream: true
      }),
      signal
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error?.message || `HTTP ${response.status}`)
    }

    return response.body!
  }
}

export const openAIService = new OpenAIService({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
  maxTokens: parseInt(import.meta.env.VITE_MAX_TOKENS || '1000'),
  temperature: parseFloat(import.meta.env.VITE_TEMPERATURE || '0.7')
})
```

## API Hooks

### useOpenAI Hook

```typescript
// src/hooks/useOpenAI.ts
import { useCallback, useState } from 'react'
import { openAIService } from '../services/openai'
import { Message } from '../types/chat'

export const useOpenAI = () => {
  const [isStreaming, setIsStreaming] = useState(false)

  const sendMessage = useCallback(async (
    content: string,
    history: Message[],
    signal?: AbortSignal
  ): Promise<string> => {
    const chatHistory = history.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }))

    return await openAIService.sendMessage({
      message: content,
      history: chatHistory,
      signal
    })
  }, [])

  const streamMessage = useCallback(async (
    content: string,
    history: Message[],
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
  ): Promise<void> => {
    setIsStreaming(true)
    
    try {
      const chatHistory = history.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))

      const stream = await openAIService.streamMessage({
        message: content,
        history: chatHistory,
        signal
      })

      const reader = stream.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            
            if (data === '[DONE]') {
              return
            }

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content
              
              if (content) {
                onChunk(content)
              }
            } catch (error) {
              console.error('Error parsing stream chunk:', error)
            }
          }
        }
      }
    } finally {
      setIsStreaming(false)
    }
  }, [])

  return {
    sendMessage,
    streamMessage,
    isStreaming
  }
}
```

## Error Handling

### API Error Types

```typescript
// src/types/api.ts
export interface APIError {
  message: string
  code?: string
  status?: number
}

export class OpenAIError extends Error {
  public code?: string
  public status?: number

  constructor(message: string, code?: string, status?: number) {
    super(message)
    this.name = 'OpenAIError'
    this.code = code
    this.status = status
  }
}

export const handleAPIError = (error: unknown): APIError => {
  if (error instanceof OpenAIError) {
    return {
      message: error.message,
      code: error.code,
      status: error.status
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message
    }
  }

  return {
    message: 'An unknown error occurred'
  }
}
```

### Error Handling in Components

```typescript
// src/components/chat/ChatContainer.tsx
import { useChat } from '../../hooks/useChat'
import { handleAPIError } from '../../types/api'
import toast from 'react-hot-toast'

export const ChatContainer: React.FC = () => {
  const { messages, isLoading, error, sendMessage } = useChat()

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(content)
    } catch (error) {
      const apiError = handleAPIError(error)
      
      if (apiError.status === 401) {
        toast.error('Invalid API key. Please check your configuration.')
      } else if (apiError.status === 429) {
        toast.error('Rate limit exceeded. Please try again later.')
      } else if (apiError.status === 500) {
        toast.error('OpenAI service is currently unavailable.')
      } else {
        toast.error(apiError.message)
      }
    }
  }

  return (
    <div className="chat-container">
      {/* Component implementation */}
    </div>
  )
}
```

## Rate Limiting

### Rate Limiter Implementation

```typescript
// src/utils/rateLimiter.ts
export class RateLimiter {
  private requests: number[] = []
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  canMakeRequest(): boolean {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.windowMs)
    
    if (this.requests.length >= this.maxRequests) {
      return false
    }
    
    this.requests.push(now)
    return true
  }

  getTimeUntilReset(): number {
    if (this.requests.length === 0) return 0
    
    const oldestRequest = Math.min(...this.requests)
    return Math.max(0, oldestRequest + this.windowMs - Date.now())
  }
}

export const rateLimiter = new RateLimiter(10, 60000) // 10 requests per minute
```

### Rate Limiting Hook

```typescript
// src/hooks/useRateLimit.ts
import { useCallback, useState, useEffect } from 'react'
import { rateLimiter } from '../utils/rateLimiter'

export const useRateLimit = () => {
  const [isLimited, setIsLimited] = useState(false)
  const [timeUntilReset, setTimeUntilReset] = useState(0)

  const checkRateLimit = useCallback(() => {
    const canMakeRequest = rateLimiter.canMakeRequest()
    setIsLimited(!canMakeRequest)
    
    if (!canMakeRequest) {
      setTimeUntilReset(rateLimiter.getTimeUntilReset())
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (isLimited) {
        const timeLeft = rateLimiter.getTimeUntilReset()
        setTimeUntilReset(timeLeft)
        
        if (timeLeft <= 0) {
          setIsLimited(false)
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isLimited])

  return {
    isLimited,
    timeUntilReset,
    checkRateLimit
  }
}
```

## Streaming Responses

### Streaming Hook

```typescript
// src/hooks/useStreaming.ts
import { useCallback, useState } from 'react'
import { useOpenAI } from './useOpenAI'
import { Message } from '../types/chat'

export const useStreaming = () => {
  const [streamingMessage, setStreamingMessage] = useState('')
  const { streamMessage } = useOpenAI()

  const startStreaming = useCallback(async (
    content: string,
    history: Message[]
  ) => {
    setStreamingMessage('')
    
    await streamMessage(
      content,
      history,
      (chunk: string) => {
        setStreamingMessage(prev => prev + chunk)
      }
    )
  }, [streamMessage])

  const stopStreaming = useCallback(() => {
    setStreamingMessage('')
  }, [])

  return {
    streamingMessage,
    startStreaming,
    stopStreaming
  }
}
```

### Streaming Component

```typescript
// src/components/chat/StreamingMessage.tsx
import React, { useEffect, useState } from 'react'
import { useStreaming } from '../../hooks/useStreaming'

interface StreamingMessageProps {
  content: string
  isStreaming: boolean
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({
  content,
  isStreaming
}) => {
  const [displayedContent, setDisplayedContent] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (isStreaming && currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(prev => prev + content[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 50) // Adjust speed as needed

      return () => clearTimeout(timer)
    }
  }, [content, currentIndex, isStreaming])

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedContent(content)
      setCurrentIndex(content.length)
    }
  }, [content, isStreaming])

  return (
    <div className="message-content">
      {displayedContent}
      {isStreaming && currentIndex < content.length && (
        <span className="typing-cursor">|</span>
      )}
    </div>
  )
}
```

## Configuration

### Environment Variables

```env
# .env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_MODEL=gpt-3.5-turbo
VITE_MAX_TOKENS=1000
VITE_TEMPERATURE=0.7
VITE_BASE_URL=https://api.openai.com/v1
VITE_RATE_LIMIT_REQUESTS=10
VITE_RATE_LIMIT_WINDOW=60000
```

### Configuration Service

```typescript
// src/services/config.ts
export interface AppConfig {
  openai: {
    apiKey: string
    model: string
    maxTokens: number
    temperature: number
    baseURL: string
  }
  rateLimit: {
    maxRequests: number
    windowMs: number
  }
}

export const config: AppConfig = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
    maxTokens: parseInt(import.meta.env.VITE_MAX_TOKENS || '1000'),
    temperature: parseFloat(import.meta.env.VITE_TEMPERATURE || '0.7'),
    baseURL: import.meta.env.VITE_BASE_URL || 'https://api.openai.com/v1'
  },
  rateLimit: {
    maxRequests: parseInt(import.meta.env.VITE_RATE_LIMIT_REQUESTS || '10'),
    windowMs: parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW || '60000')
  }
}
```

## Best Practices

1. **Error Handling**: Always handle API errors gracefully
2. **Rate Limiting**: Implement rate limiting to avoid API quota issues
3. **Loading States**: Show loading indicators during API calls
4. **Retry Logic**: Implement retry mechanisms for failed requests
5. **Streaming**: Use streaming for better user experience
6. **Security**: Never expose API keys in client-side code
7. **Caching**: Cache responses when appropriate
8. **Monitoring**: Log API usage and errors for debugging

## Next Steps

Now that you understand API integration, proceed to:

- [Styling](./styling.md) - Style your components with Tailwind CSS
- [Deployment](./deployment.md) - Deploy your application
- [Testing](./testing.md) - Test your API integration 