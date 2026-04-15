import '@/app/globals.css';

export const metadata = {
  title: 'NIT Sports Auction - Admin Panel',
  description: 'Professional Sports Auction Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
