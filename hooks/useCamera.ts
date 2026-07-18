"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { CapturedPhoto } from "@/types/camera";

type Props = {
  enabled: boolean;
};

export function useCamera({
  enabled,
}: Props) {

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  /**
   * カメラ向き
   * environment = 外カメラ
   * user = インカメラ
   */
  const [facingMode, setFacingMode] =
    useState<
      "user" | "environment"
    >("environment");

  /**
   * カメラ停止
   */
  const stopCamera = useCallback(() => {

    streamRef.current
      ?.getTracks()
      .forEach((track) => {
        track.stop();
      });

    streamRef.current = null;

    setIsCameraReady(false);

  }, []);

  /**
   * カメラ起動
   */
  const startCamera = useCallback(
    async () => {

      try {

        stopCamera();


        const stream =
          await navigator.mediaDevices.getUserMedia({

            video: {
              facingMode: {
                ideal: facingMode,
              },
            },

            audio: false,

          });



        streamRef.current = stream;



        if(videoRef.current){

          videoRef.current.srcObject =
            stream;


          await videoRef.current.play();

        }


        setIsCameraReady(true);



      } catch(err){

        console.error(
          "startCamera error:",
          err
        );


        if(err instanceof Error){

          alert(
            `${err.name}: ${err.message}`
          );

        }else{

          alert(
            "カメラを起動できませんでした"
          );

        }

      }

    },
    [
      stopCamera,
      facingMode,
    ]
  );





  /**
   * カメラ切替
   */
  const switchCamera =
    useCallback(async () => {


      const nextMode =
        facingMode === "environment"
          ? "user"
          : "environment";



      // 現在のカメラ停止
      stopCamera();



      // 新しいカメラ起動
      try {


        const stream =
          await navigator.mediaDevices.getUserMedia({

            video:{
              facingMode:{
                ideal: nextMode,
              },
            },

            audio:false,

          });



        streamRef.current =
          stream;



        if(videoRef.current){

          videoRef.current.srcObject =
            stream;


          await videoRef.current.play();

        }


        setFacingMode(nextMode);

        setIsCameraReady(true);



      } catch(err){

        console.error(
          "switchCamera error:",
          err
        );

      }


    },[
      facingMode,
      stopCamera,
    ]);







  /**
   * 初回カメラ起動
   */
  useEffect(() => {


    if(!enabled){
      return;
    }


    startCamera();



    return()=>{


      stopCamera();



      if(capturedPhoto){

        URL.revokeObjectURL(
          capturedPhoto.previewUrl
        );

      }

    };


  },[
    enabled,
    startCamera,
    stopCamera,
  ]);








  /**
   * 撮影
   */
  const takePhoto =
    useCallback(() => {


      const video =
        videoRef.current;


      const canvas =
        canvasRef.current;



      if(!video || !canvas){
        return;
      }



      canvas.width =
        video.videoWidth;


      canvas.height =
        video.videoHeight;



      const ctx =
        canvas.getContext("2d");



      if(!ctx){
        return;
      }



      ctx.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );



      canvas.toBlob(
        (blob)=>{


          if(!blob){
            return;
          }



          if(capturedPhoto){

            URL.revokeObjectURL(
              capturedPhoto.previewUrl
            );

          }



          setCapturedPhoto({

            blob,

            previewUrl:
              URL.createObjectURL(blob),

          });


        },

        "image/jpeg",

        0.8

      );



    },[
      capturedPhoto,
    ]);







  /**
   * 撮り直し
   */
  const retakePhoto =
    useCallback(async()=>{


      if(capturedPhoto){

        URL.revokeObjectURL(
          capturedPhoto.previewUrl
        );

      }



      setCapturedPhoto(null);



      await startCamera();



    },[
      capturedPhoto,
      startCamera,
    ]);







  return {

    state:{
      capturedPhoto,
      isCameraReady,
      facingMode,
    },


    refs:{
      videoRef,
      canvasRef,
    },


    actions:{
      startCamera,
      stopCamera,
      takePhoto,
      retakePhoto,
      switchCamera,
    },

  };

}