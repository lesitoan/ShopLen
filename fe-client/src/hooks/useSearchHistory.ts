"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KEYWORD_SUGGESTIONS, INITIAL_RECENT_SEARCHES } from "@/components/layout/constants";

const RECENT_SEARCHES_STORAGE_KEY = "recent_searches";
const MAX_RECENT_SEARCHES = 4;

export function useSearchHistory() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(
    INITIAL_RECENT_SEARCHES.slice(0, MAX_RECENT_SEARCHES)
  );

  // Load saved recent searches from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, MAX_RECENT_SEARCHES));
        }
      }
    } catch (error) {
      console.error("Failed to load recent searches from localStorage", error);
    }
  }, []);

  const saveRecentSearches = useCallback((searches: string[]) => {
    const trimmed = searches.slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(trimmed);
    try {
      localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.error("Failed to save recent searches to localStorage", error);
    }
  }, []);

  const addSearchQuery = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (item) => item.toLowerCase() !== trimmedQuery.toLowerCase()
      );
      const updated = [trimmedQuery, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      try {
        localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Failed to save recent searches to localStorage", error);
      }
      return updated;
    });
  }, []);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent, onSuccess?: () => void) => {
      e.preventDefault();
      const query = searchValue.trim();
      if (query) {
        addSearchQuery(query);
        onSuccess?.();
        router.push(`/san-pham?search=${encodeURIComponent(query)}`);
      }
    },
    [searchValue, addSearchQuery, router]
  );

  const handleRecentSearchClick = useCallback(
    (searchVal: string, onSuccess?: () => void) => {
      const query = searchVal.trim();
      if (query) {
        setSearchValue(query);
        addSearchQuery(query);
        onSuccess?.();
        router.push(`/san-pham?search=${encodeURIComponent(query)}`);
      }
    },
    [addSearchQuery, router]
  );

  const removeRecentSearch = useCallback(
    (index: number) => {
      setRecentSearches((prev) => {
        const updated = prev.filter((_, idx) => idx !== index);
        try {
          localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
          console.error("Failed to save recent searches to localStorage", error);
        }
        return updated;
      });
    },
    []
  );

  const clearRecentSearches = useCallback(() => {
    saveRecentSearches([]);
  }, [saveRecentSearches]);

  const resetSearchInput = useCallback(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  return {
    searchValue,
    setSearchValue,
    recentSearches,
    keywordSuggestions: KEYWORD_SUGGESTIONS,
    handleSearchSubmit,
    handleRecentSearchClick,
    removeRecentSearch,
    clearRecentSearches,
    resetSearchInput,
  };
}
