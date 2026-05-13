import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Check,
  ChevronRight,
  Ear,
  Flame,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Volume2,
  Zap,
} from "lucide-react";
import "./styles.css";

const EXERCISES = [
  {
    id: "warmup",
    type: "Warm-up",
    icon: Ear,
    eyebrow: "Ease in",
    title: "Find your lifted R",
    prompt: "Say it slowly: errr — tongue high and wide, not curled back. One easy rep.",
    action: "I practiced it",
    feedback: {
      correct: "Nice. Slow reps build the motor pattern. You're doing it right.",
      incorrect: "No stress. Relax the jaw, lift the tongue high, try once more.",
    },
  },
  {
    id: "choose",
    type: "Word selection",
    icon: Target,
    eyebrow: "Find the target",
    title: "Which word has a middle R?",
    prompt: "Pick the word where R sits between two vowel sounds.",
    options: ["Red", "Carry", "Star", "Rain"],
    answer: "Carry",
    feedback: {
      correct: "Correct — Carry. Middle-R is where the sound has to hold up inside real speech.",
      incorrect: "It's Carry. The R lives inside the word, not at the edge.",
    },
  },
  {
    id: "mirror",
    type: "Body cue",
    icon: Sparkles,
    eyebrow: "Shape first",
    title: "Set your shape",
    prompt: "Soft smile, calm jaw — then say: ray · ree · row.",
    action: "Shape feels right",
    feedback: {
      correct: "Good. Preparing the position before speaking — that's the habit.",
      incorrect: "Breathe out, reset the jaw. Let the shape come before the sound.",
    },
  },
  {
    id: "phrase",
    type: "Phrase rep",
    icon: Volume2,
    eyebrow: "Into speech",
    title: "Say the sentence",
    prompt: "Three slow reps: Rory carried a bright green rocket.",
    action: "Finished all three",
    feedback: {
      correct: "Strong session. Sound to sentence — that's real progress.",
      incorrect: "One slower round. Accuracy matters more than speed today.",
    },
  },
];

/* ─── App ─────────────────────────────────────────────── */

