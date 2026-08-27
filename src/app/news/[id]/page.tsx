export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !news) {
    notFound();
  }

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "80px 24px",
      }}
    >
      <p>NEWS</p>

      <h1
        style={{
          fontSize: "42px",
          lineHeight: "1.3",
          marginTop: "16px",
        }}
      >
        {news.title}
      </h1>

      <p
        style={{
          marginTop: "16px",
          color: "#777",
        }}
      >
        {new Date(news.created_at).toLocaleDateString("ko-KR")}
      </p>

      {news.image_url && (
        <img
          src={news.image_url}
          alt={news.title}
          style={{
            width: "100%",
            marginTop: "40px",
            borderRadius: "12px",
          }}
        />
      )}

      <div
        style={{
          marginTop: "40px",
          lineHeight: "1.9",
          whiteSpace: "pre-line",
          fontSize: "17px",
        }}
      >
        {news.content}
      </div>

      <a
        href="/news"
        style={{
          display: "inline-block",
          marginTop: "60px",
        }}
      >
        ← 교회소식 목록으로
      </a>
    </main>
  );
}