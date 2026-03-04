// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  screen: 'welcome',        // welcome | info | assessment | results
  currentControl: 0,        // index into CIS_CONTROLS
  answers: {},              // { "1.1": 2, "1.2": 0, ... }
  orgName: '',
  assessorName: '',
  assessmentDate: new Date().toISOString().split('T')[0]
};

// ─── Render helpers ───────────────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }

function renderScreen() {
  $('screen-welcome').classList.toggle('hidden', state.screen !== 'welcome');
  $('screen-info').classList.toggle('hidden', state.screen !== 'info');
  $('screen-assessment').classList.toggle('hidden', state.screen !== 'assessment');
  $('screen-results').classList.toggle('hidden', state.screen !== 'results');
}

// ─── Welcome screen ───────────────────────────────────────────────────────────
function startAssessment() {
  state.screen = 'info';
  renderScreen();
}

// ─── Info screen ─────────────────────────────────────────────────────────────
function submitInfo() {
  const orgName = $('org-name').value.trim();
  const assessorName = $('assessor-name').value.trim();

  if (!orgName || !assessorName) {
    showError('info-error', 'Please fill in all required fields.');
    return;
  }

  state.orgName = orgName;
  state.assessorName = assessorName;
  state.assessmentDate = $('assessment-date').value;
  state.screen = 'assessment';
  state.currentControl = 0;
  renderScreen();
  renderControl();
}

function showError(id, msg) {
  const el = $(id);
  if (el) {
    el.textContent = msg;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 3000);
  }
}

// ─── Assessment screen ────────────────────────────────────────────────────────
function renderControl() {
  const control = CIS_CONTROLS[state.currentControl];
  const total = CIS_CONTROLS.length;
  const progress = ((state.currentControl) / total) * 100;

  // Progress
  $('progress-bar').style.width = `${progress}%`;
  $('progress-text').textContent = `Control ${state.currentControl + 1} of ${total}`;

  // Header
  $('control-number').textContent = `Control ${control.id}`;
  $('control-category').textContent = CATEGORY_LABELS[control.category];
  $('control-category').className = `control-category category-${control.category}`;
  $('control-title').textContent = control.title;
  $('control-description').textContent = control.description;

  // Questions
  const container = $('questions-container');
  container.innerHTML = '';

  control.questions.forEach((q, idx) => {
    const saved = state.answers[q.id];
    const questionEl = document.createElement('div');
    questionEl.className = 'question-card';
    questionEl.innerHTML = `
      <div class="question-header">
        <span class="question-num">Q${idx + 1}</span>
        <p class="question-text">${q.text}</p>
      </div>
      <div class="response-options" role="group" aria-label="Response for question ${idx + 1}">
        ${RESPONSE_OPTIONS.map(opt => `
          <label class="response-option ${saved === opt.value ? 'selected' : ''}" style="--option-color: ${opt.color}">
            <input type="radio" name="q-${q.id}" value="${opt.value}" ${saved === opt.value ? 'checked' : ''} onchange="saveAnswer('${q.id}', ${opt.value}, this)">
            <span class="option-value">${opt.value}</span>
            <span class="option-label">${opt.label}</span>
          </label>
        `).join('')}
      </div>
    `;
    container.appendChild(questionEl);
  });

  // Nav buttons
  $('btn-prev').disabled = state.currentControl === 0;
  $('btn-next').textContent = state.currentControl === total - 1 ? 'Finish & View Results' : 'Next Control';
}

function saveAnswer(qid, value, inputEl) {
  state.answers[qid] = value;
  // Update sibling labels
  const group = inputEl.closest('.response-options');
  group.querySelectorAll('.response-option').forEach(label => {
    label.classList.toggle('selected', parseInt(label.querySelector('input').value) === value);
  });
  updateNextButton();
}

function updateNextButton() {
  const control = CIS_CONTROLS[state.currentControl];
  const allAnswered = control.questions.every(q => state.answers[q.id] !== undefined);
  $('btn-next').classList.toggle('btn-ready', allAnswered);
}

