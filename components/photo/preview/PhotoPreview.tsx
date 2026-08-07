"use client";

import { useBodyLock } from "@/hooks/useBodyLock";
import { usePhotoPreview } from "@/hooks/usePhotoPreview";

import PreviewViewer from "./PreviewViewer";
import PreviewThumbnail from "./PreviewThumbnail";
import PreviewFooter from "./PreviewFooter";

type Props = {
  photos: File[];
  uploading: boolean;

  actions: {
    onClear: () => void;
    onAddPhoto: () => void;
    onUpload: () => void;
    onRemovePhoto: (index: number) => void;
  };
};

export default function PhotoPreview({
  photos,
  uploading,
  actions,
}: Props) {
  useBodyLock();

  const {
    previewUrls,
    selectedIndex,
    setSelectedIndex,
    showPrevious,
    showNext,
    swipeHandlers,
  } = usePhotoPreview({
    photos,
  });

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
          pb-3
          pt-4
          backdrop-blur-xl
        "
      >
        <h1 className="text-xl font-semibold">
          写真を確認
        </h1>

        <p className="mt-1 text-sm text-white/50">
          {photos.length}枚選択中
        </p>
      </header>


      {/* Main Photo */}
      <div
        className="
          flex-1
          min-h-0
          overflow-hidden
        "
      >
        <PreviewViewer
          url={previewUrls[selectedIndex]}
          swipeHandlers={swipeHandlers}
          onPrevious={showPrevious}
          onNext={showNext}
          onRemove={() =>
            actions.onRemovePhoto(selectedIndex)
          }
          hasMultiplePhotos={previewUrls.length > 1}
        />
      </div>


      {/* Thumbnail */}
      <div className="shrink-0">
        <PreviewThumbnail
          urls={previewUrls}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          onRemove={actions.onRemovePhoto}
        />
      </div>


      {/* Footer */}
      <div className="shrink-0">
        <PreviewFooter
          uploading={uploading}
          actions={actions}
        />
      </div>
    </div>
  );
}