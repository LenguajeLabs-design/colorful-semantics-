const samples = [
  {
    subject: "SCIENCE EXPLANATION",
    title: "When the idea is already there",
    prompt: "What helps a plant grow?",
    response: "“Plants need water because it help grow.”",
    level: "Developing explanation",
    note: "Read for the message first. The ending is unfinished, but the relationship is visible.",
    feedback: "The learner communicates a need and begins to connect it to growth.",
    missing: "A specific detail about how is still missing."
  },
  {
    subject: "NARRATIVE RETELL",
    title: "When the sequence is visible",
    prompt: "What happened when the class arrived?",
    response: "“We got off the bus and then the rain started.”",
    level: "Emerging sequence",
    note: "The learner has placed two events in order. Look for the next bridge, not a rewrite.",
    feedback: "The learner communicates a clear before-and-after sequence.",
    missing: "A detail about what the class did next is still missing."
  },
  {
    subject: "OPINION + EVIDENCE",
    title: "When the claim needs a reason",
    prompt: "Which school space is most useful?",
    response: "“The library is best because it is quiet.”",
    level: "Supported opinion",
    note: "The claim and one reason are both present. Invite evidence that makes the reason more precise.",
    feedback: "The learner states a preference and gives a reason for it.",
    missing: "A concrete example of the quiet space is still missing."
  }
];

let currentSample = 0;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function renderSample(index) {
  currentSample = index;
  const sample = samples[index];
  $("#sample-title").textContent = sample.title;
  $("#sample-subject").textContent = sample.subject;
  $("#teacher-prompt").textContent = sample.prompt;
  $("#learner-response").textContent = sample.response;
  $("#sample-level").textContent = sample.level;
  $("#response-number").textContent = `Response ${String(index + 1).padStart(2, "0")}`;
  $("#progress-count").innerHTML = `${String(index + 1).padStart(2, "0")} <small>/ 03</small>`;
  $("#progress-bar").style.width = `${((index + 1) / samples.length) * 100}%`;
  $("#meaning-feedback").textContent = "Start by naming the meaning you can already hear.";
  $("#prompt-feedback").hidden = true;
  $("#reasoning-reveal").hidden = true;
  $("#reveal-reasoning").innerHTML = 'Reveal the reasoning <span aria-hidden="true">↓</span>';
  $$(".meaning-option").forEach((button) => button.setAttribute("aria-pressed", "false"));
  $$(".prompt-option").forEach((button) => button.classList.remove("is-correct", "is-wrong"));
  $$(".sample-card").forEach((button) => button.classList.toggle("is-selected", Number(button.dataset.sample) === index));
  $("#classroom-title").textContent = sample.prompt;
  $(".classroom-response").textContent = sample.response;
  $(".classroom-context .label-chip").textContent = sample.subject;
  $("#classroom-next").hidden = true;
  $$(".classroom-choice").forEach((button) => button.classList.remove("is-selected"));
}

function toggleMeaning(button) {
  const isSelected = button.getAttribute("aria-pressed") === "true";
  button.setAttribute("aria-pressed", String(!isSelected));
  const selected = $$(".meaning-option[aria-pressed='true']");
  if (!selected.length) {
    $("#meaning-feedback").textContent = "Start by naming the meaning you can already hear.";
    return;
  }
  const hasDetail = selected.some((item) => item.dataset.meaning === "detail");
  $("#meaning-feedback").textContent = hasDetail
    ? "Good noticing. The idea is present; the specific detail is the next stretch."
    : samples[currentSample].feedback;
}

function choosePrompt(button) {
  $$(".prompt-option").forEach((item) => item.classList.remove("is-correct", "is-wrong"));
  const feedback = $("#prompt-feedback");
  const correct = button.dataset.correct === "true";
  button.classList.add(correct ? "is-correct" : "is-wrong");
  feedback.hidden = false;
  feedback.innerHTML = correct
    ? "<strong>Exactly.</strong> This prompt keeps the learner’s idea and invites one more detail."
    : "This asks for too much correction or too many new ideas at once. Look for the smallest next move.";
}

function openClassroom() {
  $("#classroom-overlay").hidden = false;
  document.body.style.overflow = "hidden";
  $("#close-classroom").focus();
}

function closeClassroom() {
  $("#classroom-overlay").hidden = true;
  document.body.style.overflow = "";
  $("#open-classroom").focus();
}

$("#meaning-options").addEventListener("click", (event) => {
  const button = event.target.closest(".meaning-option");
  if (button) toggleMeaning(button);
});

$("#prompt-options").addEventListener("click", (event) => {
  const button = event.target.closest(".prompt-option");
  if (button) choosePrompt(button);
});

$("#sample-cards").addEventListener("click", (event) => {
  const card = event.target.closest(".sample-card");
  if (card) renderSample(Number(card.dataset.sample));
});

$("#new-response").addEventListener("click", () => renderSample((currentSample + 1) % samples.length));
$("#open-classroom").addEventListener("click", openClassroom);
$("#close-classroom").addEventListener("click", closeClassroom);
$("#reveal-reasoning").addEventListener("click", () => {
  const reveal = $("#reasoning-reveal");
  reveal.hidden = !reveal.hidden;
  $("#reveal-reasoning").innerHTML = reveal.hidden
    ? 'Reveal the reasoning <span aria-hidden="true">↓</span>'
    : 'Hide the reasoning <span aria-hidden="true">↑</span>';
});

$("#classroom-actions").addEventListener("click", (event) => {
  const choice = event.target.closest(".classroom-choice");
  if (!choice) return;
  $$(".classroom-choice").forEach((button) => button.classList.remove("is-selected"));
  choice.classList.add("is-selected");
  $("#classroom-next").hidden = choice.dataset.classroom !== "detail";
});

$("#listen-response").addEventListener("click", () => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance($("#learner-response").textContent.replace(/[“”]/g, ""));
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
});

$$('[data-view="library"]').forEach((button) => button.addEventListener("click", () => $("#library-panel").scrollIntoView({ behavior: "smooth" })));
$("#view-library").addEventListener("click", () => $("#library-panel").scrollIntoView({ behavior: "smooth" }));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !$("#classroom-overlay").hidden) closeClassroom();
});

renderSample(0);
