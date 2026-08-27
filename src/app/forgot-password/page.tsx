"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage("");
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("이메일을 입력해주세요.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      trimmedEmail,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    setLoading(false);

    if (error) {
      console.error("비밀번호 재설정 오류:", error);
      setError("비밀번호 재설정 이메일을 보내지 못했습니다.");
      return;
    }

    setMessage(
      "비밀번호 재설정 이메일을 보냈습니다. 이메일을 확인해주세요."
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <form
        onSubmit={handleReset}
        noValidate
        style={{
          width: "100%",
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div>
          <p>RESET PASSWORD</p>

          <h1>비밀번호 찾기</h1>

          <p>
            가입한 이메일 주소를 입력해주세요.
          </p>
        </div>

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          style={{
            padding: "14px",
            fontSize: "16px",
          }}
        />

        {error && (
          <p
            style={{
              color: "red",
              margin: 0,
            }}
          >
            ⚠️ {error}
          </p>
        )}

        {message && (
          <p
            style={{
              margin: 0,
            }}
          >
            ✅ {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "14px",
            fontSize: "16px",
          }}
        >
          {loading ? "전송 중..." : "재설정 이메일 보내기"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/login")}
          style={{
            padding: "12px",
          }}
        >
          로그인으로 돌아가기
        </button>
      </form>
    </main>
  );
}