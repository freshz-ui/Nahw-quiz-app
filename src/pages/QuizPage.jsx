import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function QuizPage() {
  const { unit, topic } = useParams();
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('unit', unit)
        .eq('topic', topic);

      if (error) console.error(error);
      else setQuestions(data);
    };
    fetchQuestions();
  }, [unit, topic]);

  const current = questions[index];

  useEffect(() => {
    if (current) {
      const options = [
        current.correct_answer,
        current.wrong1,
        current.wrong2,
        current.wrong3,
      ];
      const shuffled = [...options].sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
      setSelected(null);
      setFeedback('');
    }
  }, [index, current]);

  const handleAnswer = async (option) => {
    const isCorrect = option === current.correct_answer;
    setSelected(option);
    setFeedback(isCorrect ? '✅ Correct!' : '❌ Incorrect');

    const user = await supabase.auth.getUser();
    const userId = user.data?.user?.id;

    if (userId) {
      await supabase.from('user_progress').insert({
        user_id: userId,
        question_id: current.id,
        correct: isCorrect,
      });
    }

    setAnswers(prev => [
      ...prev,
      {
        question: current.question,
        selected: option,
        correct: current.correct_answer,
        isCorrect
      }
    ]);

    setTimeout(() => {
      if (index + 1 < questions.length) {
        setIndex(index + 1);
      } else {
        setReviewMode(true);
      }
    }, 1000);
  };

  const pageStyle = {
    backgroundColor: '#121212',
    color: '#ffffff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  };

  const buttonStyle = (option) => ({
    margin: '0.5rem',
    padding: '0.75rem 1.5rem',
    cursor: selected ? 'not-allowed' : 'pointer',
    backgroundColor:
      selected === option
        ? option === current.correct_answer
          ? 'green'
          : 'red'
        : '#333',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    width: '100%',
    maxWidth: '500px',
  });

  if (questions.length === 0) {
    return <div style={pageStyle}><p>Loading questions...</p></div>;
  }

  if (reviewMode) {
    const correctCount = answers.filter(a => a.isCorrect).length;
    const score = ((correctCount / answers.length) * 100).toFixed(1);
    return (
      <div style={pageStyle}>
        <h1>Review Mode</h1>
        <p>You scored {correctCount}/{answers.length} ({score}%)</p>
        <ul>
          {answers.map((a, i) => (
            <li key={i} style={{ marginBottom: '1rem' }}>
              <strong>{a.question}</strong><br />
              Your answer: <span style={{ color: a.isCorrect ? 'lightgreen' : 'salmon' }}>{a.selected}</span><br />
              Correct answer: {a.correct}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <h1>Nahw Quiz</h1>
      <h2>Question {index + 1} of {questions.length}</h2>
      <p style={{ maxWidth: '600px', textAlign: 'center' }}>{current.question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {shuffledOptions.map((option, i) => (
          <button
            key={i}
            style={buttonStyle(option)}
            onClick={() => !selected && handleAnswer(option)}
            disabled={!!selected}
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>{feedback}</p>}
    </div>
  );
}

export default QuizPage;
