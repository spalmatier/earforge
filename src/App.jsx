import React from "react";

import {
  Renderer,
  Stave,
  StaveNote,
  Voice,
  Formatter,
  Accidental
} from "vexflow";

/* =====================================
   MUSIC DATA
===================================== */

const NOTES = [
  "C",
  "C#",
  "D",
  "Eb",
  "E",
  "F",
  "F#",
  "G",
  "Ab",
  "A",
  "Bb",
  "B"
];

const INTERVALS = [
  {
    name: "Major 2nd",
    semitones: 2
  },
  {
    name: "Minor 3rd",
    semitones: 3
  },
  {
    name: "Major 3rd",
    semitones: 4
  },
  {
    name: "Perfect 5th",
    semitones: 7
  },
  {
    name: "Octave",
    semitones: 12
  }
];

const KEYS = [
  "C",
  "G",
  "D",
  "A",
  "E",
  "F",
  "Bb",
  "Eb",
  "Ab"
];

/* =====================================
   STAFF NOTE MAPS
===================================== */

const TREBLE_NOTES = [
  "E",
  "F",
  "G",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G"
];

const BASS_NOTES = [
  "G",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "A",
  "B"
];

/* =====================================
   AUDIO
===================================== */

function createAudioContext() {
  return new (window.AudioContext ||
    window.webkitAudioContext)();
}

function noteToFrequency(note) {
  const map = {
    C: 261.63,
    "C#": 277.18,
    D: 293.66,
    Eb: 311.13,
    E: 329.63,
    F: 349.23,
    "F#": 369.99,
    G: 392.0,
    Ab: 415.3,
    A: 440.0,
    Bb: 466.16,
    B: 493.88
  };

  return map[note] || 261.63;
}

