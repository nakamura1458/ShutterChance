"use client";

import { useSwipeable } from "react-swipeable";

type Props = {
  length: number;
  index: number;
  setIndex: (value: number) => void;
};

export function useSwipeNavigation({
  length,
  index,
  setIndex,
}: Props) {

  const next = () => {
    setIndex(
      index === length - 1
        ? 0
        : index + 1
    );
  };

  const prev = () => {
    setIndex(
      index === 0
        ? length - 1
        : index - 1
    );
  };

  return useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 50,
  });
}