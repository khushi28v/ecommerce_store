import Link from "next/link"

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#1F241F] text-[#C5EFCB]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm sm:px-6 md:grid-cols-3">
        <div>
          <h3 className="mb-2 font-semibold">Seatera</h3>
          <p>Premium modern essentials for everyday life.</p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Quick Links</h3>

          <ul className="space-y-1">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/#products">Products</Link>
            </li>
            <li>
              <Link href="/cart">Cart</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Contact</h3>
          <p>Email: support@seatera.com</p>
          <p>Phone: +91 99999 99999</p>
        </div>
      </div>

      <div className="border-t border-[#3C433B] py-4 text-center text-xs">
        (c) 2026 Seatera Store. All rights reserved.
      </div>
    </footer>
  )
}
