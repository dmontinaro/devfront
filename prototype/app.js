// Three UI variants of the First Transformation flow, switchable via ?variant=.
const variants = [
  { key: "A", name: "Living atlas" },
  { key: "B", name: "Cinematic signal" },
  { key: "C", name: "Field console" },
];

const app = document.querySelector("#app");
const variantLabel = document.querySelector("#variant-label");

function worldMarkup() {
  return `
    <div class="world" aria-label="Frontier world map">
      <div class="orbit orbit-outer"></div>
      <div class="orbit orbit-inner"></div>
      <div class="terrain terrain-one"></div>
      <div class="terrain terrain-two"></div>
      <div class="path path-one"></div>
      <div class="path path-two"></div>
      <div class="world-node node-build"><i></i><span>Build</span></div>
      <div class="world-node node-knowledge"><i></i><span>Knowledge</span></div>
      <div class="world-node node-trust"><i></i><span>Trust</span></div>
      <div class="world-node node-automation"><i></i><span>Automation</span></div>
      <div class="shield-zone">
        <div class="shield-pulse"></div>
        <div class="shield-tower">
          <span class="tower-light"></span>
          <span class="tower-top"></span>
          <span class="tower-body"></span>
          <span class="tower-base"></span>
        </div>
        <span class="zone-label">Stability frontier</span>
      </div>
      <div class="world-core"><span>DF</span><small>World core</small></div>
      <div class="particles" aria-hidden="true">${Array.from({ length: 18 }, (_, index) => `<i style="--i:${index}"></i>`).join("")}</div>
    </div>`;
}

function missionButton(label = "Choose mission") {
  return `<button class="primary-action" type="button" data-action="advance">${label}<span>→</span></button>`;
}

function progressMarkup() {
  return `
    <div class="goal-progress">
      <div class="progress-copy"><span>Frontier stability</span><strong data-progress-label>22 / 40</strong></div>
      <div class="progress-track"><i data-progress-bar></i></div>
    </div>`;
}

function rewardMarkup() {
  return `
    <div class="reward-list">
      <div><span class="reward-icon">◈</span><small>Domain progress</small><strong>+18 Stability</strong></div>
      <div><span class="reward-icon">↗</span><small>Skill growth</small><strong>+120 XP</strong></div>
      <div><span class="reward-icon">⬡</span><small>World resource</small><strong>1 Flux Core</strong></div>
    </div>`;
}

function variantA() {
  return `
    <main class="experience variant-a" data-step="mission">
      <header class="topbar">
        <a class="brand" href="?variant=A" aria-label="devfront home"><span>DF</span>devfront</a>
        <div class="world-id"><i></i> World 001 · online</div>
        <button class="icon-button" type="button" aria-label="Open player profile">DM</button>
      </header>
      <section class="atlas-layout">
        <div class="atlas-stage">
          <div class="eyebrow">Your world</div>
          <div class="map-status"><span>Cycle 08</span><span>5 domains</span><span>62% awake</span></div>
          ${worldMarkup()}
          <div class="transformation-callout" role="status">
            <span>Frontier transformed</span>
            <strong>The Shield Tower is online.</strong>
          </div>
        </div>
        <aside class="mission-panel">
          <div class="panel-step"><span data-step-number>01</span> Mission</div>
          <div class="mission-state state-mission">
            <p class="kicker">Next world goal</p>
            <h1>Stabilize the<br />Frontier</h1>
            <p class="intro">Restore the eastern shield line and bring life back to the dormant region.</p>
            ${progressMarkup()}
            <article class="mission-card">
              <div class="mission-meta"><span>Recommended</span><span>60–90 min</span></div>
              <h2>Secure the auth flow with an E2E test</h2>
              <p>Protect a critical path with verified browser coverage.</p>
              <div class="mission-yield"><span>Expected yield</span><strong>+18 Stability</strong></div>
            </article>
            ${missionButton()}
          </div>
          <div class="mission-state state-work">
            <p class="kicker">Mission in progress</p>
            <h1>Real work<br />completed?</h1>
            <p class="intro">This prototype simulates the evidence step. In the real product, work can be verified by GitHub or documented privately.</p>
            <div class="evidence-card"><span class="evidence-mark">✓</span><div><small>Simulated evidence</small><strong>Auth flow covered by E2E test</strong><p>1 test file · 4 assertions · critical path</p></div></div>
            ${missionButton("Confirm completion")}
          </div>
          <div class="mission-state state-reward">
            <p class="kicker">Mission complete</p>
            <h1>Your work<br />changed the world.</h1>
            <p class="intro">The repaired auth flow powers the eastern shield line.</p>
            ${rewardMarkup()}
            ${missionButton("Transform world")}
          </div>
          <div class="mission-state state-transformed">
            <p class="kicker">Frontier stabilized</p>
            <h1>A safer region<br />comes alive.</h1>
            <p class="intro">The Shield Tower now protects the eastern settlements and unlocks a new route.</p>
            ${progressMarkup()}
            <article class="next-goal"><small>Next world goal</small><strong>Connect the northern archive</strong><p>Build 12 · Knowledge 8</p></article>
            <button class="secondary-action" type="button" data-action="reset">Replay transformation</button>
          </div>
        </aside>
      </section>
    </main>`;
}

