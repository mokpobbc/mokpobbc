"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type NewsItem = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

type Profile = {
  id: string;
  name: string;
  email: string | null;
  approved: boolean;
  role: string;
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();

  const [news, setNews] = useState<NewsItem[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const [loading, setLoading] = useState(true);
  const [memberLoading, setMemberLoading] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !profile || profile.role !== "admin") {
      await supabase.auth.signOut();
      router.replace("/admin/login");
      return;
    }

    await Promise.all([loadNews(), loadProfiles()]);

    setLoading(false);
  }

  async function loadNews() {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("교회소식을 불러오지 못했습니다:", error);
      return;
    }

    setNews(data || []);
  }

  async function loadProfiles() {
    setMemberLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, approved, role, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("회원 목록을 불러오지 못했습니다:", error);
      setMemberLoading(false);
      return;
    }

    setProfiles(data || []);
    setMemberLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  async function deleteNews(id: string) {
    const confirmed = confirm("이 교회소식을 삭제하시겠습니까?");

    if (!confirmed) return;

    const { error } = await supabase
      .from("news")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("교회소식 삭제 오류:", error);
      alert("삭제하지 못했습니다.");
      return;
    }

    await loadNews();
  }

  async function updateApproval(
    id: string,
    approved: boolean
  ) {
    const { error } = await supabase
      .from("profiles")
      .update({ approved })
      .eq("id", id);

    if (error) {
      console.error("회원 승인 상태 변경 오류:", error);
      alert("회원 상태를 변경하지 못했습니다.");
      return;
    }

    await loadProfiles();
  }

  async function approveMember(id: string) {
    await updateApproval(id, true);
  }

  async function rejectMember(id: string) {
    const confirmed = confirm(
      "이 회원의 승인을 취소하시겠습니까?"
    );

    if (!confirmed) return;

    await updateApproval(id, false);
  }

  if (loading) {
    return <main style={{ padding: "40px" }}>불러오는 중...</main>;
  }

  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "50px",
        }}
      >
        <div>
          <p>ADMIN</p>
          <h1>주님의교회 관리자</h1>
        </div>

        <button onClick={logout}>로그아웃</button>
      </header>

      {/* 회원 관리 */}
      <section
        style={{
          marginBottom: "70px",
        }}
      >
        <h2>회원 관리</h2>

        <p
          style={{
            color: "#777",
            marginTop: "8px",
            marginBottom: "25px",
          }}
        >
          회원가입한 사람의 승인 여부를 관리합니다.
        </p>

        {memberLoading ? (
          <p>회원 목록을 불러오는 중...</p>
        ) : profiles.length === 0 ? (
          <p>가입한 회원이 없습니다.</p>
        ) : (
          <div>
            {profiles.map((profile) => (
              <article
                key={profile.id}
                style={{
                  padding: "20px 0",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <div>
                    <h3>{profile.name}</h3>

                    <p
                      style={{
                        marginTop: "6px",
                        color: "#666",
                      }}
                    >
                      {profile.email}
                    </p>

                    <p
                      style={{
                        marginTop: "6px",
                        fontSize: "14px",
                        color: "#888",
                      }}
                    >
                      가입일:{" "}
                      {new Date(
                        profile.created_at
                      ).toLocaleDateString("ko-KR")}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    {profile.role === "admin" ? (
                      <span
                        style={{
                          padding: "8px 12px",
                          background: "#eee",
                          borderRadius: "6px",
                        }}
                      >
                        관리자
                      </span>
                    ) : profile.approved ? (
                      <>
                        <span
                          style={{
                            padding: "8px 12px",
                            background: "#e8f5e9",
                            borderRadius: "6px",
                          }}
                        >
                          ✅ 승인됨
                        </span>

                        <button
                          onClick={() =>
                            rejectMember(profile.id)
                          }
                          style={{
                            padding: "8px 12px",
                          }}
                        >
                          승인 취소
                        </button>
                      </>
                    ) : (
                      <>
                        <span
                          style={{
                            padding: "8px 12px",
                            background: "#fff3cd",
                            borderRadius: "6px",
                          }}
                        >
                          ⏳ 승인 대기
                        </span>

                        <button
                          onClick={() =>
                            approveMember(profile.id)
                          }
                          style={{
                            padding: "8px 12px",
                          }}
                        >
                          승인
                        </button>

                        <button
                          onClick={() =>
                            rejectMember(profile.id)
                          }
                          style={{
                            padding: "8px 12px",
                          }}
                        >
                          거절
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 교회소식 관리 */}
      <section>
        <h2>교회소식 관리</h2>

        <button
          onClick={() => router.push("/admin/news/new")}
          style={{
            marginTop: "20px",
            marginBottom: "30px",
            padding: "12px 20px",
          }}
        >
          + 교회소식 작성
        </button>

        {news.length === 0 ? (
          <p>등록된 교회소식이 없습니다.</p>
        ) : (
          <div>
            {news.map((item) => (
              <article
                key={item.id}
                style={{
                  padding: "20px 0",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <p>
                  {new Date(
                    item.created_at
                  ).toLocaleDateString("ko-KR")}
                </p>

                <h3>{item.title}</h3>

                <p
                  style={{
                    whiteSpace: "pre-line",
                  }}
                >
                  {item.content}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "12px",
                  }}
                >
                  <button
                    onClick={() =>
                      router.push(
                        `/admin/news/${item.id}/edit`
                      )
                    }
                    style={{
                      padding: "8px 14px",
                    }}
                  >
                    수정
                  </button>

                  <button
                    onClick={() => deleteNews(item.id)}
                    style={{
                      padding: "8px 14px",
                    }}
                  >
                    삭제
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}