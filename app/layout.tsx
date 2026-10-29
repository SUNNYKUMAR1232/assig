import "./globals.css";
import { LanguageProvider } from "@/lib/language/LanguageContext";
import { ThemeProvider } from "@/lib/theme/ThemeContext";

export const metadata = {
  title: "जनसेवा सहायक | आय प्रमाण-पत्र समीक्षा | JanSeva Sahayak",
  description: "Bihar RTPS income-certificate scrutiny dashboard demo with Neon PostgreSQL and Groq AI",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
