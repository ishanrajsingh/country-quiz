interface Props {
  question: {
    flag: string;
    correctAnswer: string;
    options: string[];
  };
  userAnswer: string | null;
  onAnswer: (answer: string) => void;
}

function Question({ question, userAnswer, onAnswer }: Props) {
  return (
    <div className="question">
      <h2>Which country does this flag belong to?</h2>
      <img src={question.flag} className="flag" />

      <div className="options">
        {question.options.map((option) => {
          let className = "option";

          if (userAnswer) {
            if (option === question.correctAnswer) className += " correct";
            else if (option === userAnswer) className += " wrong";
          }

          return (
            <button
              key={option}
              className={className}
              disabled={!!userAnswer}
              onClick={() => onAnswer(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Question;
