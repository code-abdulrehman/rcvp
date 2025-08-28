import { defineThemeConfig } from 'vuepress-theme-plume'
import { enNavbar } from './navbar'

export default defineThemeConfig({
  logo: 'https://theme-plume.vuejs.press/plume.png',
  appearance: true,
  social: [
    { icon: 'github', link: 'https://github.com/code-abdulrehman/rcvp' },
  ],
  locales: {
    '/': {
      profile: {
        avatar: 'https://theme-plume.vuejs.press/plume.png',
        name: 'rcvp',
        description: '',
      },
      navbar: enNavbar,
    },
    '/zh/': {
      profile: {
        avatar: 'https://theme-plume.vuejs.press/plume.png',
        name: 'rcvp',
        description: '',
      },
      navbar: enNavbar,
    },
  },
})
