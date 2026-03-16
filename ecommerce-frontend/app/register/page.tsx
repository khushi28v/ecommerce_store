"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/auth/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })

    if (res.ok) {
      alert("Registration successful")
      router.push("/login")
      return
    }

    alert("Registration failed")
  }

  return (
    <div className="min-h-[70vh] px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-xl border bg-white p-5 shadow-sm sm:p-6">
        <h1 className="mb-6 text-2xl font-bold">Register</h1>

        <div className="flex flex-col gap-4">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded border p-3"
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border p-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border p-3"
          />

          <button onClick={handleRegister} className="rounded bg-[#647A67] py-3 text-white">
            Register
          </button>
        </div>
      </div>
    </div>
  )
}
