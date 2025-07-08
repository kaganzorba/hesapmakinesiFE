import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  // State
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [fresh, setFresh] = useState(true);
  const screenRef = useRef(null);

  // Binlik ayraçlı gösterim
  function pretty(n) {
    if (n === 'Hata') return 'Hata';
    if (n === '') return '0';
    let [int, dec] = n.replace(/,/g, '.').split('.');
    const neg = int.startsWith('-');
    if (neg) int = int.slice(1);
    const f = (neg ? '-' : '') + Number(int).toLocaleString('tr-TR');
    return dec !== undefined ? `${f},${dec}` : f;
  }

  // Klavye desteği
  useEffect(() => {
    function key(e) {
      if (/^[0-9]$/.test(e.key)) {
        num(e.key);
      } else if (e.key === '.' || e.key === ',') {
        num('.')
      } else if ('+-*/xX÷'.includes(e.key)) {
        let o = e.key;
        if (o === 'x' || o === 'X') o = '*';
        if (o === '÷') o = '/';
        setOpNow(o);
      } else if (e.key === 'Enter' || e.key === '=') {
        calc();
      } else if (e.key === 'c' || e.key === 'C') {
        clr();
      } else if (e.key === 'Backspace') {
        del();
      }
    }
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [display, fresh, prev, op]);

  // Rakam
  function num(val) {
    if (val === '.' && display.includes('.')) return;
    if (fresh) {
      setDisplay(val === '.' ? '0.' : val);
      setFresh(false);
    } else {
      setDisplay(display === '0' && val !== '.' ? val : display + val);
    }
  }

  // İşlem
  function setOpNow(o) {
    setPrev(parseFloat(display.replace(/\./g, '').replace(',', '.')));
    setOp(o);
    setFresh(true);
  }

  // Hesapla
  function calc() {
    if (prev === null || op === null) return;
    const cur = parseFloat(display.replace(/\./g, '').replace(',', '.'));
    let res = 0;
    switch (op) {
      case '+': res = prev + cur; break;
      case '-': res = prev - cur; break;
      case '*': res = prev * cur; break;
      case '/': res = cur !== 0 ? prev / cur : 'Hata'; break;
      default: return;
    }
    setDisplay(String(res).replace('.', ','));
    setOp(null);
    setPrev(null);
    setFresh(true);
  }

  // Temizle
  function clr() {
    setDisplay('0');
    setPrev(null);
    setOp(null);
    setFresh(true);
  }

  // Sil
  function del() {
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
      setFresh(true);
    } else {
      setDisplay(display.slice(0, -1));
    }
  }

  // Ekran kaydırma
  useEffect(() => {
    if (screenRef.current) {
      screenRef.current.scrollLeft = screenRef.current.scrollWidth;
    }
  }, [display]);

  return (
    <div className="hesap-makinesi">
      <h1>Hesap Makinesi</h1>
      <div className="ekran" ref={screenRef} tabIndex={-1}>
        {pretty(display)}
      </div>
      <div className="tuslar">
        <div className="rakamlar">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((n) => (
            <button key={n} onClick={() => num(String(n))}>{n}</button>
          ))}
          <button onClick={() => num('.')}>.</button>
        </div>
        <div className="islemler">
          <button onClick={() => setOpNow('+')}>+</button>
          <button onClick={() => setOpNow('-')}>-</button>
          <button onClick={() => setOpNow('*')}>×</button>
          <button onClick={() => setOpNow('/')}>÷</button>
          <button onClick={calc}>=</button>
          <button onClick={clr}>C</button>
          <button onClick={del}>←</button>
        </div>
      </div>
    </div>
  );
}

export default App;