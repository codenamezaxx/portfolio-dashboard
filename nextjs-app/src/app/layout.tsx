import type { Metadata } from 'next';
import { IBM_Plex_Sans, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { RealtimeProvider } from '@/components/providers/RealtimeProvider';
import FloatingChatButton from '@/components/shared/FloatingChatButton';
import BackgroundGrid from '@/components/shared/BackgroundGrid';

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-ibm-plex',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const sourceCodePro = Source_Code_Pro({
  variable: '--font-source-code',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Zakky Ahmad El-Kholily | Junior Front-End Web Developer Portofolio',
  description:
    'Portfolio of Zakky Ahmad El-Kholily — Junior Front-End Web Developer from East Java, Indonesia. Showcasing projects, skills, and certifications.',
  keywords: ['portfolio', 'web developer', 'front-end', 'React', 'Next.js', 'TypeScript'],
  authors: [{ name: 'Zakky Ahmad El-Kholily' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Zakky Ahmad El-Kholily | Portfolio',
    description: 'Junior Front-End Web Developer',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      // Admin dashboard will use light theme by default for the "warm cream" aesthetic
      data-theme="light"
      className={`${ibmPlexSans.variable} ${sourceCodePro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--body)] font-plex">
        <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
          <RealtimeProvider enableNotifications={true}>
            <BackgroundGrid />
            {children}
            <FloatingChatButton />
          </RealtimeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