function App() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [confidence, setConfidence] = useState(3);
  const [earnedXp, setEarnedXp] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [combo, setCombo] = useState(0);

  const currentExercise = EXERCISES[currentIndex];
  const isComplete = currentIndex >= EXERCISES.length;
  const progress = isComplete ? 100 : (currentIndex / EXERCISES.length) * 100;

  const stats = useMemo(
    () => ({
      xp: earnedXp,
      accuracy: Math.round(((EXERCISES.length - mistakes) / EXERCISES.length) * 100),
      streak: 5,
      perfect: mistakes === 0,
    }),
    [earnedXp, mistakes],
  );

  function beginLesson() {
    setStarted(true);
    setCurrentIndex(0);
    setFeedback(null);
    setSelectedOption("");
    setConfidence(3);
    setEarnedXp(0);
    setMistakes(0);
    setCombo(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submitAnswer(forceCorrect) {
    const isChoiceCard = Boolean(currentExercise.options);
    const isCorrect = isChoiceCard ? selectedOption === currentExercise.answer : forceCorrect;
    setFeedback(isCorrect ? "correct" : "incorrect");
    setEarnedXp((xp) => xp + (isCorrect ? 12 : 4));
    setCombo((c) => (isCorrect ? c + 1 : 0));
    if (!isCorrect) setMistakes((m) => m + 1);
  }

  function nextCard() {
    setCurrentIndex((i) => i + 1);
    setSelectedOption("");
    setFeedback(null);
    setConfidence(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!started) return <StartScreen onStart={beginLesson} />;

  return (
    <main className="shell">
      <div className="lesson-wrap">
        <LessonBar progress={progress} combo={combo} />
        {isComplete ? (
          <CompleteScreen stats={stats} onRestart={beginLesson} />
        ) : (
          <ExerciseCard
            key={currentIndex}
            exercise={currentExercise}
            isLast={currentIndex === EXERCISES.length - 1}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            feedback={feedback}
            confidence={confidence}
            setConfidence={setConfidence}
            onSubmit={submitAnswer}
            onNext={nextCard}
          />
        )}
      </div>
    </main>
  );
}

/* ─── Start Screen ────────────────────────────────────── */

function StartScreen({ onStart }) {
  return (
    <main className="shell shell--start">
      <div className="start-wrap">
        <div className="brand-chip">TopSpeech</div>

        <div className="start-hero" aria-hidden="true">
          <div className="hero-ring">
            <div className="hero-core">
              <Mascot mood="happy" size="lg" />
            </div>
          </div>
        </div>

        <div className="start-copy">
          <h1>Your daily R session.</h1>
          <p>4 minutes · one sound · real progress.</p>
        </div>

        <div className="lesson-meta">
          <span>4 cards</span>
          <span className="meta-sep" />
          <span>Rhotacism</span>
          <span className="meta-sep" />
          <span>+48 XP</span>
        </div>

        <button className="btn btn--primary" onClick={onStart}>
          Begin today's lesson
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </main>
  );
}

/* ─── Lesson Bar ──────────────────────────────────────── */

function LessonBar({ progress, combo }) {
  return (
    <div className="lesson-bar">
      <div className="bar-meta">
        <span className="bar-label">Rhotacism · Day 1</span>
        {combo > 0 && (
          <div key={combo} className={`combo-badge ${combo >= 3 ? "combo-badge--hot" : ""}`} aria-live="polite">
            <Zap size={11} strokeWidth={3} />
            {combo}× combo
          </div>
        )}
      </div>
      <div className="bar-row">
        <div
          className="bar-track"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Lesson progress"
        >
          <div className="bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ─── Exercise Card ───────────────────────────────────── */

function ExerciseCard({
  exercise, isLast, selectedOption, setSelectedOption,
  feedback, confidence, setConfidence, onSubmit, onNext,
}) {
  const Icon = exercise.icon;
  const canSubmit = exercise.options ? Boolean(selectedOption) : true;

  const cardClass = [
    "exercise-card",
    feedback === "correct" ? "exercise-card--correct" : "",
    feedback === "incorrect" ? "exercise-card--incorrect" : "",
  ].filter(Boolean).join(" ");

  return (
    <article className={cardClass}>
      <div className="card-type">
        <Icon size={13} strokeWidth={2.2} aria-hidden="true" />
        {exercise.type}
      </div>

      <div className="card-body">
        <p className="card-eyebrow">{exercise.eyebrow}</p>
        <h2>{exercise.title}</h2>
        <p className="card-prompt">{exercise.prompt}</p>
      </div>

      <div className="card-interactive">
        {exercise.options ? (
          <div className="options-grid" role="group" aria-label="Answer choices">
            {exercise.options.map((opt) => (
              <button
                key={opt}
                className={`opt-btn ${selectedOption === opt ? "opt-btn--selected" : ""}`}
                onClick={() => !feedback && setSelectedOption(opt)}
                aria-pressed={selectedOption === opt}
                disabled={Boolean(feedback)}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <ReadinessPanel confidence={confidence} setConfidence={setConfidence} locked={Boolean(feedback)} />
        )}
      </div>

      <div className="card-footer">
        {feedback ? (
          <FeedbackRow
            kind={feedback}
            message={exercise.feedback[feedback]}
            onNext={onNext}
            isLast={isLast}
          />
        ) : (
          <div className="action-row">
            <button className="btn btn--ghost" onClick={() => onSubmit(false)}>
              Needs another try
            </button>
            <button
              className="btn btn--primary btn--compact"
              disabled={!canSubmit}
              onClick={() => onSubmit(true)}
            >
              {exercise.action ?? "Check answer"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

/* ─── Readiness Panel ─────────────────────────────────── */

function ReadinessPanel({ confidence, setConfidence, locked }) {
  return (
    <div className="readiness">
      <div className="readiness-header">
        <span>Ready check</span>
        <strong>{confidence} / 5</strong>
      </div>
      <div className="readiness-dots" role="group" aria-label="Confidence before speaking">
        {[1, 2, 3, 4, 5].map((v) => (
          <button
            key={v}
            type="button"
            className={`rdot ${v <= confidence ? "rdot--on" : ""}`}
            onClick={() => !locked && setConfidence(v)}
            aria-label={`${v} out of 5`}
            aria-pressed={v <= confidence}
            disabled={locked}
          />
        ))}
      </div>
      <p className="readiness-cue">Lift, breathe, then speak.</p>
    </div>
  );
}

/* ─── Feedback Row ────────────────────────────────────── */

function FeedbackRow({ kind, message, onNext, isLast }) {
  const ok = kind === "correct";
  return (
    <div className={`feedback-row ${ok ? "feedback-row--ok" : "feedback-row--miss"}`} role="status">
      <div className="feedback-icon">
        {ok ? <Check size={18} strokeWidth={3} /> : <RotateCcw size={16} strokeWidth={2.5} />}
      </div>
      <div className="feedback-text">
        <strong>{ok ? "That counts." : "Good to know."}</strong>
        <span>{message}</span>
      </div>
      <button
        className={`btn btn--compact ${ok ? "btn--primary" : "btn--outline-ok"}`}
        onClick={onNext}
      >
        {isLast ? "Finish" : "Continue"}
        <ChevronRight size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* ─── Complete Screen ─────────────────────────────────── */

function CompleteScreen({ stats, onRestart }) {
  return (
    <section className="complete" aria-label="Lesson complete">
      <Confetti />

      <div className="complete-mascot">
        <Mascot mood="celebrate" size="xl" />
      </div>

      <div className="complete-copy">
        <p className="complete-label">Lesson complete</p>
        <h2>Your streak is alive.</h2>
        <p>You showed up for a vulnerable skill. That's what makes progress real.</p>
      </div>

      {stats.perfect && (
        <div className="perfect-badge">
          <Star size={13} fill="currentColor" aria-hidden="true" />
          Zero errors
        </div>
      )}

      <div className="stats-row">
        <div className="stat-cell">
          <strong><AnimatedCounter target={stats.xp} /></strong>
          <span>XP earned</span>
        </div>
        <div className="stat-cell stat-cell--sep" />
        <div className="stat-cell">
          <strong><AnimatedCounter target={stats.accuracy} />%</strong>
          <span>accuracy</span>
        </div>
        <div className="stat-cell stat-cell--sep" />
        <div className="stat-cell stat-cell--streak">
          <strong>
            <Flame size={18} strokeWidth={2} aria-hidden="true" />
            {stats.streak}
          </strong>
          <span>day streak</span>
        </div>
      </div>

      <div className="next-up">
        <span>Up next</span>
        <strong>Blend R into real conversation</strong>
      </div>

      <button className="btn btn--primary" onClick={onRestart}>
        Claim {stats.xp} XP
      </button>
    </section>
  );
}

/* ─── Animated Counter ────────────────────────────────── */

function AnimatedCounter({ target, duration = 1100 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!target) return;
    const startAt = Date.now();
    let raf;
    const tick = () => {
      const t = Math.min((Date.now() - startAt) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

/* ─── Confetti ────────────────────────────────────────── */

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: `${3 + i * 3.2}%`,
        delay: `${(i % 7) * 0.08}s`,
        dur: `${1.25 + (i % 5) * 0.22}s`,
        size: `${6 + (i % 3) * 4}px`,
        color: ["#7B5CFF", "#22C55E", "#FBBF24", "#FF7B35", "#F43F5E", "#06B6D4", "#EC4899"][i % 7],
        rot: `${i * 21}deg`,
        shape: i % 4 === 0 ? "50%" : "3px",
      })),
    [],
  );

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape,
            animationDelay: p.delay,
            animationDuration: p.dur,
            "--rot-end": `${540 + parseInt(p.rot)}deg`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Mascot ──────────────────────────────────────────── */

function Mascot({ mood = "happy", size = "md" }) {
  return (
    <div className={`mascot mascot--${mood} mascot--${size}`} aria-hidden="true">
      <span className="m-ear m-ear--l" />
      <span className="m-ear m-ear--r" />
      <span className="m-eye m-eye--l" />
      <span className="m-eye m-eye--r" />
      <span className="m-mouth" />
      <span className="m-glow" />
    </div>
  );
}

/* ─── Mount ───────────────────────────────────────────── */

createRoot(document.getElementById("root")).render(<App />);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