function playTone(freq, duration = 800) {
  const ctx = createAudioContext();

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

function playMelodic(root, target) {
  const ctx = createAudioContext();

  const o1 = ctx.createOscillator();
  const o2 = ctx.createOscillator();

  const gain = ctx.createGain();

  gain.gain.value = 0.08;

  o1.frequency.value = noteToFrequency(root);
  o2.frequency.value = noteToFrequency(target);

  o1.connect(gain);
  o2.connect(gain);

  gain.connect(ctx.destination);

  o1.start();

  setTimeout(() => {
    o2.start();
  }, 500);

  setTimeout(() => {
    o1.stop();
    o2.stop();
    ctx.close();
  }, 1600);
}

function playHarmonic(root, target) {
  const ctx = createAudioContext();

  const o1 = ctx.createOscillator();
  const o2 = ctx.createOscillator();

  const gain = ctx.createGain();

  gain.gain.value = 0.08;

  o1.frequency.value = noteToFrequency(root);
  o2.frequency.value = noteToFrequency(target);

  o1.connect(gain);
  o2.connect(gain);

  gain.connect(ctx.destination);

  o1.start();
  o2.start();

  setTimeout(() => {
    o1.stop();
    o2.stop();
    ctx.close();
  }, 1500);
}

/* =====================================
   VEXFLOW HELPERS
===================================== */

function makeNote(note, octave, clef) {
  const staveNote = new StaveNote({
    clef,
    keys: [`${note}/${octave}`],
    duration: "q"
  });

  if (note.includes("#")) {
    staveNote.addModifier(
      new Accidental("#"),
      0
    );
  }

  if (note.includes("b")) {
    staveNote.addModifier(
      new Accidental("b"),
      0
    );
  }

  return staveNote;
}

function drawStaff(
  container,
  clef,
  key,
  notes
) {
  if (!container) return;

  container.innerHTML = "";

  const renderer = new Renderer(
    container,
    Renderer.Backends.SVG
  );

  renderer.resize(520, 240);

  const context = renderer.getContext();

  const stave = new Stave(10, 40, 480);

  stave.addClef(clef);
  stave.addKeySignature(key);

  stave.setContext(context).draw();

  if (!notes || notes.length === 0) return;

  const voice = new Voice({
    num_beats: notes.length,
    beat_value: 4
  });

  voice.setStrict(false);

  voice.addTickables(notes);

  new Formatter()
    .joinVoices([voice])
    .format([voice], 350);

  voice.draw(context, stave);
}

/* =====================================
   APP
===================================== */

export default function App() {
  const [mode, setMode] =
    React.useState("build");

  const [clef, setClef] =
    React.useState("treble");

  const [key, setKey] =
    React.useState("C");

  const [playMode, setPlayMode] =
    React.useState("melodic");

  const [rootNote, setRootNote] =
    React.useState("C");

  const [targetNote, setTargetNote] =
    React.useState("G");

  const [interval, setInterval] =
    React.useState(INTERVALS[0]);

  const [selectedNote, setSelectedNote] =
    React.useState(null);

  const [feedback, setFeedback] =
    React.useState("");

  const staffRef = React.useRef(null);

  /* =====================================
     GAME LOGIC
  ===================================== */

  function transpose(rootIndex, semitones) {
    return NOTES[
      (rootIndex + semitones) %
        NOTES.length
    ];
  }

  function newChallenge() {
    const randomInterval =
      INTERVALS[
        Math.floor(
          Math.random() *
            INTERVALS.length
        )
      ];

    const randomRoot =
      NOTES[
        Math.floor(
          Math.random() * NOTES.length
        )
      ];

    const rootIndex =
      NOTES.indexOf(randomRoot);

    const target = transpose(
      rootIndex,
      randomInterval.semitones
    );

    setRootNote(randomRoot);
    setTargetNote(target);
    setInterval(randomInterval);

    setSelectedNote(null);
    setFeedback("");
  }

  function checkAnswer() {
    if (selectedNote === targetNote) {
      setFeedback("✅ Correct!");
    } else {
      setFeedback(
        `❌ Correct answer was ${targetNote}`
      );
    }
  }

  function handleStaffClick(event) {
    if (!staffRef.current) return;

    const rect =
      staffRef.current.getBoundingClientRect();

    const y =
      event.clientY - rect.top;

    const noteMap =
      clef === "bass"
        ? BASS_NOTES
        : TREBLE_NOTES;
    // Map the click Y proportionally into the note map.
    // Use a normalized ratio so the mapping works for different sizes.
    const ratio = y / rect.height;

    // Invert ratio so top of the container maps to the start
    // of the note array in the same direction as before.
    let index = Math.floor((1 - ratio) * noteMap.length);

    index = Math.max(0, Math.min(noteMap.length - 1, index));

    const clickedNote = noteMap[index];

    setSelectedNote(clickedNote);
  }

  /* =====================================
     INITIAL CHALLENGE
  ===================================== */

  React.useEffect(() => {
    newChallenge();
  }, []);

  /* =====================================
     DRAW STAFF
  ===================================== */

  React.useEffect(() => {
    if (!staffRef.current) return;

    const octave =
      clef === "bass" ? 3 : 4;

    let notes = [];

    if (mode === "build") {
      notes.push(
        makeNote(
          rootNote,
          octave,
          clef
        )
      );

      if (selectedNote) {
        notes.push(
          makeNote(
            selectedNote,
            octave,
            clef
          )
        );
      }
    } else {
      notes = [
        makeNote(
          rootNote,
          octave,
          clef
        ),
        makeNote(
          targetNote,
          octave,
          clef
        )
      ];
    }

    drawStaff(
      staffRef.current,
      clef,
      key,
      notes
    );
  }, [
    rootNote,
    targetNote,
    selectedNote,
    clef,
    key,
    mode
  ]);

  /* =====================================
     UI
  ===================================== */

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>🎼 EarForge</h1>

        {/* INSTRUCTIONS */}
        <div style={styles.instructions}>
          <h3>How to Play</h3>

          <p>
            Listen to the interval and
            build it on the staff.
          </p>

          <ul>
            <li>
              <strong>Melodic:</strong>{" "}
              notes play one after
              another
            </li>

            <li>
              <strong>Harmonic:</strong>{" "}
              notes play together
            </li>

            <li>
              Click the staff to place
              your answer note.
            </li>
          </ul>
        </div>

        {/* MODE */}
        <div style={styles.row}>
          <button
            onClick={() =>
              setMode("build")
            }
            style={{
              background:
                mode === "build"
                  ? "#2d8659"
                  : "#333"
            }}
          >
            Build
          </button>

          <button
            onClick={() =>
              setMode("explore")
            }
            style={{
              background:
                mode === "explore"
                  ? "#2d8659"
                  : "#333"
            }}
          >
            Explore
          </button>
        </div>

        {/* KEY + CLEF */}
        <div style={styles.row}>
          <select
            value={clef}
            onChange={(e) =>
              setClef(
                e.target.value
              )
            }
          >
            <option value="treble">
              Treble
            </option>

            <option value="bass">
              Bass
            </option>
          </select>

          <select
            value={key}
            onChange={(e) =>
              setKey(e.target.value)
            }
          >
            {KEYS.map((k) => (
              <option key={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        {/* PLAY MODE */}
        <div style={styles.row}>
          <button
            onClick={() =>
              setPlayMode(
                "melodic"
              )
            }
            style={{
              background:
                playMode ===
                "melodic"
                  ? "#2d8659"
                  : "#333"
            }}
          >
            Melodic
          </button>

          <button
            onClick={() =>
              setPlayMode(
                "harmonic"
              )
            }
            style={{
              background:
                playMode ===
                "harmonic"
                  ? "#2d8659"
                  : "#333"
            }}
          >
            Harmonic
          </button>
        </div>

        {/* INTERVAL INFO */}
        <div style={styles.box}>
          <div>
            <strong>Root:</strong>{" "}
            {rootNote}
          </div>

          <div>
            <strong>Interval:</strong>{" "}
            {interval.name}
          </div>
        </div>

        {/* EXPLORE MODE */}
        {mode === "explore" && (
          <div style={styles.box}>
            <h3>
              Explore Intervals
            </h3>

            <select
              value={interval.name}
              onChange={(e) => {
                const selected =
                  INTERVALS.find(
                    (i) =>
                      i.name ===
                      e.target.value
                  );

                if (!selected)
                  return;

                const rootIndex =
                  NOTES.indexOf(
                    rootNote
                  );

                const target =
                  transpose(
                    rootIndex,
                    selected.semitones
                  );

                setInterval(
                  selected
                );

                setTargetNote(
                  target
                );
              }}
            >
              {INTERVALS.map(
                (i) => (
                  <option
                    key={i.name}
                  >
                    {i.name}
                  </option>
                )
              )}
            </select>
          </div>
        )}

        {/* AUDIO */}
        <div style={styles.row}>
          <button
            onClick={() =>
              playTone(
                noteToFrequency(
                  rootNote
                )
              )
            }
          >
            Play Root
          </button>

          <button
            onClick={() => {
              if (
                playMode ===
                "melodic"
              ) {
                playMelodic(
                  rootNote,
                  targetNote
                );
              } else {
                playHarmonic(
                  rootNote,
                  targetNote
                );
              }
            }}
          >
            Play Interval
          </button>
        </div>

        {/* BUILD MODE */}
        {mode === "build" && (
          <div style={styles.box}>
            <h3>
              Build the Interval
            </h3>

            <p>
              Click on the staff
              to place the target
              note.
            </p>

            <div
              style={{
                marginTop: 10
              }}
            >
              Selected Note:{" "}
              <strong>
                {selectedNote ||
                  "None"}
              </strong>
            </div>

            <div
              style={styles.row}
            >
              <button
                onClick={
                  checkAnswer
                }
              >
                Check
              </button>

              <button
                onClick={
                  newChallenge
                }
              >
                New Challenge
              </button>
            </div>

            <div
              style={{
                marginTop: 10
              }}
            >
              {feedback}
            </div>
          </div>
        )}

        {/* STAFF */}
        <div
          ref={staffRef}
          style={styles.staff}
          onClick={
            handleStaffClick
          }
        />
      </div>
    </div>
  );
}

/* =====================================
   STYLES
===================================== */

const styles = {
  container: {
    minHeight: "100vh",
    background: "#111",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },

  card: {
    width: 720,
    background: "#1d1d1d",
    padding: 20,
    borderRadius: 12
  },

  row: {
    display: "flex",
    gap: 10,
    marginTop: 10,
    flexWrap: "wrap"
  },

  box: {
    marginTop: 15,
    padding: 15,
    background: "#252525",
    borderRadius: 8
  },

  instructions: {
    background: "#252525",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15
  },

  staff: {
    marginTop: 20,
    minHeight: 240,
    background: "white",
    borderRadius: 8,
    cursor: "pointer"
  }
};