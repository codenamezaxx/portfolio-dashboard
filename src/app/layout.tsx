import type { Metadata } from 'next';
import { Playfair_Display, Inter, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { RealtimeProvider } from '@/components/providers/RealtimeProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { NextIntlClientProvider } from 'next-intl';
import { cookies } from 'next/headers';
import "@aejkatappaja/phantom-ui/ssr.css";

const playfairDisplay = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

const sourceCodePro = Source_Code_Pro({
  variable: '--font-source-code',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Zakky Ahmad El-Kholily | Junior Fullstack Developer Portofolio',
  description:
    'Portfolio of Zakky Ahmad El-Kholily — Junior Fullstack Developer and Network Engineer from East Java, Indonesia. Showcasing projects, skills, and certifications.',
  keywords: ['portfolio', 'web developer', 'it enthusiast', 'network engineer', 'Fullstack', 'React', 'Next.js', 'TypeScript'],
  authors: [{ name: 'Zakky Ahmad El-Kholily' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Zakky Ahmad El-Kholily | Portfolio',
    description: 'Junior Fullstack Developer & Network Engineer',
    type: 'website',
    locale: 'id_ID',
    siteName: 'Zakky Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zakky Ahmad El-Kholily | Portfolio',
    description: 'Junior Fullstack Developer & Network Engineer',
    images: ['/hero.jpg'],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value || 'id';
  const messages = (await import(`../../messages/${locale}.json`)).default;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Zakky Ahmad El-Kholily',
    url: 'https://codenamezaxx.my.id',
    jobTitle: 'Junior Fullstack Developer',
    alumniOf: 'SMK Muhammadiyah 1 Surabaya',
    gender: 'Male',
    knowsAbout: ['Fullstack Development', 'Network Engineering', 'React', 'Next.js', 'TypeScript'],
    sameAs: [
      'https://github.com/codenamezaxx',
      'https://linkedin.com/in/codenamezaxx',
      'https://instagram.com/codenamezaxx',
    ],
  };

  return (
    <html
      lang="id"
      className={`${inter.variable} ${playfairDisplay.variable} ${sourceCodePro.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Inline script to apply theme before first paint — prevents flash */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('portfolio-theme');
                  var theme = stored || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--ink)] leading-normal">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
            <RealtimeProvider enableNotifications={true}>
              <ToastProvider position="bottom-right" maxToasts={5}>
                {children}
              </ToastProvider>
            </RealtimeProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
