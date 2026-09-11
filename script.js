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
      '.tasks-overview-item, .timeline-item, .progression-step, .journey-body, .tasks-cta-inner'
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
