const sermons = [
  {
    date: "2026.08.23",
    title: "내가 만든 신: 죄의 뿌리는 무엇인가?ㅣ강민구 목사ㅣ2026-08-23",
    speaker: "강민구 담임목사",
    youtubeId: "O2AWpG3g4L0",
  },
  {
    date: "2026.08.16",
    title: "(시편25-5) 홀로 남겨진 자에게 찾아온 선물ㅣ강민구 목사ㅣ2026-08-19",
    speaker: "강민구 담임목사",
    youtubeId: "aDuwMqDZ9Ug",
  },
];

export default function Sermons() {
  return (
    <section id="sermons" className="sermons-section">
      <div className="section-container">

        <div className="sermons-header">
          <div>
            <p className="section-eyebrow">SERMON</p>

            <h2>
              말씀을 듣고
              <br />
              함께 믿음을 세워갑니다.
            </h2>
          </div>

          <a href="#" className="view-all sermon-all">
            설교영상 전체보기
            <span>→</span>
          </a>
        </div>

        <div className="sermon-grid">
          {sermons.map((sermon, index) => (
            <article className="sermon-card" key={index}>

              <div className="video-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${sermon.youtubeId}`}
                  title={sermon.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="sermon-info">

                <div className="sermon-meta">
                  <span>{sermon.date}</span>
                  <span>{sermon.speaker}</span>
                </div>

                <h3>{sermon.title}</h3>

                <a
                  href={`https://www.youtube.com/watch?v=${sermon.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sermon-link"
                >
                  유튜브에서 보기 →
                </a>

              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}