type YouTubeVideo = {
  date: string;
  title: string;
  youtubeId: string;
};

const CHANNEL_ID = "UCJce-qofTvfM5UdY6gJBg1g";

async function getSermons(): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.error("YOUTUBE_API_KEY가 설정되지 않았습니다.");
    return [];
  }

  try {
    // 1. 교회 채널의 업로드 재생목록 ID 가져오기
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${apiKey}`,
      {
        next: { revalidate: 300 },
      }
    );

    const channelData = await channelResponse.json();

    const uploadsPlaylistId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      return [];
    }

    // 2. 최신 업로드 영상 가져오기
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=4&key=${apiKey}`,
      {
        next: { revalidate: 300 },
      }
    );

    const videosData = await videosResponse.json();

    return (videosData.items || []).map(
      (item: {
        snippet: {
          publishedAt: string;
          title: string;
          resourceId: {
            videoId: string;
          };
        };
      }) => ({
        date: new Date(item.snippet.publishedAt).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        title: item.snippet.title,
        youtubeId: item.snippet.resourceId.videoId,
      })
    );
  } catch (error) {
    console.error("YouTube 영상을 가져오는 중 오류:", error);
    return [];
  }
}

export default async function Sermons() {
  const sermons = await getSermons();

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

          <a
            href="https://www.youtube.com/@주님의교회bbc/videos"
            target="_blank"
            rel="noopener noreferrer"
            className="view-all sermon-all"
          >
            설교영상 전체보기
            <span>→</span>
          </a>
        </div>

        <div className="sermon-grid">
          {sermons.map((sermon) => (
            <article className="sermon-card" key={sermon.youtubeId}>

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
                  <span>강민구 담임목사</span>
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