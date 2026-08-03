"use client";

import type { PhotoListItem } from "@/types/photo";

type Props = {
    photo: PhotoListItem;
    onClick: () => void;
    selectionMode?: boolean;
    selected?: boolean;
};

export default function PhotoCard({
    photo,
    onClick,
    selectionMode = false,
    selected = false,
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
                className={`
                    h-full
                    w-full
                    object-cover
                    transition-all
                    duration-300
                    ${
                    selected
                        ? "scale-95"
                        : "group-hover:scale-110"
                    }
                `}
            />

            {selectionMode && (
                <div
                    className={`
                    absolute
                    top-2
                    left-2
                    z-20
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    text-sm
                    font-bold
                    transition-all
                    duration-200

                    ${
                        selected
                        ? `
                            scale-110
                            border-blue-600
                            bg-blue-600
                            text-white
                        `
                        : `
                            border-white
                            bg-black/30
                            text-transparent
                        `
                    }
                    `}
                >
                    ✓
                </div>
                )}

            {selectionMode && selected && (
                <div className="absolute inset-0 bg-black/30 z-10" />
            )}


            {/* hover overlay */}

            <div
                className={`
                    absolute
                    inset-0
                    flex
                    items-end
                    p-2
                    transition
                    ${
                    selectionMode
                        ? "bg-transparent opacity-100"
                        : "bg-black/0 opacity-0 group-hover:bg-black/30 group-hover:opacity-100"
                    }
                `}
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