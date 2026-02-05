import React, { useState, useCallback, useEffect, useRef } from 'react';

interface InnerSanctumLayerProps {
  isActive: boolean;
  playSound: (type: string) => void;
  toggleMusic: () => void;
  musicPlaying: boolean;
}

const TREASURE_IMG = "https://res.cloudinary.com/dswpi1pb9/image/upload/v1770293422/IMG_6470_mymbi0.png";

export const InnerSanctumLayer: React.FC<InnerSanctumLayerProps> = ({
  isActive,
  playSound,
  toggleMusic,
  musicPlaying
}) => {
  const [doorState, setDoorState] = useState<'hidden' | 'slammed' | 'opening'>('hidden');
  const [revealed, setRevealed] = useState(false);
  const [audioVisible, setAudioVisible] = useState(false);
  const [cheersActive, setCheersActive] = useState(false);
  const [toastActive, setToastActive] = useState(false);
  const [handleRotation, setHandleRotation] = useState(0);
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && doorState === 'hidden') {
      // Start the door animation sequence
      setTimeout(() => {
        setDoorState('slammed');
        playSound('slam');
        
        setTimeout(() => {
          setHandleRotation(720);
          playSound('unlock');
          
          setTimeout(() => {
            playSound('grind');
            setDoorState('opening');
            setRevealed(true);
            
            setTimeout(() => {
              spawnConfetti();
              setAudioVisible(true);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 300);
    }
  }, [isActive, doorState, playSound]);

  const spawnConfetti = useCallback(() => {
    if (!confettiRef.current) return;
    
    const emojis = ['🍗', '🍹', '🥂', '🥃', '🍸'];
    const box = confettiRef.current;
    
    for (let i = 0; i < 100; i++) {
      const el = document.createElement('div');
      
      if (Math.random() > 0.4) {
        el.className = 'chicken-foot';
        el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      } else {
        el.className = 'aperol-drop-fall';
      }
      
      el.style.left = Math.random() * 100 + '%';
      el.style.top = '-50px';
      el.style.fontSize = (15 + Math.random() * 25) + 'px';
      el.style.transform = `rotate(${Math.random() * 360}deg)`;
      const duration = 2 + Math.random() * 4;
      el.style.animation = `fall ${duration}s linear forwards`;
      
      box.appendChild(el);
    }
  }, []);

  const triggerCheers = useCallback((e: React.MouseEvent) => {
    playSound('clink');
    
    // Bump animation
    setCheersActive(true);
    setTimeout(() => setCheersActive(false), 400);
    
    // Toast text
    setToastActive(true);
    setTimeout(() => setToastActive(false), 2000);
    
    // Create particles
    const x = e.clientX;
    const y = e.clientY;
    
    for (let i = 0; i < 25; i++) {
      const b = document.createElement('div');
      b.className = 'global-particle';
      
      if (Math.random() > 0.4) {
        b.classList.add('splash-drop');
      } else {
        b.classList.add('bubble-rise');
      }
      
      const size = 5 + Math.random() * 8;
      b.style.width = size + 'px';
      b.style.height = size + 'px';
      b.style.left = x + 'px';
      b.style.top = y + 'px';
      
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 150;
      
      b.style.setProperty('--tx', (Math.cos(angle) * dist) + 'px');
      b.style.setProperty('--ty', (Math.sin(angle) * dist - 200) + 'px');
      b.style.setProperty('--rot', Math.random() * 360 + 'deg');
      
      b.style.animation = `particleFly ${0.8 + Math.random()}s ease-out forwards`;
      document.body.appendChild(b);
      
      setTimeout(() => b.remove(), 1000);
    }
  }, [playSound]);

  const handleReload = () => {
    window.location.reload();
  };

  const getDoorClass = () => {
    let className = 'final-vault-door';
    if (doorState === 'slammed') className += ' slam-down';
    if (doorState === 'opening') className += ' slam-down opening';
    return className;
  };

  return (
    <div id="inner-sanctum" className={`layer ${isActive ? 'active' : ''}`}>
      <div className={getDoorClass()}>
        <div className="final-door-frame">
          <div className="combo-dial">
            <div className="dial-marks" />
            <div className="dial-inner" />
          </div>
          <div className="handle-base">
            <div 
              className="handle-spinner"
              style={{ transform: `rotate(${handleRotation}deg)` }}
            >
              <div className="spoke spoke-1" />
              <div className="spoke spoke-2" />
              <div className="spoke spoke-3" />
              <div className="handle-cap" />
            </div>
          </div>
        </div>
      </div>

      <div className={`treasure-container ${revealed ? 'revealed' : ''}`}>
        <div className={`dossier-page ${cheersActive ? 'cheers-hit' : ''}`}>
          <div className="dossier-stamp ds-confidential">TOP SECRET</div>
          <div className="dossier-header">
            <span>CONFIDENCIAL // NIVEL 1</span>
            <span>CASO: 23-G</span>
          </div>
          
          <div className="photo-area" onClick={triggerCheers}>
            <div className="tape" />
            <img 
              src={TREASURE_IMG} 
              className="treasure-img" 
              alt="Treasure"
            />
            <div className={`toast-text ${toastActive ? 'active' : ''}`}>
              ¡CHIN CHIN!
            </div>
          </div>
          
          <div className="dossier-text">
            <p style={{ margin: 0 }}>
              REPORTE FINAL: ACCESO CONCEDIDO AL VOUCHER.<br />
              ESTADO: DISFRUTE OBLIGATORIO.<br />
              FECHA DE EJECUCIÓN: INFINITA.
            </p>
          </div>
          
          <div className="dossier-stamp ds-classified">CLASSIFIED</div>
          <div className="dossier-footer">
            <span>REF: 232323</span>
          </div>
        </div>
      </div>

      <div ref={confettiRef} className="confetti-box" />

      <div className={`elegant-audio-ui ${audioVisible ? 'visible' : ''}`}>
        <button className="btn-gold-play" onClick={toggleMusic}>
          {musicPlaying ? (
            <>
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'currentColor' }}>
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
              <span>PAUSAR</span>
            </>
          ) : (
            <>
              <span className="emoji-drink">🍹</span>
              <span>IMAGINA QUE BRINDAMOS</span>
            </>
          )}
        </button>
        <div className="audio-hint">🎧 Usar auriculares para mejor experiencia</div>
        <button className="btn-home-reset" onClick={handleReload}>
          <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: 'currentColor' }}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>CERRAR SESIÓN</span>
        </button>
      </div>
    </div>
  );
};
