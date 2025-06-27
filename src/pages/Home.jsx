import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Home() {
  const [questions, setQuestions] = useState([]);
  const [units, setUnits] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase.from('questions').select('unit, topic');
      if (error) console.error(error);
      else {
        setQuestions(data);
        const allUnits = [...new Set(data.map(q => q.unit))];
        setUnits(allUnits);
      }
    };
    fetchQuestions();
  }, []);

  const handleUnitChange = (unit) => {
    setSelectedUnit(unit);
    const filteredTopics = [...new Set(
      questions.filter(q => q.unit === unit).map(q => q.topic)
    )];
    setTopics(filteredTopics);
    setSelectedTopic('');
  };

  const startQuiz = () => {
    if (selectedUnit && selectedTopic) {
      navigate(`/quiz/${encodeURIComponent(selectedUnit)}/${encodeURIComponent(selectedTopic)}`);
    }
  };

  const darkStyle = {
    backgroundColor: '#121212',
    color: '#ffffff',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif'
  };

  const selectStyle = {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    border: '1px solid #333',
    padding: '0.5rem',
    marginTop: '0.5rem',
    width: '100%',
    maxWidth: '300px'
  };

  const buttonStyle = {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#444',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  };

return (
  <div
    style={{
      backgroundColor: '#121212',
      color: '#ffffff',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif'
    }}
  >
    <div style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Nahw Quiz</h1>

      <div style={{ marginTop: '1rem' }}>
        <label>Choose a Unit:</label><br />
        <select
          value={selectedUnit}
          onChange={(e) => handleUnitChange(e.target.value)}
          style={selectStyle}
        >
          <option value="">-- Select Unit --</option>
          {units.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>

      {topics.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <label>Choose a Topic:</label><br />
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            style={selectStyle}
          >
            <option value="">-- Select Topic --</option>
            {topics.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>
      )}

      <button
        style={buttonStyle}
        disabled={!selectedUnit || !selectedTopic}
        onClick={startQuiz}
      >
        Start Quiz
      </button>

      <button style={buttonStyle} onClick={() => navigate('/progress')}>
        View My Progress
      </button>
    </div>
  </div>
);

}

export default Home;
