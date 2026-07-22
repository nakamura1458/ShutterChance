"use client";

import type { PhotoListItem } from "@/types/photo";
import { X } from "lucide-react";

type Props = {
    photo: PhotoListItem;
    onClick: () => void;
};

export default function PhotoCard({
    photo,
    onClick,
}: Props) {

    return (

        <>
        {/* Instagram風カード */}

        <button
            onClick={onClick}
            className="
                group
                relative
                aspect-square
                overflow-hidden
                rounded-sm
                bg-muted
                "
        >
            <img
                src={photo.image_url}
                alt="uploaded photo"
                className="
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-300
                    group-hover:scale-110
                "
            />


            {/* hover overlay */}

            <div
                className="
                    absolute
                    inset-0
                    flex
                    items-end
                    bg-black/0
                    p-2
                    opacity-0
                    transition
                    group-hover:bg-black/30
                    group-hover:opacity-100
                "
            >

                <p
                    className="
                    text-xs
                    font-medium
                    text-white
                    "
                >
                    {photo.guest_name}
                </p>

            </div>

        </button>

        </>

    );
}