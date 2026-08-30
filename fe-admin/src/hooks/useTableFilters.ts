"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | null
  | undefined;

export function useTableFilters<TFilters extends Record<string, any>>(
  defaultFilters: TFilters
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: TFilters = useMemo(() => {
    if (!defaultFilters) return {} as TFilters;
    const result = { ...defaultFilters };

    Object.keys(defaultFilters).forEach((key) => {
      const defaultValue = defaultFilters[key];
      const paramValue = searchParams.get(key);

      if (paramValue !== null && paramValue !== undefined && paramValue !== "") {
        if (Array.isArray(defaultValue)) {
          (result as any)[key] = paramValue
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
        } else if (typeof defaultValue === "number") {
          const num = Number(paramValue);
          if (!isNaN(num)) {
            (result as any)[key] = num;
          }
        } else if (typeof defaultValue === "boolean") {
          (result as any)[key] = paramValue === "true";
        } else {
          (result as any)[key] = paramValue;
        }
      }
    });

    return result;
  }, [searchParams, defaultFilters]);

  const updateUrlParams = useCallback(
    (newParams: Record<string, FilterValue>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        const defaultValue = defaultFilters[key];

        if (
          value === null ||
          value === undefined ||
          value === "" ||
          (Array.isArray(value) && value.length === 0) ||
          (defaultValue !== undefined &&
            String(value) === String(defaultValue))
        ) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, String(value));
        }
      });

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newUrl, { scroll: false });
    },
    [defaultFilters, pathname, router, searchParams]
  );

  const setFilter = useCallback(
    <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
      const updatePayload: Record<string, FilterValue> = {
        [key as string]: value,
      };

      if (key !== "page" && "page" in defaultFilters) {
        updatePayload.page = 1;
      }

      updateUrlParams(updatePayload);
    },
    [defaultFilters, updateUrlParams]
  );

  const setFilters = useCallback(
    (partialFilters: Partial<TFilters>) => {
      const updatePayload: Record<string, FilterValue> = { ...partialFilters };

      if (!("page" in partialFilters) && "page" in defaultFilters) {
        updatePayload.page = 1;
      }

      updateUrlParams(updatePayload);
    },
    [defaultFilters, updateUrlParams]
  );

  const resetFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
  };
}
