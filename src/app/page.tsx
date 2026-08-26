import Header from "@/components/Header";
import Worship from "@/components/Worship";
import News from "@/components/News";
import Sermons from "@/components/Sermons";
import Album from "@/components/Album";
import Location from "@/components/Location";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">THE LORD'S CHURCH · MOKPO</p>

          <h1>
            복음을 선포하고
            <br />
            <span>사랑을 실천하는</span>
            <br />
            공동체
          </h1>

          <p className="description">
            주님의교회는 하나님의 말씀을 중심으로
            <br />
            함께 예배하고 사랑을 나누는 믿음의 공동체입니다.
          </p>

          <div className="buttons">
            <a href="#worship" className="primary-button">
              예배 안내
            </a>

            <a href="#about" className="secondary-button">
              교회 알아보기 →
            </a>
          </div>
        </div>
      </section>

      <Worship />

      <News />

      <Sermons />

      <Album />

      <Location />

      <Footer />
    </main>
  );
}