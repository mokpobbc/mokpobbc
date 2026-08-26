export default function Worship() {
  return (
    <section id="worship" className="worship-section">
      <div className="section-container">

        <div className="section-heading">
          <div>
            <p className="section-eyebrow">WORSHIP</p>

            <h2>
              함께 예배하며
              <br />
              하나님을 만나는 시간
            </h2>
          </div>

          <p className="section-intro">
            주님의교회는 하나님의 말씀을 중심으로
            <br />
            함께 예배하고 믿음 안에서 교제합니다.
          </p>
        </div>

        <div className="worship-grid">

          <article className="worship-card featured">
            <div className="card-top">
              <span>01</span>
              <span>주일예배</span>
            </div>

            <div className="card-content">
              <p className="worship-label">
                SUNDAY WORSHIP
              </p>

              <h3>주일예배</h3>

              <strong>오전 11:00</strong>

              <p>
                주일마다 함께 모여
                <br />
                하나님의 말씀을 듣고 예배합니다.
              </p>
            </div>
          </article>


          <article className="worship-card">
            <div className="card-top">
              <span>02</span>
              <span>수요예배</span>
            </div>

            <div className="card-content">
              <p className="worship-label">
                WEDNESDAY WORSHIP
              </p>

              <h3>수요예배</h3>

              <strong>저녁 7:30</strong>

              <p>
                말씀과 기도로 하나님을 바라보며
                <br />
                함께 믿음을 세워갑니다.
              </p>
            </div>
          </article>


          <article className="worship-card location-card">
            <div className="card-top">
              <span>03</span>
              <span>오시는 길</span>
            </div>

            <div className="card-content">
              <p className="worship-label">
                LOCATION
              </p>

              <h3>주님의교회</h3>

              <strong>교육로 29, 3층</strong>

              <p>
                전남광주통합특별시 목포시
                <br />
                방문하시는 모든 분들을 환영합니다.
              </p>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}