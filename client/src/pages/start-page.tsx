import { useLocation } from "wouter";
import { useState, useEffect } from "react";

export default function StartPage() {
  const [, setLocation] = useLocation();
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // โหลดค่าการตั้งค่าเสียงจาก localStorage
    const savedSoundSetting = localStorage.getItem('soundEnabled');
    if (savedSoundSetting !== null) {
      setSoundEnabled(savedSoundSetting === 'true');
    }
  }, []);

  const playSound = (type: 'click' | 'hover') => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'click') {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      } else if (type === 'hover') {
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
      }
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const toggleSound = () => {
    const newSoundState = !soundEnabled;
    setSoundEnabled(newSoundState);
    localStorage.setItem('soundEnabled', newSoundState.toString());
    playSound('click');
  };

  const startQuiz = () => {
    playSound('click');
    setLocation('/quiz');
  };

  const viewAllTypes = () => {
    playSound('click');
    // เปิดหน้าใหม่ที่แสดงตัวละครทั้งหมด
    window.open('/results', '_blank');
  };

  const showInstructions = () => {
    playSound('click');
    if (typeof (window as any).Swal !== 'undefined') {
      (window as any).Swal.fire({
        title: '<strong>วิธีทำแบบทดสอบ</strong>',
        html: `
          <div style="text-align: left; font-family: 'Kanit', sans-serif;">
            <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 10px;">
              <span style="display: inline-block; width: 30px; height: 30px; background: #b22222; color: white; border-radius: 50%; text-align: center; line-height: 30px; margin-right: 15px; font-weight: bold;">1</span>
              <p style="margin: 0;">อ่านคำถามและตัวเลือกทั้งหมดอย่างละเอียด</p>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 10px;">
              <span style="display: inline-block; width: 30px; height: 30px; background: #b22222; color: white; border-radius: 50%; text-align: center; line-height: 30px; margin-right: 15px; font-weight: bold;">2</span>
              <p style="margin: 0;">เลือกคำตอบที่ตรงกับบุคลิกภาพของคุณมากที่สุด</p>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 10px;">
              <span style="display: inline-block; width: 30px; height: 30px; background: #b22222; color: white; border-radius: 50%; text-align: center; line-height: 30px; margin-right: 15px; font-weight: bold;">3</span>
              <p style="margin: 0;">กดปุ่ม <strong>'ต่อไป'</strong> เพื่อไปคำถามถัดไป</p>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 10px;">
              <span style="display: inline-block; width: 30px; height: 30px; background: #b22222; color: white; border-radius: 50%; text-align: center; line-height: 30px; margin-right: 15px; font-weight: bold;">4</span>
              <p style="margin: 0;">เมื่อตอบครบทุกคำถามจะแสดงผลลัพธ์ทันที</p>
            </div>
            <p style="margin-top: 20px; padding: 10px; background: #fff8e1; border-left: 4px solid #ffc107; font-size: 0.9em;">💡 คำแนะนำ: ตอบตามความเป็นตัวคุณจริงๆ อย่าเลือกเพราะคิดว่าคำตอบนั้นดูดี!</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'เข้าใจแล้ว',
        confirmButtonColor: '#b22222',
        width: '800px'
      });
    }
  };

  const showAbout = () => {
    playSound('click');
    if (typeof (window as any).Swal !== 'undefined') {
      (window as any).Swal.fire({
        title: '<strong>เกี่ยวกับ Pasulol Core</strong>',
        html: `
          <div style="font-family: 'Kanit', sans-serif;">
            <p>แบบทดสอบนี้พัฒนาขึ้นเพื่อวิเคราะห์บุคลิกภาพของคุณผ่านตัวละครในจักรวาล Pasulol</p>
            <p>ใช้ทฤษฎีทางจิตวิทยาเช่น MBTI และ Enneagram ในการวิเคราะห์ผลลัพธ์</p>
            <div>
              <p><i class="fas fa-check-circle" style="color: #b22222; margin-right: 8px;"></i> แบบทดสอบ 9 คำถาม</p>
              <p><i class="fas fa-check-circle" style="color: #b22222; margin-right: 8px;"></i> ผลลัพธ์ละเอียดพร้อมคำอธิบาย</p>
              <p><i class="fas fa-check-circle" style="color: #b22222; margin-right: 8px;"></i> เปรียบเทียบกับตัวละครอื่นๆ</p>
            </div>
            <p style="font-size: 0.8em; color: #777; margin-top: 20px;">เวอร์ชัน 1.0 | อัปเดตล่าสุด: กันยายน 2023</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'ปิด',
        confirmButtonColor: '#b22222',
        width: '900px',
        showCloseButton: true
      });
    }
  };

  const showSupport = () => {
    playSound('click');
    if (typeof (window as any).Swal !== 'undefined') {
      (window as any).Swal.fire({
        title: 'สนับสนุนผู้พัฒนา',
        html: `
          <div style="text-align: center; font-family: 'Kanit', sans-serif;">
            <p>หากคุณชอบแบบทดสอบนี้และอยากสนับสนุนผู้พัฒนา</p>
            <p>สามารถสนับสนุนได้ผ่านช่องทางเหล่านี้:</p>
            <div style="margin: 25px 0; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
              <button onclick="window.open('https://www.buymeacoffee.com/wellgr8', '_blank');"
                      style="background-color: #FFDD00; color: #111; font-weight: 600; font-size: 16px;
                             border: none; padding: 12px 24px; border-radius: 12px; cursor: pointer;
                             box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.2s ease;">
                ☕ Buy Me a Coffee
              </button>
              <button onclick="window.open('https://ezdn.app/welldonegr8', '_blank');"
                      style="background-color: #2D9CDB; color: #fff; font-weight: 600; font-size: 16px;
                             border: none; padding: 12px 24px; border-radius: 12px; cursor: pointer;
                             box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.2s ease;">
                💙 EasyDonate
              </button>
            </div>
            <p style="font-size: 0.9rem; color: #555;">ขอบคุณสำหรับการสนับสนุน!</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'ปิด',
        confirmButtonColor: '#b22222'
      });
    }
  };

  return (
    <>
      {/* Load SweetAlert2 */}
      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
      
      <div 
        className="menu-container"
        style={{
          background: '#fff',
          borderRadius: '28px',
          boxShadow: '0 10px 32px rgba(178,34,34,0.12), 0 2px 8px rgba(0,0,0,0.04)',
          padding: '2.1rem 1.7rem 1.7rem 1.7rem',
          margin: '2.7rem auto 1.7rem auto',
          maxWidth: '900px',
          width: '95%',
          textAlign: 'center',
          position: 'relative',
          animation: 'fadeIn 0.7s',
          fontFamily: 'Kanit, sans-serif'
        }}
      >
        {/* Stat Box */}
        <div 
          className="stat-box"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.6rem',
            margin: '0 auto 7px auto',
            padding: '0.28rem 0.6rem',
            background: '#fff7f7',
            borderRadius: '10px',
            boxShadow: '0 1px 4px rgba(178,34,34,0.07)',
            border: '1px solid #ffccd5',
            fontSize: '0.91rem',
            color: '#b22222',
            fontWeight: '700',
            width: 'fit-content',
            minWidth: '120px',
            maxWidth: '320px',
            position: 'relative',
            zIndex: 2
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3em', fontWeight: '700', letterSpacing: '0.1px' }}>
            ยอดวิว: <span style={{
              fontSize: '1em',
              background: 'linear-gradient(90deg, #ffe5ea 60%, #fff 100%)',
              color: '#b22222',
              borderRadius: '6px',
              padding: '1px 8px',
              marginLeft: '5px',
              fontWeight: '800',
              minWidth: '18px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(178,34,34,0.08)',
              border: '1px solid #ffd6e0'
            }}>-</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3em', fontWeight: '700', letterSpacing: '0.1px' }}>
            ยอดแชร์: <span style={{
              fontSize: '1em',
              background: 'linear-gradient(90deg, #e0f7fa 60%, #fff 100%)',
              color: '#007c91',
              borderRadius: '6px',
              padding: '1px 8px',
              marginLeft: '5px',
              fontWeight: '800',
              minWidth: '18px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(178,34,34,0.08)',
              border: '1px solid #b2f7ef'
            }}>-</span>
          </span>
        </div>

        {/* Logo Section */}
        <div 
          className="menu-logo"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '24px 0 28px 0'
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2em'
          }}>
            {/* เลโก้ Pasulol สไตล์เรียบง่าย + Animation */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <div className="lego-block lego-bounce" style={{
                background: '#b22222',
                width: '32px',
                height: '32px',
                borderRadius: '8px 8px 6px 6px',
                boxShadow: '0 2px 8px #b2222230',
                display: 'inline-block',
                animation: 'lego-bounce 1.3s infinite cubic-bezier(.6,0,.4,1)'
              }}></div>
              <div className="lego-block lego-bounce" style={{
                background: '#ffccd5',
                width: '32px',
                height: '32px',
                borderRadius: '8px 8px 6px 6px',
                boxShadow: '0 2px 8px #b2222230',
                display: 'inline-block',
                animation: 'lego-bounce 1.3s infinite cubic-bezier(.6,0,.4,1)',
                animationDelay: '0.12s'
              }}></div>
              <div className="lego-block lego-bounce" style={{
                background: '#b22222',
                width: '32px',
                height: '32px',
                borderRadius: '8px 8px 6px 6px',
                boxShadow: '0 2px 8px #b2222230',
                display: 'inline-block',
                animation: 'lego-bounce 1.3s infinite cubic-bezier(.6,0,.4,1)',
                animationDelay: '0.24s'
              }}></div>
            </div>
            <div style={{
              display: 'flex',
              gap: '6px',
              marginTop: '2px'
            }}>
              <div className="lego-block lego-bounce" style={{
                background: '#ffccd5',
                width: '32px',
                height: '32px',
                borderRadius: '8px 8px 6px 6px',
                boxShadow: '0 2px 8px #b2222230',
                display: 'inline-block',
                animation: 'lego-bounce 1.3s infinite cubic-bezier(.6,0,.4,1)',
                animationDelay: '0.18s'
              }}></div>
              <div className="lego-block lego-bounce" style={{
                background: '#b22222',
                width: '32px',
                height: '32px',
                borderRadius: '8px 8px 6px 6px',
                boxShadow: '0 2px 8px #b2222230',
                display: 'inline-block',
                animation: 'lego-bounce 1.3s infinite cubic-bezier(.6,0,.4,1)',
                animationDelay: '0.30s'
              }}></div>
              <div className="lego-block lego-bounce" style={{
                background: '#ffccd5',
                width: '32px',
                height: '32px',
                borderRadius: '8px 8px 6px 6px',
                boxShadow: '0 2px 8px #b2222230',
                display: 'inline-block',
                animation: 'lego-bounce 1.3s infinite cubic-bezier(.6,0,.4,1)',
                animationDelay: '0.06s'
              }}></div>
            </div>
            <span style={{
              marginTop: '10px',
              fontFamily: 'Kanit, sans-serif',
              fontWeight: '700',
              fontSize: '1.15rem',
              color: '#b22222',
              letterSpacing: '2px'
            }}>
              PASULOL
            </span>
          </div>
        </div>
        <h1 
          className="menu-title"
          style={{
            fontSize: '2.7rem',
            color: '#b22222',
            fontWeight: '800',
            marginBottom: '0.3rem',
            letterSpacing: '1px',
            textShadow: '2px 2px 8px rgba(178,34,34,0.07)'
          }}
        >
          Pasulol Core
        </h1>
        
        <h2 
          className="menu-subtitle"
          style={{
            fontSize: '1.3rem',
            color: '#a94442',
            marginBottom: '2.2rem',
            fontWeight: '500',
            letterSpacing: '0.5px'
          }}
        >
          แบบทดสอบบุคลิกภาพว่านิสัยคุณเหมือนตัวละครอะไร<br />
          ในจักรวาล Pasulol
        </h2>

        <div 
          className="menu-options"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1.7rem 2rem',
            marginBottom: '1.7rem'
          }}
        >
          <button 
            className="menu-btn" 
            onClick={startQuiz}
            style={{
              width: '126px',
              height: '126px',
              padding: '0',
              fontSize: '1.08rem',
              background: 'linear-gradient(135deg, #b22222 80%, #ffccd5 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.22s cubic-bezier(.4,2,.6,1)',
              fontWeight: '700',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(178,34,34,0.10)',
              position: 'relative',
              outline: 'none',
              textDecoration: 'none',
              fontFamily: 'Kanit, sans-serif'
            }}
            onMouseEnter={(e) => {
              playSound('hover');
              e.currentTarget.style.background = 'linear-gradient(135deg, #8b0000 90%, #ffccd5 100%)';
              e.currentTarget.style.transform = 'translateY(-7px) scale(1.04)';
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(178,34,34,0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #b22222 80%, #ffccd5 100%)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(178,34,34,0.10)';
            }}
            title="เริ่มทำแบบทดสอบ"
          >
            <i className="fas fa-play" style={{ fontSize: '2rem', marginBottom: '8px', color: '#fff' }}></i>
            เริ่ม
          </button>

          <button 
            className="menu-btn" 
            onClick={showInstructions}
            style={{
              width: '126px',
              height: '126px',
              padding: '0',
              fontSize: '1.08rem',
              background: 'linear-gradient(135deg, #b22222 80%, #ffccd5 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.22s cubic-bezier(.4,2,.6,1)',
              fontWeight: '700',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(178,34,34,0.10)',
              position: 'relative',
              outline: 'none',
              textDecoration: 'none',
              fontFamily: 'Kanit, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #8b0000 90%, #ffccd5 100%)';
              e.currentTarget.style.transform = 'translateY(-7px) scale(1.04)';
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(178,34,34,0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #b22222 80%, #ffccd5 100%)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(178,34,34,0.10)';
            }}
            title="วิธีทำแบบทดสอบ"
          >
            <i className="fas fa-question-circle" style={{ fontSize: '2rem', marginBottom: '8px', color: '#fff' }}></i>
            วิธีเล่น
          </button>

          <button 
            className="menu-btn" 
            onClick={showAbout}
            style={{
              width: '126px',
              height: '126px',
              padding: '0',
              fontSize: '1.08rem',
              background: 'linear-gradient(135deg, #b22222 80%, #ffccd5 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.22s cubic-bezier(.4,2,.6,1)',
              fontWeight: '700',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(178,34,34,0.10)',
              position: 'relative',
              outline: 'none',
              textDecoration: 'none',
              fontFamily: 'Kanit, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #8b0000 90%, #ffccd5 100%)';
              e.currentTarget.style.transform = 'translateY(-7px) scale(1.04)';
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(178,34,34,0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #b22222 80%, #ffccd5 100%)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(178,34,34,0.10)';
            }}
            title="เกี่ยวกับแบบทดสอบ"
          >
            <i className="fas fa-info-circle" style={{ fontSize: '2rem', marginBottom: '8px', color: '#fff' }}></i>
            เกี่ยวกับ
          </button>

          <button 
            className="menu-btn" 
            onClick={showSupport}
            style={{
              width: '126px',
              height: '126px',
              padding: '0',
              fontSize: '1.08rem',
              background: 'linear-gradient(135deg, #b22222 80%, #ffccd5 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.22s cubic-bezier(.4,2,.6,1)',
              fontWeight: '700',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(178,34,34,0.10)',
              position: 'relative',
              outline: 'none',
              textDecoration: 'none',
              fontFamily: 'Kanit, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #8b0000 90%, #ffccd5 100%)';
              e.currentTarget.style.transform = 'translateY(-7px) scale(1.04)';
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(178,34,34,0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #b22222 80%, #ffccd5 100%)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(178,34,34,0.10)';
            }}
            title="สนับสนุนผู้พัฒนา"
          >
            <i className="fas fa-heart" style={{ fontSize: '2rem', marginBottom: '8px', color: '#fff' }}></i>
            สนับสนุน
          </button>

          <button 
            className="menu-btn" 
            onClick={viewAllTypes}
            style={{
              width: '126px',
              height: '126px',
              padding: '0',
              fontSize: '1.08rem',
              background: 'linear-gradient(135deg, #b22222 80%, #ffccd5 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.22s cubic-bezier(.4,2,.6,1)',
              fontWeight: '700',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(178,34,34,0.10)',
              position: 'relative',
              outline: 'none',
              textDecoration: 'none',
              fontFamily: 'Kanit, sans-serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #8b0000 90%, #ffccd5 100%)';
              e.currentTarget.style.transform = 'translateY(-7px) scale(1.04)';
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(178,34,34,0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #b22222 80%, #ffccd5 100%)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(178,34,34,0.10)';
            }}
            title="ดูผลลัพธ์ตัวละครทั้งหมด"
          >
            <i className="fas fa-users" style={{ fontSize: '2rem', marginBottom: '8px', color: '#fff' }}></i>
            ดูผลลัพธ์
          </button>
        </div>

        <div 
          className="menu-description"
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            fontSize: '1.13rem',
            lineHeight: '1.85',
            color: '#b22222',
            padding: '1.2rem 1rem',
            background: 'linear-gradient(135deg, #fff7f7 60%, #ffe5ea 100%)',
            borderRadius: '18px',
            boxShadow: '0 2px 12px rgba(178,34,34,0.08)',
            border: '2px solid #ffccd5'
          }}
        >
          <p>
            แบบทดสอบนี้จะช่วยวิเคราะห์บุคลิกภาพของคุณผ่านสถานการณ์สมมติ<br />
            มีทั้งหมด 27 คำถาม แต่ละคำถามมี 4 ตัวเลือกให้เลือกตอบ
          </p>
          <div style={{
            marginTop: '18px',
            fontSize: '0.93rem',
            color: '#b22222',
            opacity: '0.85',
            lineHeight: '1.7'
          }}>
            © 2025 WellGr8 | Pasulol Personality Test Project.<br />
            All rights reserved.<br />
            ห้ามคัดลอกหรือดัดแปลงเนื้อหาและแนวคิดโดยไม่ได้รับอนุญาต
          </div>
        </div>
      </div>

      {/* Sound Toggle Button */}
      <button 
        id="soundToggle" 
        className="sound-btn" 
        onClick={toggleSound}
        style={{
          position: 'fixed',
          top: '22px',
          right: '22px',
          background: soundEnabled ? '#b22222' : '#888',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '52px',
          height: '52px',
          cursor: 'pointer',
          fontSize: '1.6rem',
          zIndex: 1000,
          boxShadow: soundEnabled ? '0 4px 12px rgba(178,34,34,0.18)' : '0 4px 12px rgba(136,136,136,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
          transform: 'scale(1)',
          opacity: soundEnabled ? 1 : 0.7
        }}
        onMouseEnter={(e) => {
          playSound('hover');
          e.currentTarget.style.background = soundEnabled ? '#8b0000' : '#666';
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = soundEnabled ? '0 6px 20px rgba(178,34,34,0.25)' : '0 6px 20px rgba(136,136,136,0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = soundEnabled ? '#b22222' : '#888';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = soundEnabled ? '0 4px 12px rgba(178,34,34,0.18)' : '0 4px 12px rgba(136,136,136,0.18)';
        }}
        title={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
      >
        <i className={`fas ${soundEnabled ? 'fa-volume-up' : 'fa-volume-mute'}`} id="soundIcon"></i>
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes lego-bounce {
          0%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
          60% { transform: translateY(0); }
        }

        .lego-bounce {
          animation: lego-bounce 1.3s infinite cubic-bezier(.6,0,.4,1);
        }

        @media (max-width: 600px) {
          .menu-container {
            margin: 1rem auto 0 auto !important;
            padding: 0.7rem 0.1rem 0.9rem 0.1rem !important;
          }
          
          .menu-title {
            font-size: 1.4rem !important;
          }
          
          .menu-subtitle {
            font-size: 1rem !important;
          }
          
          .menu-btn {
            width: 86px !important;
            height: 86px !important;
            font-size: 0.92rem !important;
            border-radius: 12px !important;
          }
          
          .menu-btn i {
            font-size: 1.1rem !important;
            min-width: 14px !important;
          }

          .lego-block {
            width: 24px !important;
            height: 24px !important;
          }

          .menu-logo span {
            font-size: 0.9rem !important;
          }
        }
      `}</style>
    </>
  );
}
