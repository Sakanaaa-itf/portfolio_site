import type { Metadata } from "next";
import { GlobalStyle } from "../styles/globalStyles";

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "A simple portfolio website",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <GlobalStyle />
        {children}
      </body>
    </html>
  );
}
