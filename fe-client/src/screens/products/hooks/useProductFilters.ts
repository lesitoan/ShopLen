"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo, useState, useEffect } from "react";
import debounce from "debounce";
import type { ProductListParams } from "@/types/product.type";
import { useGetCategoriesQuery, Category } from "@/services/api/categoryApi";

export interface ProductFiltersState {
  search: string;
  category: string;
  color: string;
  sort: string;
  minPrice: number;
  maxPrice: number;
  page: number;
}

export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: apiCategories = [] } = useGetCategoriesQuery();

  const searchParam = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";
  const colorsParam = searchParams.get("colors") || searchParams.get("color") || "";
  const rawSortParam = searchParams.get("sort") || "BEST_SELLING";
  const minPriceParam = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0;
  const maxPriceParam = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 300000;
  const pageParam = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

  const [prevSearchParam, setPrevSearchParam] = useState(searchParam);
  const [prevCategoryParam, setPrevCategoryParam] = useState(categoryParam);
  const [prevColorsParam, setPrevColorsParam] = useState(colorsParam);

  const [localSearch, setLocalSearch] = useState(searchParam);
  const [localCategory, setLocalCategory] = useState(categoryParam);
  const [localColors, setLocalColors] = useState(colorsParam);

  const updateFilters = useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          (key === "page" && Number(value) === 1) ||
          (key === "minPrice" && Number(value) === 0) ||
          (key === "maxPrice" && Number(value) === 300000) ||
          (key === "sort" && value === "BEST_SELLING")
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

  // Khởi tạo hàm debouncedUpdateFilters từ thư viện debounce với thời gian chờ 1.5s (1500ms)
  const debouncedUpdateFilters = useMemo(
    () =>
      debounce(
        (searchVal: string, categoryVal: string, colorsVal: string) => {
          updateFilters({
            search: searchVal || null,
            category: categoryVal || null,
            colors: colorsVal || null,
            page: 1,
          });
        },
        1500
      ),
    [updateFilters]
  );

  // Đồng bộ local state ngay lập tức trong quá trình render khi URL params thay đổi (từ SearchModal hoặc điều hướng)
  if (
    searchParam !== prevSearchParam ||
    categoryParam !== prevCategoryParam ||
    colorsParam !== prevColorsParam
  ) {
    setPrevSearchParam(searchParam);
    setPrevCategoryParam(categoryParam);
    setPrevColorsParam(colorsParam);
    setLocalSearch(searchParam);
    setLocalCategory(categoryParam);
    setLocalColors(colorsParam);
    debouncedUpdateFilters.clear?.();
  }

  const sort = useMemo(() => {
    if (rawSortParam === "best_seller") return "BEST_SELLING";
    if (rawSortParam === "newest") return "NEWEST";
    if (rawSortParam === "price_asc") return "PRICE_ASC";
    if (rawSortParam === "price_desc") return "PRICE_DESC";
    return rawSortParam;
  }, [rawSortParam]);

  const filters: ProductFiltersState = useMemo(
    () => ({
      search: localSearch,
      category: localCategory,
      color: localColors,
      sort,
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      page: pageParam,
    }),
    [localSearch, localCategory, localColors, sort, minPriceParam, maxPriceParam, pageParam]
  );

  const categoryIds = useMemo(() => {
    if (!categoryParam) return undefined;
    const selectedSlugs = categoryParam.split(",").filter(Boolean);
    const mappedIds = selectedSlugs
      .map((slug) => apiCategories.find((cat: Category) => cat.slug === slug)?.id)
      .filter((id): id is string => Boolean(id));

    return mappedIds.length > 0 ? mappedIds : undefined;
  }, [categoryParam, apiCategories]);

  const colorCodes = useMemo(() => {
    if (!colorsParam) return undefined;
    const list = colorsParam.split(",").filter(Boolean);
    return list.length > 0 ? list : undefined;
  }, [colorsParam]);

  // Xây dựng query params chuẩn format cho RTK Query useGetProductsQuery từ URL params
  const queryParams: ProductListParams = useMemo(
    () => ({
      page: pageParam,
      limit: 12,
      ...(sort === "discount"
        ? { highlightType: "TODAY_DEAL" }
        : { sort: sort as any }),
      ...(categoryIds && categoryIds.length > 0
        ? { categoryIds }
        : categoryParam
        ? { categorySlug: categoryParam }
        : {}),
      ...(colorCodes && colorCodes.length > 0 ? { colorCodes } : {}),
      ...(searchParam ? { search: searchParam } : {}),
      ...(minPriceParam > 0 ? { minPrice: minPriceParam } : {}),
      ...(maxPriceParam < 300000 ? { maxPrice: maxPriceParam } : {}),
    }),
    [pageParam, sort, categoryIds, categoryParam, colorCodes, searchParam, minPriceParam, maxPriceParam]
  );

  // Clean-up debounced timer khi component unmount
  useEffect(() => {
    return () => {
      debouncedUpdateFilters.clear?.();
    };
  }, [debouncedUpdateFilters]);

  // Thực thi debounced update khi các local filter thay đổi từ input trực tiếp
  useEffect(() => {
    if (
      localSearch === searchParam &&
      localCategory === categoryParam &&
      localColors === colorsParam
    ) {
      return;
    }

    debouncedUpdateFilters(localSearch, localCategory, localColors);
  }, [localSearch, localCategory, localColors, searchParam, categoryParam, colorsParam, debouncedUpdateFilters]);

  const setSearch = useCallback((newSearch: string) => {
    setLocalSearch(newSearch);
  }, []);

  const toggleCategory = useCallback(
    (slug: string) => {
      const currentCats = localCategory ? localCategory.split(",") : [];
      const newCats = currentCats.includes(slug)
        ? currentCats.filter((c) => c !== slug)
        : [...currentCats, slug];

      setLocalCategory(newCats.join(","));
    },
    [localCategory]
  );

  const toggleColor = useCallback(
    (colorCode: string) => {
      const currentColors = localColors ? localColors.split(",") : [];
      const newColors = currentColors.includes(colorCode)
        ? currentColors.filter((c) => c !== colorCode)
        : [...currentColors, colorCode];

      setLocalColors(newColors.join(","));
    },
    [localColors]
  );

  const setSort = useCallback(
    (newSort: string) => {
      updateFilters({ sort: newSort, page: 1 });
    },
    [updateFilters]
  );

  const setPriceRange = useCallback(
    (min: number, max: number) => {
      updateFilters({ minPrice: min, maxPrice: max, page: 1 });
    },
    [updateFilters]
  );

  const setPage = useCallback(
    (newPage: number) => {
      updateFilters({ page: newPage });
    },
    [updateFilters]
  );

  const clearAllFilters = useCallback(() => {
    debouncedUpdateFilters.clear?.();
    setLocalSearch("");
    setLocalCategory("");
    setLocalColors("");
    router.push(pathname, { scroll: false });
  }, [router, pathname, debouncedUpdateFilters]);

  const hasActiveFilters = useMemo(
    () =>
      Boolean(searchParam) ||
      Boolean(categoryParam) ||
      Boolean(colorsParam) ||
      minPriceParam > 0 ||
      maxPriceParam < 300000,
    [searchParam, categoryParam, colorsParam, minPriceParam, maxPriceParam]
  );

  return {
    filters,
    queryParams,
    hasActiveFilters,
    actions: {
      updateFilters,
      setSearch,
      toggleCategory,
      toggleColor,
      setSort,
      setPriceRange,
      setPage,
      clearAllFilters,
    },
  };
}
