// src/app/dashboard/layout.tsx
import { DarkModeProvider } from '@/contexts/DarkModeContext';
import Dashboard from "../component/dashboard";

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
      <body>
        <DarkModeProvider>
          <Dashboard>{children}</Dashboard>
        </DarkModeProvider>
      </body>
    </html>
  )
}