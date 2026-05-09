export interface AnswerResponse {
    id: string;
    answer: string;
    userId: string | null;
    userName: string | null;
    isSellerAnswer: boolean;
    createdAt: string;
}

export interface QuestionResponse {
    id: string;
    question: string;
    userId: string;
    userName: string;
    userAvatar: string | null;
    bookId: string;
    bookTitle: string;
    isAnswered: boolean;
    answerCount: number;
    answers: AnswerResponse[] | null;
    createdAt: string;
    bookSlug: string;
}

export interface CreateQuestionRequest {
    bookId: string;
    question: string;
}

export interface AnswerQuestionRequest {
    answer: string;
}