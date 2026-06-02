/**
 * Build page numbers matching AssetDashboard-style pagination:
 * first page, optional window, ellipsis, last page.
 */
export function getPaginationRange(currentPage, totalPages) {
  if (totalPages <= 0) return [];

  const pages = [];

  pages.push(1);

  if (currentPage > 4) {
    pages.push("ellipsis-start");
  }

  for (let i = 0; i < 3; i += 1) {
    const page = currentPage - 1 + i;
    if (page > 1 && page < totalPages && !pages.includes(page)) {
      pages.push(page);
    }
  }

  if (currentPage < totalPages - 3) {
    pages.push("ellipsis-end");
  }

  if (totalPages > 1 && !pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
}

export function getDisplayRange(currentPage, pageSize, totalCount) {
  if (totalCount === 0) {
    return { start: 0, end: 0 };
  }
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);
  return { start, end };
}
