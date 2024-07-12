import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationBlogsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationBlogs: React.FC<PaginationBlogsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {currentPage > 1 && (
            <PaginationPrevious href="#" onClick={handlePrevious} />
          )}
        </PaginationItem>
        <PaginationItem>
          {currentPage > 1 && (
            <PaginationLink href="#" onClick={handlePrevious}>
              {currentPage - 1}
            </PaginationLink>
          )}
          <PaginationLink href="#">{currentPage}</PaginationLink>
          {currentPage < totalPages && (
            <PaginationLink href="#" onClick={handleNext}>
              {currentPage + 1}
            </PaginationLink>
          )}
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          {currentPage < totalPages && (
            <PaginationNext href="#" onClick={handleNext} />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
