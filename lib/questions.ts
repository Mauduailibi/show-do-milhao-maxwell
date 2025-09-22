import questionsData from "@/data/database.json"
import { Question } from "@/lib/types"

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

export function getQuizQuestions(): Question[] {
    const allQuestions: Question[] = questionsData;

    const easyQuestions = allQuestions.filter(q => q.difficulty === "fácil");
    const mediumQuestions = allQuestions.filter(q => q.difficulty === "médio");
    const hardQuestions = allQuestions.filter(q => q.difficulty === "difícil");

    const shuffledEasy = shuffleArray(easyQuestions);
    const shuffledMedium = shuffleArray(mediumQuestions);
    const shuffledHard = shuffleArray(hardQuestions);
    
    const selectedEasy = shuffledEasy.slice(0, 7);
    const selectedMedium = shuffledMedium.slice(0, 2);
    const selectedHard = shuffledHard.slice(0, 1);

    if (selectedEasy.length < 7 || selectedMedium.length < 2 || selectedHard.length < 1) {
        throw new Error('Não há questões suficientes no banco de questões para montar o quiz!');
    }

    const quizQuestions = [
        ...selectedEasy,
        ...selectedMedium,
        ...selectedHard
    ];

    return quizQuestions;
}