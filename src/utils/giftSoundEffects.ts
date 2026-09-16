// Specialized Web Audio API Sound Synthesizer for Royal Gifts
// Every gift shape has a meticulously tuned acoustic signature matching its nature

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. فنجان قهوة ملكية - رنين الفنجان الخزفي وصب رقيق
export function playCoffeeSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Cup rim ping 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2489, now); // D#7 porcelain ping
    gain1.gain.setValueAtTime(0.22, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.38);

    // Cup second clink
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(3135, now + 0.1); // G7
    gain2.gain.setValueAtTime(0.18, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.45);
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 2. قلب الحب - قيثارة رقيقة دافئة
export function playHeartSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Romantic gentle harp arpeggio: C5, E5, G5, B5, C6
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.01, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.75);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 3. نخلة الأصالة ورطب - نسيم الواحة وعزف هادئ
export function playNakhlaSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Desert palm warm wooden chord
    const freqs = [329.63, 392.0, 493.88, 659.25]; // E4, G4, B4, E5
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.01, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.09 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.95);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 4. وردة جورية - رنين زهري فائق الرقة
export function playRoseSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const chimePitches = [1318.51, 1567.98, 1760.0, 2093.0]; // E6, G6, A6, C7
    chimePitches.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.01, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.65);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 5. مسك وعنبر - رشة عطر أثيرية ورنين زجاجي ناعم
export function playPerfumeSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Perfume mist spray (filtered high noise)
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.1));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 4500;
    filter.Q.value = 2.0;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.16, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    // Crystal bottle chime
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1760, now + 0.1);
    gain.gain.setValueAtTime(0.15, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + 0.1);
    osc.stop(now + 0.65);
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 6. خشب عود - نقرة ريشة عود أصيلة
export function playOudSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Arabic Oud Bayati maqam notes: D3, G3, A3, D4
    const notes = [146.83, 196.0, 220.0, 293.66];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, now + idx * 0.07);
      filter.frequency.exponentialRampToValueAtTime(320, now + idx * 0.07 + 0.9);

      gain.gain.setValueAtTime(0.28, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 1.1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 1.15);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 7. دلة رسلان الذهبية - رنين النحاس المذهب التراثي
export function playDallahSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Resonant brass dallah bell chime
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1174.66, now); // D6
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 1.15);

    // Brass harmonic overtone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1760.0, now + 0.05); // A6
    gain2.gain.setValueAtTime(0.18, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.85);
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 8. شجرة الذهب - حفيف أوراق الذهب ورنين بلوري
export function playTreeSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const treeNotes = [1046.5, 1318.5, 1568.0, 2093.0, 2637.0];
    treeNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.15, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.6);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 9. خاتم ياقوت - رنين جوهرة الياقوت والمعدن النفيس
