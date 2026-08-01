"use client";

import { forwardRef } from "react";

type Props = {
    onSelect: (file: File) => void;
};

const ImagePicker = forwardRef<HTMLInputElement, Props>(
    ({ onSelect }, ref) => {
        return (
            <input
                ref={ref}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (!file) return;

                    onSelect(file);

                    // 同じ画像を連続で選べるようにする
                    e.target.value = "";
                }}
            />
        );
    }
);

ImagePicker.displayName = "ImagePicker";

export default ImagePicker;