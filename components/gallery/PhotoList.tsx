"use client";

import { useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";
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
import type { PhotoSortOrder } from "@/hooks/usePhotoSort";
import type { PhotoListItem } from "@/types/photo";
import PhotoSortButton from "./sort/PhotoSortButton";
import PhotoSortSheet from "./sort/PhotoSortSheet";

type Props = {
  photos: PhotoListItem[];
  showFilter?: boolean;
  eventToken: string;
  guestPhotoCounts?: Record<string, number>;
  totalPhotoCount: number;
};

export default function PhotoList({
  photos,
  showFilter = false,
  eventToken,
  guestPhotoCounts,
  totalPhotoCount,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedGuestsFromUrl = searchParams.getAll("guest");

  const urlFilterLabel =
    selectedGuestsFromUrl.length === 0
      ? "すべて"
      : selectedGuestsFromUrl.length === 1
        ? selectedGuestsFromUrl[0]
        : `${selectedGuestsFromUrl.length}人選択中`;
  
  // Viewer
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  // Filter
  const {
    selectedGuestNames,
    pendingGuestNames,
    filteredPhotos,
    guestNames,
    filterLabel,
    isFilterOpen,
    pendingFilteredPhotoCount,
    openFilter,
    closeFilter,
    toggleGuest,
    selectAllGuests,
    applyFilter,
  } = usePhotoFilter(
    photos,
    guestPhotoCounts ?? {},
    totalPhotoCount
  );

  const allGuestNames = Object.keys(
    guestPhotoCounts ?? {}
  ).sort((a, b) =>
    a.localeCompare(b, "ja")
  );

  // Sort
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortFromUrl =
    (searchParams.get("sort") as PhotoSortOrder) ??
    "newest";

  const sortedPhotos = photos;

  const sortOrder = sortFromUrl;

  const sortLabel = {
    newest: "新しい順",
    oldest: "古い順",
    likes: "いいね数順",
  }[sortOrder];

  // ソート（ページング反映用）
  const handleChangeSort = (
    newSort: PhotoSortOrder
  ) => {
    const params = new URLSearchParams();

    // ソート変更時は1ページ目
    params.set("page", "1");

    // newestはデフォルトなのでURLに不要
    if (newSort !== "newest") {
      params.set("sort", newSort);
    }

    // 現在のフィルターを維持
    selectedGuestNames.forEach((guestName) => {
      params.append("guest", guestName);
    });

    // Sheetを閉じる
    setIsSortOpen(false);

    // サーバー側で並び替えた結果を取得
    router.replace(
      `/e/${eventToken}/photos?${params.toString()}`,
      { scroll: false }
    );
  };

  // フィルター（＠エージング反映用）
  const handleApplyFilter = () => {
    const params = new URLSearchParams();

    // ページを1ページ目に戻す
    params.set("page", "1");

    // 現在の並び順を維持
    if (sortOrder !== "newest") {
      params.set("sort", sortOrder);
    }

    // 選択したゲストをURLに追加
    pendingGuestNames.forEach((guestName) => {
      params.append("guest", guestName);
    });

    // フィルター画面を閉じる
    closeFilter();

    // URLを更新
    router.push(
      `/e/${eventToken}/photos?${params.toString()}`
    );
  };

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
            photoCount={totalPhotoCount}
            showFilter={showFilter}
            filterLabel={urlFilterLabel}
            hasFilter={
              selectedGuestsFromUrl.length > 0
            }
            onOpenFilter={() =>
              openFilter(selectedGuestsFromUrl)
            }
            onEnterSelection={
              enterSelectionMode
            }
            sortOrder={sortOrder}
            sortLabel={sortLabel}
            onOpenSort={() => setIsSortOpen(true)}
          />
        )}
      </div>

      {/* ======================================
          Photo Grid
      ====================================== */}
      {sortedPhotos.length === 0 ? (
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
          {sortedPhotos.map(
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
          photos={sortedPhotos}
          currentIndex={currentIndex}
          eventToken={eventToken}
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
                sortedPhotos.length - 1
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
          guestNames={allGuestNames}
          guestPhotoCounts={
            guestPhotoCounts ?? {}
          }
          pendingGuestNames={
            pendingGuestNames
          }
          pendingPhotoCount={
            pendingFilteredPhotoCount
          }
          totalPhotoCount={totalPhotoCount}
          onClose={closeFilter}
          onToggleGuest={toggleGuest}
          onSelectAll={selectAllGuests}
          onApply={handleApplyFilter}
        />
      )}

      <PhotoSortSheet
        open={isSortOpen}
        currentSort={sortOrder}
        onClose={() => setIsSortOpen(false)}
        onChange={handleChangeSort}
      />

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
  sortOrder: PhotoSortOrder;
  sortLabel: string;
  onOpenSort: () => void;
};

function NormalHeader({
  photoCount,
  showFilter,
  filterLabel,
  hasFilter,
  onOpenFilter,
  onEnterSelection,
  sortOrder,
  sortLabel,
  onOpenSort,
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

        {showFilter && (
          <PhotoSortButton
            label={sortLabel}
            active={sortOrder !== "newest"}
            onClick={onOpenSort}
          />
        )}

        {hasFilter && (
          <p
            className="
              whitespace-nowrap
              text-sm
              text-muted-foreground
            "
          >
            {photoCount} 枚
          </p>
        )}

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