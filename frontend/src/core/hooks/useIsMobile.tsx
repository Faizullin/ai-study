import { useEffect, useState } from "react";

export default function useIsMobile(options?: { maxWidth?: number }) {
  options = { maxWidth: 768, ...options };
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < options.maxWidth);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}
