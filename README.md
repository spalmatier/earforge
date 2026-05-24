# 🎼 EarForge

EarForge is an interactive web-based ear training and music theory tool focused on interval recognition, construction, and staff-based interaction.

Built with React, Vite, and VexFlow, it combines visual notation, audio playback, and interactive learning into a single exploratory experience.

---

## ✨ Features

### 🎯 Interval Training
- Random interval generation (e.g. 3rd, 5th, octave)
- Root note selection and interval targeting
- Built-in answer checking system

### 🎹 Audio Playback
- Melodic interval playback (sequential notes)
- Harmonic interval playback (simultaneous tones)
- Web Audio API synthesis

### 🎼 Music Notation (VexFlow)
- Real staff rendering using VexFlow
- Treble and bass clef support
- Key signature display
- Dynamic note rendering system

### 🧠 Learning Modes
- **Build Mode**: interactive interval construction on staff (prototype stage)
- **Explore Mode**: interval auditioning and selection

### 🎵 Core Music Theory Support
- Chromatic note handling
- Basic octave mapping system
- Interval transposition logic
- Key selection framework (in progress)

---

## 🧪 Tech Stack

- React
- Vite
- VexFlow (music notation rendering)
- Web Audio API

---

## ⚠️ Current Status

This project is in **active development (v0.1 prototype stage)**.

The current version includes a fully functional but tightly coupled prototype that integrates:
- notation rendering
- audio synthesis
- interval generation
- interactive UI experimentation

A refactor into modular architecture is in progress to improve maintainability and expandability.

---

## 🚧 Planned Improvements

- Fully accurate staff-to-pitch mapping system
- Proper ledger line support
- Improved build mode interaction model
- Chord construction mode
- Adaptive difficulty system
- Better separation of music theory engine and UI layer
- Mobile responsiveness improvements

---

## 🧠 Philosophy

EarForge is designed around the idea that ear training is best learned through:
- interaction, not memorization
- visual + auditory reinforcement
- incremental exploration of theory

---

## 📦 Setup

```bash
npm install
npm run dev
