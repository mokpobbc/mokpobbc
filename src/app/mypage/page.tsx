"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Profile = {
  name: string;
  email: string | null;
  approved: boolean;
  created_at: string;
};

export default function MyPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("name, email, approved, created_at")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      console.error("회원 정보를 불러오지 못했습니다:", error);
      setLoading(false);
      return;
    }

    setProfile(data);
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  if (loading) {
    return (
      <main
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "80px 24px",
        }}
      >
        불러오는 중...
      </main>
    );
  }

  if (!profile) {
    return (
      <main
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "80px 24px",
        }}
      >
        <p>회원 정보를 불러올 수 없습니다.</p>

        <button
          onClick={() => router.push("/")}
          style={{
            marginTop: "20px",
            padding: "12px 20px",
          }}
        >
          홈으로
        </button>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "80px 24px",
      }}
    >
      <p>MY PAGE</p>

      <h1
        style={{
          fontSize: "40px",
          marginTop: "10px",
        }}
      >
        내 계정
      </h1>

      <section
        style={{
          marginTop: "40px",
          padding: "32px",
          border: "1px solid #ddd",
          borderRadius: "12px",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            marginBottom: "30px",
          }}
        >
          안녕하세요, {profile.name}님 👋
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div>
            <p
              style={{
                color: "#777",
                marginBottom: "6px",
              }}
            >
              이름
            </p>

            <p>{profile.name}</p>
          </div>

          <div>
            <p
              style={{
                color: "#777",
                marginBottom: "6px",
              }}
            >
              이메일
            </p>

            <p>{profile.email}</p>
          </div>

          <div>
            <p
              style={{
                color: "#777",
                marginBottom: "6px",
              }}
            >
              회원 상태
            </p>

            <p>
              {profile.approved
                ? "✅ 승인된 회원"
                : "⏳ 관리자 승인 대기"}
            </p>
          </div>

          <div>
            <p
              style={{
                color: "#777",
                marginBottom: "6px",
              }}
            >
              가입일
            </p>

            <p>
              {new Date(profile.created_at).toLocaleDateString(
                "ko-KR"
              )}
            </p>
          </div>
        </div>
      </section>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "30px",
        }}
      >
        <button
          onClick={() => router.push("/")}
          style={{
            padding: "12px 20px",
          }}
        >
          홈으로
        </button>

        <button
          onClick={handleLogout}
          style={{
            padding: "12px 20px",
          }}
        >
          로그아웃
        </button>
      </div>
    </main>
  );
}