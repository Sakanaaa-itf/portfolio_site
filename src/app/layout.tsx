import type { Metadata } from "next";
import { GlobalStyle } from "../styles/globalStyles";

export const metadata: Metadata = {
  title: "ふわふわ.みんな",
  description: "Portfolio site",
  icons: {
    icon: "../../public/DSCF0546.JPG",
  }
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
