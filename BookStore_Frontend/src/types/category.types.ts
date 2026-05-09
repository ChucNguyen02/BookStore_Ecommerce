export interface CategorySimpleResponse {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
}

export interface CategoryResponse {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    displayOrder: number;
    parentId: string | null;
    parentName: string | null;
    children: CategorySimpleResponse[] | null;
    bookCount: number;
    isActive: boolean;
}

export interface CategoryRequest {
    name: string;
    description?: string | null;
    parentId?: string | null;
    imageUrl?: string | null;
    displayOrder?: number;
    isActive?: boolean;
}