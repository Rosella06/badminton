import React, { useState } from 'react';

// --- Types ---
interface HistoryState {
  scoreA: number;
  scoreB: number;
  setsA: number;
  setsB: number;
  servingTeam: 'A' | 'B';
}

const App: React.FC = () => {
  // --- States ---
  const [scoreA, setScoreA] = useState<number>(0);
  const [scoreB, setScoreB] = useState<number>(0);
  const [setsA, setSetsA] = useState<number>(0);
  const [setsB, setSetsB] = useState<number>(0);
  const [servingTeam, setServingTeam] = useState<'A' | 'B'>('A');
  const [maxScore, setMaxScore] = useState<number>(21);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isSwapped, setIsSwapped] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryState[]>([]);

  // --- Logic ---
  const startGame = (points: number): void => {
    setMaxScore(points);
    setScoreA(0); setScoreB(0);
    setSetsA(0); setSetsB(0);
    setHistory([]);
    setServingTeam('A');
    setGameStarted(true);
  };

  const addScore = (team: 'A' | 'B'): void => {
    setHistory([...history, { scoreA, scoreB, setsA, setsB, servingTeam }]);

    if (team === 'A') {
      const newScore = scoreA + 1;
      setScoreA(newScore);
      setServingTeam('A');
      checkWinner(newScore, scoreB, 'A');
    } else {
      const newScore = scoreB + 1;
      setScoreB(newScore);
      setServingTeam('B');
      checkWinner(newScore, scoreA, 'B');
    }
  };

  const checkWinner = (s1: number, s2: number, team: 'A' | 'B'): void => {
    const ceiling = maxScore === 21 ? 30 : maxScore + 5;
    if ((s1 >= maxScore && s1 - s2 >= 2) || s1 === ceiling) {
      setTimeout(() => {
        alert(`ทีม ${team} ชนะเซตนี้!`);
        if (team === 'A') {
          if (setsA + 1 === 2) {
            alert("จบการแข่งขัน! ทีม A ชนะ");
            setGameStarted(false);
          } else {
            setSetsA(prev => prev + 1);
            setScoreA(0); setScoreB(0);
          }
        } else {
          if (setsB + 1 === 2) {
            alert("จบการแข่งขัน! ทีม B ชนะ");
            setGameStarted(false);
          } else {
            setSetsB(prev => prev + 1);
            setScoreA(0); setScoreB(0);
          }
        }
      }, 100);
    }
  };

  const undo = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (history.length > 0) {
      const last = history[history.length - 1];
      setScoreA(last.scoreA); setScoreB(last.scoreB);
      setSetsA(last.setsA); setSetsB(last.setsB);
      setServingTeam(last.servingTeam);
      setHistory(history.slice(0, -1));
    }
  };

  // --- Styles ---
  const ui = {
    setupBg: {
      height: '100dvh', width: '100%', backgroundColor: '#0a0a0c',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', color: 'white', fontFamily: 'sans-serif', margin: 0
    } as React.CSSProperties,

    setupCard: {
      backgroundColor: '#16161a', padding: '40px', borderRadius: '32px',
      textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      width: '85%', maxWidth: '350px', border: '1px solid #2d2d35',
      position: 'relative' // เพิ่มเพื่อให้ปุ่มจับคู่อยู่ในกรอบ
    } as React.CSSProperties,

    setupButton: {
      width: '100%', padding: '20px', margin: '10px 0', borderRadius: '16px',
      border: 'none', backgroundColor: '#2d2d35', color: 'white',
      fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer'
    } as React.CSSProperties,

    gameContainer: {
      height: '100dvh', width: '100%', display: 'flex',
      flexDirection: isSwapped ? 'row-reverse' : 'row',
      overflow: 'hidden', position: 'fixed', top: 0, left: 0,
      margin: 0, padding: 0, touchAction: 'manipulation'
    } as React.CSSProperties,

    side: (team: 'A' | 'B', isServing: boolean): React.CSSProperties => ({
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', cursor: 'pointer', transition: '0.3s',
      position: 'relative', userSelect: 'none', WebkitUserSelect: 'none',
      backgroundColor: team === 'A'
        ? (isServing ? '#d32f2f' : '#4a1111')
        : (isServing ? '#00695c' : '#002e2c'),
    }),

    score: {
      fontSize: '35vmin', fontWeight: '900', color: 'white',
      margin: 0, lineHeight: 1, textShadow: '0 10px 30px rgba(0,0,0,0.4)'
    } as React.CSSProperties,

    badge: {
      backgroundColor: 'rgba(255,255,255,0.2)', padding: '6px 15px',
      borderRadius: '100px', color: 'white', fontSize: '12px',
      fontWeight: 'bold', letterSpacing: '2px', marginBottom: '20px'
    } as React.CSSProperties,

    setDot: (active: boolean): React.CSSProperties => ({
      width: '30px', height: '6px', borderRadius: '3px',
      backgroundColor: active ? 'white' : 'rgba(255,255,255,0.15)',
      boxShadow: active ? '0 0 10px white' : 'none'
    }),

    controls: {
      position: 'absolute', bottom: '20px', left: '50%',
      transform: 'translateX(-50%)', display: 'flex', gap: '10px',
      zIndex: 100, width: 'auto'
    } as React.CSSProperties,

    miniBtn: {
      padding: '12px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)',
      backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', cursor: 'pointer',
      fontWeight: 'bold', fontSize: '12px', backdropFilter: 'blur(5px)'
    } as React.CSSProperties
  };

  // --- Render ---
  if (!gameStarted) {
    return (
      <div style={ui.setupBg}>
        <div style={ui.setupCard}>
          <a
            href="https://zxczxcasd.vercel.app/?fbclid=IwY2xjawQIuB9leHRuA2FlbQIxMABicmlkETJpU0tweUxRM0l0cVByQlIxc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHpoMfSkKOzWaXOYsWeBm1Xyvp3HW-nmOsr9xL073ts1Sbuc80y1ppX4N37zI_aem_1MiMxE6tpSZXt9hjyR3SEQ"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              padding: '10px 15px',
              backgroundColor: '#2d2d35',
              color: 'white',
              borderRadius: '12px',
              fontSize: '12px',
              textDecoration: 'none',
              fontWeight: 'bold',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            จับคู่
          </a>

          <div style={{ fontSize: '50px', marginBottom: '10px' }}>🏸</div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: '900' }}>BADMINTON PRO</h1>
          <p style={{ color: '#666', fontSize: '11px', letterSpacing: '2px', marginBottom: '30px', fontWeight: 'bold' }}>VERSION 2.0 (MOBILE)</p>
          {[11, 15, 21].map(pts => (
            <button key={pts} style={ui.setupButton} onClick={() => startGame(pts)}>
              {pts} POINTS
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={ui.gameContainer}>
      <style>{`body { margin: 0; padding: 0; overflow: hidden; background: black; }`}</style>

      {/* TEAM A */}
      <div style={ui.side('A', servingTeam === 'A')} onClick={() => addScore('A')}>
        <div style={{ position: 'absolute', top: '30px', left: '30px' }}>
          <div style={{ color: 'white', fontWeight: 'bold', opacity: 0.5, fontSize: '14px' }}>TEAM A</div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
            <div style={ui.setDot(setsA >= 1)}></div>
            <div style={ui.setDot(setsA >= 2)}></div>
          </div>
        </div>
        {servingTeam === 'A' && <div style={ui.badge}>SERVING</div>}
        <h1 style={ui.score}>{scoreA.toString().padStart(2, '0')}</h1>
      </div>

      {/* TEAM B */}
      <div style={ui.side('B', servingTeam === 'B')} onClick={() => addScore('B')}>
        <div style={{ position: 'absolute', top: '30px', right: '30px', textAlign: 'right' }}>
          <div style={{ color: 'white', fontWeight: 'bold', opacity: 0.5, fontSize: '14px' }}>TEAM B</div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', justifyContent: 'flex-end' }}>
            <div style={ui.setDot(setsB >= 1)}></div>
            <div style={ui.setDot(setsB >= 2)}></div>
          </div>
        </div>
        {servingTeam === 'B' && <div style={ui.badge}>SERVING</div>}
        <h1 style={ui.score}>{scoreB.toString().padStart(2, '0')}</h1>
      </div>

      <div style={ui.controls}>
        <button style={ui.miniBtn} onClick={undo}>ย้อนคะแนน</button>
        <button style={ui.miniBtn} onClick={(e) => { e.stopPropagation(); setIsSwapped(!isSwapped); }}>สลับฝั่ง</button>
        <button style={ui.miniBtn} onClick={(e) => { e.stopPropagation(); if (confirm("เริ่มเกมใหม่?")) setGameStarted(false); }}>เริ่มใหม่</button>
      </div>

      <div style={{
        position: 'absolute', top: 0, left: '50%', width: '1px', height: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)', transform: 'translateX(-50%)'
      }}></div>
    </div>
  );
};

export default App;