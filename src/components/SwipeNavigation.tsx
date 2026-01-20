'use client';

import { useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import { useTheme } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';

interface SwipeNavigationProps {
  children: ReactNode[];
  initialIndex?: number;
  onPageChange?: (index: number) => void;
}

export default function SwipeNavigation({ 
  children, 
  initialIndex = 1,
  onPageChange 
}: SwipeNavigationProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(initialIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const pageCount = children.length;
  const threshold = 50; // Minimum offset for page switch

  const goToPage = useCallback((index: number) => {
    const newIndex = Math.max(0, Math.min(pageCount - 1, index));
    setCurrentPage(newIndex);
    setDragOffset(0);
    onPageChange?.(newIndex);
  }, [pageCount, onPageChange]);

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    // Resistance at edges
    if ((currentPage === 0 && diff > 0) || (currentPage === pageCount - 1 && diff < 0)) {
      setDragOffset(diff * 0.2);
    } else {
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0 && currentPage > 0) {
        goToPage(currentPage - 1);
      } else if (dragOffset < 0 && currentPage < pageCount - 1) {
        goToPage(currentPage + 1);
      } else {
        setDragOffset(0);
      }
    } else {
      setDragOffset(0);
    }
  };

  // Mouse events (desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    
    if ((currentPage === 0 && diff > 0) || (currentPage === pageCount - 1 && diff < 0)) {
      setDragOffset(diff * 0.2);
    } else {
      setDragOffset(diff);
    }
  };

  const handleMouseUp = () => {
    handleTouchEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleTouchEnd();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPage(currentPage - 1);
      if (e.key === 'ArrowRight') goToPage(currentPage + 1);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, goToPage]);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: colors.bgMain }}>
      {/* Page indicators with labels */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index)}
            className="flex flex-col items-center gap-1 transition-all duration-300"
          >
            <div
              className="h-2 rounded-full"
              style={{
                width: index === currentPage ? '24px' : '8px',
                backgroundColor: index === currentPage ? colors.primary : colors.border,
                boxShadow: index === currentPage ? `0 0 8px ${colors.primary}` : 'none',
              }}
            />
            <span 
              className="text-[10px] font-mono tracking-wider uppercase"
              style={{ 
                color: index === currentPage ? colors.primary : colors.textMuted,
                textShadow: index === currentPage ? `0 0 5px ${colors.primary}` : 'none',
              }}
            >
              {index === 0 ? t('nav.history') : index === 1 ? t('nav.game') : t('nav.online')}
            </span>
          </button>
        ))}
      </div>

      {/* Navigation arrows (desktop) */}
      {currentPage > 0 && (
        <button
          onClick={() => goToPage(currentPage - 1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all hidden md:flex"
          style={{ 
            backgroundColor: `${colors.bgPanel}cc`,
            border: `1px solid ${colors.border}`,
            color: colors.primary,
            textShadow: `0 0 5px ${colors.primary}`,
          }}
        >
          ◀
        </button>
      )}
      {currentPage < pageCount - 1 && (
        <button
          onClick={() => goToPage(currentPage + 1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all hidden md:flex"
          style={{ 
            backgroundColor: `${colors.bgPanel}cc`,
            border: `1px solid ${colors.border}`,
            color: colors.primary,
            textShadow: `0 0 5px ${colors.primary}`,
          }}
        >
          ▶
        </button>
      )}

      {/* Pages container */}
      <div
        ref={containerRef}
        className="flex h-full w-full pt-14 pb-4"
        style={{
          transform: `translateX(calc(${-currentPage * 100}% + ${dragOffset}px))`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="h-full w-full flex-shrink-0 overflow-y-auto"
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
