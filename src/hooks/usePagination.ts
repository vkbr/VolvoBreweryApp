import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Range = [number, number];

type UsePaginationOptions<T> = {
  initialPageIndex?: number;
  initialEntriesPerPage?: number;
  totalCount: number | number;
  fetchData: (page: number, countPerPage: number) => Promise<T[] | undefined>;
};

type UsePaginationResult<T> = {
  currentPage: number;
  entriesPerPage: number;
  isLoading: boolean;
  slice: T[];
  requestPageChange: (pageNumber: number) => void;
  requestEntriesPerPageChange: (pageNumber: number) => void;
  resetData: () => void;
};

const getRange = (
  pageIndex: number,
  countPerPage: number,
): [number, number] => {
  const start = pageIndex * countPerPage;
  return [start, start + countPerPage];
};

export function usePagination<T>({
  initialPageIndex,
  initialEntriesPerPage,
  totalCount,
  fetchData,
}: UsePaginationOptions<T>): UsePaginationResult<T> {
  const fetchingSlice = useRef<Record<string, boolean>>({});
  const mounted = useRef<boolean>(true);
  const [entries, setEnties] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPageIndex ?? 0);
  const [entriesPerPage, setEntriesPerPage] = useState(
    initialEntriesPerPage ?? 5,
  );

  const [[sliceStart, sliceEnd], setSliceBounds] = useState<Range>(() =>
    getRange(currentPage, entriesPerPage),
  );
  const [requestedSlice, setRequestedSlice] = useState<Range>([
    sliceStart,
    sliceEnd,
  ]);
  const isEntriesSliceReady = useMemo(() => {
    const [start, end] = [
      requestedSlice[0],
      Math.min(requestedSlice[1], totalCount),
    ];
    const availableEntries = entries.slice(start, end).filter(Boolean);
    return availableEntries.length === end - start;
  }, [entries, requestedSlice, totalCount]);

  /**
   * pageIndex: 0-based page index
   */
  const requestPageChange = useCallback((pageIndex: number) => {
    setCurrentPage(pageIndex);
  }, []);

  const requestEntriesPerPageChange = useCallback((entryCount: number) => {
    setEntriesPerPage(entryCount);
  }, []);

  useEffect(() => {
    if (isEntriesSliceReady) {
      setSliceBounds(requestedSlice);
    }
  }, [isEntriesSliceReady, requestedSlice]);

  useEffect(() => {
    setRequestedSlice(getRange(currentPage, entriesPerPage));
  }, [currentPage, entriesPerPage]);

  useEffect(() => {
    const [sliceStart, sliceEnd] = getRange(currentPage, entriesPerPage);
    const sliceKey = `${sliceStart}-${sliceEnd}`;
    if (isEntriesSliceReady || fetchingSlice.current[sliceKey]) return;
    fetchingSlice.current[sliceKey] = true;
    fetchData(currentPage, entriesPerPage)
      .then((response) => {
        if (response === undefined) return;
        const newEntries = [...entries];

        for (
          let i = sliceStart;
          i < sliceEnd && i < sliceStart + response.length; // Second conditional check is for the last page where resposne count might be less than page count
          i++
        ) {
          newEntries[i] = response[i - sliceStart];
        }
        setEnties([...newEntries]);
      })
      .finally(() => {
        delete fetchingSlice.current[sliceKey];
      });
  }, [entries, currentPage, entriesPerPage, isEntriesSliceReady, fetchData]);

  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  const entriesSlice = useMemo(
    () => entries.slice(sliceStart, sliceEnd),
    [sliceStart, sliceEnd, entries],
  );

  const resetData = useCallback(() => {
    setEnties([]);
  }, []);

  return {
    isLoading: !isEntriesSliceReady,
    slice: entriesSlice,
    currentPage,
    entriesPerPage,
    requestPageChange,
    requestEntriesPerPageChange,
    resetData,
  };
}