function prevControl() {
  if (state.currentControl > 0) {
    state.currentControl--;
    renderControl();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function nextControl() {
  const control = CIS_CONTROLS[state.currentControl];
  const unanswered = control.questions.filter(q => state.answers[q.id] === undefined);

  if (unanswered.length > 0) {
    showError('assessment-error', `Please answer all ${unanswered.length} remaining question(s) before proceeding.`);
    highlightUnanswered(control);
    return;
  }

  if (state.currentControl < CIS_CONTROLS.length - 1) {
    state.currentControl++;
    renderControl();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    state.screen = 'results';
    renderScreen();
    renderResults();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function highlightUnanswered(control) {
  control.questions.forEach((q, idx) => {
    if (state.answers[q.id] === undefined) {
      const cards = $('questions-container').querySelectorAll('.question-card');
      if (cards[idx]) {
        cards[idx].classList.add('unanswered-highlight');
        setTimeout(() => cards[idx].classList.remove('unanswered-highlight'), 2000);
      }
    }
  });
}

// ─── Scoring ──────────────────────────────────────────────────────────────────
function calcControlScore(control) {
  let earned = 0;
  let possible = 0;
  control.questions.forEach(q => {
    const ans = state.answers[q.id] ?? 0;
    earned += ans * q.weight;
    possible += 3 * q.weight; // max value is 3
  });
  return possible > 0 ? Math.round((earned / possible) * 100) : 0;
}

function calcOverallScore() {
  const scores = CIS_CONTROLS.map(c => calcControlScore(c));
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function getRiskLevel(score) {
  return RISK_LEVELS.find(r => score >= r.min && score < r.max) || RISK_LEVELS[0];
}

// ─── Results screen ───────────────────────────────────────────────────────────
function renderResults() {
  const overallScore = calcOverallScore();
  const risk = getRiskLevel(overallScore);

  // Meta
  $('result-org').textContent = state.orgName;
  $('result-assessor').textContent = state.assessorName;
  $('result-date').textContent = new Date(state.assessmentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Score ring
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (overallScore / 100) * circumference;
  $('score-ring').style.strokeDasharray = circumference;
  $('score-ring').style.strokeDashoffset = offset;
  $('score-ring').style.stroke = risk.color;
  $('score-value').textContent = overallScore;
  $('score-value').style.color = risk.color;
  $('risk-label').textContent = risk.label;
  $('risk-label').style.color = risk.color;
  $('risk-description').textContent = risk.description;

  // Control breakdown
  const breakdownEl = $('control-breakdown');
  breakdownEl.innerHTML = '';

  // Group by category
  const grouped = {};
  CIS_CONTROLS.forEach(c => {
    if (!grouped[c.category]) grouped[c.category] = [];
    grouped[c.category].push(c);
  });

  Object.entries(grouped).forEach(([cat, controls]) => {
    const groupEl = document.createElement('div');
    groupEl.className = 'breakdown-group';
    groupEl.innerHTML = `<h3 class="breakdown-group-title">${CATEGORY_LABELS[cat]}</h3>`;

    controls.forEach(control => {
      const score = calcControlScore(control);
      const cRisk = getRiskLevel(score);
      const controlEl = document.createElement('div');
      controlEl.className = 'breakdown-item';
      controlEl.innerHTML = `
        <div class="breakdown-item-header">
          <span class="breakdown-item-title">
            <span class="breakdown-ctrl-num">CIS ${control.id}</span>
            ${control.title}
          </span>
          <span class="breakdown-score" style="color: ${cRisk.color}">${score}%</span>
        </div>
        <div class="breakdown-bar-bg">
          <div class="breakdown-bar-fill" style="width: ${score}%; background: ${cRisk.color}"></div>
        </div>
        <span class="breakdown-risk-label" style="color: ${cRisk.color}">${cRisk.label}</span>
      `;
      groupEl.appendChild(controlEl);
    });

    breakdownEl.appendChild(groupEl);
  });

  // Recommendations
  renderRecommendations();
}

function renderRecommendations() {
  const scored = CIS_CONTROLS.map(c => ({
    control: c,
    score: calcControlScore(c)
  })).sort((a, b) => a.score - b.score);

  const recsEl = $('recommendations-list');
  recsEl.innerHTML = '';

  // Top gaps
  const gaps = scored.slice(0, 6);
  gaps.forEach(({ control, score }, idx) => {
    const risk = getRiskLevel(score);
    const weakQuestions = control.questions.filter(q => (state.answers[q.id] ?? 0) < 2);

    const recEl = document.createElement('div');
    recEl.className = 'rec-item';
    recEl.innerHTML = `
      <div class="rec-header">
        <div class="rec-priority priority-${idx < 2 ? 'critical' : idx < 4 ? 'high' : 'medium'}">
          ${idx < 2 ? 'Critical Priority' : idx < 4 ? 'High Priority' : 'Medium Priority'}
        </div>
        <span class="rec-score" style="color: ${risk.color}">${score}% — ${risk.label}</span>
      </div>
      <h4 class="rec-title">CIS Control ${control.id}: ${control.title}</h4>
      ${weakQuestions.length > 0 ? `
        <ul class="rec-gaps">
          ${weakQuestions.slice(0, 3).map(q => `<li>${q.text}</li>`).join('')}
        </ul>
      ` : ''}
    `;
    recsEl.appendChild(recEl);
  });
}

// ─── Export ───────────────────────────────────────────────────────────────────
function exportReport() {
  const overallScore = calcOverallScore();
  const risk = getRiskLevel(overallScore);
  const date = new Date(state.assessmentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  let csv = `CIS Controls v8 Cyber Risk Assessment Report\n`;
  csv += `Organization: ${state.orgName}\n`;
  csv += `Assessor: ${state.assessorName}\n`;
  csv += `Date: ${date}\n`;
  csv += `Overall Score: ${overallScore}%\n`;
  csv += `Risk Level: ${risk.label}\n\n`;
  csv += `Control ID,Control Title,Category,Score (%),Risk Level\n`;

  CIS_CONTROLS.forEach(control => {
    const score = calcControlScore(control);
    const cRisk = getRiskLevel(score);
    csv += `"CIS ${control.id}","${control.title}","${CATEGORY_LABELS[control.category]}",${score},"${cRisk.label}"\n`;
  });

  csv += `\nDetailed Responses\n`;
  csv += `Question ID,Question Text,Response Value,Response Label\n`;
  CIS_CONTROLS.forEach(control => {
    control.questions.forEach(q => {
      const val = state.answers[q.id] ?? 0;
      const opt = RESPONSE_OPTIONS.find(o => o.value === val);
      csv += `"${q.id}","${q.text}",${val},"${opt.label}"\n`;
    });
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CIS18-Assessment-${state.orgName.replace(/\s+/g, '-')}-${state.assessmentDate}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function restartAssessment() {
  if (!confirm('Are you sure you want to restart? All answers will be lost.')) return;
  state.screen = 'welcome';
  state.currentControl = 0;
  state.answers = {};
  state.orgName = '';
  state.assessorName = '';
  renderScreen();
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  $('assessment-date').value = state.assessmentDate;
  renderScreen();
});
