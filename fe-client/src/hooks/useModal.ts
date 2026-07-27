import { useState, useCallback } from "react";

export interface UseModalReturn<T = any> {
  isOpen: boolean;
  data: T | null;
  openModal: (data?: T) => void;
  closeModal: () => void;
  toggleModal: () => void;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

/**
 * Custom hook quản lý trạng thái hiển thị Modal
 */
export function useModal<T = any>(initialOpen = false): UseModalReturn<T> {
  const [isOpen, setIsOpen] = useState<boolean>(initialOpen);
  const [data, setData] = useState<T | null>(null);

  const openModal = useCallback((modalData?: T) => {
    if (modalData !== undefined) {
      setData(modalData);
    }
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    data,
    openModal,
    closeModal,
    toggleModal,
    setData,
  };
}

export default useModal;
