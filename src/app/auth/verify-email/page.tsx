"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Terminal, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    // Get email from query params or localStorage
    const storedEmail = localStorage.getItem("pendingEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In production, verify the code with Supabase
      // This is a mock implementation
      if (verificationCode === "123456" || verificationCode.length === 6) {
        setIsVerified(true);
        localStorage.removeItem("pendingEmail");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        alert("Invalid verification code");
      }
    } catch (error) {
      alert("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      // In production, request Supabase to resend verification email
      alert("Verification code resent to your email");
      setResendTimer(60);
    } catch (error) {
      alert("Failed to resend code");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] noise-texture flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 group">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center glow-cyan">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            K8sTroubleshoot
          </span>
        </Link>

        <Card className="bg-card/50 backdrop-blur-xl border-border/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-display flex items-center gap-2">
              {isVerified ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  Email Verified
                </>
              ) : (
                "Verify Your Email"
              )}
            </CardTitle>
            <CardDescription>
              {isVerified
                ? "Your email has been verified successfully!"
                : `We've sent a verification code to ${email}`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isVerified ? (
              <div className="text-center space-y-4">
                <p className="text-green-400 font-medium">
                  Redirecting to dashboard...
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  onClick={() => router.push("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              </div>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="bg-secondary/50 border-border/20 focus:border-cyan-500/50 text-center text-lg tracking-widest"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Check your email for the verification code (check spam if not found)
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 glow-cyan h-11"
                  disabled={isLoading || verificationCode.length < 6}
                >
                  {isLoading ? "Verifying..." : "Verify Email"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-border/20"
                  onClick={handleResendCode}
                  disabled={resendTimer > 0}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                </Button>
              </form>
            )}

            <p className="text-center text-sm text-muted-foreground mt-6">
              Wrong email?{" "}
              <Link
                href="/auth/register"
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Start over
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
