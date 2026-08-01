"use client";

import { forwardRef } from "react";

type Props = {
  onSelect: (files: File[]) => void;
};

const ImagePicker = forwardRef<HTMLInputElement, Props>(
  ({ onSelect }, ref) => {
    return (
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          const files = Array.from(
            e.target.files ?? []
          );

          if (files.length === 0) return;

          onSelect(files);

          // 同じ画像を連続で選べるようにする
          e.target.value = "";
        }}
      />
    );
  }
);

ImagePicker.displayName = "ImagePicker";

export default ImagePicker;