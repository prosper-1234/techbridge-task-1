// TechBridge — vanilla JS for mobile navigation and section reveal

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
    };

    const openMenu = () => {
      navMenu.classList.add('is-open');
      navToggle.classList.add('is-open');
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Close menu');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    // Close the mobile menu after a nav link is tapped
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Scroll reveal (skipped if user prefers reduced motion) ---------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll(
      '.about-grid, .program-card, .internship-grid, .why-item, .cta-inner, .contact-inner, ' +
      '.tasks-overview-item, .timeline-item, .progression-step, .journey-body, .tasks-cta-inner, ' +
      '.challenges-overview-inner, .challenge-filters-section, .challenges-cta-inner'
    );

    revealTargets.forEach((el) => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach((el) => observer.observe(el));
  }
});

/* =========================================================
   TASK 4 — INTERACTIVE TWO-TRACK INTERNSHIP ROADMAP
   Powers internship-roadmap.html. Wrapped in an IIFE so it
   only ever runs on the page that has the roadmap markup —
   it does nothing (and errors nothing) on the other pages
   that also load this same script.js file.
   ========================================================= */
(function () {

  /* ---------- 1. Data: two arrays of task objects, grouped by track ----------
     This is the single source of truth for the roadmap. Every task is an
     object with the same shape, so it can be looped over and rendered the
     same way regardless of which track is selected. */
  const internshipTracks = {
    dataAnalytics: {
      label: 'Data Analytics',
      intro: 'Build practical data skills through spreadsheets, SQL, visualization, analysis, and a capstone project.',
      tasks: [
        { number: '01', day: 'Day 1',  title: 'Data Cleaning Basics',
          description: 'Clean a messy dataset in Google Sheets or Excel by identifying and fixing duplicates, blanks, inconsistent formatting, and incorrect data types.',
          difficulty: 'Beginner', level: 1 },
        { number: '02', day: 'Day 4',  title: 'Formulas & Pivot Tables',
          description: 'Use formulas and Pivot Tables to answer questions and extract useful insights from a dataset.',
          difficulty: 'Beginner', level: 1 },
        { number: '03', day: 'Day 8',  title: 'Data Visualization',
          description: 'Create charts and a simple dashboard to communicate insights clearly.',
          difficulty: 'Beginner → Intermediate', level: 2 },
        { number: '04', day: 'Day 11', title: 'Introduction to SQL',
          description: 'Write basic SQL queries to answer real-world data questions.',
          difficulty: 'Beginner → Intermediate', level: 2 },
        { number: '05', day: 'Day 15', title: 'SQL Joins & Aggregations',
          description: 'Use JOIN, GROUP BY, COUNT, SUM, and AVG across multiple tables.',
          difficulty: 'Intermediate', level: 3 },
        { number: '06', day: 'Day 19', title: 'Lookup Functions & Data Wrangling',
          description: 'Use VLOOKUP/XLOOKUP to combine related datasets and handle mismatches.',
          difficulty: 'Intermediate', level: 3 },
        { number: '07', day: 'Day 22', title: 'Mini Analysis Project',
          description: 'Complete an end-to-end analysis using cleaning, formulas, Pivot Tables, charts, and recommendations.',
          difficulty: 'Intermediate', level: 3 },
        { number: '08', day: 'Day 26', title: 'Capstone Project',
          description: 'Complete a larger project combining spreadsheet analysis and SQL using at least two related tables.',
          difficulty: 'Intermediate', level: 3 }
      ]
    },
    webDevelopment: {
      label: 'Web Development',
      intro: 'Progress from HTML and CSS foundations to JavaScript-powered experiences and a complete internship platform.',
      tasks: [
        { number: '01', day: 'Day 1',  title: 'Build the TechBridge Homepage',
          description: 'Build the TechBridge homepage using HTML and CSS.',
          difficulty: 'Beginner', level: 1 },
        { number: '02', day: 'Day 4',  title: 'Build the TechBridge Programs Experience',
          description: 'Build the TechBridge Programs experience.',
          difficulty: 'Beginner', level: 1 },
        { number: '03', day: 'Day 8',  title: 'Build the Internship Tasks Experience',
          description: 'Build an interface showing the internship task journey.',
          difficulty: 'Beginner → Intermediate', level: 2 },
        { number: '04', day: 'Day 11', title: 'Build an Interactive Internship Roadmap',
          description: 'Use JavaScript to switch between the Data Analytics and Web Development tracks.',
          difficulty: 'Beginner → Intermediate', level: 2 },
        { number: '05', day: 'Day 15', title: 'Build the Intern Registration Experience',
          description: 'Build a registration and onboarding interface for interns.',
          difficulty: 'Intermediate', level: 3 },
        { number: '06', day: 'Day 19', title: 'Build the Task Submission System',
          description: 'Build an interface that allows interns to prepare and submit their task work.',
          difficulty: 'Intermediate', level: 3 },
        { number: '07', day: 'Day 22', title: 'Build the Intern Dashboard',
          description: 'Build a dashboard showing intern profile, progress, tasks, and submissions.',
          difficulty: 'Intermediate', level: 3 },
        { number: '08', day: 'Day 26', title: 'Build the Complete TechBridge Internship Platform',
          description: 'Combine the major components of the TechBridge internship experience into a complete platform.',
          difficulty: 'Intermediate', level: 3 }
      ]
    }
  };

  /* ---------- 2. DOM references ---------- */
  const trackButtons = document.querySelectorAll('.track-btn');
  const timelineList = document.getElementById('roadmapTimeline');
  const introEyebrow = document.getElementById('trackIntroEyebrow');
  const introTitle = document.getElementById('trackIntroTitle');
  const introText = document.getElementById('trackIntroText');
  const taskCountEl = document.getElementById('trackTaskCount');

  // Guard clause: this code only runs on internship-roadmap.html.
  // On every other page these elements simply don't exist, so we stop here.
  if (!trackButtons.length || !timelineList) return;

  /* ---------- 3. State ---------- */
  let selectedTrack = 'dataAnalytics';

  /* ---------- 4. Build a single task card (DOM manipulation) ---------- */
  function createTaskCard(task) {
    const item = document.createElement('li');
    item.className = 'timeline-item';

    const marker = document.createElement('div');
    marker.className = 'timeline-marker';
    marker.textContent = task.number;

    const card = document.createElement('div');
    card.className = 'timeline-card';

    const head = document.createElement('div');
    head.className = 'timeline-card-head';

    const day = document.createElement('span');
    day.className = 'timeline-day';
    day.textContent = task.day;

    const difficulty = document.createElement('span');
    difficulty.className = 'timeline-difficulty';
    difficulty.setAttribute('data-level', task.level);
    difficulty.textContent = task.difficulty;

    head.appendChild(day);
    head.appendChild(difficulty);

    const title = document.createElement('h3');
    title.className = 'timeline-title';
    title.textContent = `Task ${task.number}: ${task.title}`;

    const desc = document.createElement('p');
    desc.className = 'timeline-desc';
    desc.textContent = task.description;

    card.appendChild(head);
    card.appendChild(title);
    card.appendChild(desc);

    item.appendChild(marker);
    item.appendChild(card);

    return item;
  }

  /* ---------- 5. Render the full list of tasks for a track ---------- */
  function renderTrack(trackKey) {
    const track = internshipTracks[trackKey];

    // Clear whatever is currently in the timeline before rendering the new set
    timelineList.innerHTML = '';

    track.tasks.forEach((task) => {
      timelineList.appendChild(createTaskCard(task));
    });

    // Update the intro copy above the timeline
    introEyebrow.textContent = `${track.label} track`;
    introTitle.textContent = track.label;
    introText.textContent = track.intro;
    taskCountEl.textContent = `${track.tasks.length} tasks · Day 1 → Day 26`;

    // Small entrance transition each time content changes
    timelineList.classList.remove('roadmap-fade');
    // Force reflow so the animation can re-trigger on repeated clicks
    void timelineList.offsetWidth;
    timelineList.classList.add('roadmap-fade');
  }

  /* ---------- 6. Reflect the active track on the selector buttons ---------- */
  function updateActiveTrack(trackKey) {
    trackButtons.forEach((btn) => {
      const isActive = btn.dataset.track === trackKey;
      // Conditional logic: only the matching button gets the active state
      if (isActive) {
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  /* ---------- 7. Switch tracks (no page refresh) ---------- */
  function switchTrack(trackKey) {
    if (!internshipTracks[trackKey] || trackKey === selectedTrack) return;
    selectedTrack = trackKey;
    renderTrack(selectedTrack);
    updateActiveTrack(selectedTrack);
  }

  /* ---------- 8. Event listeners for the track buttons ---------- */
  trackButtons.forEach((btn) => {
    btn.addEventListener('click', () => switchTrack(btn.dataset.track));
  });

  /* ---------- 9. Initial render on page load ---------- */
  renderTrack(selectedTrack);
  updateActiveTrack(selectedTrack);

})();

/* =========================================================
   TASK 5 — TECHBRIDGE CHALLENGE HUB
   Powers challenges.html. Wrapped in its own IIFE so it only
   ever runs on the page that has the Challenge Hub markup —
   it does nothing (and errors nothing) on the other pages
   that also load this same script.js file.
   ========================================================= */
(function () {

  /* ---------- 1. Data: a single array of challenge objects ----------
     This is the single source of truth for the Challenge Hub. Every
     challenge shares the same shape, so the grid, filters, search, and
     modal can all work off this one array. */
  const challenges = [
    {
      id: 1,
      title: 'Sales Performance Dashboard',
      track: 'Data Analytics',
      difficulty: 'Beginner',
      description: 'Clean a raw sales dataset and turn it into a spreadsheet dashboard that highlights revenue trends and top performers.',
      outcome: 'A one-page dashboard a manager could use to spot trends at a glance.',
      objective: 'Turn a raw, unformatted sales dataset into a structured dashboard that surfaces monthly revenue trends, top-performing products, and the best and worst performing regions.',
      skills: ['Data cleaning', 'Spreadsheet formulas', 'Pivot Tables', 'Chart creation'],
      tools: ['Google Sheets', 'Microsoft Excel'],
      deliverables: 'A single spreadsheet with a cleaned data tab, a Pivot Table summary, and a dashboard tab containing at least three charts.',
      estimatedTime: '3–4 hours',
      expectedResult: 'A one-page dashboard that clearly shows monthly revenue trends, the top five products by sales, and performance broken down by region.'
    },
    {
      id: 2,
      title: 'Customer Churn Analysis',
      track: 'Data Analytics',
      difficulty: 'Intermediate',
      description: 'Query a customer dataset to uncover patterns behind churn and summarize the findings for a non-technical audience.',
      outcome: 'A short analytical report identifying which customer segments are most likely to churn.',
      objective: 'Use SQL queries to explore a customer dataset, identify churn patterns across segments such as plan type, tenure, and usage, then translate the findings into plain-language insights.',
      skills: ['SQL (JOIN, GROUP BY, aggregates)', 'Data interpretation', 'Written communication'],
      tools: ['SQL environment (SQLite, PostgreSQL, or a BigQuery sandbox)', 'Spreadsheet for the supporting summary'],
      deliverables: 'A set of SQL queries plus a one-page written summary covering the top three churn drivers and a recommendation.',
      estimatedTime: '4–5 hours',
      expectedResult: 'A concise report identifying the customer segments most at risk of churning, supported directly by the query results.'
    },
    {
      id: 3,
      title: 'Cross-Table Business Performance Report',
      track: 'Data Analytics',
      difficulty: 'Advanced',
      description: 'Join sales, product, and customer tables with SQL to build one consolidated view of business performance.',
      outcome: 'A multi-table analysis connecting revenue, product, and customer data into one coherent report.',
      objective: 'Practice working across multiple related tables to answer business questions a single table can\u2019t answer alone, then present the combined findings clearly.',
      skills: ['Advanced SQL (multi-table joins, subqueries)', 'Data aggregation', 'Business reporting'],
      tools: ['SQL environment', 'Spreadsheet or BI tool for the final summary (e.g. Google Sheets, Looker Studio)'],
      deliverables: 'SQL scripts joining at least three tables, plus a summary report combining revenue, product, and customer insights.',
      estimatedTime: '5–6 hours',
      expectedResult: 'A consolidated report showing how customer behavior and product performance relate to overall revenue.'
    },
    {
      id: 4,
      title: 'Responsive Landing Page',
      track: 'Web Development',
      difficulty: 'Beginner',
      description: 'Design and build a fully responsive landing page for a fictional product using HTML and CSS.',
      outcome: 'A polished, mobile-friendly landing page with a clear visual hierarchy.',
      objective: 'Practice structuring a page with HTML and styling it with CSS to build a landing page that works cleanly across desktop, tablet, and mobile.',
      skills: ['Semantic HTML', 'CSS layout (Flexbox/Grid)', 'Responsive design', 'Typography & spacing'],
      tools: ['HTML', 'CSS', 'Browser DevTools'],
      deliverables: 'A single-page site with a hero section, feature highlights, and a call to action, tested at common screen widths.',
      estimatedTime: '3–4 hours',
      expectedResult: 'A responsive landing page with no horizontal scrolling or overlapping content at any screen size.'
    },
    {
      id: 5,
      title: 'Interactive Business Portfolio Website',
      track: 'Web Development',
      difficulty: 'Intermediate',
      description: 'Build a multi-section portfolio-style site for a small business, including interactive navigation and hover states.',
      outcome: 'A professional multi-section site that reads clearly and feels polished to interact with.',
      objective: 'Bring together HTML, CSS, and light JavaScript to build a site with working navigation, at least one interactive UI element, and a consistent visual system.',
      skills: ['HTML/CSS structure', 'JavaScript for interactivity', 'Component-based thinking', 'Visual consistency'],
      tools: ['HTML', 'CSS', 'JavaScript'],
      deliverables: 'A multi-section site (home, services, about, contact) with working in-page navigation and at least one interactive component, such as an accordion, tabs, or a gallery.',
      estimatedTime: '5–6 hours',
      expectedResult: 'A cohesive multi-section site where navigation, hover states, and the interactive component all function correctly.'
    },
    {
      id: 6,
      title: 'Dynamic Event Booking Interface',
      track: 'Web Development',
      difficulty: 'Advanced',
      description: 'Build an interface where visitors can browse events, filter by category, and reserve a spot without a page refresh.',
      outcome: 'A working front-end booking flow driven entirely by JavaScript.',
      objective: 'Practice data-driven front-end development by rendering event data dynamically, filtering it based on user input, and updating the UI instantly.',
      skills: ['JavaScript (arrays, objects, DOM manipulation)', 'Event handling', 'Dynamic rendering', 'Form validation'],
      tools: ['HTML', 'CSS', 'JavaScript'],
      deliverables: 'A working page with a filterable event list and a booking form that confirms a selection without reloading the page.',
      estimatedTime: '6–7 hours',
      expectedResult: 'A smooth, no-refresh booking experience with working filters and a clear confirmation state once a booking is made.'
    }
  ];

  /* ---------- 2. DOM references ---------- */
  const challengeGrid = document.getElementById('challengeGrid');
  const emptyState = document.getElementById('challengeEmptyState');
  const countPill = document.getElementById('challengeCountPill');
  const trackFilterGroup = document.getElementById('trackFilterGroup');
  const difficultyFilterGroup = document.getElementById('difficultyFilterGroup');
  const searchInput = document.getElementById('challengeSearchInput');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const emptyStateResetBtn = document.getElementById('emptyStateResetBtn');

  const modalOverlay = document.getElementById('challengeModalOverlay');
  const modalClose = document.getElementById('challengeModalClose');
  const modalTrack = document.getElementById('challengeModalTrack');
  const modalDifficulty = document.getElementById('challengeModalDifficulty');
  const modalTitle = document.getElementById('challengeModalTitle');
  const modalDesc = document.getElementById('challengeModalDesc');
  const modalObjective = document.getElementById('challengeModalObjective');
  const modalSkills = document.getElementById('challengeModalSkills');
  const modalTools = document.getElementById('challengeModalTools');
  const modalDeliverables = document.getElementById('challengeModalDeliverables');
  const modalTime = document.getElementById('challengeModalTime');
  const modalResult = document.getElementById('challengeModalResult');

  // Guard clause: this code only runs on challenges.html.
  // On every other page these elements simply don't exist, so we stop here.
  if (!challengeGrid) return;

  /* ---------- 3. State ---------- */
  let selectedTrack = 'all';
  let selectedDifficulty = 'all';
  let searchTerm = '';
  let lastFocusedElement = null;

  /* ---------- 4. Track icons (inline SVG, no emoji, no external assets) ---------- */
  const trackIcons = {
    'Data Analytics':
      '<svg viewBox="0 0 48 48" fill="none">' +
      '<rect x="6" y="26" width="7" height="16" rx="1.5" class="icon-stroke"/>' +
      '<rect x="20.5" y="16" width="7" height="26" rx="1.5" class="icon-stroke"/>' +
      '<rect x="35" y="8" width="7" height="34" rx="1.5" class="icon-stroke"/>' +
      '</svg>',
    'Web Development':
      '<svg viewBox="0 0 48 48" fill="none">' +
      '<path d="M17 15 L7 24 L17 33" class="icon-stroke" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M31 15 L41 24 L31 33" class="icon-stroke" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<line x1="27" y1="10" x2="21" y2="38" class="icon-stroke" stroke-linecap="round"/>' +
      '</svg>'
  };

  const outcomeIcon =
    '<svg viewBox="0 0 20 20" fill="none"><path d="M4 10.5 L8 14.5 L16 5.5" class="icon-stroke" ' +
    'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ---------- 5. Filtering logic: combine track + difficulty + search ---------- */
  function filterChallenges() {
    return challenges.filter((challenge) => {
      const matchesTrack = selectedTrack === 'all' || challenge.track === selectedTrack;
      const matchesDifficulty = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
      const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.trim().toLowerCase());
      return matchesTrack && matchesDifficulty && matchesSearch;
    });
  }

  /* ---------- 6. Build a single challenge card ---------- */
  function createChallengeCard(challenge, index) {
    const card = document.createElement('article');
    card.className = 'challenge-card';
    card.dataset.track = challenge.track;
    card.style.animationDelay = (index * 0.06) + 's';

    card.innerHTML =
      '<div class="challenge-card-top">' +
        '<div class="challenge-card-icon" aria-hidden="true">' + trackIcons[challenge.track] + '</div>' +
        '<span class="challenge-card-id">#' + String(challenge.id).padStart(2, '0') + '</span>' +
      '</div>' +
      '<div class="challenge-card-badges">' +
        '<span class="challenge-track-badge">' + challenge.track + '</span>' +
        '<span class="challenge-difficulty-badge" data-difficulty="' + challenge.difficulty + '">' + challenge.difficulty + '</span>' +
      '</div>' +
      '<h3 class="challenge-card-title">' + challenge.title + '</h3>' +
      '<p class="challenge-card-desc">' + challenge.description + '</p>' +
      '<div class="challenge-card-outcome">' +
        outcomeIcon +
        '<p><strong>Expected outcome</strong>' + challenge.outcome + '</p>' +
      '</div>' +
      '<div class="challenge-card-footer">' +
        '<button type="button" class="challenge-view-btn" data-challenge-id="' + challenge.id + '">' +
          'View Challenge' +
          '<svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" class="icon-stroke" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
      '</div>';

    return card;
  }

  /* ---------- 7. Render the grid for the current filter/search state ---------- */
  function renderChallenges() {
    const visible = filterChallenges();

    challengeGrid.innerHTML = '';

    if (visible.length === 0) {
      challengeGrid.hidden = true;
      emptyState.hidden = false;
    } else {
      challengeGrid.hidden = false;
      emptyState.hidden = true;
      visible.forEach((challenge, index) => {
        challengeGrid.appendChild(createChallengeCard(challenge, index));
      });
    }

    if (countPill) {
      countPill.textContent = visible.length === challenges.length
        ? challenges.length + ' challenges'
        : visible.length + ' of ' + challenges.length + ' challenges';
    }
  }

  /* ---------- 8. Keep filter pill active states in sync with state ---------- */
  function updateFilterPillsUI() {
    trackFilterGroup.querySelectorAll('.filter-pill').forEach((pill) => {
      pill.classList.toggle('is-active', pill.dataset.value === selectedTrack);
    });
    difficultyFilterGroup.querySelectorAll('.filter-pill').forEach((pill) => {
      pill.classList.toggle('is-active', pill.dataset.value === selectedDifficulty);
    });
  }

  /* ---------- 9. Apply whatever the current filter/search state is ---------- */
  function updateFilters() {
    updateFilterPillsUI();
    renderChallenges();
  }

  /* ---------- 10. Filter pill click handling ---------- */
  [trackFilterGroup, difficultyFilterGroup].forEach((group) => {
    group.addEventListener('click', (event) => {
      const pill = event.target.closest('.filter-pill');
      if (!pill) return;

      if (pill.dataset.filter === 'track') {
        selectedTrack = pill.dataset.value;
      } else if (pill.dataset.filter === 'difficulty') {
        selectedDifficulty = pill.dataset.value;
      }
      updateFilters();
    });
  });

  /* ---------- 11. Search input handling ---------- */
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      searchTerm = event.target.value;
      renderChallenges();
    });
  }

  /* ---------- 12. Reset filters (track, difficulty, and search) ---------- */
  function resetFilters() {
    selectedTrack = 'all';
    selectedDifficulty = 'all';
    searchTerm = '';
    if (searchInput) searchInput.value = '';
    updateFilters();
  }
  if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetFilters);
  if (emptyStateResetBtn) emptyStateResetBtn.addEventListener('click', resetFilters);

  /* ---------- 13. Modal: open a challenge's full details ---------- */
  function renderChallengeModal(challenge) {
    modalTrack.textContent = challenge.track;
    modalTrack.setAttribute('data-track', challenge.track);
    modalDifficulty.textContent = challenge.difficulty;
    modalDifficulty.setAttribute('data-difficulty', challenge.difficulty);
    modalTitle.textContent = challenge.title;
    modalDesc.textContent = challenge.description;
    modalObjective.textContent = challenge.objective;
    modalDeliverables.textContent = challenge.deliverables;
    modalTime.textContent = challenge.estimatedTime;
    modalResult.textContent = challenge.expectedResult;

    modalSkills.innerHTML = challenge.skills.map((skill) => '<li>' + skill + '</li>').join('');
    modalTools.innerHTML = challenge.tools.map((tool) => '<li>' + tool + '</li>').join('');
  }

  function openChallenge(challengeId) {
    const challenge = challenges.find((item) => item.id === challengeId);
    if (!challenge) return;

    lastFocusedElement = document.activeElement;
    renderChallengeModal(challenge);

    modalOverlay.hidden = false;
    modalOverlay.classList.remove('is-closing');
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog for keyboard/screen-reader users
    modalClose.focus();
  }

  /* ---------- 14. Modal: close ---------- */
  function closeChallengeModal() {
    if (modalOverlay.hidden) return;

    modalOverlay.classList.add('is-closing');

    const finishClose = () => {
      modalOverlay.hidden = true;
      modalOverlay.classList.remove('is-closing');
      document.body.style.overflow = '';
      if (lastFocusedElement) lastFocusedElement.focus();
    };

    // Respect reduced motion: skip waiting on the closing animation
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      finishClose();
    } else {
      modalOverlay.addEventListener('animationend', finishClose, { once: true });
    }
  }

  /* ---------- 15. Event delegation: "View Challenge" buttons ---------- */
  challengeGrid.addEventListener('click', (event) => {
    const btn = event.target.closest('.challenge-view-btn');
    if (!btn) return;
    openChallenge(Number(btn.dataset.challengeId));
  });

  /* ---------- 16. Modal close interactions ---------- */
  modalClose.addEventListener('click', closeChallengeModal);

  // Close when clicking the dimmed overlay, but not the dialog itself
  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) closeChallengeModal();
  });

  // Close on Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modalOverlay.hidden) closeChallengeModal();
  });

  // Basic focus containment: keep Tab within the modal while it's open
  modalOverlay.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || modalOverlay.hidden) return;
    const focusable = modalOverlay.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* ---------- 17. Initial render on page load ---------- */
  renderChallenges();

})();


/* =========================================================
   GLOBAL SCROLL REVEALS — enabled on every TechBridge page
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const selectors = [
    'main > section',
    'main > .section',
    'main > article',
    '.hero-content',
    '.hero-visual',
    '.page-hero-content',
    '.section-header',
    '.section-title',
    '.section-heading',
    '.program-card',
    '.task-card',
    '.challenge-card',
    '.feature-card',
    '.info-card',
    '.timeline-item',
    '.roadmap-card',
    '.step-card',
    '.stat-card',
    '.testimonial-card',
    'footer'
  ];

  const elements = [...new Set(selectors.flatMap(selector => [...document.querySelectorAll(selector)]))];
  if (!elements.length) return;

  elements.forEach((el, index) => {
    if (el.closest('[hidden]')) return;
    el.classList.add('tb-reveal');
    const delay = Math.min((index % 6) * 70, 350);
    el.style.setProperty('--tb-delay', `${delay}ms`);
  });

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('tb-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('tb-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  elements.forEach(el => observer.observe(el));
});
