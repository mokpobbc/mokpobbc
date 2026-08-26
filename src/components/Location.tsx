export default function Location() {
  return (
    <section id="about" className="location-section">
      <div className="section-container">

        <div className="location-header">
          <div>
            <p className="section-eyebrow">ABOUT US</p>

            <h2>
              복음을 선포하고
              <br />
              사랑을 실천합니다.
            </h2>
          </div>

          <p className="location-intro">
            주님의교회는 복음을 선포하고 사랑을 실천하는
            <br />
            믿음의 공동체입니다.
          </p>
        </div>


        <div className="church-info-grid">

          {/* 담임목사 */}

          <div className="church-info-card">
            <span className="info-number">01</span>

            <p>담임목사</p>

            <h3>강민구 목사</h3>

            <span className="info-description">
              The Master's Seminary
              <br />
              강해설교 전공
            </span>
          </div>


          {/* 주소 */}

          <div className="church-info-card">
            <span className="info-number">02</span>

            <p>주소</p>

            <h3>교육로 29, 3층</h3>

            <span className="info-description">
              전남광주통합특별시 목포시
            </span>
          </div>


          {/* 이메일 */}

          <div className="church-info-card">
            <span className="info-number">03</span>

            <p>문의</p>

            <h3 className="email-text">
              Seming5822@gmail.com
            </h3>

            <span className="info-description">
              교회 관련 문의 및 연락
            </span>
          </div>


          {/* 교단 */}

          <div className="church-info-card">
            <span className="info-number">04</span>

            <p>교단</p>

            <h3>한국성서침례친교회</h3>

            <a
              href="http://bbfk.org"
              target="_blank"
              rel="noopener noreferrer"
              className="denomination-link"
            >
              교단 홈페이지 →
            </a>
          </div>

        </div>


        {/* 오시는 길 */}

        <div className="location-box">

          <div className="location-text">

            <p className="section-eyebrow">
              LOCATION
            </p>

            <h3>
              주님의교회로
              <br />
              오시는 길
            </h3>

            <p>
              전남광주통합특별시 목포시 교육로 29 3층
            </p>

          </div>


          <div className="map-placeholder">
            <span>MAP</span>

            <p>
              지도를 준비하고 있습니다.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}