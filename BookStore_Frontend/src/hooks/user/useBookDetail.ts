import { useQuery } from '@tanstack/react-query';
import { bookService } from '../../services';
import type { BookDetailResponse } from '../../types';

export const useBookDetail = (slug: string | undefined) => {
  return useQuery<BookDetailResponse, Error>({
    queryKey: ['book', 'detail', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Slug is required');
      return await bookService.getBookDetail(slug);
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, 
    retry: 1,
  });
};