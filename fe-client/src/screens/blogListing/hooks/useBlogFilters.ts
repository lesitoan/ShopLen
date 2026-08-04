"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";

export function useBlogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTag = searchParams.get("tag") || "tat-ca";
  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const updateFilters = useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          (key === "tag" && value === "tat-ca") ||
          (key === "page" && Number(value) === 1)
        ) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const handleTagChange = useCallback(
    (tagKey: string) => {
      updateFilters({ tag: tagKey, page: 1 });
    },
    [updateFilters]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ page });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateFilters]
  );

  return {
    activeTag,
    currentPage,
    handleTagChange,
    handlePageChange,
  };
}
