const newsItems = [
  {
    date: "2026.08.23",
    category: "교회소식",
    title: "주님의교회 홈페이지를 준비하고 있습니다.",
    description:
      "성도님들과 지역사회를 위한 새로운 홈페이지를 준비하고 있습니다.",
  },
  {
    date: "2026.08.16",
    category: "예배안내",
    title: "주일예배와 수요예배 안내",
    description:
      "주일 오전 11시, 수요일 저녁 7시 30분에 함께 예배드립니다.",
  },
  {
    date: "2026.08.09",
    category: "공지",
    title: "주님의교회에 오신 여러분을 환영합니다.",
    description:
      "복음을 선포하고 사랑을 실천하는 믿음의 공동체, 주님의교회입니다.",
  },
];

export default function News() {
  return (
    <section id="news" className="news-section">
      <div className="section-container">

        <div className="news-header">
          <div>
            <p className="section-eyebrow">NEWS</p>

            <h2>
              교회소식
              <br />
              새로운 소식을 전합니다.
            </h2>
          </div>

          <a href="#" className="view-all">
            전체 소식 보기
            <span>→</span>
          </a>
        </div>

        <div className="news-list">
          {newsItems.map((news, index) => (
            <article className="news-item" key={index}>
              <div className="news-date">
                <span>{news.date}</span>
                <small>{news.category}</small>
              </div>

              <div className="news-content">
                <h3>{news.title}</h3>

                <p>{news.description}</p>
              </div>

              <div className="news-arrow">
                →
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}