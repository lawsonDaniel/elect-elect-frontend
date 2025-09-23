// src/app/layout.tsx
import "./globals.css"; 
import Notification from "./component/notification";
import { DarkModeProvider } from '@/contexts/DarkModeContext';
import { Poppins } from "next/font/google";

// Load font from Google
const poppins = Poppins({
  subsets: ['latin'],        
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',            
});

export const metadata = {
  title: 'EEE Unijos',
  description: 'university of jos eletrical electronics engineering website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className={poppins.className} >
        <DarkModeProvider>
          {children}
          <Notification.ToastContainer />
        </DarkModeProvider>
      </body>
    </html>
  )
}