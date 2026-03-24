# personalwebsite
My Personal Website

Built with Next.js and Tailwind CSS. Home page: scroll-driven terminal. Blog: markdown files in `content/blog/`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Terminal home page

- Scroll-driven commands: [src/data/terminal-commands.ts](src/data/terminal-commands.ts)
- After the scroll tour, an **interactive shell** unlocks — type `help` for navigation, `theme cyan` (etc.), `sms`, `email`, `rainbow`, and more.
- Accent color persists in `localStorage` (`portfolio-accent`).
