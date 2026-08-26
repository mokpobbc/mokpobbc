export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        <div className="footer-main">

          <div className="footer-brand">
            <p className="footer-mark">✦</p>

            <h2>주님의교회</h2>

            <p className="footer-english">
              THE LORD'S CHURCH
            </p>

            <p className="footer-description">
              복음을 선포하고
              <br />
              사랑을 실천하는 믿음의 공동체
            </p>
          </div>


          <div className="footer-info">

            <div className="footer-info-item">
              <span>ADDRESS</span>
              <p>
                전남광주통합특별시 목포시
                <br />
                교육로 29, 3층
              </p>
            </div>

            <div className="footer-info-item">
              <span>WORSHIP</span>
              <p>
                주일예배 오전 11:00
                <br />
                수요예배 저녁 7:30
              </p>
            </div>

            <div className="footer-info-item">
              <span>CONTACT</span>
              <p>
                Seming5822@gmail.com
              </p>
            </div>

          </div>

        </div>


        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} 주님의교회. All rights reserved.
          </p>

          <p>
            한국성서침례친교회
          </p>

        </div>

      </div>
    </footer>
  );
}