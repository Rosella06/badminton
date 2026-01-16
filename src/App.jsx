import React, { useState } from 'react';

function App() {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [setsA, setSetsA] = useState(0);
  const [setsB, setSetsB] = useState(0);
  const [servingTeam, setServingTeam] = useState('A');
  const [maxScore, setMaxScore] = useState(21);
  const [gameStarted, setGameStarted] = useState(false);
  const [history, setHistory] = useState([]);

  const startGame = (points) => {
    setMaxScore(points);
    setScoreA(0); setScoreB(0);
    setSetsA(0); setSetsB(0);
    setHistory([]);
    setGameStarted(true);
  };

  const addScore = (team) => {
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

  const checkWinner = (s1, s2, team) => {
    const ceiling = maxScore === 21 ? 30 : maxScore + 5;
    if ((s1 >= maxScore && s1 - s2 >= 2) || s1 === ceiling) {
      setTimeout(() => {
        alert(`ทีม ${team} ชนะเซตนี้!`);
        if (team === 'A') {
          if (setsA + 1 === 2) {
            alert("จบเกม! ทีม A ชนะการแข่งขัน");
            setGameStarted(false);
          } else {
            setSetsA(setsA + 1);
            setScoreA(0); setScoreB(0);
          }
        } else {
          if (setsB + 1 === 2) {
            alert("จบเกม! ทีม B ชนะการแข่งขัน");
            setGameStarted(false);
          } else {
            setSetsB(setsB + 1);
            setScoreA(0); setScoreB(0);
          }
        }
      }, 100);
    }
  };

  const undo = (e) => {
    e.stopPropagation();
    if (history.length > 0) {
      const last = history[history.length - 1];
      setScoreA(last.scoreA); setScoreB(last.scoreB);
      setSetsA(last.setsA); setSetsB(last.setsB);
      setServingTeam(last.servingTeam);
      setHistory(history.slice(0, -1));
    }
  };

  // --- Styles (CSS-in-JS) ---
  const ui = {
    setupBg: {
      height: '100vh', backgroundColor: '#0a0a0c', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif'
    },
    setupCard: {
      backgroundColor: '#16161a', padding: '40px', borderRadius: '32px', textAlign: 'center',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)', width: '350px', border: '1px solid #2d2d35'
    },
    setupButton: {
      width: '100%', padding: '20px', margin: '10px 0', borderRadius: '16px', border: 'none',
      backgroundColor: '#2d2d35', color: 'white', fontSize: '1.2rem', fontWeight: 'bold',
      cursor: 'pointer', transition: '0.2s'
    },
    gameContainer: {
      height: '100vh', width: '100vw', display: 'flex', overflow: 'hidden', fontFamily: 'sans-serif'
    },
    side: (team, isServing) => ({
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', transition: '0.4s', position: 'relative',
      backgroundColor: team === 'A' 
        ? (isServing ? '#d32f2f' : '#4a1111') 
        : (isServing ? '#00897b' : '#00332e'),
    }),
    score: {
      fontSize: '25vw', fontWeight: '900', color: 'white', margin: 0, lineHeight: 1,
      textShadow: '0 10px 30px rgba(0,0,0,0.3)'
    },
    badge: {
      backgroundColor: 'rgba(255,255,255,0.2)', padding: '8px 20px', borderRadius: '100px',
      color: 'white', fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '20px'
    },
    setDot: (active) => ({
      width: '40px', height: '8px', borderRadius: '4px',
      backgroundColor: active ? 'white' : 'rgba(255,255,255,0.2)',
      boxShadow: active ? '0 0 15px white' : 'none'
    })
  };

  // --- หน้าแรก (Setup) ---
  if (!gameStarted) {
    return (
      <div style={ui.setupBg}>
        <div style={ui.setupCard}>
          <div style={{fontSize: '50px', marginBottom: '10px'}}>🏸</div>
          <h1 style={{margin: '0 0 10px 0', fontSize: '28px', fontWeight: '900'}}>BADMINTON PRO</h1>
          <p style={{color: '#666', fontSize: '12px', letterSpacing: '2px', marginBottom: '30px'}}>SELECT SCORE MODE</p>
          {[11, 15, 21].map(pts => (
            <button 
              key={pts} 
              style={ui.setupButton}
              onClick={() => startGame(pts)}
              onMouseOver={(e) => e.target.style.backgroundColor = '#fbbf24'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#2d2d35'}
            >
              {pts} POINTS
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- หน้าเล่นเกม (Game) ---
  return (
    <div style={ui.gameContainer}>
      {/* ทีม A */}
      <div style={ui.side('A', servingTeam === 'A')} onClick={() => addScore('A')}>
        <div style={{position: 'absolute', top: '40px', left: '40px'}}>
          <div style={{color: 'white', fontWeight: 'bold', opacity: 0.6}}>TEAM A</div>
          <div style={{display: 'flex', gap: '8px', mt: '10px'}}>
            <div style={ui.setDot(setsA >= 1)}></div>
            <div style={ui.setDot(setsA >= 2)}></div>
          </div>
        </div>
        
        {servingTeam === 'A' && <div style={ui.badge}>SERVING</div>}
        <h1 style={ui.score}>{scoreA.toString().padStart(2, '0')}</h1>
      </div>

      {/* ทีม B */}
      <div style={ui.side('B', servingTeam === 'B')} onClick={() => addScore('B')}>
        <div style={{position: 'absolute', top: '40px', right: '40px', textAlign: 'right'}}>
          <div style={{color: 'white', fontWeight: 'bold', opacity: 0.6}}>TEAM B</div>
          <div style={{display: 'flex', gap: '8px', mt: '10px', justifyContent: 'flex-end'}}>
            <div style={ui.setDot(setsB >= 1)}></div>
            <div style={ui.setDot(setsB >= 2)}></div>
          </div>
        </div>

        {servingTeam === 'B' && <div style={ui.badge}>SERVING</div>}
        <h1 style={ui.score}>{scoreB.toString().padStart(2, '0')}</h1>
      </div>

      {/* ปุ่ม Undo / Reset */}
      <div style={{
        position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '15px', zIndex: 100
      }}>
        <button onClick={undo} style={{
          padding: '12px 25px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.3)',
          backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', cursor: 'pointer', fontWeight: 'bold'
        }}>รีเช็ตคะแนน</button>
        <button onClick={() => setGameStarted(false)} style={{
          padding: '12px 25px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.3)',
          backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', cursor: 'pointer', fontWeight: 'bold'
        }}>เริ่มเกมใหม่</button>
      </div>

      {/* เส้นแบ่งกลาง */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', width: '2px', height: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)', transform: 'translateX(-50%)'
      }}></div>
    </div>
  );
}

export default App;