export function playRingSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2637.02, now); // E7 pure crystal ping
    gain.gain.setValueAtTime(0.26, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.65);

    // Jewel sparkle overtone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(3520.0, now + 0.08); // A7
    gain2.gain.setValueAtTime(0.16, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.55);
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 10. سيف دمشقي مذهب - سحب السيف الصقيل ورنين النصل
export function playSwordSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Blade draw whoosh (filtered noise)
    const bufferSize = ctx.sampleRate * 0.18;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(4500, now + 0.16);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    // 2. Steel blade metallic ring
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1864.66, now + 0.08); // A#6
    gain.gain.setValueAtTime(0.24, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + 0.08);
    osc.stop(now + 0.95);
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 11. سحاب وغيوم المطر - صوت قطرات المطر ورعد خفيف في الأفق
export function playCloudsSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Distant warm rolling thunder
    const thunderOsc = ctx.createOscillator();
    const thunderGain = ctx.createGain();
    thunderOsc.type = 'sawtooth';
    thunderOsc.frequency.setValueAtTime(65, now);
    thunderOsc.frequency.exponentialRampToValueAtTime(45, now + 1.2);

    const thunderFilter = ctx.createBiquadFilter();
    thunderFilter.type = 'lowpass';
    thunderFilter.frequency.setValueAtTime(160, now);
    thunderFilter.frequency.exponentialRampToValueAtTime(80, now + 1.2);

    thunderGain.gain.setValueAtTime(0.25, now);
    thunderGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    thunderOsc.connect(thunderFilter);
    thunderFilter.connect(thunderGain);
    thunderGain.connect(ctx.destination);
    thunderOsc.start(now);
    thunderOsc.stop(now + 1.35);

    // Delicate raindrops
    for (let i = 0; i < 6; i++) {
      const dropOsc = ctx.createOscillator();
      const dropGain = ctx.createGain();
      dropOsc.type = 'sine';
      dropOsc.frequency.setValueAtTime(1200 + i * 200, now + 0.1 + i * 0.07);
      dropOsc.frequency.exponentialRampToValueAtTime(600, now + 0.1 + i * 0.07 + 0.05);

      dropGain.gain.setValueAtTime(0.12, now + 0.1 + i * 0.07);
      dropGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1 + i * 0.07 + 0.06);

      dropOsc.connect(dropGain);
      dropGain.connect(ctx.destination);
      dropOsc.start(now + 0.1 + i * 0.07);
      dropOsc.stop(now + 0.1 + i * 0.07 + 0.07);
    }
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 12. تاج الملوك - أبواق التتويج الملكية
export function playCrownSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Royal coronation trumpet fanfare: C5, G5, C6, E6
    const trumpetNotes = [523.25, 783.99, 1046.5, 1318.51];
    trumpetNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.01, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.28, now + idx * 0.1 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.9);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 13. سيارة سوبركار ذهبية - تسارع محرك V12 وانطلاقة رياضية وتوربو
export function playSupercarSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Supercar engine rev acceleration
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.4);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.8);
    osc.frequency.exponentialRampToValueAtTime(180, now + 1.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(2800, now + 0.7);
    filter.frequency.exponentialRampToValueAtTime(800, now + 1.2);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.3);

    // Turbo blow-off valve hiss
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
    }
    const turbo = ctx.createBufferSource();
    turbo.buffer = buffer;
    const turboGain = ctx.createGain();
    turboGain.gain.setValueAtTime(0.18, now + 0.75);
    turboGain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);

    turbo.connect(turboGain);
    turboGain.connect(ctx.destination);
    turbo.start(now + 0.75);
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 14. طائرة خاصة نفاثة - دوي محرك الطائرة النفاثة واختراق الأجواء
export function playJetSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Jet turbine sweep
    const bufferSize = ctx.sampleRate * 1.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.5);
    filter.frequency.exponentialRampToValueAtTime(600, now + 1.1);
    filter.Q.value = 3.0;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.28, now + 0.45);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 15. جوهرة الألماس - رنين كريستالي ألماسي فائق النقاء
export function playDiamondSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const diamondHarmonics = [2093.0, 2637.0, 3135.96, 4186.0]; // C7, E7, G7, C8
    diamondHarmonics.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.18, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.65);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 16. قصر الأساطير الذهبي - لحن القصر الإمبراطوري المهيب
export function playCastleSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Majestic castle brass chords
    const castleChords = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    castleChords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.01, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.24, now + idx * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 1.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 1.15);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 17. صندوق كنز السلطان - فتح القفل الحديدي وتساقط القطع الذهبية
export function playTreasureChestSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // 1. Heavy lock click
    const lockOsc = ctx.createOscillator();
    const lockGain = ctx.createGain();
    lockOsc.type = 'square';
    lockOsc.frequency.setValueAtTime(220, now);
    lockGain.gain.setValueAtTime(0.25, now);
    lockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    lockOsc.connect(lockGain);
    lockGain.connect(ctx.destination);
    lockOsc.start(now);
    lockOsc.stop(now + 0.09);

    // 2. Cascading gold coins clatter
    const coinPitches = [1760, 2093, 2489, 2793, 3135, 3520];
    coinPitches.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + 0.08 + idx * 0.05);

      gain.gain.setValueAtTime(0.2, now + 0.08 + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08 + idx * 0.05 + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + 0.08 + idx * 0.05);
      osc.stop(now + 0.08 + idx * 0.05 + 0.25);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 18. يخت الملياردير الملكي - جرس السفينة البحري وأمواج المحيط
