"use client";

import { useEffect, useState } from "react";

export function usePreviewUrls(files: File[]) {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    const createdUrls = files.map((file) =>
      URL.createObjectURL(file)
    );

    setUrls(createdUrls);


    return () => {
      createdUrls.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };

  }, [files]);


  return urls;
}