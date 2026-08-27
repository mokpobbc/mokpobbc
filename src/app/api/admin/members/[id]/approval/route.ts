import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "MEMBER_ID_MISSING",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const approved = body.approved;

    if (typeof approved !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          error: "APPROVED_VALUE_INVALID",
        },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          success: false,
          error: "SERVER_ENV_MISSING",
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

    const { error } = await adminSupabase
      .from("profiles")
      .update({ approved })
      .eq("id", id);

    if (error) {
      console.error(
        "APPROVAL UPDATE ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          step: "profiles",
          error: "APPROVAL_UPDATE_FAILED",
          details: error.message,
          code: error.code,
          hint: error.hint,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      approved,
    });
  } catch (error) {
    console.error(
      "APPROVAL API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        step: "server",
        error: "APPROVAL_REQUEST_FAILED",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}