import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

function ProgressPage() {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      const user = await supabase.auth.getUser();
      const userId = user.data?.user?.id;

      if (!userId) return;

      const { data, error } = await supabase
        .from('user_progress')
        .select('question_id, correct, questions(unit, topic)')
        .eq('user_id', userId);

      if (error) {
        console.error(error);
      } else {
        // Aggregate progress by unit-topic
        const grouped = {};

        data.forEach(({ correct, questions }) => {
          const label = `${questions.unit} → ${questions.topic}`;
          if (!grouped[label]) {
            grouped[label] = { correct: 0, total: 0 };
          }
          grouped[label].total += 1;
          if (correct) grouped[label].correct += 1;
        });

        const summary = Object.entries(grouped).map(([label, stats]) => ({
          label,
          correct: stats.correct,
          total: stats.total,
          percent: Math.round((stats.correct / stats.total) * 100),
        }));

        setProgress(summary);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#121212',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        padding: '2rem'
      }}
    >
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <h2 style={{ textAlign: 'center' }}>Your Progress</h2>

        {progress.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No progress yet.</p>
        ) : (
          <ul>
            {progress.map(({ label, correct, total, percent }, i) => (
              <li key={i} style={{ marginBottom: '1.5rem' }}>
                <strong>{label}</strong><br />
                <span>{correct} / {total} correct</span><br />
                <span>{percent}%</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProgressPage;
