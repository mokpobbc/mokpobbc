"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NewNewsPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    let imageUrl: string | null = null;

    // 사진이 있으면 Storage에 업로드
    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("news-images")
        .upload(fileName, image);

      if (uploadError) {
        console.error("사진 업로드 오류:", uploadError);
        setMessage("사진 업로드에 실패했습니다.");
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("news-images")
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    // DB에 교회소식 저장
    const { error } = await supabase.from("news").insert({
      title,
      content,
      image_url: imageUrl,
    });

    setLoading(false);

    if (error) {
      console.error("교회소식 등록 오류:", error);
      setMessage("교회소식 등록에 실패했습니다.");
      return;
    }

    setMessage("교회소식이 등록되었습니다.");

    setTimeout(() => {
      router.push("/admin");
      router.refresh();
    }, 800);
  }

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 24px",
      }}
    >
      <button
        type="button"
        onClick={() => router.push("/admin")}
        style={{ marginBottom: "30px" }}
      >
        ← 관리자 페이지
      </button>

      <h1>교회소식 작성</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <label>
          제목
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="교회소식 제목을 입력하세요"
            required
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "8px",
            }}
          />
        </label>

        <label>
          내용
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="교회소식 내용을 입력하세요"
            required
            rows={12}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              resize: "vertical",
            }}
          />
        </label>

        <label>
          사진
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files?.[0] || null);
            }}
            style={{
              display: "block",
              marginTop: "8px",
            }}
          />
        </label>

        {image && (
          <p>
            선택된 사진: <strong>{image.name}</strong>
          </p>
        )}

        {message && <p>{message}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "14px",
            fontSize: "16px",
          }}
        >
          {loading ? "등록 중..." : "교회소식 등록"}
        </button>
      </form>
    </main>
  );
}