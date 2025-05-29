import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { questions, generateSessionId } from "@/lib/quiz-data";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function QuizPage() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [sessionId] = useState(() => generateSessionId());
  const { toast } = useToast();

  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const currentQuestionData = questions[currentQuestion];

  useEffect(() => {
    // Save progress to sessionStorage
    sessionStorage.setItem('pasulol-quiz-progress', JSON.stringify({
      currentQuestion,
      answers,
      sessionId
    }));
  }, [currentQuestion, answers, sessionId]);

  useEffect(() => {
    // Restore progress from sessionStorage
    const saved = sessionStorage.getItem('pasulol-quiz-progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCurrentQuestion(data.currentQuestion || 0);
        setAnswers(data.answers || {});
      } catch (e) {
        console.log('Failed to restore quiz progress');
      }
    }
  }, []);

  const selectAnswer = (answerKey: string) => {
    if ((window as any).playSound) {
      (window as any).playSound('click');
    }
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerKey
    }));
  };

  const nextQuestion = async () => {
    if ((window as any).playSound) {
      (window as any).playSound('click');
    }

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz completed, process results
      await processQuizResults();
    }
  };

  const previousQuestion = () => {
    if ((window as any).playSound) {
      (window as any).playSound('click');
    }
    
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const processQuizResults = async () => {
    try {
      if ((window as any).playSound) {
        (window as any).playSound('complete');
      }

      // Convert answers to the format expected by backend
      const formattedAnswers: Record<string, string> = {};
      Object.entries(answers).forEach(([questionIndex, answer]) => {
        formattedAnswers[questionIndex] = answer;
      });

      const response = await apiRequest('POST', '/api/process-quiz', {
        answers: formattedAnswers,
        sessionId
      });

      if (response.ok) {
        // Clear saved progress
        sessionStorage.removeItem('pasulol-quiz-progress');
        
        // Navigate to results
        setLocation(`/results/${sessionId}`);
      } else {
        throw new Error('Failed to process quiz');
      }
    } catch (error) {
      console.error('Error processing quiz:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถประมวลผลแบบทดสอบได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    }
  };

  const saveProgress = () => {
    if ((window as any).playSound) {
      (window as any).playSound('click');
    }
    
    toast({
      title: "บันทึกความคืบหน้าแล้ว",
      description: "คุณสามารถกลับมาทำต่อได้ในภายหลัง",
    });
  };

  const exitQuiz = () => {
    if ((window as any).playSound) {
      (window as any).playSound('click');
    }
    
    setLocation('/');
  };

  const hasCurrentAnswer = answers.hasOwnProperty(currentQuestion);
  const currentAnswer = answers[currentQuestion];

  return (
    <>
      <main 
        className="container"
        style={{
          background: '#fff',
          padding: '32px 16px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(178,34,34,0.10)',
          maxWidth: '700px',
          width: '98%',
          maxHeight: '95vh',
          overflowY: 'auto',
          position: 'relative',
          fontFamily: 'Kanit, sans-serif',
          animation: 'fadeIn 0.5s ease-in'
        }}
      >
        <section id="test-container">
          <div id="question-section" style={{ marginBottom: '1.5rem' }}>
            <div className="question-header" style={{ marginBottom: '1rem' }}>
              <h2 
                id="question-text"
                style={{
                  fontWeight: '700',
                  fontSize: '1.3rem',
                  textAlign: 'center',
                  marginBottom: '1rem',
                  color: '#222'
                }}
              >
                {currentQuestionData.question}
              </h2>
            </div>

            {/* Question Image */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div 
                id="question-image"
                style={{
                  margin: '0 auto 1.5rem',
                  maxWidth: '180px',
                  height: '120px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 12px rgba(178,34,34,0.10)',
                  backgroundColor: '#ffe5e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="fas fa-image" style={{ fontSize: '2rem', color: '#b22222' }}></i>
              </div>
            </div>

            {/* Answer Options */}
            <div 
              id="answer-options"
              className="answers"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
                marginBottom: '2rem'
              }}
            >
              {Object.entries(currentQuestionData.answers).map(([key, answer]) => (
                <div
                  key={key}
                  className={`answer-option ${currentAnswer === key ? 'selected' : ''}`}
                  onClick={() => selectAnswer(key)}
                  style={{
                    padding: '14px',
                    background: currentAnswer === key ? '#ff9999' : '#ffe5e5',
                    border: currentAnswer === key ? '2px solid #b22222' : '2px solid transparent',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(.25,.8,.25,1)',
                    fontWeight: '600',
                    textAlign: 'center',
                    fontSize: '1.05rem',
                    userSelect: 'none',
                    color: '#222'
                  }}
                  onMouseEnter={(e) => {
                    if (currentAnswer !== key) {
                      e.currentTarget.style.background = '#ffccd5';
                      e.currentTarget.style.borderColor = '#b22222';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentAnswer !== key) {
                      e.currentTarget.style.background = '#ffe5e5';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  {answer.text}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div 
            id="controls"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '1.5rem',
              width: '100%',
              maxWidth: '500px'
            }}
          >
            <button
              id="prev-btn"
              className="nav-btn"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              style={{
                padding: '15px 30px',
                background: currentQuestion === 0 ? '#ddd' : '#b22222',
                color: currentQuestion === 0 ? '#aaa' : '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Kanit, sans-serif',
                minWidth: '140px',
                justifyContent: 'center',
                boxShadow: currentQuestion === 0 ? 'none' : '0 2px 8px rgba(178,34,34,0.15)'
              }}
              onMouseEnter={(e) => {
                if (currentQuestion > 0) {
                  e.currentTarget.style.background = '#8b0000';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentQuestion > 0) {
                  e.currentTarget.style.background = '#b22222';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <i className="fas fa-arrow-left"></i> ย้อนกลับ
            </button>

            <button
              id="next-btn"
              className="nav-btn"
              onClick={nextQuestion}
              disabled={!hasCurrentAnswer}
              style={{
                padding: '15px 30px',
                background: !hasCurrentAnswer ? '#ddd' : '#b22222',
                color: !hasCurrentAnswer ? '#aaa' : '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor: !hasCurrentAnswer ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Kanit, sans-serif'
              }}
              onMouseEnter={(e) => {
                if (hasCurrentAnswer) {
                  e.currentTarget.style.background = '#8b0000';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (hasCurrentAnswer) {
                  e.currentTarget.style.background = '#b22222';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {currentQuestion === totalQuestions - 1 ? 'ดูผลลัพธ์' : 'ต่อไป'} <i className="fas fa-arrow-right"></i>
            </button>
          </div>

          {/* Progress Container */}
          <div 
            id="progress-container"
            style={{
              marginBottom: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <div 
              className="progress-bar"
              style={{
                flex: 1,
                background: '#ffe5e5',
                height: '12px',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              <div 
                id="progress"
                className="progress"
                style={{
                  background: '#b22222',
                  height: '100%',
                  width: `${progress}%`,
                  transition: 'width 0.3s cubic-bezier(.25,.8,.25,1)',
                  borderRadius: '8px'
                }}
              ></div>
            </div>
            <span 
              id="progress-text"
              style={{
                minWidth: '60px',
                textAlign: 'right',
                fontWeight: '600',
                fontSize: '0.9rem',
                color: '#222'
              }}
            >
              {currentQuestion + 1}/{totalQuestions}
            </span>
          </div>
        </section>
      </main>

      {/* Sound Toggle Button */}
      <button 
        id="soundToggle" 
        className="sound-btn" 
        aria-label="Toggle sound"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 100,
          background: '#b22222',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.3rem',
          boxShadow: '0 2px 8px rgba(178,34,34,0.13)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(.25,.8,.25,1)',
          fontFamily: 'Kanit, sans-serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#8b0000';
          e.currentTarget.style.transform = 'scale(1.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#b22222';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <i className="fas fa-volume-up"></i>
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .container {
            padding: 16px 8px !important;
            width: 99% !important;
            max-height: 99vh !important;
          }
          
          #question-text {
            font-size: 1.1rem !important;
          }

          .answers, #answer-options {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }

          .answer-option {
            font-size: 1rem !important;
            padding: 12px !important;
          }

          #controls {
            flex-direction: column !important;
          }

          .nav-btn {
            justify-content: center !important;
            width: 100% !important;
          }

          .sound-btn {
            bottom: 10px !important;
            right: 10px !important;
            width: 38px !important;
            height: 38px !important;
            font-size: 1.1rem !important;
          }
        }
      `}</style>
    </>
  );
}
