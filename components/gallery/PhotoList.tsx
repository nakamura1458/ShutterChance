"use client";

import { useState } from "react";
import {
  CheckSquare,
  Square,
} from "lucide-react";

import PhotoCard from "./PhotoCard";
import FullscreenPhotoViewer from "./FullscreenPhotoViewer";

import PhotoFilterButton from "./filter/PhotoFilterButton";
import PhotoFilterSheet from "./filter/PhotoFilterSheet";
import PhotoSelectionBar from "./selection/PhotoSelectionBar";

import { usePhotoFilter } from "@/hooks/usePhotoFilter";
import { usePhotoSelection } from "@/hooks/usePhotoSelection";

import type { PhotoListItem } from "@/types/photo";

type Props = {
  photos: PhotoListItem[];
  showFilter?: boolean;
  eventToken: string;
};

export default function PhotoList({
  photos,
  showFilter = false,
  eventToken
}: Props) {
  // ========================================
  // Viewer
  // ========================================

  const [currentIndex, setCurrentIndex] =
    useState<number | null>(null);

  // ========================================
  // Filter
  // ========================================

  const {
    selectedGuestNames,
    pendingGuestNames,
    filteredPhotos,
    guestNames,
    guestPhotoCounts,
    filterLabel,
    isFilterOpen,
    pendingFilteredPhotoCount,
    openFilter,
    closeFilter,
    toggleGuest,
    selectAllGuests,
    applyFilter,
  } = usePhotoFilter(photos);

  // ========================================
  // Selection
  // ========================================

  const {
    selectionMode,
    selectedIds,
    isSaving,
    toggleSelection,
    enterSelectionMode,
    cancelSelection,
    toggleSelectAll,
    saveSelectedPhotos,
  } = usePhotoSelection(photos);

  // ========================================
  // Render
  // ========================================

  return (
    <section
      id="photo-list"
      className={`
        space-y-5
        ${selectionMode ? "pb-24" : ""}
      `}
    >
      {/* ======================================
          Header
      ====================================== */}

      <div className="flex items-center justify-between px-1">
        {selectionMode ? (
          <SelectionHeader
            selectedCount={selectedIds.length}
            onCancel={cancelSelection}
            onToggleAll={() =>
              toggleSelectAll(filteredPhotos)
            }
          />
        ) : (
          <NormalHeader
            photoCount={filteredPhotos.length}
            showFilter={showFilter}
            filterLabel={filterLabel}
            hasFilter={
              selectedGuestNames.length > 0
            }
            onOpenFilter={openFilter}
            onEnterSelection={
              enterSelectionMode
            }
          />
        )}
      </div>

      {/* ======================================
          Photo Grid
      ====================================== */}

      {filteredPhotos.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          className="
            grid
            grid-cols-3
            gap-1
            sm:gap-2
          "
        >
          {filteredPhotos.map(
            (photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                eventToken={eventToken}
                selectionMode={selectionMode}
                selected={selectedIds.includes(
                  photo.id
                )}
                onClick={() => {
                  if (selectionMode) {
                    toggleSelection(photo.id);
                    return;
                  }

                  setCurrentIndex(index);
                }}
              />
            )
          )}
        </div>
      )}

      {/* ======================================
          Fullscreen Viewer
      ====================================== */}

      {currentIndex !== null && (
        <FullscreenPhotoViewer
          photos={filteredPhotos}
          currentIndex={currentIndex}
          onPrevious={() =>
            setCurrentIndex((prev) =>
              prev !== null && prev > 0
                ? prev - 1
                : prev
            )
          }
          onNext={() =>
            setCurrentIndex((prev) =>
              prev !== null &&
              prev <
                filteredPhotos.length - 1
                ? prev + 1
                : prev
            )
          }
          onClose={() =>
            setCurrentIndex(null)
          }
        />
      )}

      {/* ======================================
          Filter Sheet
      ====================================== */}

      {showFilter && (
        <PhotoFilterSheet
          open={isFilterOpen}
          guestNames={guestNames}
          guestPhotoCounts={
            guestPhotoCounts
          }
          pendingGuestNames={
            pendingGuestNames
          }
          pendingPhotoCount={
            pendingFilteredPhotoCount
          }
          totalPhotoCount={photos.length}
          onClose={closeFilter}
          onToggleGuest={toggleGuest}
          onSelectAll={selectAllGuests}
          onApply={applyFilter}
        />
      )}

      {/* ======================================
          Selection Bar
      ====================================== */}

      {selectionMode && (
        <PhotoSelectionBar
          selectedCount={
            selectedIds.length
          }
          isSaving={isSaving}
          onSave={saveSelectedPhotos}
        />
      )}
    </section>
  );
}

// ==========================================
// Normal Header
// ==========================================

type NormalHeaderProps = {
  photoCount: number;
  showFilter: boolean;
  filterLabel: string;
  hasFilter: boolean;
  onOpenFilter: () => void;
  onEnterSelection: () => void;
};

function NormalHeader({
  photoCount,
  showFilter,
  filterLabel,
  hasFilter,
  onOpenFilter,
  onEnterSelection,
}: NormalHeaderProps) {
  return (
    <>
      <h2
        className="
          text-xl
          font-bold
          tracking-tight
        "
      >
        📸 Gallery
      </h2>

      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        {showFilter && (
          <PhotoFilterButton
            label={filterLabel}
            active={hasFilter}
            onClick={onOpenFilter}
          />
        )}

        <p
          className="
            whitespace-nowrap
            text-sm
            text-muted-foreground
          "
        >
          {photoCount} Photos
        </p>

        <button
          type="button"
          onClick={onEnterSelection}
          className="
            flex
            items-center
            gap-1
            whitespace-nowrap
            text-sm
            font-medium
            text-blue-600
            transition
            active:opacity-60
          "
        >
          <CheckSquare size={16} />
          選択
        </button>
      </div>
    </>
  );
}

// ==========================================
// Selection Header
// ==========================================

type SelectionHeaderProps = {
  selectedCount: number;
  onCancel: () => void;
  onToggleAll: () => void;
};

function SelectionHeader({
  selectedCount,
  onCancel,
  onToggleAll,
}: SelectionHeaderProps) {
  return (
    <>
      <button
        type="button"
        onClick={onCancel}
        className="
          text-sm
          font-medium
          text-muted-foreground
          transition
          active:opacity-60
        "
      >
        キャンセル
      </button>

      <p
        className="
          text-sm
          font-semibold
        "
      >
        {selectedCount}枚選択中
      </p>

      <button
        type="button"
        onClick={onToggleAll}
        className="
          flex
          items-center
          gap-1
          text-sm
          font-medium
          text-blue-600
          transition
          active:opacity-60
        "
      >
        {selectedCount > 0 ? (
          <>
            <Square size={16} />
            すべて解除
          </>
        ) : (
          <>
            <CheckSquare size={16} />
            すべて選択
          </>
        )}
      </button>
    </>
  );
}

// ==========================================
// Empty State
// ==========================================

function EmptyState() {
  return (
    <p
      className="
        py-12
        text-center
        text-sm
        text-muted-foreground
      "
    >
      写真がありません
    </p>
  );
}