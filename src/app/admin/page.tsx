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

export default function AdminPage() {
  const router = useRouter();

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    await loadNews();
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

  if (loading) {
    return <main style={{ padding: "40px" }}>불러오는 중...</main>;
  }

  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <div>
          <p>ADMIN</p>
          <h1>주님의교회 관리자</h1>
        </div>

        <button onClick={logout}>로그아웃</button>
      </header>

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
                  {new Date(item.created_at).toLocaleDateString("ko-KR")}
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
    onClick={() => router.push(`/admin/news/${item.id}/edit`)}
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