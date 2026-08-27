import { supabase } from "@/lib/supabase";

type NewsItem = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

export default async function NewsPage() {
  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("교회소식을 불러오지 못했습니다:", error);
  }

  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "80px 24px",
      }}
    >
      <p>NEWS</p>

      <h1
        style={{
          fontSize: "40px",
          marginBottom: "50px",
        }}
      >
        교회소식
      </h1>

      {news && news.length > 0 ? (
        <div>
          {news.map((item: NewsItem, index: number) => (
            <article
              key={item.id}
              style={{
                padding: "24px 0",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                }}
              >
                <div>
                  <p style={{ marginBottom: "8px" }}>
                    {new Date(item.created_at).toLocaleDateString("ko-KR")}
                  </p>

                  <a
  href={`/news/${item.id}`}
  style={{
    textDecoration: "none",
    color: "inherit",
  }}
>
  <h2>{item.title}</h2>
</a>
                </div>

                <span>{news.length - index}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p>등록된 교회소식이 없습니다.</p>
      )}
    </main>
  );
}