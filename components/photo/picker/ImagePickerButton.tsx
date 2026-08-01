"use client";

import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

type Props = {
    onClick: () => void;
};

export default function ImagePickerButton({
    onClick,
}: Props) {
  return (
    <Button
        variant="outline"
        className="w-full"
        onClick={onClick}
    >
    <Image className="mr-2 h-5 w-5" />
        アルバムから選ぶ
    </Button>
  );
}