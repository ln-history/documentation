import * as path from 'node:path';
import { pluginShiki } from '@rspress/plugin-shiki';
import mermaid from 'rspress-plugin-mermaid';
import { defineConfig } from 'rspress/config';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'ln-history-documentation',
  icon: '/rspress-icon.png',
  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },
  plugins: [
    mermaid({
      mermaidConfig: {
        theme: 'base',
      },
    }),
    pluginShiki(),
  ],
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/ln-history',
      },
    ],
  },
  markdown: {
    showLineNumbers: true,
  },
  globalUIComponents: [path.join(__dirname, 'src', 'components', 'Terminal.tsx')],
  globalStyles: path.join(__dirname, 'src', 'styles', 'terminal.css'),
});
