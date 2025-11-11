"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import Cookies from "js-cookie"; // ✅ added
import React, { useState } from "react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.msg || data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      // ✅ Save auth token & role in client cookies
      Cookies.set("gva_token", data.token, {
        expires: 365,
        secure: true,
        sameSite: "strict",
      });

      Cookies.set("gva_role", data.user.role, {
        expires: 365,
        secure: true,
        sameSite: "strict",
      });

      // ✅ Redirect based on role
      if (data.user.role === "SUPER_ADMIN") {
        window.location.href = "/";
      } else if (data.user.role === "ORG_ADMIN") {
        window.location.href = "/org/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

          <form onSubmit={handleLogin} action="javascript:void(0);">
            <div className="space-y-6">

              {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

              <div>
                <Label>Email <span className="text-error-500">*</span></Label>
                <Input
                  placeholder="info@gmail.com"
                  type="email"
                 
                  onChange={(e) => setEmail(e.target.value)}
                 
                />
              </div>

              <div>
                <Label>Password <span className="text-error-500">*</span></Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                     
                    onChange={(e) => setPassword(e.target.value)}
                    
                  />

                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked onChange={() => {}} />
                  <span className="text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
                <Link href="/reset-password" className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
                  Forgot password?
                </Link>
              </div>

              <Button className="w-full py-2"  type="submit"  disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                Sign Up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
