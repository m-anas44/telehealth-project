import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/patient")) {
    return NextResponse.rewrite(new URL("/patient/overview", request.url));
  }
}
