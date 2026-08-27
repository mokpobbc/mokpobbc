import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "회원 ID가 없습니다.",
        },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          success: false,
          error: "서버 환경변수가 없습니다.",
        },
        { status: 500 }
      );
    }

    const adminSupabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 1. profiles 삭제
    const { error: profileError } = await adminSupabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (profileError) {
  console.error("PROFILES DELETE ERROR:", profileError);

  return NextResponse.json(
    {
      success: false,
      step: "profiles",
      error: "PROFILE_DELETE_FAILED",
      details: String(profileError.message || ""),
      code: String(profileError.code || ""),
      hint: String(profileError.hint || ""),
      raw: JSON.stringify(profileError),
    },
    { status: 500 }
  );
}

    // 2. Supabase Auth 계정 삭제
    const { error: authError } =
      await adminSupabase.auth.admin.deleteUser(id);

    if (authError) {
      console.error("AUTH DELETE ERROR:", authError);

      return NextResponse.json(
        {
          success: false,
          step: "auth",
          error: "회원 계정 삭제 실패",
          details: authError.message,
          code: authError.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "회원이 완전히 삭제되었습니다.",
    });
  } catch (error) {
    console.error("DELETE MEMBER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        step: "server",
        error: "회원 삭제 중 오류가 발생했습니다.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}