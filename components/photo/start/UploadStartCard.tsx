"use client";

import NameInput from "./NameInput";
import ImagePickerButton from "../picker/ImagePickerButton";

// 装飾系のインポート
import { User, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


type Props = {
    guestName: string;
    guestNameDraft: string;
    onGuestNameChange: (value: string) => void;
    onSaveGuestName: (name: string) => void;
    onClearGuestName: () => void;
    onSelectPhoto: () => void;
};

export default function CameraStartCard({
    guestName,
    guestNameDraft,
    onGuestNameChange,
    onSaveGuestName,
    onClearGuestName,
    onSelectPhoto,
}: Props) {
    const handleStart = () => {
        const name = guestNameDraft.trim();

        if (!name) return;

        onSaveGuestName(name);
        onSelectPhoto();
    };

    const handleClear = () => {
        onClearGuestName();
        onGuestNameChange("");
    };

    return (
        <Card className="shadow-md border-0">
            <CardHeader className="pb-8">
                <CardTitle className="text-2xl">
                📷 写真をアップロードする
                </CardTitle>

                <CardDescription className="text-base">
                思い出の一枚を撮影してアップロードしましょう
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="relative">
                {guestName.trim() ? (
                    <div className="space-y-6 text-center">
                        <div className="flex items-center justify-between rounded-xl border p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-muted p-2">
                                    <User className="h-5 w-5" />
                                </div>

                                <div className="text-left">
                                    <p className="text-xs text-muted-foreground">
                                    投稿者
                                    </p>

                                    <p className="font-semibold">
                                    {guestName} さん
                                    </p>
                                </div>
                            </div>

                            <AlertDialog>
                                <AlertDialogTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    <Pencil className="h-4 w-4" />
                                    変更
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            名前を変更しますか？
                                        </AlertDialogTitle>

                                        <AlertDialogDescription>
                                            保存されている名前を削除し、
                                            新しい名前を入力できるようになります。
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            キャンセル
                                        </AlertDialogCancel>

                                        <AlertDialogAction onClick={handleClear}>
                                            変更する
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>

                        <ImagePickerButton
                            onClick={onSelectPhoto}
                        />
                    </div>
                ) : (
                    <NameInput
                        guestName={guestNameDraft}
                        onGuestNameChange={onGuestNameChange}
                        onStart={handleStart}
                    />
                )}
                </div>
            </CardContent>
        </Card>
    );
}