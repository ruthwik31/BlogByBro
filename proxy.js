import { NextResponse } from "next/server";

export async function proxy(request) {
  // Auth is now handled client-side in AdminShell component
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
