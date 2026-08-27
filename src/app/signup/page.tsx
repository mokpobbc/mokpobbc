"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [nameError, setNameError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setNameError("");
    setError("");
    setMessage("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // 이름 필수 검사
    if (!trimmedName) {
      setNameError("이름은 필수 입력입니다.");
      return;
    }

    // 이름 형식 검사
    if (!/^[가-힣]{2,4}$/.test(trimmedName)) {
      setNameError("이름은 한글 2~4글자로 입력해주세요.");
      return;
    }

    // 이메일 필수 검사
    if (!trimmedEmail) {
      setError("이메일을 입력해주세요.");
      return;
    }

    // 이메일 형식 검사
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    // 비밀번호 검사
    if (password.length < 6) {
      setError("비밀번호는 6자 이상 입력해주세요.");
      return;
    }

    // 비밀번호 확인
    if (password !== passwordConfirm) {
      setError("비밀번호가 서로 다릅니다.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          name: trimmedName,
        },
      },
    });

    setLoading(false);

    if (error) {
      console.error("회원가입 오류:", error);

      // Supabase 오류 메시지 한글 처리
      if (
        error.message.includes("invalid format") ||
        error.message.includes("Unable to validate email address")
      ) {
        setError("올바른 이메일 주소를 입력해주세요.");
      } else if (
        error.message.includes("User already registered") ||
        error.message.includes("already registered")
      ) {
        setError("이미 가입된 이메일 주소입니다.");
      } else if (error.message.includes("Password should be")) {
        setError("비밀번호는 6자 이상 입력해주세요.");
      } else {
        setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
      }

      return;
    }

    setMessage(
      "회원가입이 완료되었습니다. 이메일 인증이 필요한 경우 이메일을 확인해주세요."
    );

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }

  return (
    <main
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "80px 24px",
      }}
    >
      <p>JOIN</p>

      <h1>회원가입</h1>

      <form
        onSubmit={handleSignup}
        noValidate
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "40px",
        }}
      >
        <div>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError("");
            }}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              boxSizing: "border-box",
              border: nameError
                ? "1px solid red"
                : "1px solid #ccc",
            }}
          />

          {nameError && (
            <p
              style={{
                marginTop: "6px",
                fontSize: "14px",
                color: "red",
              }}
            >
              ⚠️ {nameError}
            </p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              boxSizing: "border-box",
              border: error
                ? "1px solid red"
                : "1px solid #ccc",
            }}
          />
        </div>

        <input
          type="password"
          placeholder="비밀번호"
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
          placeholder="비밀번호 확인"
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
              fontSize: "14px",
              margin: 0,
            }}
          >
            ⚠️ {error}
          </p>
        )}

        {message && (
          <p
            style={{
              fontSize: "14px",
              margin: 0,
            }}
          >
            {message}
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
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => router.push("/login")}
        style={{
          marginTop: "20px",
        }}
      >
        이미 계정이 있으신가요? 로그인
      </button>
    </main>
  );
}