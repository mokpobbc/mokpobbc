"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setError(
        "비밀번호 재설정 링크가 만료되었거나 올바르지 않습니다."
      );
      setChecking(false);
      return;
    }

    setChecking(false);
  }

  async function handleResetPassword(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("비밀번호는 6자 이상 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호가 서로 다릅니다.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      console.error("비밀번호 변경 오류:", error);
      setError(
        "비밀번호를 변경하지 못했습니다. 다시 시도해주세요."
      );
      return;
    }

    setMessage(
      "비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다."
    );

    await supabase.auth.signOut();

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }

  if (checking) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        확인 중...
      </main>
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
        onSubmit={handleResetPassword}
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
          <p>NEW PASSWORD</p>

          <h1>새 비밀번호 설정</h1>

          <p>
            새로운 비밀번호를 입력해주세요.
          </p>
        </div>

        <input
          type="password"
          placeholder="새 비밀번호"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          style={{
            padding: "14px",
            fontSize: "16px",
          }}
        />

        <input
          type="password"
          placeholder="새 비밀번호 확인"
          value={passwordConfirm}
          onChange={(e) => {
            setPasswordConfirm(e.target.value);
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
              lineHeight: "1.5",
            }}
          >
            ⚠️ {error}
          </p>
        )}

        {message && (
          <p
            style={{
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            ✅ {message}
          </p>
        )}

        {!error && (
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              fontSize: "16px",
            }}
          >
            {loading ? "변경 중..." : "비밀번호 변경"}
          </button>
        )}

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