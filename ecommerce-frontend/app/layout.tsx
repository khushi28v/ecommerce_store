import "./globals.css"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import { ReactNode } from "react"

export const metadata = {
  title: "Seatera Store",
  description: "Modern ecommerce store",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {

  return (
    <html lang="en">
      <body className="bg-[#F5F8F5] text-[#020402]">

        <Navbar />

        <main>{children}</main>

        <Footer />

      </body>
    </html>
  )
}
