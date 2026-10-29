import React, { useState } from 'react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../data/notesData';

export const QuizDeck: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [filterTopic, setFilterTopic] = useState('All');

  const topics = ['All', ...Array.from(new Set(QUIZ_QUESTIONS.map(q => q.topicTag)))];

  const filteredQuestions = filterTopic === 'All'
    ? QUIZ_QUESTIONS
    : QUIZ_QUESTIONS.filter(q => q.topicTag === filterTopic);

  const safeIdx = Math.min(currentIndex, filteredQuestions.length - 1);
  const currentQ: QuizQuestion = filteredQuestions[safeIdx] || QUIZ_QUESTIONS[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    setAnsweredCount(prev => prev + 1);
    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (safeIdx < filteredQuestions.length - 1) {
      setCurrentIndex(safeIdx + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-handwriting font-bold text-lg text-rose-700">Self-Test Exam</span>
            <span className="text-slate-300">·</span>
            <h3 className="font-sans font-bold text-slate-900 text-base">Gen AI Staff & Core Mastery Quiz Deck</h3>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Test your intuition against technical interview and production traps.
          </p>
        </div>

        {/* Score Tally */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1 bg-slate-100 rounded-lg text-slate-700">
            Score: <span className="font-bold text-emerald-700">{score}</span> / {answeredCount}
          </div>
          <div className="text-slate-400">
            Card {safeIdx + 1} of {filteredQuestions.length}
          </div>
        </div>
      </div>

      {/* Topic Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 my-2 text-xs">
        {topics.map(t => (
          <button
            key={t}
            onClick={() => {
              setFilterTopic(t);
              setCurrentIndex(0);
              setSelectedOption(null);
              setIsAnswered(false);
            }}
            className={`px-2.5 py-1 rounded-md whitespace-nowrap shrink-0 transition-colors ${
              filterTopic === t ? 'bg-slate-900 text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Active Question Card */}
      <div className="my-4 p-5 rounded-xl border border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-mono">
          <span>{currentQ.module}</span>
          <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px] font-sans">
            {currentQ.topicTag}
          </span>
        </div>

        <h4 className="text-base font-bold text-slate-900 font-sans leading-snug mb-4">
          {currentQ.question}
        </h4>

        {/* Multiple Choice Options */}
        <div className="space-y-2.5 mb-5">
          {currentQ.options.map((optionText, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const isCorrect = optIdx === currentQ.correctIndex;

            let btnStyle = 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200';
            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-500';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-50 border-rose-500 text-rose-950 ring-1 ring-rose-500';
              } else {
                btnStyle = 'bg-slate-50 opacity-50 border-slate-200 text-slate-500';
              }
            }

            return (
              <button
                key={optIdx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs font-sans transition-all flex items-start gap-3 ${btnStyle}`}
              >
                <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center shrink-0 font-mono text-[11px] font-bold">
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span className="flex-1 leading-relaxed">{optionText}</span>
                {isAnswered && isCorrect && (
                  <span className="text-emerald-700 font-bold font-mono text-sm">✓</span>
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <span className="text-rose-700 font-bold font-mono text-sm">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Handwritten Explanation Note (Revealed on Answer) */}
        {isAnswered && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-amber-950 font-handwriting text-sm leading-relaxed mb-4">
            <div className="font-bold text-amber-800 text-base mb-1 font-sans flex items-center gap-1.5">
              <span>💡</span>
              <span>Handwritten Explanation & Intuition:</span>
            </div>
            <p className="text-amber-950 text-base">{currentQ.handwrittenExplanation}</p>
          </div>
        )}

        {/* Next Question Navigation */}
        {isAnswered && (
          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors shadow-xs font-sans"
            >
              Next Question →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
