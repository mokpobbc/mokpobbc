import { supabase } from "@/lib/supabase";

type NewsItem = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

export default async function News() {
  const { data: news, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("교회소식을 불러오지 못했습니다:", error);
  }

  return (
    <section id="news" className="news-section">
      <div className="section-container">

        <div className="news-header">
          <div>
            <p className="section-eyebrow">NEWS</p>

            <h2>
              주님의교회
              <br />
              새로운 소식을 전합니다.
            </h2>
          </div>

          <a href="/news" className="view-all">
  교회소식 전체보기
  <span>→</span>
</a>
        </div>

        <div className="news-grid">
          {news && news.length > 0 ? (
            news.map((item: NewsItem) => (
              <article className="news-card" key={item.id}>

                {item.image_url && (
                  <div className="news-image">
                    <img
                      src={item.image_url}
                      alt={item.title}
                    />
                  </div>
                )}

                <div className="news-info">

                  <p className="news-date">
                    {new Date(item.created_at).toLocaleDateString("ko-KR")}
                  </p>

                  <h3>{item.title}</h3>

                  <p
  className="news-content"
  style={{ whiteSpace: "pre-line" }}
>
  {item.content}
</p>

                </div>

              </article>
            ))
          ) : (
            <p>등록된 교회소식이 없습니다.</p>
          )}
        </div>

      </div>
    </section>
  );
}