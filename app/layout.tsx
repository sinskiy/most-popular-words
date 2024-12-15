import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/header";

const TITLE = "Most popular words in _____";
const DESCRIPTION = "View and learn words";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    siteName: TITLE,
    url: "https://words.sinskiy.website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white m-4 flex flex-col gap-4 max-w-screen-lg mx-auto">
        <Header />
        {children}
      </body>
    </html>
  );
}
