"use client";

import { useState, useEffect } from "react";
import { Question } from "@/types/quiz";
import Image from "next/image";

interface QuizComponentProps {
  questions: Question[];
  title: string;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ questions, title }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showJustification, setShowJustification] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [randomMode, setRandomMode] = useState(false);

  useEffect(() => {
    // Ask user about random mode
    const result = window.confirm("Do you want random questions and answers?");
    setRandomMode(result);
    
    if (result) {
      // Shuffle questions and their options
      const shuffled = [...questions].sort(() => 0.5 - Math.random());
      const shuffledWithOptions = shuffled.map(question => ({
        ...question,
        options: [...question.options].sort(() => 0.5 - Math.random())
      }));
      setShuffledQuestions(shuffledWithOptions);
      alert("You have chosen random questions and answers!");
    } else {
      setShuffledQuestions(questions);
      alert("You have chosen non-random questions and answers!");
    }
  }, [questions]);

  useEffect(() => {
    // Load saved progress
    const saved = localStorage.getItem(`quiz-progress-${title}`);
    if (saved) {
      setCurrentQuestionIndex(parseInt(saved));
    }
  }, [title]);

  useEffect(() => {
    // Save progress
    localStorage.setItem(`quiz-progress-${title}`, currentQuestionIndex.toString());
  }, [currentQuestionIndex, title]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleAnswerChange = (optionIndex: number) => {
    if (currentQuestion?.type === "radio") {
      setSelectedAnswers([optionIndex]);
    } else if (currentQuestion?.type === "checkbox") {
      setSelectedAnswers(prev => 
        prev.includes(optionIndex) 
          ? prev.filter(i => i !== optionIndex)
          : [...prev, optionIndex]
      );
    }
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    if (selectedAnswers.length === 0) {
      alert("Por favor, selecione uma resposta.");
      return;
    }

    let correct = false;
    
    if (currentQuestion.type === "radio") {
      correct = selectedAnswers[0] === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === "checkbox") {
      const correctAnswers = Array.isArray(currentQuestion.correctAnswer) 
        ? currentQuestion.correctAnswer 
        : [currentQuestion.correctAnswer];
      correct = selectedAnswers.length === correctAnswers.length && 
                selectedAnswers.every(answer => correctAnswers.includes(answer));
    }

    setIsCorrect(correct);
    setShowJustification(true);
    
    if (correct) {
      alert("Resposta correta!");
    } else {
      alert("Resposta incorreta!");
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswers([]);
      setShowJustification(false);
      setIsCorrect(false);
    } else {
      alert("Você respondeu todas as perguntas!");
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswers([]);
      setShowJustification(false);
      setIsCorrect(false);
    } else {
      alert("Esta é a primeira pergunta!");
    }
  };

  if (shuffledQuestions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="text-center mt-5">
        <h1>{title}</h1>
      </div>
      
      <div id="questions-container" className="mt-3 p-3 border border-dark">
        <p>
          <strong>Question {currentQuestionIndex + 1}/{shuffledQuestions.length}:</strong> 
          {currentQuestion.question}
        </p>

        {currentQuestion.options.map((option, index) => (
          <div key={index} className="form-check mt-2">
            <input
              className="form-check-input"
              type={currentQuestion.type}
              name={`question-${currentQuestionIndex}`}
              id={`option-${index}`}
              value={index}
              checked={selectedAnswers.includes(index)}
              onChange={() => handleAnswerChange(index)}
            />
            <label className="form-check-label" htmlFor={`option-${index}`}>
              {option}
            </label>
          </div>
        ))}
      </div>

      <div className="row mt-3">
        <div className="col">
          {currentQuestionIndex > 0 && (
            <button className="btn btn-primary" onClick={previousQuestion}>
              Anterior
            </button>
          )}
        </div>
        <div className="col text-center">
          <button className="btn btn-primary" onClick={checkAnswer}>
            Verificar Resposta
          </button>
        </div>
        <div className="col text-end">
          {currentQuestionIndex < shuffledQuestions.length - 1 && (
            <button className="btn btn-primary" onClick={nextQuestion}>
              Próximo
            </button>
          )}
        </div>
      </div>

      {showJustification && (
        <>
          <div className="references-container mt-3">
            <h2>Justification</h2>
            <p>{currentQuestion.justification}</p>
            
            {currentQuestion.referenceLinks && currentQuestion.referenceLinks.length > 0 && (
              <>
                <h2>Reference Links</h2>
                <ul>
                  {currentQuestion.referenceLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        Exemplo {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {currentQuestion.screenshots && currentQuestion.screenshots.length > 0 && (
            <div className="screenshots-container mt-3">
              <h2>Screenshots</h2>
              <div>
                {currentQuestion.screenshots.map((screenshot, index) => (
                  <Image
                    key={index}
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    width={600}
                    height={400}
                    className="screenshot img-fluid mb-2"
                  />
                ))}
              </div>
            </div>
          )}

          {currentQuestion.videos && currentQuestion.videos.length > 0 && (
            <div className="video-container mt-3">
              <h2>Explainer Video</h2>
              <video controls className="w-100">
                <source src={currentQuestion.videos[0]} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizComponent;
