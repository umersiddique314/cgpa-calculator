'use client';
import { ThemeProvider } from './ThemeProvider'
import { Toaster } from 'react-hot-toast'



export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster position="top-center" />
    </ThemeProvider>
  )
}
