"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadNews();
  }, []);

  async function loadNews() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("교회소식을 불러오지 못했습니다:", error);
      router.replace("/admin");
      return;
    }

    setTitle(data.title);
    setContent(data.content);
    setCurrentImageUrl(data.image_url);

    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    let imageUrl = currentImageUrl;

    if (newImage) {
      const fileExt = newImage.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("news-images")
        .upload(fileName, newImage);

      if (uploadError) {
        console.error("사진 업로드 오류:", uploadError);
        setMessage("사진 업로드에 실패했습니다.");
        setSaving(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("news-images")
        .getPublicUrl(fileName);

      imageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from("news")
      .update({
        title,
        content,
        image_url: imageUrl,
      })
      .eq("id", id);

    if (error) {
      console.error("교회소식 수정 오류:", error);
      setMessage("수정에 실패했습니다.");
      setSaving(false);
      return;
    }

    setMessage("교회소식이 수정되었습니다.");

    setTimeout(() => {
      router.push("/admin");
      router.refresh();
    }, 800);
  }

  if (loading) {
    return <main style={{ padding: "40px" }}>불러오는 중...</main>;
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

      <h1>교회소식 수정</h1>

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
            required
            rows={15}
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              resize: "vertical",
            }}
          />
        </label>

        {currentImageUrl && (
          <div>
            <p>현재 사진</p>
            <img
              src={currentImageUrl}
              alt="현재 교회소식 이미지"
              style={{
                width: "100%",
                maxWidth: "500px",
                borderRadius: "12px",
              }}
            />
          </div>
        )}

        <label>
          새 사진으로 변경
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setNewImage(e.target.files?.[0] || null);
            }}
            style={{
              display: "block",
              marginTop: "8px",
            }}
          />
        </label>

        {message && <p>{message}</p>}

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "14px",
            fontSize: "16px",
          }}
        >
          {saving ? "수정 중..." : "수정 저장"}
        </button>
      </form>
    </main>
  );
}