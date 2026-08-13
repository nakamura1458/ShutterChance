import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

type Props = {
  params: Promise<{
    eventToken: string;
  }>;
};

export async function GET(request: Request, { params }: Props) {
  const { eventToken } = await params;

  const cookieStore = await cookies();
  const cookieName = `shutterchance_guest_${eventToken}`;

  let guestId = cookieStore.get(cookieName)?.value;

  if (!guestId) {
    guestId = randomUUID();

    cookieStore.set(cookieName, guestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  return NextResponse.json({
    success: true,
    guestId,
  });
}