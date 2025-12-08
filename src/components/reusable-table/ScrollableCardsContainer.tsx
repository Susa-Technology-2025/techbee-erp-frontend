import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Box, TablePagination } from "@mui/material";
import { Table } from "@tanstack/react-table";

interface ScrollableCardsContainerProps {
  data: any[];
  CardComponent: React.ComponentType<any>;
  table: Table<any>;
  totalRowCount: number;
  start: number;
  size: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void;
  onRowsPerPageChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export const ScrollableCardsContainer: React.FC<
  ScrollableCardsContainerProps
> = ({
  data,
  CardComponent,
  table,
  totalRowCount,
  start,
  size,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [cardWidth, setCardWidth] = useState(250);
  const [cardHeight, setCardHeight] = useState(250);
  const [columnCount, setColumnCount] = useState(1);
  const gap = 16;
  const rowHeight = cardHeight > 0 ? cardHeight + gap : 250;

  useLayoutEffect(() => {
    const updateDimensions = () => {
      if (cardRef.current) {
        setCardWidth(cardRef.current.offsetWidth);
        setCardHeight(cardRef.current.offsetHeight);
      }
      if (scrollableRef.current && cardWidth > 0) {
        const containerWidth = scrollableRef.current.clientWidth;
        const newColumnCount = Math.max(
          1,
          Math.floor(containerWidth / (cardWidth + gap))
        );
        setColumnCount(newColumnCount);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [cardWidth, gap]);

  const rowCount = Math.ceil(data.length / columnCount);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollableRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  });

  const virtualRows = virtualizer.getVirtualItems();

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        scrollbarWidth: "none",
      }}
    >
      <Box
        ref={scrollableRef}
        sx={{
          flexGrow: 1,
          overflow: "auto",
          width: "95%",
          mx: "auto",
          position: "relative",
          scrollbarWidth: "none",
          p: 2,
        }}
      >
        <Box
          sx={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualRows.map((virtualRow) => (
            <Box
              key={virtualRow.key}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                  gap: `${gap}px`,
                  justifyContent: "center",
                }}
              >
                {Array.from({ length: columnCount }).map((_, colIndex) => {
                  const index = virtualRow.index * columnCount + colIndex;
                  if (index >= data.length) return null;

                  const row = table.getRowModel().rows[index];
                  const firstCard = virtualRow.index === 0 && colIndex === 0;

                  return (
                    <CardComponent
                      key={colIndex}
                      row={row}
                      ref={firstCard ? cardRef : null}
                    />
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <TablePagination
        component="div"
        count={totalRowCount}
        page={start / size}
        rowsPerPage={size}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        sx={{ flexShrink: 0 }}
      />
    </Box>
  );
};
