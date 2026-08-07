"use client";

import {
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { useEffect, useState } from "react";


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


  /**
   * iPhone Safari用
   * 背景スクロール完全停止
   */
  useEffect(() => {

    const scrollY = window.scrollY;

    const body = document.body;

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";


    return () => {

      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";

      window.scrollTo(0, scrollY);

    };


  }, []);



  /**
   * swipe
   */
  const swipeHandlers = useSwipeable({

    onSwipedLeft: () => {
      onNext();
    },

    onSwipedRight: () => {
      onPrevious();
    },


    preventScrollOnSwipe: true,

    trackMouse: true,

    delta: 50,

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
        z-[9999]
        flex
        flex-col
        bg-black
        overflow-hidden
      "

      style={{
        touchAction:"none",
      }}

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
          shrink-0
        "
      >

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



        <div
          className="
            text-sm
            text-white/70
          "
        >
          {selectedIndex + 1}
          {" / "}
          {photos.length}
        </div>


        <div
          className="
            w-10
          "
        />

      </div>




      {/* Photo Area */}

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

        style={{
          touchAction:"none",
        }}

      >

        <AnimatePresence mode="wait">

          <motion.img

            key={photos[selectedIndex]}

            src={photos[selectedIndex]}

            initial={{
              opacity:0,
              x:40,
            }}

            animate={{
              opacity:1,
              x:0,
            }}

            exit={{
              opacity:0,
              x:-40,
            }}

            transition={{
              duration:0.2,
            }}

            className="
              max-h-full
              max-w-full
              rounded-xl
              object-contain
              select-none
            "

            draggable={false}

          />

        </AnimatePresence>


      </div>





      {/* Bottom */}

      <div

        className="
          flex
          items-center
          justify-between
          px-6
          pb-8
          shrink-0
        "

      >


        {
          photos.length > 1
          ?
          <>


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
                text-xs
                text-white/40
              "
            >
              swipe
            </div>




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
          :
          <div />

        }


      </div>


    </motion.div>

  );

}