export interface WishlistResponse {
    id: string;
    bookId: string;
    bookTitle: string;
    bookSlug: string;
    bookImage: string | null;
    price: number;
    discountPrice: number | null;
    inStock: boolean;
    addedAt: string;
}