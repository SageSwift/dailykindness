// ---------- Ideas ----------
const ideasA = [
  "Leave a kind note for someone to find",
  "Send a thank you text to who helped you recently",
  "Let someone go ahead of you in traffic or a checkout line",
  "Give a sincere compliment to a stranger",
  "Hold the door open for 3 people",
  "Write a positive review for a small business you enjoy",
  "Call a relative you haven't spoken with in a while",
  "Write a thank you note for a boss, teacher, or mentor",
  "Boost someone's project on social media",
  "Invite someone sitting alone to join you",
  "Send an encouraging message to someone you know facing a challenge",
  "Offer to help someone with a task",
  "Compliment a coworker or classmate on a specific skill",
  "Let someone merge ahead of you",
  "Bring coffee or snacks for a friend",
  "Clean up a public space",
  "Pick up litter on the sidewalk",
  "Help someone load or carry something",
  "Say hello to a neighbor you don't know well",
  "Bake some cookies and share them with someone",
  "Offer to help someone who needs it",
  "Mail a card or letter to someone you love",
  "Tell a coworker or fellow student how you see them working hard and you admire them",
  "Return a stray shopping cart",
  "Fold an origami model and leave it for someone to find"
];
const ideasB = [
  "Give someone a ride who doesn’t have transportation",
  "Pay for the coffee of the person behind you in line",
  "Bring a meal to a friend who’s been sick, stressed, or busy",
  "Offer to walk someone's dog",
  "Help a neighbor with yard work or shoveling snow",
  "Donate blood at a local drive or hospital",
  "Leave a generous surprise tip or note for a delivery driver",
  "Cook extra dinner and share it with a neighbor",
  "Spend quality time with someone who’s lonely or grieving",
  "Offer to proofread or help with someone’s project or resume",
  "Buy groceries for a family in need",
  "Make a playlist for a friend who’s going through something",
  "Donate supplies to a school or teacher",
  "Share your professional skills (e.g., photography, design, tutoring) for free",
  "Give a homeless person a meal"
];
 const ideasC = [
  "Volunteer at a homeless shelter",
  "Volunteer at a food bank",
  "Volunteer at an animal rescue",
  "Organize a charity event or donation drive",
  "Cook and deliver meals to people experiencing homelessness",
  "Foster a rescue pet until it finds a permanent home",
];


// ---------- DOM ----------
const ideaText = document.getElementById("idea");
const generateBtn = document.getElementById("generateBtn");
const didItBtn = document.getElementById("didItBtn");
didItBtn.disabled = true;
const feedbackEl = document.getElementById("feedback");

const totalDaysEl = document.getElementById("totalDays");
const currentStreakEl = document.getElementById("currentStreak");
const weekCountEl = document.getElementById("weekCount");
const weekProgressBar = document.getElementById("weekProgressBar");
const weekProgressFill = document.getElementById("weekProgressFill");

// ---------- Utilities ----------
const STORAGE_KEY = "kindness-progress-v1";

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dateDiffInDays(from, to) {
  const a = new Date(from + "T00:00:00");
  const b = new Date(to + "T00:00:00");
  const msPerDay = 86400000;
  return Math.round((b - a) / msPerDay);
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { totalDays: 0, currentStreak: 0, lastCompletedDate: null, weekCount: 0 };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      totalDays: parsed.totalDays ?? 0,
      currentStreak: parsed.currentStreak ?? 0,
      lastCompletedDate: parsed.lastCompletedDate ?? null,
      weekCount: parsed.weekCount ?? 0
    };
  } catch {
    return { totalDays: 0, currentStreak: 0, lastCompletedDate: null, weekCount: 0 };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render(state) {
  totalDaysEl.textContent = state.totalDays;
  currentStreakEl.textContent = state.currentStreak;
  weekCountEl.textContent = state.weekCount;// % 7;
  const pct = ((state.weekCount) / 7) * 100;//((state.weekCount % 7) / 7) * 100;
  weekProgressFill.style.width = `${pct}%`;
  weekProgressBar.setAttribute("aria-valuenow", String(state.weekCount % 7));

  const t = todayStr();
  const already = state.lastCompletedDate === t;
  //didItBtn.disabled = already;
  feedbackEl.textContent = "";
}

function celebrate() {
  feedbackEl.textContent = "Nice work";
  weekProgressFill.animate(
    [{ transform: "scaleY(1.0)" }, { transform: "scaleY(1.08)" }, { transform: "scaleY(1.0)" }],
    { duration: 250, easing: "ease-out" }
  );
}

// ---------- Idea generation ----------
var pointValue = 0;

function getRandomIdeaEasy() {
  const randomIndex = Math.floor(Math.random() * ideasA.length);
  pointValue = 1;
  return ideasA[randomIndex];
}

function getRandomIdeaMedium() {
  const randomIndex = Math.floor(Math.random() * ideasB.length);
  pointValue = 3;
  return ideasB[randomIndex];
}

function getRandomIdeaHard() {
  const randomIndex = Math.floor(Math.random() * ideasC.length);
  pointValue = 10;
  return ideasC[randomIndex];
}


function getRandomIdea() {
  didItBtn.disabled = false;
  const randomIndex = Math.floor(Math.random() * 4);
  if (randomIndex < 2){
	  return getRandomIdeaEasy() + " (+1pt)";
  }
  else if (randomIndex < 3){
	  return getRandomIdeaMedium() + " (+3pt)";
  }
  else {
	  return getRandomIdeaHard() + " (+10pt)";
  }
}

function swapIdeaWithFade(newText) {
  ideaText.classList.add("is-fading");
  const onEnd = () => {
    ideaText.textContent = newText;
    ideaText.classList.remove("is-fading");
    ideaText.removeEventListener("transitionend", onEnd);
  };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    ideaText.textContent = newText;
    ideaText.classList.remove("is-fading");
  } else {
    ideaText.addEventListener("transitionend", onEnd);
  }
}

// ---------- Handlers ----------
const state = loadState();
render(state);

generateBtn.addEventListener("click", () => {
  const newIdea = getRandomIdea();
  swapIdeaWithFade(newIdea);
});

didItBtn.addEventListener("click", () => {
  const t = todayStr();

  /*
  //Limit daily acts of kindness to 1
  if (state.lastCompletedDate === t) {
    //didItBtn.disabled = true;
    return;
  }
  */

  // Totals
  //totalDays is now totalPoints
  state.totalDays += pointValue;

  // Streak logic
  if (state.lastCompletedDate) {
    const diff = dateDiffInDays(state.lastCompletedDate, t);
    if (diff === 1) {
      state.currentStreak += 1;
    } else if (diff > 1) {
      state.currentStreak = 1;
    } else {
      state.currentStreak = Math.max(1, state.currentStreak);
    }
  } else {
    state.currentStreak = 1;
  }

  // Weekly progress
  //state.weekCount = (state.weekCount % 7) + 1; //reset at 7 days
  state.weekCount = (state.weekCount) + 1;
  state.lastCompletedDate = t;

  // Handle week complete
  /*if (state.weekCount === 7) {
    saveState(state);
    render(state);
    celebrate();
    /*setTimeout(() => {
      state.weekCount = 0;
      saveState(state);
      render(state);
    }, 800);*//*
  } else {
    saveState(state);
    render(state);
    celebrate();
  }
  */
  
    saveState(state);
    render(state);
    celebrate();
});