export function playYachtSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Double marine ship bell
    [0, 0.25].forEach((offset) => {
      const bell = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(880, now + offset);
      bellGain.gain.setValueAtTime(0.25, now + offset);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.8);
      bell.connect(bellGain);
      bellGain.connect(ctx.destination);
      bell.start(now + offset);
      bell.stop(now + offset + 0.85);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 19. أسد الصحراء الملكي - زئير الأسد المهيب
export function playLionSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Powerful resonant lion roar
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.4);
    osc.frequency.exponentialRampToValueAtTime(75, now + 1.2);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(750, now + 0.5);
    filter.frequency.exponentialRampToValueAtTime(320, now + 1.2);
    filter.Q.value = 4.0;

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.35);
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 20. عرش الملوك الأسطوري - أبواق المراسم السلطانية الكبرى
export function playThroneSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.01, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.26, now + idx * 0.12 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 1.25);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 21. صاروخ المجرات - انطلاق محركات الدفع الصاروخية
export function playRocketSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 1.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, now);
    filter.frequency.exponentialRampToValueAtTime(2500, now + 0.6);
    filter.frequency.exponentialRampToValueAtTime(400, now + 1.2);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 22. مجرة الكواكب - أثير كوني عميق ودوران الأفلاك
export function playGalaxySound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    // Deep cosmic harmonic pad
    const cosmicNotes = [130.81, 196.0, 261.63, 392.0, 523.25]; // C3, G3, C4, G4, C5
    cosmicNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0.01, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.18, now + idx * 0.1 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 1.55);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 23. صقر حر شامخ
export function playFalconSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const falconPitches = [1174.66, 1760.0, 2093.0];
    falconPitches.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + idx * 0.05 + 0.15);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + idx * 0.05 + 0.65);

      gain.gain.setValueAtTime(0.01, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.24, now + idx * 0.05 + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.75);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

// 24. تنين أسطوري
export function playDragonSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const bassNotes = [110, 146.83, 220];
    bassNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + idx * 0.06 + 0.5);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.75, now + idx * 0.06 + 1.4);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + 0.4);
      filter.frequency.exponentialRampToValueAtTime(350, now + 1.4);

      gain.gain.setValueAtTime(0.01, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.28, now + idx * 0.06 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 1.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 1.55);
    });
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

/**
 * Main dispatcher: plays EXACTLY and ONLY the sound appropriate to this specific gift shape.
 * Never plays mismatched sounds.
 */
