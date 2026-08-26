const albums = [
  {
    title: "강민구 담임목사 취임식",
    category: "SPECIAL EVENT",
    date: "2025.08.24",
    image: "/album/pastor-inauguration.jpg",
  },
  {
    title: "취임사",
    category: "PASTOR",
    date: "2025.08.24",
    image: "/album/pastor-inauguration-message.jpg",
  },
  {
    title: "성탄전야제",
    category: "CHRISTMAS",
    date: "2025.12.24",
    image: "/album/christmas-eve.jpg",
  },
];

export default function Album() {
  return (
    <section id="album" className="album-section">
      <div className="section-container">

        <div className="album-header">
          <div>
            <p className="section-eyebrow">ALBUM</p>

            <h2>
              함께한 순간을
              <br />
              기억합니다.
            </h2>
          </div>

          <a href="#" className="view-all">
            앨범 전체보기
            <span>→</span>
          </a>
        </div>

        <div className="album-grid">

          {albums.map((album, index) => (
            <article className={`album-card album-${index + 1}`} key={album.title}>

              <div className="album-image">
                <img
                  src={album.image}
                  alt={album.title}
                />

                <div className="album-overlay">
                  <span>사진 보기 →</span>
                </div>
              </div>

              <div className="album-info">

                <div>
                  <p>{album.category}</p>

                  <h3>{album.title}</h3>
                </div>

                <span>{album.date}</span>

              </div>

            </article>
          ))}

        </div>

      </div>
    </section>
  );
}