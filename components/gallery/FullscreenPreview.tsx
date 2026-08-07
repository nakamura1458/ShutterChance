"use client";

import {
    X,
    ChevronLeft,
    ChevronRight,
    Download,
} from "lucide-react";

import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { useState } from "react";

import {
    TransformWrapper,
    TransformComponent,
} from "react-zoom-pan-pinch";


type Props = {
    photos: string[];
    selectedIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrevious: () => void;
};

export default function FullscreenPreview({
    photos,
    selectedIndex,
    onClose,
    onNext,
    onPrevious,
}: Props) {

    const [zoomed, setZoomed] = useState(false);
    const handleDownload = async () => {

        try {
            const url = photos[selectedIndex];
            const response = await fetch(url);
            const blob = await response.blob();
            const file =
                new File(
                    [blob],
                    `photo-${selectedIndex + 1}.jpg`,
                    {
                        type: blob.type,
                    }
                );

            // iPhone Safari
            if (
                navigator.canShare &&
                navigator.canShare({
                    files: [file],
                })
            ) {
                await navigator.share({
                    files: [file],
                    title: "写真を保存",
                });
                return;
            }

            // PC / Android
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = `photo-${selectedIndex + 1}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);

        } catch(error){
            console.error(
                "download failed",
                error
            );
        }
    };


    const swipeHandlers = useSwipeable({
        onSwiped: (eventData) => {
            if (zoomed) return;

            if (eventData.dir === "Left") {
                onNext();
            }

            if (eventData.dir === "Right") {
                onPrevious();
            }
        },

        delta: 50,
        swipeDuration: 500,
        preventScrollOnSwipe: true,
        trackMouse: true,
    });


    return (

        <motion.div
            initial={{
                opacity:0,
            }}

            animate={{
                opacity:1,
            }}

            exit={{
                opacity:0,
            }}

            className="
                fixed
                inset-0
                z-[300]
                flex
                flex-col
                overflow-hidden
                bg-black
                touch-none
            "
        >


            {/* Header */}
            <div
                className="
                flex
                items-center
                justify-between
                px-5
                py-4
                text-white
                "
            >

                {/* Close */}
                <button
                    onClick={onClose}
                    className="
                        rounded-full
                        bg-white/10
                        p-2
                        backdrop-blur
                        active:scale-95
                    "
                >
                    <X size={24}/>
                </button>


                {/* Counter */}
                <div
                    className="
                        text-sm
                        text-white/80
                    "
                >
                    {selectedIndex + 1}
                    {" / "}
                    {photos.length}
                </div>

                {/* Download */}
                <button
                    onClick={handleDownload}
                    className="
                        rounded-full
                        bg-white/10
                        p-2
                        backdrop-blur
                        active:scale-95
                    "
                >
                    <Download size={24}/>

                </button>

            </div>


            {/* Photo */}
            
            <TransformWrapper
                key={selectedIndex}
                initialScale={1}
                minScale={1}
                maxScale={4}

                onTransformed={(ref) => {
                    setZoomed(
                        ref.state.scale > 1
                    );
                }}

                doubleClick={{
                    mode:"toggle",
                    step:2,
                }}

                pinch={{
                    step:5,
                }}

                panning={{
                    disabled:false,
                }}

                wheel={{
                    disabled:true,
                }}

                centerOnInit
            >
                <div
                    {...swipeHandlers}
                    className="
                    flex
                    flex-1
                    items-center
                    justify-center
                    overflow-hidden
                    px-4
                    "
                >
                    <TransformComponent
                        wrapperClass="
                            flex
                            h-full
                            w-full
                            items-center
                            justify-center
                        "

                        contentClass="
                            touch-none
                        "
                    >

                        <motion.img
                            src={
                                photos[selectedIndex]
                            }

                            initial={{
                                opacity:0,
                                scale:0.96,
                            }}

                            animate={{
                                opacity:1,
                                scale:1,

                            }}

                            transition={{
                                duration:0.25,
                            }}

                            className="
                                max-h-[80vh]
                                max-w-full
                                rounded-xl
                                object-contain
                            "
                        />

                    </TransformComponent>
                </div>

            </TransformWrapper>
            

            {/* Bottom */}
            <div
                className="
                flex
                items-center
                justify-between
                px-6
                pb-8
                "
            >
                {photos.length > 1 ? (
                    <>

                        {/* Previous */}
                        <button
                            onClick={onPrevious}
                            className="
                                rounded-full
                                bg-white/10
                                p-3
                                text-white
                                backdrop-blur
                                active:scale-95
                            "
                        >
                            <ChevronLeft size={28}/>
                        </button>

                        <div
                            className="
                                text-sm
                                text-white/50
                            "
                        >
                            swipe
                        </div>


                        {/* Next */}
                        <button
                            onClick={onNext}
                            className="
                                rounded-full
                                bg-white/10
                                p-3
                                text-white
                                backdrop-blur
                                active:scale-95
                            "
                        >
                            <ChevronRight size={28}/>
                        </button>

                    </>

                ) : (
                    <div />
                )}

            </div>


        </motion.div>

    );

}