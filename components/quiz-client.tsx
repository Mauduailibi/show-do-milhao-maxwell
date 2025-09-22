'use client';

import { useState, useEffect } from 'react';
import { useAudio } from '@/hooks/useAudio';
import { Question } from '@/lib/types';
import Image from 'next/image';
import MaxwellFeliz from '@/public/images/maxwell_feliz.jpeg';
import MaxwellTriste from '@/public/images/maxwell_triste.jpeg';

interface QuizClientProps {
  questions: Question[];
}

type EndGameStatus = 'COMPLETED' | 'WRONG_ANSWER';

export default function QuizClient({ questions }: QuizClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [endGameStatus, setEndGameStatus] = useState<EndGameStatus | null>(null);

  const { play: playAcertou } = useAudio('/audio/acertou.mp3');
  const { play: playErrou } = useAudio('/audio/errou.mp3');
  const { play: playGanhou } = useAudio('/audio/ganhou.mp3');
  const { play: playPergunta } = useAudio('/audio/pergunta.mp3');

  const currentQuestion = questions[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      playPergunta();
    }, 500);

    return () => clearTimeout(timer);
  }, [currentQuestionIndex, playPergunta]);

  const handleSelectAnswer = (answerIndex: number) => {
    if (isVerified) return;
    setSelectedAnswer(answerIndex);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;

    setIsVerified(true);

    if (selectedAnswer === currentQuestion.correctAnswer) {
      playAcertou();
      setScore(score + 1);
    } else {
      playErrou();
      setEndGameStatus('WRONG_ANSWER');
      setTimeout(() => {
        setIsFinished(true);
      }, 2000);
    }
  };


  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsVerified(false);
    } else {
      setEndGameStatus('COMPLETED');
      setIsFinished(true);
    }
  };

  useEffect(() => {
    if (endGameStatus === 'COMPLETED') {
        playGanhou();
    }
  }, [endGameStatus, playGanhou]);

  if (isFinished) {
    return (
      <div className="w-full max-w-2xl text-center rounded-lg bg-gray-800 p-8 text-white shadow-2xl">
        {endGameStatus === 'COMPLETED' ? (
          <>
            <Image src={MaxwellFeliz} alt='Maxwell feliz' className='w-1/2 m-auto' />
            <h2 className="text-3xl font-bold text-yellow-400 mt-4">Parabéns!</h2>
            <p className="mt-4 text-xl">
              Você completou o desafio e acertou todas as perguntas!
            </p>
            <p className="my-6 text-6xl font-bold text-green-500">
              {score} / {questions.length}
            </p>
          </>
        ) : (
          <>
            <Image src={MaxwellTriste} alt="Maxwell triste" className='w-1/2 m-auto' />
            <h2 className="text-3xl font-bold text-red-500 mt-4">Que pena, você errou!</h2>
            <p className="mt-4 text-xl">
              O jogo terminou. Você acertou um total de:
            </p>
            <p className="my-6 text-6xl font-bold text-yellow-400">
              {score} {score === 1 ? 'pergunta' : 'perguntas'}
            </p>
          </>
        )}
        <button
          onClick={() => window.location.href = '/'}
          className="rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-transform duration-200 hover:scale-105"
        >
          Jogar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl rounded-lg bg-gray-800 p-6 text-white shadow-2xl md:p-8">
      {/* Cabeçalho */}
      <div className="mb-6 flex justify-between border-b border-gray-600 pb-4">
        <h2 className="text-xl font-bold text-yellow-400">
          Pergunta {questionNumber} <span className="text-gray-400">/ {questions.length}</span>
        </h2>
        <div className="text-lg font-semibold">Pontos: <span className="text-green-400">{score}</span></div>
      </div>
      
      {/* Pergunta */}
      <div className="mb-8">
        <p className="text-lg md:text-xl">{currentQuestion.question}</p>
      </div>

      {/* Alternativas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {currentQuestion.alternatives.map((alt, index) => {
          let buttonClass = 'bg-blue-600 hover:bg-blue-500';
          
          if (isVerified) {
            if (index === currentQuestion.correctAnswer) {
              buttonClass = 'bg-green-600';
            } else if (index === selectedAnswer) {
              buttonClass = 'bg-red-600';
            } else {
              buttonClass = 'bg-gray-700 opacity-70';
            }
          } else if (selectedAnswer === index) {
            buttonClass = 'bg-yellow-600';
          }
          
          return (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              disabled={isVerified}
              className={`w-full p-4 rounded-lg text-left text-lg transition-all duration-300 ${buttonClass} ${!isVerified ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              {String.fromCharCode(65 + index)}. {alt}
            </button>
          );
        })}
      </div>

      <div className="mt-8 text-right">
        {!isVerified ? (
          <button
            onClick={handleCheckAnswer}
            disabled={selectedAnswer === null}
            className="rounded-full bg-green-500 px-10 py-3 text-lg font-bold text-gray-900 transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:bg-gray-500"
          >
            Verificar Resposta
          </button>
        ) : (
          selectedAnswer === currentQuestion.correctAnswer && (
            <button
              onClick={handleNextQuestion}
              className="rounded-full bg-yellow-500 px-10 py-3 text-lg font-bold text-gray-900 transition-transform duration-200 hover:scale-105"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Próxima Pergunta'}
            </button>
          )
        )}
      </div>
    </div>
  );
}