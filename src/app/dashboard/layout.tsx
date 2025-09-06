// src/app/dashboard/layout.tsx
import { DarkModeProvider } from '@/contexts/DarkModeContext';
import Dashboard from "../component/dashboard";
import { Poppins, Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-grotesk",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});



export const metadata = {
  title: 'Dashboard',
  description: 'Student Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${poppins.variable} font-poppins font-grotesk`} >
        <DarkModeProvider>
          <Dashboard>{children}</Dashboard>
        </DarkModeProvider>
      </body>
    </html>
  )
}