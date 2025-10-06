export type Difficulty = "fácil" | "médio" | "difícil";

export interface Question {
  id: number;
  question: string;
  alternatives: string[];
  correctAnswer: number;
  difficulty: string;
  imageUrl?: string;
}