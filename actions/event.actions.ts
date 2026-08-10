"use server";

import { getEventByToken } from "@/services/event.service";

type CheckEventTokenResult =
  | {
      success: true;
      eventToken: string;
    }
  | {
      success: false;
      message: string;
    };

export async function checkEventToken(
  eventToken: string
): Promise<CheckEventTokenResult> {
  const token = eventToken.trim();

  if (!token) {
    return {
      success: false,
      message: "イベントコードを入力してください",
    };
  }

  const event = await getEventByToken(token);

  if (!event) {
    return {
      success: false,
      message: "イベントが見つかりませんでした",
    };
  }

  return {
    success: true,
    eventToken: token,
  };
}