import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with us regarding the UAF CGPA Calculator. We\'re here to help with your questions and feedback.',
  openGraph: {
    title: 'Contact UAF CGPA Calculator',
    description: 'Get in touch with us regarding the UAF CGPA Calculator.',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
