import { useEffect, useState } from "react";
import Question from "./Question";
import Congratulations from "./Congratulations";

interface QuestionType {
  flag: string;
  correctAnswer: string;
  options: string[];
}

function Quiz() {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(10).fill(null)
  );
  const [showResult, setShowResult] = useState<boolean>(false);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags"
        );

        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Invalid API response", data);
          return;
        }

        const validCountries = data.filter(
          (c) => c?.name?.common && c?.flags?.svg
        );

        if (validCountries.length < 10) {
          console.error("Not enough valid countries");
          return;
        }

        const shuffled = [...validCountries].sort(() => 0.5 - Math.random());

        const selected = shuffled.slice(0, 10);

        const generated: QuestionType[] = selected.map((country) => {
          const correct = country.name.common;

          const wrongOptions = validCountries
            .filter((c) => c.name.common !== correct)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map((c) => c.name.common);

          return {
            flag: country.flags.svg,
            correctAnswer: correct,
            options: [...wrongOptions, correct].sort(() => 0.5 - Math.random()),
          };
        });

        console.log("Generated questions:", generated);
        setQuestions(generated);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswer = (answer: string) => {
    const updated = [...answers];
    updated[currentIndex] = answer;
    setAnswers(updated);
  };

  useEffect(() => {
    if (answers.every((a) => a !== null)) {
      setShowResult(true);
    }
  }, [answers]);

  const restartQuiz = () => {
    setAnswers(Array(10).fill(null));
    setCurrentIndex(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <Congratulations
        questions={questions}
        answers={answers}
        onRestart={restartQuiz}
      />
    );
  }

  if (!questions.length) return <p>Loading...</p>;

  return (
    <div className="quiz">
      <div className="navigator">
        {questions.map((_, idx) => (
          <button
            key={idx}
            className={idx === currentIndex ? "nav active" : "nav"}
            onClick={() => setCurrentIndex(idx)}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <Question
        question={questions[currentIndex]}
        userAnswer={answers[currentIndex]}
        onAnswer={handleAnswer}
      />
    </div>
  );
}

export default Quiz;
