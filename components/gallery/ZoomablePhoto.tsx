"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Props = {
  src: string;
  alt: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
};

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2;
const SWIPE_THRESHOLD = 50;

export default function ZoomablePhoto({
  src,
  alt,
  onSwipeLeft,
  onSwipeRight,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const scaleRef = useRef(1);
  const positionRef = useRef({
    x: 0,
    y: 0,
  });

  const lastTapRef = useRef(0);

  const pinchStartDistanceRef =
    useRef<number | null>(null);

  const pinchStartScaleRef =
    useRef(1);

  const dragStartRef = useRef<{
    x: number;
    y: number;
  } | null>(null);

  const dragStartPositionRef = useRef({
    x: 0,
    y: 0,
  });

  const touchStartRef = useRef<{
    x: number;
    y: number;
  } | null>(null);

  // ========================================
  // Reset
  // ========================================

  const resetZoom = useCallback(() => {
    scaleRef.current = 1;
    positionRef.current = {
      x: 0,
      y: 0,
    };

    setScale(1);
    setPosition({
      x: 0,
      y: 0,
    });
  }, []);

  useEffect(() => {
    resetZoom();
  }, [src, resetZoom]);

  // ========================================
  // Utility
  // ========================================

  const getDistance = (
    touch1: React.Touch,
    touch2: React.Touch
  ) => {
    const dx =
      touch2.clientX - touch1.clientX;

    const dy =
      touch2.clientY - touch1.clientY;

    return Math.sqrt(
      dx * dx + dy * dy
    );
  };

  // ========================================
  // Double Tap
  // ========================================

  const handleDoubleTap = (
    clientX: number,
    clientY: number
  ) => {
    const now = Date.now();

    if (now - lastTapRef.current < 300) {
      if (scaleRef.current > 1) {
        resetZoom();
      } else {
        scaleRef.current =
          DOUBLE_TAP_SCALE;

        setScale(DOUBLE_TAP_SCALE);

        // タップした位置を中心に拡大
        const rect =
          containerRef.current?.getBoundingClientRect();

        if (rect) {
          const x =
            (rect.width / 2 - clientX + rect.left) *
            (DOUBLE_TAP_SCALE - 1);

          const y =
            (rect.height / 2 - clientY + rect.top) *
            (DOUBLE_TAP_SCALE - 1);

          const nextPosition = {
            x,
            y,
          };

          positionRef.current =
            nextPosition;

          setPosition(nextPosition);
        }
      }

      lastTapRef.current = 0;
      return;
    }

    lastTapRef.current = now;
  };

  // ========================================
  // Touch Start
  // ========================================

  const handleTouchStart = (
    e: React.TouchEvent
  ) => {
    // ピンチ
    if (e.touches.length === 2) {
      pinchStartDistanceRef.current =
        getDistance(
          e.touches[0],
          e.touches[1]
        );

      pinchStartScaleRef.current =
        scaleRef.current;

      return;
    }

    if (e.touches.length !== 1) {
      return;
    }

    const touch = e.touches[0];

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

    // 拡大中はドラッグ
    if (scaleRef.current > 1) {
      dragStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };

      dragStartPositionRef.current = {
        ...positionRef.current,
      };
    }
  };

  // ========================================
  // Touch Move
  // ========================================

  const handleTouchMove = (
    e: React.TouchEvent
  ) => {
    // ピンチ
    if (
      e.touches.length === 2 &&
      pinchStartDistanceRef.current !== null
    ) {
      e.preventDefault();

      const currentDistance =
        getDistance(
          e.touches[0],
          e.touches[1]
        );

      const ratio =
        currentDistance /
        pinchStartDistanceRef.current;

      let nextScale =
        pinchStartScaleRef.current *
        ratio;

      nextScale = Math.max(
        MIN_SCALE,
        Math.min(MAX_SCALE, nextScale)
      );

      scaleRef.current = nextScale;
      setScale(nextScale);

      return;
    }

    // 拡大中のドラッグ
    if (
      e.touches.length === 1 &&
      scaleRef.current > 1 &&
      dragStartRef.current
    ) {
      e.preventDefault();

      const touch = e.touches[0];

      const dx =
        touch.clientX -
        dragStartRef.current.x;

      const dy =
        touch.clientY -
        dragStartRef.current.y;

      const nextPosition = {
        x:
          dragStartPositionRef.current.x +
          dx,
        y:
          dragStartPositionRef.current.y +
          dy,
      };

      positionRef.current =
        nextPosition;

      setPosition(nextPosition);
    }
  };

  // ========================================
  // Touch End
  // ========================================

  const handleTouchEnd = (
    e: React.TouchEvent
  ) => {
    if (
      touchStartRef.current === null
    ) {
      return;
    }

    // ピンチ終了
    if (e.touches.length > 0) {
      return;
    }

    const touch =
      e.changedTouches[0];

    const start =
      touchStartRef.current;

    const diffX =
      touch.clientX - start.x;

    const diffY =
      touch.clientY - start.y;

    touchStartRef.current = null;
    dragStartRef.current = null;
    pinchStartDistanceRef.current =
      null;

    // 拡大中は写真切り替えを無効化
    if (scaleRef.current > 1) {
      return;
    }

    // 縦方向の移動が大きければ無視
    if (
      Math.abs(diffY) >
      Math.abs(diffX)
    ) {
      return;
    }

    // 小さい移動は無視
    if (
      Math.abs(diffX) <
      SWIPE_THRESHOLD
    ) {
      handleDoubleTap(
        touch.clientX,
        touch.clientY
      );

      return;
    }

    if (diffX < 0) {
      onSwipeLeft?.();
    } else {
      onSwipeRight?.();
    }
  };

  // ========================================
  // Mouse Wheel
  // ========================================

  const handleWheel = (
    e: React.WheelEvent
  ) => {
    e.preventDefault();

    const delta = e.deltaY > 0 ? -0.25 : 0.25;

    const nextScale = Math.max(
      MIN_SCALE,
      Math.min(
        MAX_SCALE,
        scaleRef.current + delta
      )
    );

    scaleRef.current = nextScale;
    setScale(nextScale);

    if (nextScale === 1) {
      positionRef.current = {
        x: 0,
        y: 0,
      };

      setPosition({
        x: 0,
        y: 0,
      });
    }
  };

  // ========================================
  // Mouse Drag
  // ========================================

  const handleMouseDown = (
    e: React.MouseEvent
  ) => {
    if (scaleRef.current <= 1) {
      return;
    }

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    dragStartPositionRef.current = {
      ...positionRef.current,
    };
  };

  const handleMouseMove = (
    e: React.MouseEvent
  ) => {
    if (
      scaleRef.current <= 1 ||
      !dragStartRef.current
    ) {
      return;
    }

    const dx =
      e.clientX -
      dragStartRef.current.x;

    const dy =
      e.clientY -
      dragStartRef.current.y;

    const nextPosition = {
      x:
        dragStartPositionRef.current.x +
        dx,
      y:
        dragStartPositionRef.current.y +
        dy,
    };

    positionRef.current =
      nextPosition;

    setPosition(nextPosition);
  };

  const handleMouseUp = () => {
    dragStartRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="
        relative
        h-full
        w-full
        overflow-hidden
        touch-none
        select-none
      "
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        cursor:
          scale > 1
            ? dragStartRef.current
              ? "grabbing"
              : "grab"
            : "default",
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="
          absolute
          left-1/2
          top-1/2
          max-h-full
          max-w-full
          select-none
          object-contain
        "
        style={{
          transform: `
            translate(
              calc(-50% + ${position.x}px),
              calc(-50% + ${position.y}px)
            )
            scale(${scale})
          `,
          transformOrigin: "center center",
          transition:
            dragStartRef.current
              ? "none"
              : "transform 0.15s ease-out",
          willChange: "transform",
        }}
      />

      {/* Zoom indicator */}

      {scale > 1 && (
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-4
            z-10
            -translate-x-1/2
            rounded-full
            bg-black/60
            px-3
            py-1.5
            text-xs
            font-medium
            text-white
            backdrop-blur
          "
        >
          {Math.round(scale * 100)}%
        </div>
      )}
    </div>
  );
}