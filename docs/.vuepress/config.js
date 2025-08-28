import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  base: '/',
  lang: 'en-US',
  locales: {
    '/': {
      title: 'React Chatbot',
      lang: 'en-US',
      description: 'AI-Powered Chat Interface with OpenAI',
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: 'https://theme-plume.vuejs.press/favicon-32x32.png' }],
  ],

  bundler: viteBundler(),
  shouldPrefetch: false,

  theme: plumeTheme({
    footer: {
      message: 'Made with ❤️ by <a href="https://code-abdulrehman.vercel.app/" target="_blank" rel="noopener noreferrer">Abdul Rehman</a> © 2025',
    },
    article: '/article/',
    cache: 'filesystem',
    search: { provider: 'local' },
  }),
})
