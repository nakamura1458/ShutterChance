"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  guestName: string;
  onGuestNameChange: (value: string) => void;
  onStart: () => void;
};

export default function NameInput({
  guestName,
  onGuestNameChange,
  onStart,
}: Props) {

  const isValid = guestName.trim().length > 0;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6">

      <Input
        placeholder="例：山田 太郎"
        value={guestName}
        onChange={(e) => {
          onGuestNameChange(e.target.value);
        }}
        className="h-12"
      />

      <Button
        onClick={() => {
          onStart();
        }}
        disabled={!isValid}
        className="h-12 w-full text-base"
      >
        撮影を始める
      </Button>

    </div>
  );
}