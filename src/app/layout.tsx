import "./globals.css";
import MainLayout from "@/components/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anthony Leuterio | Real Estate Visionary & Elite Coach",
  description: "Join the inner circle of the Philippines' most prolific real estate mogul. Anthony Leuterio architecturally transforms professionals into industry icons.",
  openGraph: {
    title: "Anthony Leuterio | Real Estate Visionary",
    description: "Unlock the secrets of the Philippines' real estate mogul. Claim your territory in the industry.",
    url: "https://anthonyleuterio.com",
    siteName: "Anthony Leuterio Portfolio",
    images: [
      {
        url: "/images/bossing5.jpg",
        width: 1200,
        height: 630,
        alt: "Anthony Leuterio - Real Estate Visionary",
      },
    ],
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anthony Leuterio | Real Estate Visionary",
    description: "Unlock the secrets of the Philippines' real estate mogul. Claim your territory in the industry.",
    images: ["/images/bossing5.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  let theme = localStorage.getItem('theme');
                  if (theme === 'light-mode') theme = 'light';
                  
                  const supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  
                  if (!theme) {
                    theme = supportDarkMode ? 'dark' : 'light';
                  }
                  
                  document.documentElement.setAttribute('data-theme', theme);
                  document.body.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
