import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQueryStates } from "nuqs";
import { searchParamsParsers } from "@/hooks/useSearchListings";

const buildPageList = (current: number, total: number): (number | "ellipsis")[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (current > 3) pages.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("ellipsis");

  pages.push(total);

  return pages;
};

interface PaginationControlsProps {
  totalPages: number;
  total: number;
}

export const PaginationControls = ({ totalPages, total }: PaginationControlsProps) => {
  const [params, setParams] = useQueryStates(searchParamsParsers);
  const currentPage = params.page ?? 1;

  if (totalPages <= 1 || total === 0) return null;

  const goTo = (page: number) => {
    setParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = buildPageList(currentPage, totalPages);

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => goTo(currentPage - 1)}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => goTo(page)}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => goTo(currentPage + 1)}
            aria-disabled={currentPage === totalPages}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
