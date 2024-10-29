import { useEffect, useRef, useState } from "react";

const useIntersectionObserver = () => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Ngừng quan sát sau khi phần tử đã hiện
        }
      },
      { threshold: 0.1 } // Kích hoạt khi 10% phần tử đi vào khung nhìn
    );

    if (elementRef.current) observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, []);

  return { isVisible, elementRef };
};

export default useIntersectionObserver;
