"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    // 1. Supabase 로그인
    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (loginError) {
      setLoading(false);
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    // 2. 로그인한 사용자 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      await supabase.auth.signOut();
      setLoading(false);
      setError("로그인 정보를 확인할 수 없습니다.");
      return;
    }

    // 3. 관리자 승인 여부 확인
    const { data: profile, error: profileError } =
  await supabase
    .from("profiles")
    .select("approved")
    .eq("id", user.id)
    .single();

if (profileError || !profile) {
  console.error("프로필 조회 오류:", profileError);
  console.error("로그인한 사용자 ID:", user.id);

  await supabase.auth.signOut();
  setLoading(false);

  setError(
    profileError?.message ||
      "회원 정보를 확인할 수 없습니다."
  );

  return;
}

    // 4. 관리자 승인 전이면 로그인 차단
    if (!profile.approved) {
      await supabase.auth.signOut();
      setLoading(false);
      setError(
        "아직 관리자 승인이 완료되지 않았습니다. 관리자 승인 후 로그인할 수 있습니다."
      );
      return;
    }

    // 5. 승인된 회원만 홈페이지 이동
    setLoading(false);
    router.push("/");
    router.refresh();
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
        onSubmit={handleLogin}
        style={{
          width: "100%",
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div>
          <p>LOGIN</p>

          <h1>주님의교회 로그인</h1>

          <p>회원 계정으로 로그인해주세요.</p>
        </div>

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          required
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          required
        />

        {error && (
          <p
            style={{
              color: "red",
              lineHeight: "1.5",
            }}
          >
            ⚠️ {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "확인 중..." : "로그인"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/signup")}
        >
          회원가입
        </button>

        <button
  type="button"
  onClick={() => router.push("/forgot-password")}
>
  비밀번호를 잊으셨나요?
</button>
      </form>
    </main>
  );
}