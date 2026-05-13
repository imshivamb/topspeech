# TopSpeech Daily Lesson Prototype

A mobile-first PWA prototype for a daily rhotacism lesson — built as a polished browser experience with a full lesson loop: start screen, four exercise cards, feedback states, combo progress, and a reward screen.

## Run locally

```bash
npm install
npm run dev
```

## Duolingo audit — what I studied, what I kept, what I changed

### What Duolingo gets right (and I kept)

- **One card at a time.** No information overload. Every card is a single focused task. I kept this ruthlessly.
- **Visible progress with combo momentum.** The bar advancing after each correct card creates a tiny dopamine loop. I kept this with a smooth spring-eased fill and a combo badge that fires a pop animation.
- **Instant feedback inline.** Duolingo never makes you wait to know if you were right. My feedback row animates in immediately below the content, green or rose, clear icon, one-line message.
- **Reward screen as a moment.** The complete screen should feel like a celebration, not just a summary. I kept the XP counter (now animated), accuracy, and streak. I added CSS confetti and a mascot pop-in animation so the moment has energy.
- **Physical button depth.** Duolingo's buttons press down. I replicated this with a bottom box-shadow that collapses on `:active`, giving real tactile feedback.

### What I deliberately changed for speech therapy

- **Removed the failure flash.** Duolingo's bright red "INCORRECT" header is fine for vocabulary, but speech therapy users are often working through self-consciousness. I replaced it with a warm rose tint on the card and a neutral message: "Good to know." Mistakes are reframed as information, not failure.
- **Added a confidence-before-speaking check.** Duolingo scores the answer after the attempt. Practice cards in this prototype ask for a quick readiness rating *before* speaking. This reinforces body awareness, motor preparation, and psychological safety — things that matter for rhotacism but not for vocabulary drills.
- **Removed time pressure and lives.** Duolingo's heart system and time limits create urgency. Rhotacism work requires calm repetition. I stripped all pressure mechanics; the only score is accuracy shown *after* the session is complete.
- **Copy tone is coaching, not judging.** Every feedback message is written as a coach note, not a score. "Slow reps build the motor pattern." "Prepare the position before asking for accuracy." The language respects that the user is doing something hard.
- **Streak is kept but not weaponised.** I show the day streak on the complete screen because consistency matters in therapy. But I do not use streak loss as a threat mid-session.

## Exercise card types

| Card | Mechanic | Purpose |
|------|----------|---------|
| Warm-up | Self-assess practice | Isolated R awareness before speed |
| Word selection | 4-option tap | Identify the middle-R target in context |
| Mirror cue | Self-assess practice | Body setup before the motor attempt |
| Phrase rep | Self-assess practice | Sound into natural connected speech |

## Innovation

**Confidence-before-speaking check.** A five-dot readiness panel on practice cards asks the user to rate their readiness before speaking. This is novel for a language-learning UI pattern. It draws from speech therapy clinical practice where body and breath setup is explicitly trained before motor execution. It also removes the implicit pressure of "tap when ready" by separating mental readiness from action.

## PWA details

- Installable manifest with theme color and icon
- Service worker for offline shell caching
- Responsive layout for mobile browsers, scales cleanly to desktop
- `prefers-reduced-motion` respected — all animations collapse to instant

## Deploy

```bash
npm run build
vercel
```
