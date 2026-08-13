import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

type Props = {
  params: Promise<{
    eventToken: string;
  }>;
};

async function getOrCreateGuestId(eventToken: string) {
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

  return guestId;
}

export async function POST(
  request: Request,
  { params }: Props
) {
  try {
    const { eventToken } = await params;

    const body = await request.json();
    const photoId = body.photoId;

		console.log("LIKE API DEBUG:", {
      eventToken,
      photoId,
    });

    if (!photoId) {
      return NextResponse.json(
        {
          success: false,
          error: "photoId is required",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // イベントの存在確認
		const { data: event, error: eventError } = await supabase
			.from("events")
			.select("id")
			.eq("event_token", eventToken)
			.single();

    if (eventError || !event) {
      return NextResponse.json(
        {
          success: false,
          error: "イベントが見つかりません",
        },
        { status: 404 }
      );
    }

    // 写真がこのイベントに属しているか確認
    const { data: photo, error: photoError } = await supabase
      .from("photos")
      .select("id")
      .eq("id", photoId)
      .eq("event_id", event.id)
      .single();

    if (photoError || !photo) {
      return NextResponse.json(
        {
          success: false,
          error: "写真が見つかりません",
        },
        { status: 404 }
      );
    }

    const guestId = await getOrCreateGuestId(eventToken);

    const { data: existingLike } = await supabase
      .from("photo_likes")
      .select("id")
      .eq("photo_id", photoId)
      .eq("guest_id", guestId)
      .maybeSingle();

    if (existingLike) {
      const { error: deleteError } = await supabase
        .from("photo_likes")
        .delete()
        .eq("id", existingLike.id);

      if (deleteError) {
        throw deleteError;
      }

      return NextResponse.json({
        success: true,
        liked: false,
      });
    }

    const { error: insertError } = await supabase
      .from("photo_likes")
      .insert({
        photo_id: photoId,
        guest_id: guestId,
      });

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      liked: true,
    });
  } catch (error) {
    console.error("Like API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "いいね処理に失敗しました",
      },
      { status: 500 }
    );
  }
}


export async function GET(
  request: Request,
  { params }: Props
) {
  try {
    const { eventToken } = await params;

    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get("photoId");

    if (!photoId) {
      return NextResponse.json(
        {
          success: false,
          error: "photoId is required",
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // イベント確認
    const { data: event, error: eventError } =
      await supabase
        .from("events")
        .select("id")
        .eq("event_token", eventToken)
        .single();

    if (eventError || !event) {
      return NextResponse.json(
        {
          success: false,
          error: "イベントが見つかりません",
        },
        { status: 404 }
      );
    }

    // 写真確認
    const { data: photo, error: photoError } =
      await supabase
        .from("photos")
        .select("id")
        .eq("id", photoId)
        .eq("event_id", event.id)
        .single();

    if (photoError || !photo) {
      return NextResponse.json(
        {
          success: false,
          error: "写真が見つかりません",
        },
        { status: 404 }
      );
    }

    // Guest ID取得
    const cookieStore = await cookies();

    const cookieName =
      `shutterchance_guest_${eventToken}`;

    const guestId =
      cookieStore.get(cookieName)?.value;

    // いいね数取得
    const { count, error: countError } =
      await supabase
        .from("photo_likes")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("photo_id", photoId);

    if (countError) {
      throw countError;
    }

    // 自分がいいね済みか確認
    let liked = false;

    if (guestId) {
      const { data: existingLike } =
        await supabase
          .from("photo_likes")
          .select("id")
          .eq("photo_id", photoId)
          .eq("guest_id", guestId)
          .maybeSingle();

      liked = !!existingLike;
    }

    return NextResponse.json({
      success: true,
      count: count ?? 0,
      liked,
    });
  } catch (error) {
    console.error(
      "Like GET API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "いいね情報の取得に失敗しました",
      },
      { status: 500 }
    );
  }
}