function variantB() {
  return `
    <main class="experience variant-b" data-step="mission">
      <div class="cinematic-backdrop">${worldMarkup()}</div>
      <header class="cinematic-header">
        <a class="brand" href="?variant=B"><span>DF</span>devfront</a>
        <div class="chapter">Chapter 01 <i></i> The silent frontier</div>
      </header>
      <section class="story-card">
        <div class="story-index"><span data-step-number>01</span><i></i><small data-story-label>Choose your mission</small></div>
        <div class="mission-state state-mission">
          <p class="kicker">A region is waiting</p>
          <h1>Bring the frontier<br />back online.</h1>
          <p class="intro">One piece of real work can wake the eastern shield line.</p>
          <button class="cinematic-mission" type="button" data-action="advance"><span><small>Stability mission · 60–90 min</small><strong>Secure the auth flow with an E2E test</strong></span><b>Accept →</b></button>
        </div>
        <div class="mission-state state-work">
          <p class="kicker">The work is done</p>
          <h1>Turn evidence<br />into energy.</h1>
          <div class="signal-proof"><span>Verified output</span><strong>Auth flow covered</strong><i></i></div>
          ${missionButton("Confirm the signal")}
        </div>
        <div class="mission-state state-reward">
          <p class="kicker">Signal acquired</p>
          <h1>Three rewards.<br />One consequence.</h1>
          ${rewardMarkup()}
          ${missionButton("Release energy")}
        </div>
        <div class="mission-state state-transformed">
          <p class="kicker">The frontier answers</p>
          <h1>Light returns<br />to the east.</h1>
          <p class="intro">Your work built protection where there was none. A path to the northern archive is now visible.</p>
          <button class="secondary-action" type="button" data-action="reset">Experience it again</button>
        </div>
      </section>
      <div class="cinematic-progress"><span data-cinematic-progress></span></div>
    </main>`;
}

