"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useState } from "react";
import Cookies from "js-cookie";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const handleLogin = async () => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    try {
      const data = await response.json();
      if (response.status === 200) {
        const userDetails = data.user;
        setMessage(data.message);
        Cookies.set("userDetails", JSON.stringify(userDetails), {
          expires: 7,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
        });
        window.location.href = "/dashboard";
      } else {
        setMessage(data.error || "Login Failed");
      }
    } catch {
      setMessage("Internal Server Error");
    }
  };

  return (
    <MaxWidthWrapper>
      This is Login
      <div>
        email:
        <input
          type="text"
          className="border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        password:
        <input
          type="password"
          className="border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} className="bg-blue-500">
          Login
        </button>
      </div>
      {message && <p>{message}</p>}
    </MaxWidthWrapper>
  );
}
