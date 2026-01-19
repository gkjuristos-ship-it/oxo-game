// Звуковой движок в стиле 1950-х компьютеров
// Использует Web Audio API для генерации ретро-звуков

let audioContext: AudioContext | null = null;

interface WindowWithWebkit extends Window {
  webkitAudioContext?: typeof AudioContext;
}

function getAudioContext(): AudioContext {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || (window as WindowWithWebkit).webkitAudioContext;
    if (AudioContextClass) {
      audioContext = new AudioContextClass();
    }
  }
  return audioContext!;
}

// Создать осциллятор с заданными параметрами
function createOscillator(
  type: OscillatorType,
  frequency: number,
  duration: number,
  volume: number = 0.3
): void {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

// Клик роторного диска
export function playDialClick(): void {
  createOscillator('square', 800, 0.02, 0.15);
  setTimeout(() => createOscillator('square', 600, 0.02, 0.1), 15);
}

// Звук отпускания диска (возврат)
export function playDialReturn(): void {
  const clicks = 6;
  for (let i = 0; i < clicks; i++) {
    setTimeout(() => {
      createOscillator('square', 400 + Math.random() * 100, 0.015, 0.08);
    }, i * 40);
  }
}

// Бип при ходе игрока
export function playPlayerMove(): void {
  createOscillator('sine', 880, 0.1, 0.2);
  setTimeout(() => createOscillator('sine', 1100, 0.15, 0.15), 80);
}

// Бип при ходе компьютера (более низкий)
export function playComputerMove(): void {
  createOscillator('sawtooth', 220, 0.15, 0.15);
  setTimeout(() => createOscillator('sawtooth', 180, 0.2, 0.12), 100);
}

// Звук победы
export function playWin(): void {
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => createOscillator('sine', freq, 0.3, 0.2), i * 150);
  });
}

// Звук проигрыша
export function playLose(): void {
  const notes = [440, 349, 294, 220]; // A4, F4, D4, A3
  notes.forEach((freq, i) => {
    setTimeout(() => createOscillator('sawtooth', freq, 0.25, 0.15), i * 180);
  });
}

// Звук ничьей (победа по правилам!)
export function playDraw(): void {
  const notes = [440, 554, 659, 880]; // A4, C#5, E5, A5
  notes.forEach((freq, i) => {
    setTimeout(() => createOscillator('triangle', freq, 0.25, 0.18), i * 120);
  });
}

// Мелодия загрузки (в стиле первой компьютерной музыки 1951)
// Вдохновлено Manchester Mark 1 "God Save the King"
export function playBootSequence(volume: number = 0.2): void {
  // Простая мелодия в стиле 1951 года
  const melody = [
    { freq: 392, dur: 0.2 }, // G4
    { freq: 392, dur: 0.2 }, // G4
    { freq: 440, dur: 0.2 }, // A4
    { freq: 349, dur: 0.3 }, // F4
    { freq: 392, dur: 0.2 }, // G4
    { freq: 440, dur: 0.2 }, // A4
    { freq: 494, dur: 0.4 }, // B4
    { freq: 523, dur: 0.5 }, // C5
  ];
  
  let time = 0;
  melody.forEach(note => {
    setTimeout(() => {
      createOscillator('square', note.freq, note.dur * 0.9, volume * 0.5);
    }, time * 1000);
    time += note.dur;
  });
}

// Звук реле/процессора (для эффекта "думания")
export function playProcessing(): void {
  const duration = 0.8;
  const clicks = 15;
  
  for (let i = 0; i < clicks; i++) {
    setTimeout(() => {
      const freq = 100 + Math.random() * 200;
      createOscillator('square', freq, 0.02, 0.05);
    }, (i / clicks) * duration * 1000);
  }
}

// Звук нажатия кнопки
export function playButtonPress(): void {
  createOscillator('square', 150, 0.05, 0.1);
  setTimeout(() => createOscillator('square', 200, 0.03, 0.08), 30);
}

// Звук переключателя/крутилки
export function playKnobClick(): void {
  createOscillator('square', 300, 0.02, 0.12);
}

// Инициализация аудио (нужно вызвать после пользовательского действия)
export function initAudio(): void {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
}
