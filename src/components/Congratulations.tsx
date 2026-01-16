interface Props {
  questions: {
    correctAnswer: string;
  }[];
  answers: (string | null)[];
  onRestart: () => void;
}

function Congratulations({ questions, answers, onRestart }: Props) {
  const score = answers.filter(
    (ans, idx) => ans === questions[idx].correctAnswer
  ).length;

  return (
    <div className="congrats">
      <h2>Congrats! You completed the quiz 🎉</h2>
      <p>You answered {score} / 10 correctly</p>
      <button onClick={onRestart}>Play Again</button>
    </div>
  );
}

export default Congratulations;
