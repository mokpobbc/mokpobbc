"use client";

import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">

        <a href="#home" className="logo">
          <span className="logo-symbol">✦</span>

          <span className="logo-text">
            <strong>주님의교회</strong>
            <small>THE LORD'S CHURCH</small>
          </span>
        </a>

        <nav className={`navigation ${menuOpen ? "open" : ""}`}>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            교회소개
          </a>

          <a href="#worship" onClick={() => setMenuOpen(false)}>
            예배
          </a>

          <a href="#sermons" onClick={() => setMenuOpen(false)}>
            설교영상
          </a>

          <a href="#news" onClick={() => setMenuOpen(false)}>
            교회소식
          </a>

          <a href="#community" onClick={() => setMenuOpen(false)}>
            커뮤니티
          </a>
        </nav>

        <button
          className="login-button"
          onClick={() => alert("로그인 기능은 다음 단계에서 만들어요.")}
        >
          로그인
        </button>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴 열기"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </header>
  );
}