"use client";

import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { useGesture } from "@use-gesture/react";
import { useState } from "react";

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

    const [scale,setScale] = useState(1);

    const resetZoom = () => {
        setScale(1);
    };

    const handleNext = () => {
        resetZoom();
        onNext();
    };


    const handlePrevious = () => {
        resetZoom();
        onPrevious();
    };

    const bind = useGesture({

        onPinch:({
            offset:[distance = 200],
        })=>{

            const nextScale =
            Math.min(
                Math.max(distance / 200,1),
                3
            );

            setScale(nextScale);

        },

    });

    return (
        <motion.div
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
            }}
            className="
                fixed
                inset-0
                z-[300]
                flex
                flex-col
                bg-black
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
                        transition
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


            </div>



            {/* Photo Area */}
            <div
                className="
                flex
                flex-1
                items-center
                justify-center
                overflow-hidden
                px-4
                "
            >

                <motion.img
                    {...bind()}
                    key={selectedIndex}
                    src={photos[selectedIndex]}

                    drag

                    dragConstraints={{
                        left:-300,
                        right:300,
                        top:-300,
                        bottom:300,
                    }}

                    dragElastic={0.8}

                    onDragEnd={(event, info)=>{

                        // 拡大中は写真移動のみ
                        if(scale > 1){
                            return;
                        }

                        if(info.offset.x < -80){
                            handleNext();
                        }

                        if(info.offset.x > 80){
                            handlePrevious();
                        }

                    }}

                    onDoubleClick={()=>{
                        if(scale > 1){
                            resetZoom();
                        }else{
                            setScale(2);
                        }
                    }}

                    initial={{
                        opacity:0,
                        x:40,
                        scale:0.96,
                    }}

                    animate={{
                        opacity:1,
                        scale,
                    }}

                    transition={{
                        type:"spring",
                        stiffness:250,
                        damping:25,
                    }}

                    className="
                        max-h-full
                        max-w-full
                        rounded-xl
                        object-contain
                    "
                />

            </div>



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
                        onClick={handlePrevious}
                        className="
                            rounded-full
                            bg-white/10
                            p-3
                            text-white
                            backdrop-blur
                            transition
                            active:scale-95
                        "
                    >
                        <ChevronLeft size={28}/>
                    </button>


                    {/* Spacer */}
                    <div
                    className="
                        text-sm
                        text-white/60
                    "
                    >
                        swipe
                    </div>


                    {/* Next */}
                    <button
                    onClick={handleNext}
                    className="
                        rounded-full
                        bg-white/10
                        p-3
                        text-white
                        backdrop-blur
                        transition
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