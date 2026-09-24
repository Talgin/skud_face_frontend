import { endOfDay, startOfDay } from "date-fns";

export interface HistoryFilters {
  startDate?: Date;
  endDate?: Date;
  minSimilarity?: number;
  gender?: string;
}

export interface HistoryQueryParams {
  page: number;
  page_size: number;
  start_date?: string;
  end_date?: string;
  min_similarity?: number;
  gender?: string;
}

// Query for GET /history. Dates are whole local days (the calendar returns local midnight, which as an end
// bound excluded the chosen day). A similarity of 0 is not sent: events without a similarity (nobody enrolled
// yet, old events) would be hidden by "≥ 0%".
export function buildHistoryQuery(
  filters: HistoryFilters,
  page: number,
  pageSize: number,
): HistoryQueryParams {
  const query: HistoryQueryParams = { page, page_size: pageSize };
  if (filters.startDate) query.start_date = startOfDay(filters.startDate).toISOString();
  if (filters.endDate) query.end_date = endOfDay(filters.endDate).toISOString();
  if (filters.minSimilarity && filters.minSimilarity > 0) {
    query.min_similarity = Math.min(1, filters.minSimilarity);
  }
  if (filters.gender) query.gender = filters.gender;
  return query;
}
