import { useEffect, useRef, useState } from "react";

export default function useStickySidebar() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    position: "sticky",
    top: "88px",
  });

  useEffect(() => {
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Header height (sticky top: 72px + 16px spacing = 88px)
    const headerHeight = 88; 
    // Spacing at the bottom of the viewport when scrolling down
    const bottomSpacing = 24;

    const handleScroll = () => {
      const sidebar = sidebarRef.current;
      if (!sidebar) return;

      const parent = sidebar.parentElement;
      if (!parent) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const direction = scrollTop > lastScrollTop ? "down" : "up";
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

      const windowHeight = window.innerHeight;
      const sidebarRect = sidebar.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const sidebarHeight = sidebarRect.height;

      // Case 1: Sidebar is shorter than the viewport, pin to the top header
      if (sidebarHeight <= windowHeight - headerHeight - bottomSpacing) {
        setStyle({
          position: "sticky",
          top: `${headerHeight}px`,
          bottom: "auto",
        });
        return;
      }

      // Case 2: Sidebar is taller than the viewport
      if (direction === "down") {
        if (sidebarRect.bottom <= windowHeight - bottomSpacing) {
          // Bottom of sidebar has hit the bottom limit, stick there
          setStyle({
            position: "sticky",
            top: "auto",
            bottom: `${bottomSpacing}px`,
          });
        } else {
          // In-between scrolling, let it scroll naturally absolute
          if (sidebar.style.position === "sticky") {
            const absoluteTop = sidebarRect.top + scrollTop - parentRect.top;
            setStyle({
              position: "absolute",
              top: `${absoluteTop}px`,
              bottom: "auto",
            });
          }
        }
      } else {
        // Scrolling up
        if (sidebarRect.top >= headerHeight) {
          // Top of sidebar has hit the top limit, stick there
          setStyle({
            position: "sticky",
            top: `${headerHeight}px`,
            bottom: "auto",
          });
        } else {
          // In-between scrolling, let it scroll naturally absolute
          if (sidebar.style.position === "sticky") {
            const absoluteTop = sidebarRect.top + scrollTop - parentRect.top;
            setStyle({
              position: "absolute",
              top: `${absoluteTop}px`,
              bottom: "auto",
            });
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    // Initial run
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return { sidebarRef, style };
}
