import React, { useState, useEffect } from 'react';
import questionsData  from '../questions';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(
    JSON.parse(localStorage.getItem('currentQuestion')) || 0
  );
  const [timer, setTimer] = useState(
    JSON.parse(localStorage.getItem('timer')) || 600
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setQuestions(questionsData)
    setLoading(false)
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        const newTime = prevTimer - 1;
        localStorage.setItem('timer', newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('currentQuestion', currentQuestion);
  }, [currentQuestion]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      ) {
        setIsFullScreen(true);
      } else {
        setIsFullScreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const handleAnswerOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setCurrentQuestion(currentQuestion + 1);
  };

  const handleFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (!isFullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please enable fullscreen mode to take the quiz.</h1>
          <button onClick={handleFullScreen} className="px-4 py-2 bg-blue-500 text-white rounded">
            Go Fullscreen
          </button>
        </div>
      </div>
    );
  }

  if (timer <= 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <h1 className="text-2xl font-bold">Time's up!</h1>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <div className="mb-4">
          <span className="font-bold text-lg">Time remaining: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</span>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4">{questions[currentQuestion]?.question}</h2>
          {questions[currentQuestion]?.options.map((option, index) => (
            <button
              key={index}
              className={`block w-full text-left p-2 mb-2 border rounded ${selectedOption === option ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleAnswerOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          onClick={handleNextQuestion}
          disabled={selectedOption === null}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Quiz;
