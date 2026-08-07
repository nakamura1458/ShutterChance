"use client";

import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";

import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { useEffect } from "react";


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


  // 背景スクロール停止
  useEffect(() => {

    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";


    return () => {

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";

      window.scrollTo(0, scrollY);

    };

  }, []);



  // 保存
  const handleDownload = async () => {

    try {

      const response =
        await fetch(
          photos[selectedIndex]
        );

      const blob =
        await response.blob();


      const url =
        URL.createObjectURL(blob);


      const link =
        document.createElement("a");


      link.href = url;

      link.download =
        `photo-${selectedIndex + 1}.jpg`;


      link.click();


      URL.revokeObjectURL(url);


    } catch(error){

      console.error(
        "download failed",
        error
      );

    }

  };



  // swipe
  const swipeHandlers = useSwipeable({

    onSwipedLeft(){

      onNext();

    },

    onSwipedRight(){

      onPrevious();

    },


    preventScrollOnSwipe:true,

    trackMouse:true,

    delta:50,

  });



  return (

    <motion.div

      initial={{
        opacity:0,
        y:"100%",
      }}

      animate={{
        opacity:1,
        y:0,
      }}

      exit={{
        opacity:0,
      }}

      transition={{
        type:"spring",
        damping:28,
        stiffness:250,
      }}


      className="
        fixed
        inset-0
        z-[9999]
        flex
        flex-col
        overflow-hidden
        bg-black
      "


      style={{
        height:"100dvh",
      }}

    >


      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          px-5
          pt-5
          text-white
        "
      >


        <button

          onClick={onClose}

          className="
            rounded-full
            bg-white/10
            p-3
            backdrop-blur-xl
            active:scale-90
          "

        >

          <X size={24}/>

        </button>



        <div
          className="
            rounded-full
            bg-white/10
            px-4
            py-2
            text-sm
            text-white/80
            backdrop-blur-xl
          "
        >

          {selectedIndex + 1}
          {" / "}
          {photos.length}

        </div>



        <button

          onClick={handleDownload}

          className="
            rounded-full
            bg-white/10
            p-3
            backdrop-blur-xl
            active:scale-90
          "

        >

          <Download size={22}/>

        </button>


      </div>





      {/* Photo */}

      <div

        {...swipeHandlers}

        className="
          flex
          flex-1
          items-center
          justify-center
          overflow-hidden
          px-4
          touch-none
        "

      >


        <motion.img

          key={selectedIndex}

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
            max-h-full
            max-w-full
            rounded-2xl
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
          pb-10
        "
      >

        {
          photos.length > 1
          ? <>


            <button

              onClick={onPrevious}

              className="
                rounded-full
                bg-white/10
                p-4
                text-white
                backdrop-blur-xl
                active:scale-90
              "

            >

              <ChevronLeft size={30}/>

            </button>



            <div
              className="
                text-sm
                text-white/50
              "
            >
              swipe
            </div>



            <button

              onClick={onNext}

              className="
                rounded-full
                bg-white/10
                p-4
                text-white
                backdrop-blur-xl
                active:scale-90
              "

            >

              <ChevronRight size={30}/>

            </button>


          </>
          :
          <div/>

        }


      </div>


    </motion.div>

  );

}