export function playDedicatedGiftSound(gift: { id?: string; nameAr?: string; nameEn?: string; icon?: string; animationType?: string }) {
  const id = (gift.id || '').toLowerCase();
  const nameAr = (gift.nameAr || '').toLowerCase();
  const nameEn = (gift.nameEn || '').toLowerCase();
  const icon = (gift.icon || '').toLowerCase();
  const anim = (gift.animationType || '').toLowerCase();

  // 1. Coffee
  if (id.includes('coffee') || nameAr.includes('قهوة') || nameEn.includes('coffee') || icon.includes('coffee')) {
    playCoffeeSound();
    return;
  }

  // 2. Heart
  if (id.includes('heart') || nameAr.includes('قلب') || nameEn.includes('heart') || icon.includes('heart')) {
    playHeartSound();
    return;
  }

  // 3. Palm & Dates
  if (id.includes('date') || id.includes('nakhla') || nameAr.includes('نخل') || nameAr.includes('رطب') || icon.includes('nakhla')) {
    playNakhlaSound();
    return;
  }

  // 4. Rose
  if (id.includes('rose') || nameAr.includes('ورد') || nameEn.includes('rose') || icon.includes('rose') || anim === 'rose_shower') {
    playRoseSound();
    return;
  }

  // 5. Perfume / Musk
  if (id.includes('perfume') || id.includes('musk') || nameAr.includes('مسك') || nameAr.includes('عنبر') || nameAr.includes('عطر') || icon.includes('musk')) {
    playPerfumeSound();
    return;
  }

  // 6. Oud Wood
  if (id.includes('oud') || id.includes('wood') || nameAr.includes('عود') || nameEn.includes('oud') || icon.includes('wood')) {
    playOudSound();
    return;
  }

  // 7. Dallah
  if (id.includes('dallah') || id.includes('kettle') || nameAr.includes('دلة') || nameEn.includes('dallah') || icon.includes('kettle')) {
    playDallahSound();
    return;
  }

  // 8. Tree
  if (id.includes('tree') || nameAr.includes('شجرة') || nameEn.includes('tree') || icon.includes('tree')) {
    playTreeSound();
    return;
  }

  // 9. Ring
  if (id.includes('ring') || nameAr.includes('خاتم') || nameEn.includes('ring') || icon.includes('ring')) {
    playRingSound();
    return;
  }

  // 10. Sword
  if (id.includes('sword') || nameAr.includes('سيف') || nameEn.includes('sword') || icon.includes('sword') || anim === 'swords') {
    playSwordSound();
    return;
  }

  // 11. Clouds / Rain
  if (id.includes('cloud') || nameAr.includes('سحاب') || nameAr.includes('غيم') || nameAr.includes('مطر') || icon.includes('cloud') || anim === 'rain') {
    playCloudsSound();
    return;
  }

  // 12. Crown
  if (id.includes('crown') || nameAr.includes('تاج') || nameEn.includes('crown') || icon.includes('crown') || anim === 'crown_burst') {
    playCrownSound();
    return;
  }

  // 13. Supercar
  if (id.includes('car') || id.includes('supercar') || nameAr.includes('سيارة') || nameAr.includes('سوبركار') || icon.includes('car') || anim === 'supercar') {
    playSupercarSound();
    return;
  }

  // 14. Private Jet
  if (id.includes('jet') || id.includes('airplane') || nameAr.includes('طائرة') || nameEn.includes('jet') || icon.includes('airplane') || anim === 'jet') {
    playJetSound();
    return;
  }

  // 15. Diamond
  if (id.includes('diamond') || nameAr.includes('ألماس') || nameEn.includes('diamond') || icon.includes('diamond') || anim === 'diamond_rain') {
    playDiamondSound();
    return;
  }

  // 16. Castle / Palace
  if (id.includes('castle') || id.includes('palace') || nameAr.includes('قصر') || nameEn.includes('castle') || icon.includes('castle')) {
    playCastleSound();
    return;
  }

  // 17. Treasure Chest
  if (id.includes('treasure') || id.includes('chest') || nameAr.includes('صندوق') || nameAr.includes('كنز') || icon.includes('treasure') || anim === 'treasure_chest') {
    playTreasureChestSound();
    return;
  }

  // 18. Yacht
  if (id.includes('yacht') || nameAr.includes('يخت') || nameEn.includes('yacht') || icon.includes('yacht') || anim === 'yacht') {
    playYachtSound();
    return;
  }

  // 19. Lion
  if (id.includes('lion') || nameAr.includes('أسد') || nameEn.includes('lion') || icon.includes('lion')) {
    playLionSound();
    return;
  }

  // 20. Throne
  if (id.includes('throne') || nameAr.includes('عرش') || nameEn.includes('throne') || icon.includes('the-throne') || anim === 'golden_throne') {
    playThroneSound();
    return;
  }

  // 21. Rocket
  if (id.includes('rocket') || nameAr.includes('صاروخ') || nameEn.includes('rocket') || icon.includes('rocket') || anim === 'rocket') {
    playRocketSound();
    return;
  }

  // 22. Galaxy / Planets
  if (id.includes('galaxy') || id.includes('planet') || nameAr.includes('مجرة') || nameAr.includes('كواكب') || icon.includes('planet') || anim === 'galaxy') {
    playGalaxySound();
    return;
  }

  // 23. Falcon
  if (id.includes('falcon') || nameAr.includes('صقر') || nameEn.includes('falcon') || anim === 'falcon') {
    playFalconSound();
    return;
  }

  // 24. Dragon
  if (id.includes('dragon') || nameAr.includes('تنين') || nameEn.includes('dragon') || anim === 'dragon') {
    playDragonSound();
    return;
  }

  // Fallback: gentle, non-intrusive crystal bell
  playRingSound();
}
