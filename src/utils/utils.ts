import { BadRequestException } from '@nestjs/common';
import dayjs from 'dayjs';
import { PaginationDto } from 'src/shared/pagination/pagination.dto';

/**
 * Check if the query has pagination params
 * @param query - The query
 * @returns The pagination params
 */
export const checkPaginationParams = (query: PaginationDto) => {
  const paginationKeys = ['page', 'limit', 'sortField', 'sortOrder', 'search', 'filters'];
  const hasPaginationParam = paginationKeys.some((key) => query?.[key] !== undefined);
  return hasPaginationParam;
};

/**
 * English month map
 */
export const englishMonthMap: { [key: string]: number } = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

/**
 * Make date range for a month
 * @param month - The month
 * @param year - The year
 * @returns The start and end date
 */
export function makeDateRange(month: string, year: string): { startDate: string; endDate: string } {
  // Convert English month name to month number
  const monthNumber = englishMonthMap[month.toLowerCase()];
  if (!monthNumber) {
    throw new BadRequestException('Invalid month name');
  }

  // Create date range for the specified month and year using dayjs
  const startDate = dayjs()
    .year(parseInt(year))
    .month(monthNumber - 1)
    .startOf('month')
    .format('YYYY-MM-DD');
  const endDate = dayjs()
    .year(parseInt(year))
    .month(monthNumber - 1)
    .endOf('month')
    .format('YYYY-MM-DD');

  return { startDate, endDate };
}

export const getPreviousMonthName = (month: string) => {
  const prev = (englishMonthMap[month.toLowerCase()] - 1 + 12) % 12;
  return Object.keys(englishMonthMap).find((key) => englishMonthMap[key] === prev);
};
