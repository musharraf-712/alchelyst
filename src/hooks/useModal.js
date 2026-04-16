import { useState, useCallback } from "react";

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);

  const open = useCallback((item) => {
    setData(item);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setData(null), 200);
  }, []);

  return { isOpen, data, open, close };
}