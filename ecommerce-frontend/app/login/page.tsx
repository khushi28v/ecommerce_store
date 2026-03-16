"use client"

import { useState } from "react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem("token", data.access)
      alert("Login successful")
      window.location.href = "/"
      return
    }

    alert("Invalid credentials")
  }

  return (
    <div className="min-h-[70vh] px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-xl border bg-white p-5 shadow-sm sm:p-6">
        <h1 className="mb-6 text-2xl font-bold">Login</h1>

        <div className="flex flex-col gap-4">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded border p-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border p-3"
          />

          <button onClick={handleLogin} className="rounded bg-[#647A67] py-3 text-white">
            Login
          </button>
        </div>
      </div>
    </div>
  )
}
