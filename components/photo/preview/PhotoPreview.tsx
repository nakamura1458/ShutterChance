"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";

type Props = {
  photos: File[];
  uploading: boolean;

  actions: {
    onClear: () => void;
    onAddPhoto: () => void;
    onUpload: () => void;
  };
};


export default function PhotoPreview({
  photos,
  uploading,
  actions,
}: Props) {


  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const showPrevious = () => {

    setSelectedIndex((prev) =>
      prev === 0
        ? previewUrls.length - 1
        : prev - 1
    );

  };

  const showNext = () => {

    setSelectedIndex((prev) =>
      prev === previewUrls.length - 1
        ? 0
        : prev + 1
    );

  };



  const swipeHandlers = useSwipeable({

    onSwipedLeft: () => {
      showNext();
    },

    onSwipedRight: () => {
      showPrevious();
    },


    preventScrollOnSwipe: true,

    trackMouse: true,

    delta: 50,

  });


  /*
   * body scroll lock
   */
  useEffect(() => {

    const scrollY = window.scrollY;

    const html = document.documentElement;
    const body = document.body;


    html.style.overflow = "hidden";
    body.style.overflow = "hidden";


    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";


    return () => {

      html.style.overflow = "";
      body.style.overflow = "";

      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";


      window.scrollTo(0, scrollY);

    };


  }, []);




  /*
   * create preview urls
   */
  useEffect(() => {


    const urls = photos.map((file) =>
      URL.createObjectURL(file)
    );


    setPreviewUrls(urls);

    // 初期表示
    setSelectedIndex(0);



    return () => {

      urls.forEach((url) =>
        URL.revokeObjectURL(url)
      );

    };


  }, [photos]);





  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        h-[100dvh]
        flex-col
        overflow-hidden
        bg-black
        text-white
      "
    >


      {/* Header */}

      <header
        className="
          shrink-0
          bg-black/80
          px-5
          pt-4
          pb-3
          backdrop-blur-xl
        "
      >

        <h1
          className="
            text-xl
            font-semibold
          "
        >
          写真を確認
        </h1>


        <p
          className="
            mt-1
            text-sm
            text-white/50
          "
        >
          {photos.length}枚選択中
        </p>


      </header>





      {/* Main Photo */}

      <main
        {...swipeHandlers}

        className="
          flex
          min-h-0
          flex-1
          items-center
          justify-center
          overflow-hidden
          px-5
          touch-pan-y
        "
      >


        <AnimatePresence mode="wait">

          {
          previewUrls[selectedIndex] && (

          <motion.img

            key={selectedIndex}

            src={
              previewUrls[selectedIndex]
            }


            initial={{
              opacity:0,
              x:80,
            }}

            animate={{
              opacity:1,
              x:0,
            }}

            exit={{
              opacity:0,
              x:-80,
            }}


            transition={{
              duration:0.2,
            }}


            className="
              max-h-full
              max-w-full
              rounded-2xl
              object-contain
            "

          />

          )
          }

        </AnimatePresence>


      </main>






      {/* Thumbnail */}

      <div
        className="
          shrink-0
          overflow-x-auto
          px-4
          pb-3
          overscroll-contain
        "
      >

        <div
          className="
            flex
            gap-2
          "
        >

          {
            previewUrls.map((url,index)=>(

              <button

                key={url}

                type="button"

                onClick={() =>
                  setSelectedIndex(index)
                }


                className={`
                  relative
                  h-16
                  w-16
                  shrink-0
                  overflow-hidden
                  rounded-xl
                  transition

                  ${
                    selectedIndex === index
                    ? "ring-2 ring-primary"
                    : "opacity-60"
                  }

                `}

              >

                <img

                  src={url}

                  alt={`写真 ${index + 1}`}

                  className="
                    h-full
                    w-full
                    object-cover
                  "

                />


              </button>

            ))
          }


        </div>


      </div>







      {/* Footer */}

      <footer
        className="
          shrink-0
          space-y-3
          border-t
          border-white/10
          bg-black/90
          px-4
          pt-3
          pb-3
          backdrop-blur-xl
        "
      >


        <Button

          type="button"

          variant="ghost"

          disabled={uploading}

          onClick={actions.onAddPhoto}

          className="
            h-12
            w-full
            rounded-xl
            text-white
            hover:bg-white/10
          "

        >

          ＋ 写真を追加

        </Button>





        <motion.button

          type="button"

          disabled={uploading}

          onClick={actions.onUpload}


          whileTap={{
            scale:0.96,
          }}


          className="
            flex
            h-14
            w-full
            items-center
            justify-center
            rounded-2xl
            bg-primary
            font-semibold
            text-primary-foreground
            shadow-lg
            disabled:opacity-60
          "

        >

          {
            uploading
            ?
            (
              <>
                <Loader2
                  className="
                    mr-2
                    h-5
                    w-5
                    animate-spin
                  "
                />

                写真を届けています...
              </>
            )
            :
            (
              <>
                ✨ 写真を共有する
              </>
            )
          }


        </motion.button>






        <button

          type="button"

          disabled={uploading}

          onClick={actions.onClear}


          className="
            w-full
            text-center
            text-sm
            text-white/50
          "

        >

          選択を解除

        </button>


      </footer>


    </div>

  );

}