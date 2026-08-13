import { cookies } from "next/headers";

export async function getGuestId(eventToken: string) {
  const cookieStore = await cookies();

  const cookieName = `shutterchance_guest_${eventToken}`;

  return cookieStore.get(cookieName)?.value ?? null;
}