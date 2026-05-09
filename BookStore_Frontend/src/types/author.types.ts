export interface AuthorSimpleResponse {
    id: string;
    name: string;
    avatarUrl: string | null;
}

export interface AuthorResponse {
    id: string;
    name: string;
    bio: string | null;
    avatarUrl: string | null;
    birthDate: string | null;
    nationality: string | null;
    bookCount: number | null;
    createdAt: string;
}

export interface AuthorRequest {
    name: string;
    bio?: string | null;
    avatarUrl?: string | null;
    birthDate?: string | null;
    nationality?: string | null;
}