function variantC() {
  return `
    <main class="experience variant-c" data-step="mission">
      <header class="console-header">
        <a class="brand" href="?variant=C"><span>DF</span>DEVFRONT / FIELD CONSOLE</a>
        <div class="console-status"><span>WORLD_001</span><span class="online">● ONLINE</span><span>CYCLE_08</span></div>
      </header>
      <section class="console-grid">
        <aside class="domain-rail">
          <p>DOMAIN NETWORK</p>
          <button type="button"><i class="build"></i><span>01</span>BUILD<small>12</small></button>
          <button type="button" class="active"><i class="stability"></i><span>02</span>STABILITY<small data-rail-score>22</small></button>
          <button type="button"><i class="knowledge"></i><span>03</span>KNOWLEDGE<small>08</small></button>
          <button type="button"><i class="trust"></i><span>04</span>TRUST<small>14</small></button>
          <button type="button"><i class="automation"></i><span>05</span>AUTOMATION<small>06</small></button>
        </aside>
        <section class="console-world">
          <div class="coordinate">48° 12′ N / FRONTIER_EAST</div>
          ${worldMarkup()}
          <div class="scanline"></div>
        </section>
        <aside class="console-task">
          <div class="task-heading"><span data-step-number>01</span><small data-console-label>AVAILABLE MISSION</small></div>
          <div class="mission-state state-mission">
            <p class="system-label">OBJECTIVE / STABILIZE_FRONTIER</p>
            <h1>SECURE THE<br />AUTH FLOW</h1>
            <p class="intro">Add an E2E test to protect a critical path. Estimated duration: 60–90 minutes.</p>
            <dl><div><dt>OUTPUT</dt><dd>Browser coverage</dd></div><div><dt>IMPACT</dt><dd>Critical path</dd></div><div><dt>YIELD</dt><dd>+18 STABILITY</dd></div></dl>
            ${missionButton("INITIATE MISSION")}
          </div>
          <div class="mission-state state-work">
            <p class="system-label">EVIDENCE / READY</p>
            <h1>VERIFY<br />THE OUTPUT</h1>
            <div class="console-log"><span>✓ TEST_FILE_DETECTED</span><span>✓ 4_ASSERTIONS_PASSED</span><span>✓ CRITICAL_PATH_COVERED</span></div>
            ${missionButton("CONFIRM OUTPUT")}
          </div>
          <div class="mission-state state-reward">
            <p class="system-label">REWARD / CALCULATED</p>
            <h1>ROUTE<br />THE ENERGY</h1>
            ${rewardMarkup()}
            ${missionButton("EXECUTE TRANSFORMATION")}
          </div>
          <div class="mission-state state-transformed">
            <p class="system-label">REGION / STABLE</p>
            <h1>SHIELD GRID<br />ONLINE</h1>
            <div class="console-log success"><span>STABILITY 22 → 40</span><span>ROUTE NORTH_ARCHIVE UNLOCKED</span><span>NEXT_OBJECTIVE AVAILABLE</span></div>
            <button class="secondary-action" type="button" data-action="reset">RESET SIMULATION</button>
          </div>
        </aside>
      </section>
    </main>`;
}

const renderers = { A: variantA, B: variantB, C: variantC };
const steps = ["mission", "work", "reward", "transformed"];
let currentStep = 0;

function getVariant() {
  const requested = new URLSearchParams(window.location.search).get("variant")?.toUpperCase();
  return variants.some(({ key }) => key === requested) ? requested : "A";
}

function render() {
  const variant = getVariant();
  const meta = variants.find(({ key }) => key === variant);
  app.innerHTML = renderers[variant]();
  variantLabel.textContent = `${meta.key} — ${meta.name}`;
  currentStep = 0;
  updateStep();
}

function updateStep() {
  const experience = document.querySelector(".experience");
  const step = steps[currentStep];
  experience.dataset.step = step;
  experience.querySelectorAll("[data-step-number]").forEach((item) => {
    item.textContent = String(currentStep + 1).padStart(2, "0");
  });

  const storyLabels = ["Choose your mission", "Confirm real work", "Understand reward", "See the change"];
  experience.querySelectorAll("[data-story-label]").forEach((item) => {
    item.textContent = storyLabels[currentStep];
  });
  experience.querySelectorAll("[data-console-label]").forEach((item) => {
    item.textContent = storyLabels[currentStep].toUpperCase();
  });
  experience.querySelectorAll("[data-cinematic-progress]").forEach((item) => {
    item.style.width = `${(currentStep + 1) * 25}%`;
  });
}

function changeVariant(direction) {
  const currentIndex = variants.findIndex(({ key }) => key === getVariant());
  const nextIndex = (currentIndex + direction + variants.length) % variants.length;
  const url = new URL(window.location.href);
  url.searchParams.set("variant", variants[nextIndex].key);
  window.history.replaceState({}, "", url);
  render();
}

document.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "advance" && currentStep < steps.length - 1) {
    currentStep += 1;
    updateStep();
  }
  if (action === "reset") {
    currentStep = 0;
    updateStep();
  }
});

document.querySelector("#previous-variant").addEventListener("click", () => changeVariant(-1));
document.querySelector("#next-variant").addEventListener("click", () => changeVariant(1));

document.addEventListener("keydown", (event) => {
  const target = event.target;
  if (target instanceof Element && target.matches("input, textarea, [contenteditable]")) return;
  if (event.key === "ArrowLeft") changeVariant(-1);
  if (event.key === "ArrowRight") changeVariant(1);
});

window.addEventListener("popstate", render);
render();
