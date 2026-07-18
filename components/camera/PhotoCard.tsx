"use client";

import { useState } from "react";
import type { PhotoListItem } from "@/types/photo";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

type Props = {
    photo: PhotoListItem;
};

export default function PhotoCard({
    photo,
}: Props) {

    const [open, setOpen] = useState(false);

    return (

        <>
        {/* Instagram風カード */}

        <button
            onClick={() => setOpen(true)}
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

        {/* 拡大表示 */}

        <Dialog
            open={open}
            onOpenChange={setOpen}
        >

            <DialogContent
                className="
                    max-w-md
                    overflow-hidden
                    p-0
                    gap-0
                "
                >


                {/* User Header */}

                <div
                    className="
                    flex
                    items-center
                    px-4
                    py-3
                    border-b
                    bg-background
                    "
                >

                    <p
                    className="
                        font-semibold
                        text-sm
                    "
                    >
                    {photo.guest_name}
                    </p>


                </div>




                {/* Photo */}

                <div
                    className="
                    relative
                    aspect-square
                    w-full
                    bg-black
                    "
                >

                    <img

                    src={photo.image_url}

                    alt="uploaded photo"

                    className="
                        h-full
                        w-full
                        object-contain
                    "

                    />


                </div>


            </DialogContent>


        </Dialog>


        </>

    );
}