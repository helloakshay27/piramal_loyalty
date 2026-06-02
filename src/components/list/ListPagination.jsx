import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPaginationRange } from "../../utils/paginationUtils";
import "./list-toolbar.css";

const ListPagination = ({
  currentPage,
  totalPages,
  totalCount,
  pageSize = 10,
  onPageChange,
  itemLabel = "entries",
  summaryFormat = "page-total",
}) => {
  const safePage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1));
  const pages = getPaginationRange(safePage, totalPages);

  if (totalCount === 0) {
    return (
      <div className="lockated-list-pagination">
        <p className="lockated-list-pagination__summary">
          No {itemLabel} to display
        </p>
      </div>
    );
  }

  const summaryText =
    summaryFormat === "range"
      ? `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(
          safePage * pageSize,
          totalCount
        )} of ${totalCount} ${itemLabel}`
      : `Showing page ${safePage} of ${totalPages} (${totalCount} total ${itemLabel})`;

  return (
    <div className="lockated-list-pagination">
      <nav className="lockated-list-pagination__nav" aria-label="Pagination">
        <ul className="lockated-list-pagination__controls">
          <li>
            <button
              type="button"
              className="lockated-list-pagination__arrow"
              disabled={safePage <= 1}
              aria-label="Previous page"
              onClick={() => onPageChange(safePage - 1)}
            >
              <ChevronLeft size={20} strokeWidth={1.75} />
            </button>
          </li>

          {pages.map((page, index) => {
            if (typeof page === "string") {
              return (
                <li key={`${page}-${index}`}>
                  <span className="lockated-list-pagination__ellipsis" aria-hidden>
                    …
                  </span>
                </li>
              );
            }

            const isActive = page === safePage;

            return (
              <li key={page}>
                <button
                  type="button"
                  className={`lockated-list-pagination__page${
                    isActive ? " is-active" : ""
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </li>
            );
          })}

          <li>
            <button
              type="button"
              className="lockated-list-pagination__arrow lockated-list-pagination__arrow--next"
              disabled={safePage >= totalPages}
              aria-label="Next page"
              onClick={() => onPageChange(safePage + 1)}
            >
              <ChevronRight size={20} strokeWidth={1.75} />
            </button>
          </li>
        </ul>
      </nav>

      <p className="lockated-list-pagination__summary">{summaryText}</p>
    </div>
  );
};

export default ListPagination;
