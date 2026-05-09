export interface CartItemResponse {
    id: string;
    bookId: string;
    bookTitle: string;
    bookSlug: string;
    bookImage: string | null;
    price: number;
    discountPrice: number | null;
    quantity: number;
    subtotal: number;
    availableStock: number;
    inStock: boolean;
    addedAt: string;
    selected?: boolean;
}

export interface CartResponse {
    items: CartItemResponse[];
    totalItems: number;
    subtotal: number;
    estimatedShippingFee: number;
    estimatedTotal: number;
    selectedItems?: number;
    selectedSubtotal?: number;
}

export interface AddToCartRequest {
    bookId: string;
    quantity: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}