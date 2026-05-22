import React from "react";

export default function IntervalTrainerPrototype() {
  const intervals = [
    { name: "Major Third", semitones: 4 },
    { name: "Minor Third", semitones: 3 },
    { name: "Perfect Fifth", semitones: 7 },
    { name: "Tritone", semitones: 6 }
  ];

  const tonic = {
    name: "C4",
    frequency: 261.63
  };

  const [selectedInterval, setSelectedInterval] = React.useState(intervals[0]);
  const [mode, setMode] = React.useState("explore");
  const [feedback, setFeedback] = React.useState("");
  const [showStaff, setShowStaff] = React.useState(false);

  // 🎼 STAFF NOTE POSITIONS
  function getIntervalNote(semitones) {
    const map = {
      // Eb4
      3: {
        note: "Eb4",
        position: 130
      },

      // E4 (bottom line)
      4: {
        note: "E4",
        position: 120
      },

      // F#4
      6: {
        note: "F#4",
        position: 110
      },

      // G4
      7: {
        note: "G4",
        position: 100
      }
    };

    return map[semitones];
  }

  // 🎧 PLAY SINGLE NOTE
  function playTone(freq, duration = 800) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = freq;

    gain.gain.value = 0.08;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();

    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, duration);
  }

  // 🎧 PLAY INTERVAL
  function playInterval(semitones, direction = "ascending") {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();

    const base = tonic.frequency;
    const second = base * Math.pow(2, semitones / 12);

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";

    gain.gain.value = 0.08;

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    if (direction === "ascending") {
      osc1.frequency.value = base;
      osc2.frequency.value = second;
    } else {
      osc1.frequency.value = second;
      osc2.frequency.value = base;
    }

    osc1.start();

    setTimeout(() => {
      osc2.start();
    }, 500);

    setTimeout(() => {
      osc1.stop();
      osc2.stop();
      ctx.close();
    }, 1800);
  }

  // 🎹 PLAY TONIC
  function playTonic() {
    playTone(tonic.frequency);
  }

  // ▶ PLAY CURRENT INTERVAL
  function playSelected() {
    playInterval(selectedInterval.semitones);
    setFeedback("");
  }

  // 🔁 COMPARE ALL INTERVALS
  function compareAll() {
    intervals.forEach((interval, idx) => {
      setTimeout(() => {
        setSelectedInterval(interval);
        playInterval(interval.semitones);
      }, idx * 2500);
    });
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>🎵 Interval Explorer</h1>

        {/* MODE BUTTONS */}
        <div style={styles.modeRow}>
          <button
            style={mode === "explore" ? styles.activeBtn : styles.btn}
            onClick={() => setMode("explore")}
          >
            Explore
          </button>

          <button
            style={mode === "challenge" ? styles.activeBtn : styles.btn}
            onClick={() => setMode("challenge")}
          >
            Challenge
          </button>
        </div>

        {/* INFO */}
        <div style={styles.infoBox}>
          <div>
            <b>Tonic:</b> {tonic.name}
          </div>

          <div>
            <b>Clef:</b> Treble Clef
          </div>
        </div>

        {/* AUDIO CONTROLS */}
        <button style={styles.playBtn} onClick={playTonic}>
          🎹 Play Tonic
        </button>

        <button style={styles.playBtn} onClick={playSelected}>
          ▶ Play Interval
        </button>

        <button style={styles.secondaryBtn} onClick={compareAll}>
          🔁 Compare All
        </button>

        {/* STAFF TOGGLE */}
        <button
          style={styles.secondaryBtn}
          onClick={() => setShowStaff(!showStaff)}
        >
          {showStaff ? "🙈 Hide Staff Notation" : "🎼 Show Staff Notation"}
        </button>

        {/* INTERVAL SELECTOR */}
        <div style={styles.grid}>
          {intervals.map((interval) => (
            <button
              key={interval.name}
              onClick={() => setSelectedInterval(interval)}
              style={
                selectedInterval.name === interval.name
                  ? styles.activeInterval
                  : styles.intervalBtn
              }
            >
              {interval.name}
            </button>
          ))}
        </div>

        {/* INTERVAL INFO */}
        <div style={styles.infoBox}>
          <div>
            <b>Selected:</b> {selectedInterval.name}
          </div>

          <div>
            <b>Semitones:</b> {selectedInterval.semitones}
          </div>
        </div>

        {/* STAFF NOTATION */}
        {showStaff && (
          <div style={styles.staffContainer}>
            <svg
              width="320"
              height="180"
              viewBox="0 0 320 180"
            >
              {/* STAFF LINES */}
              {[40, 60, 80, 100, 120].map((y) => (
                <line
                  key={y}
                  x1="60"
                  y1={y}
                  x2="280"
                  y2={y}
                  stroke="white"
                  strokeWidth="2"
                />
              ))}

              {/* TREBLE CLEF */}
              <text
                x="65"
                y="105"
                fontSize="64"
                fill="white"
              >
                𝄞
              </text>

              {/* C4 LEDGER LINE */}
              <line
                x1="108"
                y1="140"
                x2="132"
                y2="140"
                stroke="white"
                strokeWidth="2"
              />

              {/* TONIC NOTE */}
              <ellipse
                cx="120"
                cy="140"
                rx="8"
                ry="6"
                fill="#4caf50"
              />

              {/* INTERVAL NOTE */}
              <ellipse
                cx="210"
                cy={getIntervalNote(selectedInterval.semitones).position}
                rx="8"
                ry="6"
                fill="#ff9800"
              />

              {/* NOTE LABELS */}
              <text
                x="108"
                y="165"
                fill="white"
                fontSize="12"
              >
                C4
              </text>

              <text
                x="198"
                y="165"
                fill="white"
                fontSize="12"
              >
                {getIntervalNote(selectedInterval.semitones).note}
              </text>
            </svg>
          </div>
        )}

        {/* FEEDBACK */}
        <div style={styles.feedback}>
          {mode === "explore"
            ? "Explore freely — listen, compare, and repeat."
            : "Challenge mode coming later."}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f0f0f",
    color: "white",
    fontFamily: "Arial"
  },

  card: {
    width: "360px",
    padding: "18px",
    background: "#1e1e1e",
    borderRadius: "12px",
    textAlign: "center"
  },

  modeRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "10px"
  },

  btn: {
    flex: 1,
    padding: "8px",
    background: "#333",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  activeBtn: {
    flex: 1,
    padding: "8px",
    background: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  playBtn: {
    margin: "6px 0",
    padding: "10px",
    width: "100%",
    background: "#2196f3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  secondaryBtn: {
    margin: "6px 0",
    padding: "10px",
    width: "100%",
    background: "#555",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    marginTop: "10px"
  },

  intervalBtn: {
    padding: "8px",
    background: "#2a2a2a",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  activeInterval: {
    padding: "8px",
    background: "#ff9800",
    color: "black",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  infoBox: {
    marginTop: "10px",
    padding: "8px",
    background: "#111",
    borderRadius: "6px",
    fontSize: "12px",
    opacity: 0.9
  },

  staffContainer: {
    marginTop: "12px",
    padding: "10px",
    background: "#111",
    borderRadius: "8px",
    minHeight: "200px"
  },

  feedback: {
    marginTop: "10px",
    fontSize: "12px",
    opacity: 0.8
  }
}