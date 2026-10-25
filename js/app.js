/**
 * SANDEEP VARIER MLA — OFFICIAL WEBSITE CLIENT JAVASCRIPT
 * Features:
 * - Dual Theme Switcher (INC Royal Blue & White / Dark Poster Noir)
 * - Complete English & Malayalam Language Engine
 * - Interactive Grievance Filing with Unique Token Generator & Local Storage
 * - Real-Time Grievance Status Tracker with Visual Step Progress
 * - Appointment Booking Simulator
 * - Emergency Directory Modal (Inspired by reference data)
 * - Project Case Study Modal Viewer
 * - KPI Number Counter Animation
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. THEME SWITCHER ENGINE
     ========================================================================== */
  const htmlEl = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const SAVED_THEME_KEY = 'mla_sandeep_theme';

  // Check saved theme or default to 'blue-white'
  const savedTheme = localStorage.getItem(SAVED_THEME_KEY) || 'blue-white';
  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme') || 'blue-white';
      const nextTheme = currentTheme === 'blue-white' ? 'dark-poster' : 'blue-white';
      setTheme(nextTheme);
    });
  }

  function setTheme(themeName) {
    htmlEl.setAttribute('data-theme', themeName);
    localStorage.setItem(SAVED_THEME_KEY, themeName);
  }

  /* ==========================================================================
     2. BILINGUAL LANGUAGE ENGINE (ENGLISH & MALAYALAM)
     ========================================================================== */
  const langButtons = document.querySelectorAll('.lang-btn');
  const SAVED_LANG_KEY = 'mla_sandeep_lang';

  const savedLang = localStorage.getItem(SAVED_LANG_KEY) || 'en';
  setLanguage(savedLang);

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetLang = btn.getAttribute('data-set-lang');
      if (targetLang) {
        setLanguage(targetLang);
      }
    });
  });

  function setLanguage(lang) {
    htmlEl.setAttribute('data-lang', lang);
    localStorage.setItem(SAVED_LANG_KEY, lang);

    // Update active state of buttons
    langButtons.forEach(b => {
      if (b.getAttribute('data-set-lang') === lang) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    // Translate all elements with data-en and data-ml
    const translatableElements = document.querySelectorAll('[data-en][data-ml]');
    translatableElements.forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        // If element is an input or textarea with placeholder
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });
  }

  /* ==========================================================================
     3. KPI METRIC COUNTER ANIMATION
     ========================================================================== */
  const counterElements = document.querySelectorAll('.counter');
  let hasCounted = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasCounted) {
        hasCounted = true;
        counterElements.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1600; // ms
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target;
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.2 });

  const metricsSection = document.querySelector('.hero-col.hero-metrics');
  if (metricsSection) {
    countObserver.observe(metricsSection);
  }

  /* ==========================================================================
     4. CITIZEN PORTAL TABS
     ========================================================================== */
  const portalTabs = document.querySelectorAll('.portal-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');

  portalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPaneId = tab.getAttribute('data-tab');

      portalTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tabPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const targetPane = document.getElementById(targetPaneId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     5. GRIEVANCE SUBMISSION & TOKEN GENERATOR
     ========================================================================== */
  const grievanceForm = document.getElementById('grievance-form');
  const receiptModal = document.getElementById('receipt-modal');
  const receiptTokenId = document.getElementById('receipt-token-id');
  const receiptName = document.getElementById('receipt-name');
  const receiptLocality = document.getElementById('receipt-locality');
  const receiptCategory = document.getElementById('receipt-category');
  const receiptTimestamp = document.getElementById('receipt-timestamp');
  const btnCopyToken = document.getElementById('btn-copy-token');
  const btnCloseReceipt = document.getElementById('btn-close-receipt');

  // Seed default grievances in localStorage if not exists
  const SEED_STORAGE_KEY = 'mla_grievances_db';
  if (!localStorage.getItem(SEED_STORAGE_KEY)) {
    const defaultTickets = {
      'TKP-2026-1082': {
        name: 'Suresh Kumar P.',
        phone: '98471XXXXX',
        panchayat: 'Thrikkaripur',
        ward: 'Ward 04, Kooliyad',
        category: 'PWD Roads & Bridges',
        details: 'Urgent tarring and culvert repair required on Kooliyad - Padanna rural stretch.',
        status: 'inspection',
        statusText: 'Under Field Inspection by PWD Assistant Engineer',
        date: '18 Oct 2026'
      },
      'TKP-2026-4419': {
        name: 'Fathima Beegum',
        phone: '94473XXXXX',
        panchayat: 'Cheruvathur',
        ward: 'Ward 11, Railway Station Road',
        category: 'Drinking Water (KWA)',
        details: 'Low water pressure and line leakage along municipal pipeline line.',
        status: 'sanctioned',
        statusText: 'Special KWA Repair Sanction Approved by MLA Office',
        date: '21 Oct 2026'
      }
    };
    localStorage.setItem(SEED_STORAGE_KEY, JSON.stringify(defaultTickets));
  }

  if (grievanceForm) {
    grievanceForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('citizen-name').value.trim();
      const phoneVal = document.getElementById('citizen-phone').value.trim();
      const panchayatVal = document.getElementById('panchayat-select').value;
      const wardVal = document.getElementById('ward-number').value.trim();
      const categoryVal = document.getElementById('dept-category').value;
      const detailsVal = document.getElementById('grievance-details').value.trim();

      // Generate unique token
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const generatedToken = `TKP-2026-${randomNum}`;
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

      // Save into DB
      const db = JSON.parse(localStorage.getItem(SEED_STORAGE_KEY) || '{}');
      db[generatedToken] = {
        name: nameVal,
        phone: phoneVal,
        panchayat: panchayatVal,
        ward: wardVal,
        category: categoryVal,
        details: detailsVal,
        status: 'submitted',
        statusText: 'Registered at MLA Office Desk — Verification Pending',
        date: formattedDate
      };
      localStorage.setItem(SEED_STORAGE_KEY, JSON.stringify(db));

      // Populate Receipt Modal
      if (receiptTokenId) receiptTokenId.textContent = generatedToken;
      if (receiptName) receiptName.textContent = nameVal;
      if (receiptLocality) receiptLocality.textContent = `${panchayatVal} (${wardVal})`;
      if (receiptCategory) receiptCategory.textContent = categoryVal;
      if (receiptTimestamp) receiptTimestamp.textContent = formattedDate;

      // Open Modal
      if (receiptModal) {
        receiptModal.classList.add('open');
      }

      grievanceForm.reset();
    });
  }

  // Copy Tracking ID button
  if (btnCopyToken) {
    btnCopyToken.addEventListener('click', () => {
      const code = receiptTokenId.textContent;
      navigator.clipboard.writeText(code).then(() => {
        const originalText = btnCopyToken.innerHTML;
        btnCopyToken.innerHTML = '<span>✓ Copied to Clipboard!</span>';
        setTimeout(() => {
          btnCopyToken.innerHTML = originalText;
        }, 2000);
      });
    });
  }

  // Close Receipt and switch to Track tab
  if (btnCloseReceipt) {
    btnCloseReceipt.addEventListener('click', () => {
      if (receiptModal) receiptModal.classList.remove('open');
      const trackTab = document.querySelector('.portal-tab[data-tab="tab-track"]');
      if (trackTab) {
        trackTab.click();
        const code = receiptTokenId.textContent;
        const trackInput = document.getElementById('track-id-input');
        if (trackInput) {
          trackInput.value = code;
          document.getElementById('btn-run-track').click();
        }
      }
    });
  }

  const closeReceiptModal = document.getElementById('close-receipt-modal');
  if (closeReceiptModal) {
    closeReceiptModal.addEventListener('click', () => {
      if (receiptModal) receiptModal.classList.remove('open');
    });
  }

  /* ==========================================================================
     6. REAL-TIME TRACKING LOOKUP
     ========================================================================== */
  const btnRunTrack = document.getElementById('btn-run-track');
  const trackIdInput = document.getElementById('track-id-input');
  const trackerResultBox = document.getElementById('tracker-result-box');
  const sampleChips = document.querySelectorAll('.sample-chip');

  sampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const sampleId = chip.getAttribute('data-sample-id');
      if (trackIdInput) {
        trackIdInput.value = sampleId;
        renderTrackingResult(sampleId);
      }
    });
  });

  if (btnRunTrack) {
    btnRunTrack.addEventListener('click', () => {
      const queryId = trackIdInput ? trackIdInput.value.trim().toUpperCase() : '';
      if (!queryId) {
        alert('Please enter a valid tracking token (e.g., TKP-2026-1082)');
        return;
      }
      renderTrackingResult(queryId);
    });
  }

  function renderTrackingResult(tokenId) {
    const db = JSON.parse(localStorage.getItem(SEED_STORAGE_KEY) || '{}');
    const ticket = db[tokenId];

    if (!trackerResultBox) return;

    if (!ticket) {
      trackerResultBox.style.display = 'block';
      trackerResultBox.innerHTML = `
        <div style="text-align: center; padding: 1.5rem 0;">
          <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🔍</div>
          <h4 style="font-size: 1.15rem; font-weight: 800; margin-bottom: 0.3rem;">Token "${tokenId}" Not Found</h4>
          <p style="font-size: 0.88rem; color: var(--text-muted);">Please check the token spelling or click one of the verified sample tokens above to test.</p>
        </div>
      `;
      return;
    }

    // Determine stepper active states
    let step1 = 'completed';
    let step2 = ticket.status === 'submitted' ? 'current' : 'completed';
    let step3 = (ticket.status === 'inspection' || ticket.status === 'sanctioned') ? 'completed' : (ticket.status === 'submitted' ? '' : 'current');
    let step4 = ticket.status === 'sanctioned' ? 'current' : '';
    let step5 = ticket.status === 'resolved' ? 'completed' : '';

    trackerResultBox.style.display = 'block';
    trackerResultBox.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <span style="font-size: 0.75rem; font-weight: 800; color: var(--color-primary); letter-spacing: 0.8px;">VERIFIED CONSTITUENCY PETITION</span>
          <h4 style="font-size: 1.4rem; font-weight: 900; margin-top: 0.15rem;">${tokenId}</h4>
          <span style="font-size: 0.82rem; color: var(--text-muted);">${ticket.panchayat} • ${ticket.ward}</span>
        </div>
        <div style="text-align: right;">
          <span style="display: inline-block; padding: 0.35rem 0.85rem; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 800; background: rgba(22, 163, 74, 0.12); color: var(--color-green);">
            ● LIVE STATUS
          </span>
          <div style="font-size: 0.78rem; color: var(--text-light); margin-top: 0.3rem;">Filed on ${ticket.date}</div>
        </div>
      </div>

      <!-- Stepper Indicator -->
      <div class="tracking-stepper">
        <div class="step-node ${step1}">
          <div class="step-bullet">1</div>
          <span class="step-label">Submitted</span>
        </div>
        <div class="step-node ${step2}">
          <div class="step-bullet">2</div>
          <span class="step-label">MLA Review</span>
        </div>
        <div class="step-node ${step3}">
          <div class="step-bullet">3</div>
          <span class="step-label">Field Inspect</span>
        </div>
        <div class="step-node ${step4}">
          <div class="step-bullet">4</div>
          <span class="step-label">Sanction</span>
        </div>
        <div class="step-node ${step5}">
          <div class="step-bullet">5</div>
          <span class="step-label">Delivered</span>
        </div>
      </div>

      <div style="background: var(--bg-surface); padding: 1.2rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-top: 1.25rem;">
        <div style="font-size: 0.8rem; font-weight: 800; color: var(--text-light); text-transform: uppercase;">Current Action Note:</div>
        <p style="font-size: 0.95rem; font-weight: 700; color: var(--color-primary); margin-top: 0.3rem;">${ticket.statusText}</p>
        <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 0.5rem; line-height: 1.5;">
          <strong>Issue Summary:</strong> ${ticket.details} (${ticket.category})
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     7. APPOINTMENT SCHEDULER
     ========================================================================== */
  const appointmentForm = document.getElementById('appointment-form');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('app-name').value;
      const date = document.getElementById('app-date').value;
      alert(`Thank you, ${name}! Your appointment request for ${date} at the Thrikkaripur MLA Office has been forwarded to the Private Secretary. You will receive an SMS and WhatsApp confirmation shortly.`);
      appointmentForm.reset();
    });
  }

  /* ==========================================================================
     8. MODALS CONTROL (Emergency & Project Viewer)
     ========================================================================== */
  const emergencyModal = document.getElementById('emergency-modal');
  const btnEmergencyNav = document.getElementById('btn-emergency-modal');
  const btnEmergencyBottom = document.getElementById('btn-open-emergency-bottom');
  const footerEmergencyTrigger = document.getElementById('footer-emergency-trigger');
  const closeEmergencyModal = document.getElementById('close-emergency-modal');

  const openEmergency = () => emergencyModal && emergencyModal.classList.add('open');
  const closeEmergency = () => emergencyModal && emergencyModal.classList.remove('open');

  if (btnEmergencyNav) btnEmergencyNav.addEventListener('click', openEmergency);
  if (btnEmergencyBottom) btnEmergencyBottom.addEventListener('click', openEmergency);
  if (footerEmergencyTrigger) footerEmergencyTrigger.addEventListener('click', openEmergency);
  if (closeEmergencyModal) closeEmergencyModal.addEventListener('click', closeEmergency);

  // Close on backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(modal => {
        modal.classList.remove('open');
      });
    }
  });

  /* ==========================================================================
     9. PROJECT INITIATIVE MODAL
     ========================================================================== */
  const projectModal = document.getElementById('project-modal');
  const closeProjectModal = document.getElementById('close-project-modal');
  const initiativeCards = document.querySelectorAll('.initiative-card');
  const btnViewAllProjects = document.getElementById('btn-view-all-projects');

  const initiativeData = {
    '1': {
      num: '01',
      title: 'Coastal Belt Protection & Fisherfolk Welfare',
      category: 'COASTAL INFRASTRUCTURE & WELFARE',
      img: 'assets/images/project-coastal.jpg',
      status: 'Active Works in Progress',
      region: 'Kottikulam, Padanna & Valiyaparamba Coastline',
      scheme: 'KIIFB & Coastal Disaster Fund',
      desc: 'Addressing the historic soil erosion and heavy monsoonal sea surge facing Kasaragod coastal settlements. The initiative entails modern geo-textile tube reinforced seawalls, mechanized net mending yards, 24x7 solar navigation lights, and welfare relief funds for fishing families during ban periods.'
    },
    '2': {
      num: '02',
      title: 'Valiyaparamba Eco-Tourism & Island Connectivity',
      category: 'ECO-TOURISM & WATERWAYS',
      img: 'assets/images/project-valiyaparamba.jpg',
      status: 'Project Sanctioned & In Execution',
      region: 'Valiyaparamba Backwaters & Islands',
      scheme: 'Tourism Infrastructure Mission & MLA-ADS',
      desc: 'Positioning Valiyaparamba island strip as a global model of sustainable responsible tourism. Key milestones include eco-friendly solar passenger ferries, mangrove conservation walkways, local homestay skill upgrades, and emergency water ambulance linkages connecting islanders to main hospitals.'
    },
    '3': {
      num: '03',
      title: 'Smart Classrooms & Digital Youth Skill Hubs',
      category: 'DIGITAL EDUCATION & CAREERS',
      img: 'assets/images/project-skills.jpg',
      status: 'Phase 1 Deployed in 8 Schools',
      region: 'Higher Secondary Schools in Thrikkaripur',
      scheme: 'Education Rejuvenation Mission',
      desc: 'Equipping youth in Kasaragod with high-demand digital economy capabilities. The program upgrades government schools with interactive digital display panels, broadband connectivity, robotics labs, competitive examination (UPSC/PSC/Banking) guidance hubs, and public skill incubation centers.'
    }
  };

  initiativeCards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-initiative-id');
      const data = initiativeData[id];
      if (data && projectModal) {
        document.getElementById('modal-proj-num').textContent = data.num;
        document.getElementById('modal-proj-title').textContent = data.title;
        document.getElementById('modal-proj-category').textContent = data.category;
        document.getElementById('modal-proj-img').src = data.img;
        document.getElementById('modal-proj-status').textContent = data.status;
        document.getElementById('modal-proj-region').textContent = data.region;
        document.getElementById('modal-proj-scheme').textContent = data.scheme;
        document.getElementById('modal-proj-desc').textContent = data.desc;

        projectModal.classList.add('open');
      }
    });
  });

  if (btnViewAllProjects) {
    btnViewAllProjects.addEventListener('click', () => {
      // Open the first project as showcase or scroll down
      const firstCard = document.querySelector('.initiative-card[data-initiative-id="1"]');
      if (firstCard) firstCard.click();
    });
  }

  if (closeProjectModal) {
    closeProjectModal.addEventListener('click', () => {
      projectModal.classList.remove('open');
    });
  }

  /* ==========================================================================
     10. CURRENT YEAR IN FOOTER
     ========================================================================== */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
