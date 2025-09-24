import { getQuizQuestions } from "@/lib/questions";
import QuizClient from "@/components/quiz-client"

export const dynamic = 'force-dynamic'

export default function Quiz(){    
    const questions = getQuizQuestions();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
            <QuizClient questions={questions} />
        </main>
    )
}