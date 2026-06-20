import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Parking Spots - Find Free Parking',
  description: 'Real-time parking availability in the Bay Area',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
