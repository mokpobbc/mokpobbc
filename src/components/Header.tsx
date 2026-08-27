"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkLogin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkLogin() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setLoggedIn(!!session);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setLoggedIn(false);
    router.refresh();
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          href="#home"
          className="logo"
          onClick={() => setMenuOpen(false)}
        >
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {loggedIn ? (
            <>
              <button
                className="login-button"
                onClick={() => router.push("/mypage")}
              >
                내 계정
              </button>

              <button
                className="login-button"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                className="login-button"
                onClick={() => router.push("/login")}
              >
                로그인
              </button>

              <button
                className="login-button"
                onClick={() => router.push("/signup")}
              >
                회원가입
              </button>
            </>
          )}
        </div>

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