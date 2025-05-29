import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { QuizResult } from "@shared/schema";

export default function ResultsPage() {
  const [, params] = useRoute("/results/:sessionId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const sessionId = params?.sessionId;

  const { data: session, isLoading, error } = useQuery({
    queryKey: [`/api/quiz-session/${sessionId}`],
    enabled: !!sessionId,
  });

  useEffect(() => {
    if (!sessionId) {
      setLocation('/');
    }
  }, [sessionId, setLocation]);

  const restartQuiz = () => {
    if ((window as any).playSound) {
      (window as any).playSound('click');
    }
    
    // Clear any saved progress
    sessionStorage.removeItem('pasulol-quiz-progress');
    setLocation('/');
  };

  const shareResult = () => {
    if ((window as any).playSound) {
      (window as any).playSound('click');
    }
    
    // Define sharing functions in global scope
    (window as any).shareToFacebook = () => {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent('ลองทำแบบทดสอบบุคลิกภาพ Pasulol ดูสิ!');
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
    };
    
    (window as any).shareToTwitter = () => {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent('ลองทำแบบทดสอบบุคลิกภาพ Pasulol ดูสิ!');
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    };
    
    (window as any).copyResultLink = () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        if ((window as any).Swal) {
          (window as any).Swal.fire({
            title: 'คัดลอกแล้ว!',
            text: 'ลิงก์ผลลัพธ์ถูกคัดลอกไปยัง clipboard แล้ว',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        }
      });
    };
    
    // Use SweetAlert2 for sharing options
    if ((window as any).Swal) {
      (window as any).Swal.fire({
        title: 'แชร์ผลลัพธ์ของคุณ',
        html: `
          <div style="text-align: center;">
            <p style="margin-bottom: 20px;">เลือกวิธีการแชร์ผลลัพธ์ของคุณ</p>
            <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
              <button onclick="shareToFacebook()" style="background-color: #1877f2; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                <i class="fab fa-facebook" style="margin-right: 8px;"></i>Facebook
              </button>
              <button onclick="shareToTwitter()" style="background-color: #1da1f2; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                <i class="fab fa-twitter" style="margin-right: 8px;"></i>Twitter
              </button>
              <button onclick="copyResultLink()" style="background-color: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                <i class="fas fa-copy" style="margin-right: 8px;"></i>คัดลอกลิงก์
              </button>
            </div>
          </div>
        `,
        showConfirmButton: false,
        showCloseButton: true
      });
    } else {
      toast({
        title: "แชร์ผลลัพธ์",
        description: "คุณสามารถคัดลอก URL หน้านี้เพื่อแชร์ผลลัพธ์ได้",
      });
    }
  };

  const downloadResult = () => {
    if ((window as any).playSound) {
      (window as any).playSound('click');
    }
    
    // Check if html2canvas is available
    if ((window as any).html2canvas) {
      const resultContainer = document.querySelector('.result-container');
      if (resultContainer) {
        (window as any).html2canvas(resultContainer).then((canvas: HTMLCanvasElement) => {
          const link = document.createElement("a");
          link.download = "ผลลัพธ์บุคลิกภาพ-Pasulol.png";
          link.href = canvas.toDataURL();
          link.click();
        });
      }
    } else {
      toast({
        title: "ไม่สามารถดาวน์โหลดได้",
        description: "กรุณาใช้ฟีเจอร์ capture หน้าจอของเบราว์เซอร์แทน",
        variant: "destructive",
      });
    }
  };

  const showSupport = () => {
    if ((window as any).playSound) {
      (window as any).playSound('click');
    }
    
    if ((window as any).Swal) {
      (window as any).Swal.fire({
        title: 'สนับสนุนผู้พัฒนา',
        html: `
          <div class="text-center">
            <p class="mb-4">หากคุณชอบแบบทดสอบนี้ สามารถสนับสนุนผู้พัฒนาได้ที่:</p>
            <div class="space-y-3">
              <button onclick="window.open('https://www.buymeacoffee.com/wellgr8', '_blank')" 
                      class="bg-yellow-500 text-white px-6 py-3 rounded-lg w-full">
                ☕ Buy Me a Coffee
              </button>
              <button onclick="window.open('https://ezdn.app/welldonegr8', '_blank')" 
                      class="bg-blue-500 text-white px-6 py-3 rounded-lg w-full">
                💙 EasyDonate
              </button>
            </div>
            <p class="text-sm text-gray-600 mt-4">ขอบคุณสำหรับการสนับสนุน!</p>
          </div>
        `,
        showConfirmButton: false,
        showCloseButton: true
      });
    } else {
      window.open('https://www.buymeacoffee.com/wellgr8', '_blank');
    }
  };

  const viewAllTypes = () => {
    if ((window as any).playSound) {
      (window as any).playSound('click');
    }
    
    toast({
      title: "ฟีเจอร์กำลังพัฒนา",
      description: "เร็วๆ นี้จะสามารถดูบุคลิกภาพทั้งหมดได้",
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-white rounded-[16px] shadow-2xl p-8 text-center bounce-in">
        <CardContent className="py-12">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[hsl(var(--pasulol-primary))] to-[hsl(var(--pasulol-secondary))] rounded-full flex items-center justify-center mb-6 animate-pulse">
              <i className="fas fa-brain text-white text-4xl animate-bounce"></i>
            </div>
            <LoadingSpinner className="w-16 h-16 border-4 border-[hsl(var(--pasulol-accent))] border-t-[hsl(var(--pasulol-primary))] mx-auto mb-6" />
          </div>
          
          <h2 className="text-2xl font-bold text-[hsl(var(--pasulol-primary))] mb-4">
            กำลังโหลดผลลัพธ์ของคุณ...
          </h2>
          <div className="space-y-3 text-gray-600">
            <p className="animate-pulse">🧠 กำลังดึงข้อมูลบุคลิกภาพ</p>
            <p className="animate-pulse" style={{animationDelay: '0.5s'}}>📊 จัดรูปแบบผลลัพธ์</p>
            <p className="animate-pulse" style={{animationDelay: '1s'}}>✨ เตรียมข้อมูลที่น่าสนใจ</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !session) {
    return (
      <Card className="bg-white rounded-[16px] shadow-2xl p-8 text-center">
        <CardContent>
          <div className="mb-4">
            <i className="fas fa-exclamation-triangle text-red-500 text-5xl mb-4"></i>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">ไม่พบผลลัพธ์</h2>
          <p className="text-gray-600 mb-6">ไม่สามารถโหลดผลลัพธ์ของคุณได้ กรุณาทำแบบทดสอบใหม่</p>
          <Button onClick={restartQuiz} className="pasulol-primary hover:pasulol-secondary">
            ทำแบบทดสอบใหม่
          </Button>
        </CardContent>
      </Card>
    );
  }

  const result = {
    type: session.personalityType,
    name: session.characterName,
    traits: session.traits,
    description: session.description,
    strengths: session.strengths,
    growthAreas: session.growthAreas,
    relatedCharacters: session.relatedCharacters
  } as QuizResult;

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
        <section id="result-container">
          <div className="result-card" style={{
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(178,34,34,0.10)',
            padding: '24px 10px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <h2 style={{
              textAlign: 'center',
              color: '#b22222',
              fontSize: '1.8rem',
              fontWeight: '700',
              marginBottom: '1.5rem'
            }}>
              ผลลัพธ์ของคุณ
            </h2>

            {/* Character Display */}
            <div className="character-display" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '18px',
              marginBottom: '1rem',
              flexWrap: 'wrap'
            }}>
              <div 
                className="character-image"
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  border: '3px solid #b22222',
                  boxShadow: '0 2px 8px rgba(178,34,34,0.10)',
                  background: 'linear-gradient(135deg, #b22222, #8b0000)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                  fontWeight: '700'
                }}
              >
                {result.type}
              </div>

              <div className="character-info" style={{
                textAlign: 'left',
                maxWidth: '340px'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#b22222',
                  marginBottom: '0.5rem'
                }}>
                  {result.name}
                </h3>
                <p className="traits" style={{
                  color: '#8b0000',
                  fontWeight: '600',
                  margin: '0.5rem 0 0 0',
                  fontSize: '0.9rem'
                }}>
                  {result.traits?.join(' • ')}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="description" style={{
              margin: '1rem 0 1.2rem 0',
              fontSize: '1rem',
              color: '#222',
              textAlign: 'center',
              lineHeight: '1.6'
            }}>
              {result.description}
            </div>

            {/* Strengths */}
            {result.strengths && result.strengths.length > 0 && (
              <div className="result-section" style={{
                background: '#ffe5e5',
                borderRadius: '10px',
                padding: '10px 0 8px 0',
                margin: '0.7rem 0 0.5rem 0',
                fontSize: '1.02rem'
              }}>
                <h4 style={{
                  margin: '0 0 0.4rem 0',
                  color: '#b22222',
                  fontSize: '1.1rem',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-star" style={{ marginRight: '8px' }}></i>
                  จุดแข็ง
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0',
                  textAlign: 'center',
                  color: '#333'
                }}>
                  {result.strengths.map((strength: string, index: number) => (
                    <li key={index} style={{ margin: '0.2rem 0' }}>• {strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Growth Areas */}
            {result.growthAreas && result.growthAreas.length > 0 && (
              <div className="result-section" style={{
                background: '#ffe5e5',
                borderRadius: '10px',
                padding: '10px 0 8px 0',
                margin: '0.7rem 0 0.5rem 0',
                fontSize: '1.02rem'
              }}>
                <h4 style={{
                  margin: '0 0 0.4rem 0',
                  color: '#b22222',
                  fontSize: '1.1rem',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-seedling" style={{ marginRight: '8px' }}></i>
                  พื้นที่พัฒนา
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  margin: '0',
                  textAlign: 'center',
                  color: '#333'
                }}>
                  {result.growthAreas.map((area: string, index: number) => (
                    <li key={index} style={{ margin: '0.2rem 0' }}>• {area}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Characters */}
            {result.relatedCharacters && result.relatedCharacters.length > 0 && (
              <div className="related-section" style={{ margin: '1.2rem 0' }}>
                <h4 style={{
                  textAlign: 'center',
                  color: '#b22222',
                  fontSize: '1.1rem',
                  marginBottom: '1rem'
                }}>
                  <i className="fas fa-users" style={{ marginRight: '8px' }}></i>
                  ตัวละครที่เกี่ยวข้อง
                </h4>
                <div className="related-characters" style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  {result.relatedCharacters.map((character: any, index: number) => (
                    <div key={index} className="related-character" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '70px',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        border: '2px solid #b22222',
                        boxShadow: '0 2px 6px rgba(178,34,34,0.10)',
                        marginBottom: '4px',
                        background: 'linear-gradient(135deg, #8b0000, #b22222)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.8rem',
                        fontWeight: '700'
                      }}>
                        {character.type}
                      </div>
                      <div className="related-char-info" style={{
                        fontSize: '0.75rem',
                        color: '#8b0000',
                        textAlign: 'center',
                        fontWeight: '600'
                      }}>
                        {character.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons" style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: '1.2rem'
            }}>
              <button 
                id="restart-btn"
                className="action-btn"
                onClick={restartQuiz}
                style={{
                  background: '#b22222',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(.25,.8,.25,1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  fontFamily: 'Kanit, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#8b0000';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#b22222';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <i className="fas fa-redo"></i> ทำแบบทดสอบอีกครั้ง
              </button>

              <button 
                id="view-other-results-btn"
                className="action-btn"
                onClick={viewAllTypes}
                style={{
                  background: '#b22222',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(.25,.8,.25,1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  fontFamily: 'Kanit, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#8b0000';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#b22222';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <i className="fas fa-list"></i> ดูผลลัพธ์อื่นๆ
              </button>

              <button 
                id="support-btn"
                className="action-btn"
                onClick={showSupport}
                style={{
                  background: '#b22222',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(.25,.8,.25,1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  fontFamily: 'Kanit, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#8b0000';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#b22222';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <i className="fas fa-heart"></i> สนับสนุนผู้จัดทำ
              </button>

              <button 
                id="share-btn"
                className="action-btn share-btn"
                onClick={shareResult}
                style={{
                  background: '#ffccd5',
                  color: '#b22222',
                  border: '2px solid #b22222',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(.25,.8,.25,1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  fontFamily: 'Kanit, sans-serif'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#b22222';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffccd5';
                  e.currentTarget.style.color = '#b22222';
                }}
              >
                <i className="fas fa-share-alt"></i> แชร์ผลลัพธ์
              </button>
            </div>
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

          .result-card {
            padding: 16px 8px !important;
          }

          .character-image {
            width: 70px !important;
            height: 70px !important;
          }

          .related-character img {
            width: 40px !important;
            height: 40px !important;
          }

          .character-info {
            text-align: center !important;
            padding: 0 8px !important;
          }

          .action-buttons {
            flex-direction: column !important;
          }

          .action-btn {
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
