const app = document.getElementById("app");
const state = {
  subject: null,
  chapter: null,
  questions: [],
  index: 0,
  answers: [],
  score: 0,
  seconds: 0,
  timer: null
};

const progressKey = "studymate_progress_v1";
const themeKey = "studymate_theme_v1";

document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  showHome();
});

function getProgress() {
  try { return JSON.parse(localStorage.getItem(progressKey)) || {}; }
  catch { return {}; }
}

function saveProgress(data) {
  localStorage.setItem(progressKey, JSON.stringify(data));
}

function markAttempt(subjectId, chapterId, score, total) {
  const p = getProgress();
  const key = `${subjectId}:${chapterId}`;
  if (!p[key]) p[key] = { attempts: 0, best: 0, total: 0 };
  p[key].attempts += 1;
  p[key].best = Math.max(p[key].best, score);
  p[key].total = total;
  saveProgress(p);
}

function showHome() {
  clearTimer();
  const totalQuestions = STUDY_DATA.reduce((sum, s) =>
    sum + s.chapters.reduce((x, c) => x + c.questions.length, 0), 0);

  app.innerHTML = `
    <section class="hero">
      <div>
        <span class="pill">NO LOGIN • JUST STUDY</span>
        <h1>Study smarter.<br><span>Practice faster.</span></h1>
        <p>Pick a subject, choose a chapter and start solving. Your progress stays on this device.</p>
        <div class="hero-stats">
          <div><b>${STUDY_DATA.length}</b><span>Subjects</span></div>
          <div><b>${STUDY_DATA.reduce((a,s)=>a+s.chapters.length,0)}</b><span>Chapters</span></div>
          <div><b>${totalQuestions}</b><span>Questions</span></div>
        </div>
      </div>
    </section>

    <section class="content">
      <div class="section-head">
        <div>
          <span class="eyebrow">YOUR LIBRARY</span>
          <h2>Choose a subject</h2>
        </div>
        <button class="ghost-btn" onclick="showProgress()">View progress</button>
      </div>

      <div class="subject-grid">
        ${STUDY_DATA.map(s => `
          <button class="subject-card" onclick="showSubject('${s.id}')">
            <div class="subject-icon">${s.icon}</div>
            <div>
              <h3>${escapeHtml(s.name)}</h3>
              <p>${escapeHtml(s.description)}</p>
              <small>${s.chapters.length} chapter${s.chapters.length!==1?"s":""}</small>
            </div>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function showSubject(id) {
  clearTimer();
  const subject = STUDY_DATA.find(s => s.id === id);
  if (!subject) return;
  state.subject = subject;

  app.innerHTML = `
    <section class="content">
      <button class="back" onclick="showHome()">← Back</button>
      <div class="section-head">
        <div>
          <span class="eyebrow">${escapeHtml(subject.name.toUpperCase())}</span>
          <h2>Choose a chapter</h2>
        </div>
      </div>
      <div class="chapter-list">
        ${subject.chapters.map(c => {
          const p = getProgress()[`${subject.id}:${c.id}`];
          return `
            <button class="chapter-card" onclick="startQuiz('${subject.id}','${c.id}')">
              <div>
                <h3>${escapeHtml(c.name)}</h3>
                <p>${c.questions.length} questions · ${p ? `Best: ${p.best}/${p.total}` : "Not attempted"}</p>
              </div>
              <span class="arrow">→</span>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function startQuiz(subjectId, chapterId) {
  const subject = STUDY_DATA.find(s => s.id === subjectId);
  const chapter = subject?.chapters.find(c => c.id === chapterId);
  if (!chapter || !chapter.questions.length) return;

  clearTimer();
  state.subject = subject;
  state.chapter = chapter;
  state.questions = [...chapter.questions].sort(() => Math.random() - 0.5);
  state.index = 0;
  state.answers = [];
  state.score = 0;
  state.seconds = Math.max(60, state.questions.length * 45);

  renderQuestion();
  state.timer = setInterval(() => {
    state.seconds--;
    const timer = document.getElementById("timer");
    if (timer) timer.textContent = formatTime(state.seconds);
    if (state.seconds <= 0) finishQuiz(true);
  }, 1000);
}

function renderQuestion() {
  const q = state.questions[state.index];
  const answered = state.answers[state.index];
  const pct = Math.round((state.index / state.questions.length) * 100);

  app.innerHTML = `
    <section class="quiz-page">
      <div class="quiz-nav">
        <button class="back" onclick="confirmExit()">← Exit</button>
        <div class="timer">⏱ <span id="timer">${formatTime(state.seconds)}</span></div>
      </div>

      <div class="progressbar"><span style="width:${pct}%"></span></div>
      <div class="question-meta">
        <span>${state.chapter.name}</span>
        <b>${state.index + 1} / ${state.questions.length}</b>
      </div>

      <article class="question-box">
        <h2>${escapeHtml(q.q)}</h2>
        <div class="options">
          ${q.options.map((opt, i) => `
            <button class="answer ${answered !== undefined ? (i === q.correct ? "correct": i === answered ? "wrong":"disabled") : ""}"
                    ${answered !== undefined ? "disabled" : ""}
                    onclick="selectAnswer(${i})">
              <span class="letter">${String.fromCharCode(65+i)}</span>
              <span>${escapeHtml(opt)}</span>
            </button>
          `).join("")}
        </div>

        ${answered !== undefined ? `
          <div class="explanation ${answered === q.correct ? "good":"bad"}">
            <b>${answered === q.correct ? "Correct!" : "Not quite."}</b>
            <p>${escapeHtml(q.explanation)}</p>
          </div>
          <button class="primary next-btn" onclick="nextQuestion()">
            ${state.index === state.questions.length-1 ? "See result" : "Next question →"}
          </button>
        ` : ""}
      </article>
    </section>
  `;
}

function selectAnswer(choice) {
  if (state.answers[state.index] !== undefined) return;
  state.answers[state.index] = choice;
  if (choice === state.questions[state.index].correct) state.score++;
  renderQuestion();
}

function nextQuestion() {
  if (state.index >= state.questions.length - 1) finishQuiz(false);
  else { state.index++; renderQuestion(); }
}

function finishQuiz(timeUp) {
  clearTimer();
  markAttempt(state.subject.id, state.chapter.id, state.score, state.questions.length);
  const percent = Math.round((state.score / state.questions.length) * 100);

  app.innerHTML = `
    <section class="result-wrap">
      <div class="result-card">
        <span class="pill">${timeUp ? "TIME UP" : "QUIZ COMPLETE"}</span>
        <div class="result-circle">${percent}%</div>
        <h2>${getResultTitle(percent)}</h2>
        <p>You scored <b>${state.score}</b> out of <b>${state.questions.length}</b>.</p>
        <div class="result-actions">
          <button class="primary" onclick="startQuiz('${state.subject.id}','${state.chapter.id}')">Try again</button>
          <button class="ghost-btn" onclick="showSubject('${state.subject.id}')">Choose another</button>
        </div>
      </div>
    </section>
  `;
}

function showProgress() {
  clearTimer();
  const p = getProgress();

  const rows = STUDY_DATA.flatMap(s => s.chapters.map(c => {
    const x = p[`${s.id}:${c.id}`] || {attempts:0,best:0,total:c.questions.length};
    return { subject:s, chapter:c, data:x };
  }));

  const attempted = rows.filter(x => x.data.attempts > 0).length;
  const avg = rows.filter(x => x.data.attempts > 0).length
    ? Math.round(rows.filter(x => x.data.attempts > 0)
      .reduce((sum,x)=>sum+(x.data.best/x.data.total)*100,0) / attempted)
    : 0;

  app.innerHTML = `
    <section class="content">
      <button class="back" onclick="showHome()">← Back</button>
      <div class="section-head">
        <div><span class="eyebrow">LOCAL PROGRESS</span><h2>Your progress</h2></div>
      </div>

      <div class="progress-summary">
        <div class="mini-stat"><b>${attempted}</b><span>Chapters practiced</span></div>
        <div class="mini-stat"><b>${avg}%</b><span>Best-score average</span></div>
        <div class="mini-stat"><b>${rows.reduce((a,x)=>a+x.data.attempts,0)}</b><span>Total attempts</span></div>
      </div>

      <div class="progress-list">
        ${rows.map(x => `
          <div class="progress-row">
            <div>
              <strong>${escapeHtml(x.subject.name)} · ${escapeHtml(x.chapter.name)}</strong>
              <small>${x.data.attempts ? `${x.data.attempts} attempt${x.data.attempts!==1?"s":""}` : "Not attempted"}</small>
            </div>
            <div class="progress-score">${x.data.attempts ? `${x.data.best}/${x.data.total}` : "—"}</div>
          </div>
        `).join("")}
      </div>

      <button class="danger-btn" onclick="resetProgress()">Reset local progress</button>
    </section>
  `;
}

function resetProgress() {
  if (confirm("Reset all progress saved on this device?")) {
    localStorage.removeItem(progressKey);
    showProgress();
  }
}

function confirmExit() {
  if (confirm("Exit this quiz? Your current answers will be lost.")) {
    showSubject(state.subject.id);
  }
}

function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  localStorage.setItem(themeKey, dark ? "dark" : "light");
  document.getElementById("themeBtn").textContent = dark ? "☀" : "☾";
}

function applySavedTheme() {
  const dark = localStorage.getItem(themeKey) === "dark";
  document.documentElement.classList.toggle("dark", dark);
  const btn = document.getElementById("themeBtn");
  if (btn) btn.textContent = dark ? "☀" : "☾";
}

function clearTimer() {
  if (state.timer) clearInterval(state.timer);
  state.timer = null;
}

function formatTime(s) {
  s = Math.max(0, s);
  return `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
}

function getResultTitle(percent) {
  if (percent >= 90) return "Excellent work!";
  if (percent >= 75) return "Great job!";
  if (percent >= 50) return "Keep practicing!";
  return "Good start — try again!";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}
