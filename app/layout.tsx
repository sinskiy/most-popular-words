import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/header";

const TITLE = "Most popular words in _____";
const DESCRIPTION =
  "Look at the most popular words in any language, save and learn them";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
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
