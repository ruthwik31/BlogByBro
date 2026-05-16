import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("=== Login API called ===");
  const { email, password } = await request.json();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // No-op - we'll set cookies manually
        },
      },
    },
  );

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("Login error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  console.log("Login successful, manually setting session cookie");

  // Manually set the session cookie
  const response = NextResponse.json({ success: true });

  // Extract project ref from URL (e.g., "gfqfmpmchgajefrtlfys" from "https://gfqfmpmchgajefrtlfys.supabase.co")
  const projectRef =
    process.env.NEXT_PUBLIC_SUPABASE_URL.match(/https:\/\/([^.]+)/)?.[1];

  if (data.session && projectRef) {
    const cookieName = `sb-${projectRef}-auth-token`;
    const cookieValue = btoa(JSON.stringify(data.session));

    console.log("Setting cookie:", cookieName);

    response.cookies.set(cookieName, cookieValue, {
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  return response;
}
