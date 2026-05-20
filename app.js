/* ==========================================================================
   Kaamwala AI Engine Core Controller
   ========================================================================== */

// 1. Core State Configuration
const appState = {
  activeCustomerQuery: "",
  detectedLanguage: "mix", // mix, roman, en
  nlpResult: {
    intent: "None",
    urgency: "Normal",
    location: "G-11",
    confidence: 0,
    cleanTranslation: "None"
  },
  matchingWeights: {
    distance: 0.25,
    specialization: 0.20,
    reliability: 0.15,
    price: 0.10,
    cancel: 0.10,
    rating: 0.12,
    experience: 0.08
  },
  currentCustomerMarker: { x: 4, y: 4 }, // Custom default location
  providers: [],
  selectedProvider: null,
  activeInvoice: null,
  
  // Lifecycle state
  // Idle, Matching, Offered, Accepted, EnRoute, Arrived, InProgress, Completed, AwaitingRating, Disputed
  lifecycleState: "Idle", 
  
  // Stress / Chaos states
  stressFlags: {
    rushHourSurge: false,
    lockAllBusy: false,
  },
  
  // Global tickers
  countdownTimer: null,
  countdownVal: 15,
  simJourneyInterval: null,
  simJobInterval: null,
  
  // Leaderboard cache
  rankedLeaderboard: []
};

// 2. Preseeded Detailed Database (18 Providers across 9 Categories in Islamabad Sectors)
const preseededProviders = [
  // Plumbers
  {
    id: "prov_plumb_1",
    name: "Tariq Masood",
    service: "Plumber",
    specialization: "Pipe Leakage, Tap & Sink Repair",
    rating: 4.7,
    reliability: 0.96,
    cancelRate: 0.04,
    baseRate: 1200,
    location: "G-11",
    coordinates: { x: 3, y: 3.5 },
    availability: ["09:00 AM", "01:00 PM", "05:00 PM"],
    recentReviews: [
      { text: "Fast leakage fix!", rating: 5, daysAgo: 1 },
      { text: "Good behaviour.", rating: 4, daysAgo: 4 }
    ],
    experience: "8 years",
    certifications: ["National Vocational Board (NVB) Plumber"],
    jobsCompleted: 412,
    isBusy: false,
    earnings: 0,
    avatar: "🚰"
  },
  {
    id: "prov_plumb_2",
    name: "Kamran Akmal",
    service: "Plumber",
    specialization: "Sewerage blockages, Commode installation",
    rating: 4.2,
    reliability: 0.88,
    cancelRate: 0.12,
    baseRate: 1000,
    location: "I-8",
    coordinates: { x: 12, y: 2 },
    availability: ["11:00 AM", "04:00 PM"],
    recentReviews: [{ text: "Arrived a bit late but job done.", rating: 3, daysAgo: 6 }],
    experience: "4 years",
    certifications: [],
    jobsCompleted: 120,
    isBusy: false,
    earnings: 0,
    avatar: "🔧"
  },
  
  // AC Repair
  {
    id: "prov_ac_1",
    name: "Arshad Mahmood",
    service: "AC Repair",
    specialization: "Inverter ACs, Gas Refilling, Compressor Repairs",
    rating: 4.9,
    reliability: 0.99,
    cancelRate: 0.01,
    baseRate: 2000,
    location: "G-10",
    coordinates: { x: 4.5, y: 3.8 },
    availability: ["10:00 AM", "12:00 PM", "04:00 PM"],
    recentReviews: [
      { text: "Excellent AC work, expert in inverters.", rating: 5, daysAgo: 2 },
      { text: "Highly professional.", rating: 5, daysAgo: 5 }
    ],
    experience: "7 years",
    certifications: ["DAE HVAC certified", "Samsung Pro Tech"],
    jobsCompleted: 589,
    isBusy: false,
    earnings: 0,
    avatar: "❄️"
  },
  {
    id: "prov_ac_2",
    name: "Sajid Khan",
    service: "AC Repair",
    specialization: "Window ACs, General Cleaning & Servicing",
    rating: 4.4,
    reliability: 0.92,
    cancelRate: 0.05,
    baseRate: 1500,
    location: "E-11",
    coordinates: { x: 2, y: 6.5 },
    availability: ["02:00 PM", "06:00 PM"],
    recentReviews: [{ text: "Nice service and fair price.", rating: 4, daysAgo: 8 }],
    experience: "3 years",
    certifications: ["Local Guild Member"],
    jobsCompleted: 98,
    isBusy: false,
    earnings: 0,
    avatar: "💨"
  },

  // Electricians
  {
    id: "prov_elec_1",
    name: "Jamil Qureshi",
    service: "Electrician",
    specialization: "UPS Installation, Board repair, Short circuit fix",
    rating: 4.8,
    reliability: 0.97,
    cancelRate: 0.02,
    baseRate: 800,
    location: "F-11",
    coordinates: { x: 1.8, y: 4.5 },
    availability: ["08:00 AM", "11:00 AM", "03:00 PM"],
    recentReviews: [
      { text: "Fixed dangerous board wiring issues instantly.", rating: 5, daysAgo: 3 }
    ],
    experience: "10 years",
    certifications: ["Electrical Wiring License class B"],
    jobsCompleted: 730,
    isBusy: false,
    earnings: 0,
    avatar: "🔌"
  },
  {
    id: "prov_elec_2",
    name: "Naeem Akhtar",
    service: "Electrician",
    specialization: "Ceiling fans, Chandelier hanging, basic wiring",
    rating: 4.1,
    reliability: 0.85,
    cancelRate: 0.15,
    baseRate: 600,
    location: "G-13",
    coordinates: { x: -1, y: 2 },
    availability: ["03:00 PM", "07:00 PM"],
    recentReviews: [{ text: "Decent work.", rating: 4, daysAgo: 12 }],
    experience: "2 years",
    certifications: [],
    jobsCompleted: 54,
    isBusy: false,
    earnings: 0,
    avatar: "💡"
  },

  // Tutors
  {
    id: "prov_tutor_1",
    name: "Sidra Rafique",
    service: "Tutor",
    specialization: "Mathematics & Physics, Grade 8-10, O-levels",
    rating: 4.95,
    reliability: 0.98,
    cancelRate: 0.01,
    baseRate: 2500,
    location: "F-10",
    coordinates: { x: 4.2, y: 5 },
    availability: ["04:00 PM", "06:00 PM"],
    recentReviews: [
      { text: "My daughter scored 95% in Math exam. Best tutor!", rating: 5, daysAgo: 3 }
    ],
    experience: "6 years",
    certifications: ["MSc Mathematics (QAU)", "Best Lecturer Award 2024"],
    jobsCompleted: 142,
    isBusy: false,
    earnings: 0,
    avatar: "📚"
  },
  {
    id: "prov_tutor_2",
    name: "Zain Ali",
    service: "Tutor",
    specialization: "Primary classes, Urdu, English tutoring",
    rating: 4.5,
    reliability: 0.94,
    cancelRate: 0.04,
    baseRate: 1500,
    location: "G-11",
    coordinates: { x: 3.2, y: 3.2 },
    availability: ["03:00 PM", "05:00 PM"],
    recentReviews: [{ text: "Patient and friendly teacher.", rating: 5, daysAgo: 10 }],
    experience: "3 years",
    certifications: ["BEd Qualified"],
    jobsCompleted: 64,
    isBusy: false,
    earnings: 0,
    avatar: "✏️"
  },

  // House Cleaning
  {
    id: "prov_clean_1",
    name: "Shazia Bibi",
    service: "House Cleaning",
    specialization: "Deep kitchen scrubbing, Bathroom hygiene, Carpet wash",
    rating: 4.6,
    reliability: 0.95,
    cancelRate: 0.03,
    baseRate: 1800,
    location: "G-11",
    coordinates: { x: 3.5, y: 3.6 },
    availability: ["09:00 AM", "02:00 PM"],
    recentReviews: [
      { text: "Extremely tidy! Kitchen looks brand new.", rating: 5, daysAgo: 5 }
    ],
    experience: "5 years",
    certifications: ["Premium Maid Training Academy certification"],
    jobsCompleted: 280,
    isBusy: false,
    earnings: 0,
    avatar: "🧹"
  },
  {
    id: "prov_clean_2",
    name: "Bashiran Mai",
    service: "House Cleaning",
    specialization: "General dusting, Sweeping & Mopping",
    rating: 4.3,
    reliability: 0.90,
    cancelRate: 0.08,
    baseRate: 1200,
    location: "I-8",
    coordinates: { x: 11, y: 1.5 },
    availability: ["10:00 AM", "01:00 PM"],
    recentReviews: [{ text: "Good routine cleaner.", rating: 4, daysAgo: 14 }],
    experience: "4 years",
    certifications: [],
    jobsCompleted: 198,
    isBusy: false,
    earnings: 0,
    avatar: "🧼"
  },

  // Mechanics
  {
    id: "prov_mech_1",
    name: "Faisal Qureshi",
    service: "Car Mechanic",
    specialization: "Engine diagnostics, Brake repairs, Battery jumpstart",
    rating: 4.8,
    reliability: 0.97,
    cancelRate: 0.02,
    baseRate: 1500,
    location: "G-10",
    coordinates: { x: 4.6, y: 3.5 },
    availability: ["09:00 AM", "03:00 PM", "06:00 PM"],
    recentReviews: [
      { text: "Quick battery jumpstart at midnight! Life saver.", rating: 5, daysAgo: 4 }
    ],
    experience: "12 years",
    certifications: ["Master Auto Tech (Deutscher standard)"],
    jobsCompleted: 672,
    isBusy: false,
    earnings: 0,
    avatar: "🚗"
  },

  // Beauticians
  {
    id: "prov_beauty_1",
    name: "Rida Shah",
    service: "Beautician",
    specialization: "Bridal Makeup, Facials, Hair styling & blowdry",
    rating: 4.9,
    reliability: 0.98,
    cancelRate: 0.01,
    baseRate: 3000,
    location: "F-11",
    coordinates: { x: 1.9, y: 4.7 },
    availability: ["11:00 AM", "03:00 PM", "06:00 PM"],
    recentReviews: [
      { text: "Fabulous bridal makeup! Recieving lots of compliments.", rating: 5, daysAgo: 2 }
    ],
    experience: "8 years",
    certifications: ["L'Oreal Professional Expert Degree"],
    jobsCompleted: 305,
    isBusy: false,
    earnings: 0,
    avatar: "💄"
  },

  // Drivers
  {
    id: "prov_drive_1",
    name: "Muhammad Ali",
    service: "Driver",
    specialization: "Inter-city tours, Luxury cars, night driving",
    rating: 4.75,
    reliability: 0.96,
    cancelRate: 0.03,
    baseRate: 2000,
    location: "E-11",
    coordinates: { x: 2.2, y: 6.3 },
    availability: ["07:00 AM", "12:00 PM", "07:00 PM"],
    recentReviews: [
      { text: "Extremely safe driver, knew all shortcuts.", rating: 5, daysAgo: 6 }
    ],
    experience: "9 years",
    certifications: ["HTV driving license", "First Aid certified"],
    jobsCompleted: 450,
    isBusy: false,
    earnings: 0,
    avatar: "🚐"
  },

  // Local Carpenters/Painters
  {
    id: "prov_carp_1",
    name: "Waseem Najjar",
    service: "Carpenter/Painter",
    specialization: "Cabinet fitting, door lock repair, sofa polish",
    rating: 4.65,
    reliability: 0.94,
    cancelRate: 0.04,
    baseRate: 1500,
    location: "G-11",
    coordinates: { x: 3.8, y: 3.9 },
    availability: ["10:00 AM", "03:00 PM"],
    recentReviews: [
      { text: "Beautiful kitchen drawer modifications.", rating: 5, daysAgo: 9 }
    ],
    experience: "11 years",
    certifications: [],
    jobsCompleted: 504,
    isBusy: false,
    earnings: 0,
    avatar: "🪚"
  }
];

// Seed other filler providers to total exactly 18
const fillerProviders = [
  {
    id: "prov_elec_3",
    name: "Bilal Sabri",
    service: "Electrician",
    specialization: "Solar panel setup, inverter panels",
    rating: 4.6,
    reliability: 0.93,
    cancelRate: 0.04,
    baseRate: 1800,
    location: "I-8",
    coordinates: { x: 12, y: 2.2 },
    availability: ["10:00 AM", "02:00 PM"],
    recentReviews: [],
    experience: "5 years",
    certifications: ["PEECA Solar Auditor Certified"],
    jobsCompleted: 110,
    isBusy: false,
    earnings: 0,
    avatar: "☀️"
  },
  {
    id: "prov_plumb_3",
    name: "Imran Bhatti",
    service: "Plumber",
    specialization: "Geyser repairs, boiling pipe fitting",
    rating: 4.5,
    reliability: 0.92,
    cancelRate: 0.05,
    baseRate: 1500,
    location: "F-10",
    coordinates: { x: 4.0, y: 4.8 },
    availability: ["08:00 AM", "12:00 PM"],
    recentReviews: [],
    experience: "6 years",
    certifications: [],
    jobsCompleted: 215,
    isBusy: false,
    earnings: 0,
    avatar: "🔥"
  },
  {
    id: "prov_beauty_2",
    name: "Sadia Mumtaz",
    service: "Beautician",
    specialization: "Waxing, Threading, Manicure/Pedicure",
    rating: 4.3,
    reliability: 0.89,
    cancelRate: 0.07,
    baseRate: 1000,
    location: "G-10",
    coordinates: { x: 4.4, y: 3.4 },
    availability: ["12:00 PM", "04:00 PM"],
    recentReviews: [],
    experience: "3 years",
    certifications: [],
    jobsCompleted: 88,
    isBusy: false,
    earnings: 0,
    avatar: "💅"
  },
  {
    id: "prov_clean_3",
    name: "Riaz Masih",
    service: "House Cleaning",
    specialization: "Water tank wash, window cleaning",
    rating: 4.4,
    reliability: 0.93,
    cancelRate: 0.04,
    baseRate: 1600,
    location: "G-13",
    coordinates: { x: -0.8, y: 1.8 },
    availability: ["09:00 AM", "03:00 PM"],
    recentReviews: [],
    experience: "6 years",
    certifications: [],
    jobsCompleted: 147,
    isBusy: false,
    earnings: 0,
    avatar: "🪣"
  }
];

// Initialize database array
appState.providers = [...preseededProviders, ...fillerProviders];

// 3. UI Elements Mapping
const dom = {
  // Common UI
  statState: document.getElementById("stat-state"),
  statActiveProviders: document.getElementById("stat-active-providers"),
  statAvgConfidence: document.getElementById("stat-avg-confidence"),
  btnResetApp: document.getElementById("btn-reset-app"),
  
  // Customer Screen
  selectCustomerLang: document.getElementById("select-customer-lang"),
  customerChatScroller: document.getElementById("customer-chat-scroller"),
  customerQuickChips: document.getElementById("customer-quick-chips"),
  customerMapContainer: document.getElementById("customer-map-container"),
  providerGpsMarker: document.getElementById("provider-gps-marker"),
  mapEtaVal: document.getElementById("map-eta-val"),
  mapRoute: document.getElementById("map-route"),
  customerRatingOverlay: document.getElementById("customer-rating-overlay"),
  ratingProviderName: document.getElementById("rating-provider-name"),
  ratingComment: document.getElementById("rating-comment"),
  btnSubmitRating: document.getElementById("btn-submit-rating"),
  customerMessageInput: document.getElementById("customer-message-input"),
  btnVoiceInput: document.getElementById("btn-voice-input"),
  btnSendMessage: document.getElementById("btn-send-message"),
  
  // Provider Screen
  provHeaderAvatar: document.getElementById("prov-header-avatar"),
  provHeaderName: document.getElementById("prov-header-name"),
  provHeaderStatus: document.getElementById("prov-header-status"),
  provEarningsBadge: document.getElementById("prov-earnings-badge"),
  
  provStateOffline: document.getElementById("prov-state-offline"),
  provStateSearching: document.getElementById("prov-state-searching"),
  provStateAlert: document.getElementById("prov-state-alert"),
  provStateActive: document.getElementById("prov-state-active"),
  
  btnGoOnline: document.getElementById("btn-go-online"),
  btnGoOffline: document.getElementById("btn-go-offline"),
  alertCountdown: document.getElementById("alert-countdown"),
  alertCustLoc: document.getElementById("alert-cust-loc"),
  alertServiceType: document.getElementById("alert-service-type"),
  alertEstPay: document.getElementById("alert-est-pay"),
  alertDistance: document.getElementById("alert-distance"),
  btnDeclineJob: document.getElementById("btn-decline-job"),
  btnAcceptJob: document.getElementById("btn-accept-job"),
  
  jobProgressBadge: document.getElementById("job-progress-badge"),
  activeClientName: document.getElementById("active-client-name"),
  activeClientPhone: document.getElementById("active-client-phone"),
  jobJourneyProgress: document.getElementById("job-journey-progress"),
  jobHudEta: document.getElementById("job-hud-eta"),
  provChecklistUl: document.getElementById("prov-checklist-ul"),
  btnProvAction: document.getElementById("btn-prov-action"),
  
  // Antigravity HUD
  nlpIntent: document.getElementById("nlp-intent"),
  nlpUrgency: document.getElementById("nlp-urgency"),
  nlpConfidenceBar: document.getElementById("nlp-confidence-bar"),
  nlpConfidenceVal: document.getElementById("nlp-confidence-val"),
  nlpExtractedLocation: document.getElementById("nlp-extracted-location"),
  nlpRawInput: document.getElementById("nlp-raw-input"),
  nlpCleanTranslation: document.getElementById("nlp-clean-translation"),
  
  matchmakingLeaderboardTbody: document.getElementById("matchmaking-leaderboard-tbody"),
  
  invoiceDetails: document.getElementById("invoice-details"),
  gaugeCapacityVal: document.getElementById("gauge-capacity-val"),
  gaugeCapacityFill: document.getElementById("gauge-capacity-fill"),
  gaugeSurgeVal: document.getElementById("gauge-surge-val"),
  
  // Weight Tuners
  weightDistance: document.getElementById("weight-distance"),
  valWDistance: document.getElementById("val-w-distance"),
  weightSpecialization: document.getElementById("weight-specialization"),
  valWSpecialization: document.getElementById("val-w-specialization"),
  weightReliability: document.getElementById("weight-reliability"),
  valWReliability: document.getElementById("val-w-reliability"),
  weightPrice: document.getElementById("weight-price"),
  valWPrice: document.getElementById("val-w-price"),
  weightCancel: document.getElementById("weight-cancel"),
  valWCancel: document.getElementById("val-w-cancel"),
  weightRating: document.getElementById("weight-rating"),
  valWRating: document.getElementById("val-w-rating"),
  weightExperience: document.getElementById("weight-experience"),
  valWExperience: document.getElementById("val-w-experience"),
  btnResetWeights: document.getElementById("btn-reset-weights"),
  weightSumWarning: document.getElementById("weight-sum-warning"),
  
  // Logs
  consoleTerminal: document.getElementById("console-terminal"),
  btnClearLogs: document.getElementById("btn-clear-logs"),
  syncDbStatus: document.getElementById("sync-db-status"),
  syncSheetStatus: document.getElementById("sync-sheet-status"),
  sheetLogUl: document.getElementById("sheet-log-ul"),
  
  // Stress Testing buttons
  stressBtnCancel: document.getElementById("stress-btn-cancel"),
  stressBtnRush: document.getElementById("stress-btn-rush"),
  stressBtnNoproviders: document.getElementById("stress-btn-noproviders"),
  stressBtnSlang: document.getElementById("stress-btn-slang"),
  
  // Tab panels
  tabBtns: document.querySelectorAll(".console-tabs .tab-btn"),
  tabPanels: document.querySelectorAll(".console-content .tab-panel"),
  
  // Toast container
  toastContainer: document.getElementById("toast-container")
};

// ==========================================================================
// 4. Auxiliary / Helper Engines
// ==========================================================================

// Display toast notifications
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <span class="toast-close">&times;</span>
  `;
  dom.toastContainer.appendChild(toast);
  
  // Close action
  toast.querySelector(".toast-close").addEventListener("click", () => {
    toast.remove();
  });
  
  // Auto-remove toast after 4s
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(120%)";
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}

// Add logs to Orchestrator Console
function logToTerminal(message, type = "normal") {
  const line = document.createElement("div");
  line.className = `terminal-line ${type}`;
  const timestamp = new Date().toLocaleTimeString();
  line.innerHTML = `<span class="prompt">[${timestamp}] AntigravityOS:</span> ${message}`;
  dom.consoleTerminal.appendChild(line);
  dom.consoleTerminal.scrollTop = dom.consoleTerminal.scrollHeight;
}

// Stream data sync to mock Google Sheets simulator console
const sheetsSyncLog = [];
function logToGoogleSheets(action, details) {
  const timestamp = new Date().toLocaleTimeString();
  const newRow = `Row added | Timestamp: ${timestamp} | Event: ${action.toUpperCase()} | Data: ${JSON.stringify(details)}`;
  sheetsSyncLog.unshift(newRow);
  if (sheetsSyncLog.length > 3) sheetsSyncLog.pop();
  
  // render list
  dom.sheetLogUl.innerHTML = sheetsSyncLog.map(row => `<li>${row}</li>`).join("");
}

// Translate dynamic Euclidean distance
function calculateDistance(coord1, coord2) {
  return Math.sqrt(Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2)).toFixed(2);
}

// Coordinate translator from Cartesian space to actual Islamabad GPS (lat/lng)
function cartesianToGps(coord) {
  // Center of Islamabad coordinates: lat 33.6844, lng 73.0479
  return [
    33.6844 + (coord.y - 4) * 0.015,
    73.0479 + (coord.x - 4) * 0.015
  ];
}

// Initialize Leaflet Map focused on Customer
function initializeLeafletMap() {
  try {
    const custGps = cartesianToGps(appState.currentCustomerMarker);
    const provGps = cartesianToGps(appState.selectedProvider.coordinates);

    // Re-check or instantiate Leaflet map
    if (!appState.map) {
      appState.map = L.map('leaflet-map', {
        zoomControl: false,
        attributionControl: false
      });
      
      // Beautiful Dark Matter Map Tiles matching Dark theme perfectly
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(appState.map);
    } else {
      // Clear previous elements
      if (appState.custMarker) appState.map.removeLayer(appState.custMarker);
      if (appState.provMarker) appState.map.removeLayer(appState.provMarker);
      if (appState.routePolyline) appState.map.removeLayer(appState.routePolyline);
    }

    // Leaflet gotcha: invalidate size after showing container
    setTimeout(() => {
      if (appState.map) appState.map.invalidateSize();
    }, 100);

    // Create premium neon div-icon markers
    const customerIcon = L.divIcon({
      html: '<div style="font-size: 24px; filter: drop-shadow(0 0 6px var(--color-purple)); line-height: 1;">🏠</div>',
      className: 'leaflet-emoji-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    
    const providerIcon = L.divIcon({
      html: `<div style="font-size: 24px; filter: drop-shadow(0 0 6px var(--color-blue)); line-height: 1;">${appState.selectedProvider.avatar || '🚗'}</div>`,
      className: 'leaflet-emoji-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Plot pins
    appState.custMarker = L.marker(custGps, { icon: customerIcon }).addTo(appState.map)
      .bindPopup(`<b>Apka Ghar</b><br>Sector ${appState.nlpResult.location}`, { closeButton: false });
      
    appState.provMarker = L.marker(provGps, { icon: providerIcon }).addTo(appState.map)
      .bindPopup(`<b>${appState.selectedProvider.name}</b><br>${appState.selectedProvider.specialization}`, { closeButton: false }).openPopup();

    // Dotted routing polyline
    appState.routePolyline = L.polyline([provGps, custGps], {
      color: 'var(--color-purple)',
      weight: 3,
      opacity: 0.8,
      dashArray: '5, 10'
    }).addTo(appState.map);

    // Auto fit viewport
    appState.map.fitBounds(L.latLngBounds([provGps, custGps]), {
      padding: [30, 30]
    });
    
  } catch (err) {
    console.error("Leaflet map initialization failed: ", err);
    logToTerminal(`Map initialization error: ${err.message}`, "error-log");
  }
}

// Display real-time weights warning sums
function checkWeightsSum() {
  const total = (
    parseFloat(dom.weightDistance.value) +
    parseFloat(dom.weightSpecialization.value) +
    parseFloat(dom.weightReliability.value) +
    parseFloat(dom.weightPrice.value) +
    parseFloat(dom.weightCancel.value) +
    parseFloat(dom.weightRating.value) +
    parseFloat(dom.weightExperience.value)
  );
  
  appState.matchingWeights = {
    distance: parseFloat(dom.weightDistance.value),
    specialization: parseFloat(dom.weightSpecialization.value),
    reliability: parseFloat(dom.weightReliability.value),
    price: parseFloat(dom.weightPrice.value),
    cancel: parseFloat(dom.weightCancel.value),
    rating: parseFloat(dom.weightRating.value),
    experience: parseFloat(dom.weightExperience.value)
  };
  
  dom.weightSumWarning.textContent = `Weights Sum: ${total.toFixed(2)}`;
  if (Math.abs(total - 1.0) > 0.01) {
    dom.weightSumWarning.className = "warning-text red-alert";
    dom.weightSumWarning.textContent += " (Sum must equal 1.00!)";
  } else {
    dom.weightSumWarning.className = "warning-text";
  }
}

// Dynamic stars UI trigger
function initStars() {
  const starBtns = document.querySelectorAll(".stars-row .star-btn");
  starBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      const selectedRating = parseInt(this.getAttribute("data-rating"));
      starBtns.forEach(sb => {
        const r = parseInt(sb.getAttribute("data-rating"));
        if (r <= selectedRating) {
          sb.classList.add("active");
        } else {
          sb.classList.remove("active");
        }
      });
      btn.parentNode.setAttribute("data-selected-rating", selectedRating);
    });
  });
}

// Reset rating overlay stars
function resetRatingOverlayStars() {
  const starBtns = document.querySelectorAll(".stars-row .star-btn");
  starBtns.forEach(sb => sb.classList.remove("active"));
  document.querySelector(".stars-row").removeAttribute("data-selected-rating");
  dom.ratingComment.value = "";
}

// ==========================================================================
// 5. Intelligent Roman Urdu & Code-Switched Multilingual NLP Engine
// ==========================================================================

function runMultilingualNLPEngine(rawQuery) {
  logToTerminal(`Analyzing multilingual query: "${rawQuery}"`, "system");
  
  const query = rawQuery.toLowerCase();
  
  // Lexicon mappings
  const keywords = {
    "AC Repair": ["ac", "air conditioner", "compressor", "thanda", "cooling", "inverter ac"],
    "Plumber": ["plumber", "leak", "sink", "tap", "flush", "commode", "leakage", "paani", "bathroom", "geyser"],
    "Tutor": ["tutor", "parhana", "math", "teach", "study", "class", "physics", "teacher", "bache"],
    "Car Mechanic": ["mechanic", "car", "gari", "start", "battery", "engine", "brake"],
    "House Cleaning": ["clean", "safai", "sweeping", "scrub", "carpet", "bathroom safai", "maid", "kitchen scrub"],
    "Electrician": ["electrician", "bijli", "fan", "switch", "board", "short circuit", "ups", "wire", "bulb"],
    "Beautician": ["beautician", "makeup", "bridal", "facial", "waxing", "hair styling", "blowdry", "salon"],
    "Driver": ["driver", "car ride", "luxury car", "intercity", "safar", "night drive"],
    "Carpenter/Painter": ["carpenter", "paint", "cabinet", "lock repair", "wood", "sofa polish", "darwaza"]
  };

  const locations = ["g-11", "g-13", "f-11", "f-10", "i-8", "e-11", "g-10"];
  const urgencyWords = ["jaldi", "emergency", "urgent", "asap", "fauran", "abhi", "speedy", "immediate"];
  
  let detectedIntent = "None";
  let maxScore = 0;
  
  // Scans lexicon mapping weights
  for (const [service, tokens] of Object.entries(keywords)) {
    let score = 0;
    tokens.forEach(t => {
      if (query.includes(t)) {
        score += query.includes(" " + t + " ") || query.startsWith(t) || query.endsWith(t) ? 2 : 1;
      }
    });
    if (score > maxScore) {
      maxScore = score;
      detectedIntent = service;
    }
  }

  // Location extraction
  let detectedLocation = "G-11"; // Default location Islamabad
  locations.forEach(loc => {
    if (query.includes(loc)) {
      detectedLocation = loc.toUpperCase();
    }
  });

  // Urgency extraction
  let detectedUrgency = "Normal";
  urgencyWords.forEach(u => {
    if (query.includes(u)) {
      detectedUrgency = "High";
    }
  });

  // Multilingual translation simulation
  let cleanTranslation = "None";
  if (detectedIntent !== "None") {
    const urgencyPhrase = detectedUrgency === "High" ? " urgently" : "";
    cleanTranslation = `Requires a professional ${detectedIntent} service at sector ${detectedLocation}${urgencyPhrase}.`;
  } else {
    cleanTranslation = "Unable to process unstructured conversation. Requiring user input validation.";
  }

  // Compute confidence scores
  let confidence = 0;
  if (detectedIntent !== "None") {
    confidence = Math.min(80 + maxScore * 5, 99);
  } else {
    confidence = Math.min(10 + query.length * 0.5, 40);
  }
  
  // Save results
  appState.nlpResult = {
    intent: detectedIntent,
    urgency: detectedUrgency,
    location: detectedLocation,
    confidence: confidence,
    cleanTranslation: cleanTranslation
  };

  // Render to NLP HUD Panel
  dom.nlpIntent.textContent = detectedIntent;
  dom.nlpUrgency.textContent = detectedUrgency;
  dom.nlpConfidenceVal.textContent = `${confidence}%`;
  dom.nlpConfidenceBar.style.width = `${confidence}%`;
  dom.nlpExtractedLocation.textContent = detectedLocation;
  dom.nlpRawInput.textContent = `"${rawQuery}"`;
  dom.nlpCleanTranslation.textContent = cleanTranslation;
  
  logToTerminal(`NLP Result: Intent [${detectedIntent}], Urgency [${detectedUrgency}], Conf [${confidence}%]`, "success-log");
  
  return appState.nlpResult;
}

// ==========================================================================
// 6. Dynamic Matching & Pricing Algorithms
// ==========================================================================

function execute7FactorMatching(nlpResult) {
  if (nlpResult.intent === "None") {
    dom.matchmakingLeaderboardTbody.innerHTML = `
      <tr>
        <td colspan="9" class="text-center error-log">Failed to resolve service type. Ensure correct lexicon inputs.</td>
      </tr>
    `;
    return [];
  }

  logToTerminal("Executing 7-Factor Provider Search Optimization...", "system");
  
  const customerSector = nlpResult.location; // G-11
  
  // Set approximate sector coordinates for distance calculations
  const sectorCoordinates = {
    "G-11": { x: 3, y: 3 },
    "G-13": { x: -1, y: 1.5 },
    "F-11": { x: 1.5, y: 4.5 },
    "F-10": { x: 4, y: 5 },
    "G-10": { x: 4.5, y: 3.5 },
    "I-8": { x: 12, y: 2 },
    "E-11": { x: 2, y: 6.5 }
  };
  
  const custCoord = sectorCoordinates[customerSector] || { x: 3, y: 3 };
  appState.currentCustomerMarker = custCoord;

  // Filter providers matching service
  let candidates = appState.providers.filter(p => p.service === nlpResult.intent);
  
  if (appState.stressFlags.lockAllBusy) {
    candidates.forEach(p => p.isBusy = true);
  }

  // Calculate scores
  const scoredCandidates = candidates.map(p => {
    // 1. Distance factor (exponential decay)
    const distance = parseFloat(calculateDistance(custCoord, p.coordinates));
    const s_distance = Math.max(0, 1 - (distance / 15)); // normalized

    // 2. Skill fit (Base match 0.7, specialization keywords increase match)
    let s_skill = 0.7;
    const cleanSpec = p.specialization.toLowerCase();
    const query = appState.activeCustomerQuery.toLowerCase();
    
    // Check key phrases
    if (query.includes("leak") && cleanSpec.includes("leak")) s_skill = 1.0;
    if (query.includes("inverter") && cleanSpec.includes("inverter")) s_skill = 1.0;
    if (query.includes("solar") && cleanSpec.includes("solar")) s_skill = 1.0;
    if (query.includes("geyser") && cleanSpec.includes("geyser")) s_skill = 1.0;

    // 3. Reliability
    const s_reliability = p.reliability;

    // 4. Price Compatibility (Closer to average is better)
    const avgSectorRates = 1500;
    const s_price = Math.max(0, 1 - Math.abs(p.baseRate - avgSectorRates) / 3000);

    // 5. Cancellation rate score
    const s_cancel = 1 - p.cancelRate;

    // 6. Rating (normalized out of 5)
    const s_rating = p.rating / 5;

    // 7. Experience score (cap at 15 years)
    const expYears = parseInt(p.experience) || 3;
    const s_experience = Math.min(expYears / 15, 1.0);

    // Composite weights calculation
    const w = appState.matchingWeights;
    const totalScore = (
      w.distance * s_distance +
      w.specialization * s_skill +
      w.reliability * s_reliability +
      w.price * s_price +
      w.cancel * s_cancel +
      w.rating * s_rating +
      w.experience * s_experience
    );

    return {
      ...p,
      distance: distance,
      scores: {
        distance: s_distance,
        skill: s_skill,
        reliability: s_reliability,
        price: s_price,
        cancel: s_cancel,
        rating: s_rating,
        experience: s_experience
      },
      totalScore: parseFloat(totalScore.toFixed(3))
    };
  });

  // Sort candidates
  scoredCandidates.sort((a, b) => b.totalScore - a.totalScore);
  
  appState.rankedLeaderboard = scoredCandidates;
  
  // Render scoreboard grid
  renderMatchmakingLeaderboard(scoredCandidates);
  
  return scoredCandidates;
}

function renderMatchmakingLeaderboard(candidates) {
  if (candidates.length === 0) {
    dom.matchmakingLeaderboardTbody.innerHTML = `
      <tr>
        <td colspan="9" class="text-center error-log">No candidates matched. Sector capacity: 0%</td>
      </tr>
    `;
    return;
  }

  dom.matchmakingLeaderboardTbody.innerHTML = candidates.map((p, idx) => {
    const isMatchedWinner = idx === 0 && !p.isBusy;
    const busyText = p.isBusy ? '<span class="warning-text">(Busy)</span>' : '';
    const nameStr = isMatchedWinner ? `${p.name} <span class="winner-badge-cell">MATCHED</span>` : `${p.name} ${busyText}`;
    const rowClass = isMatchedWinner ? 'winner-row' : '';

    return `
      <tr class="${rowClass}">
        <td>#${idx + 1}</td>
        <td>${p.avatar} ${nameStr}</td>
        <td>${p.service}</td>
        <td>${p.scores.rating.toFixed(2)}</td>
        <td>${p.scores.distance.toFixed(2)} (${p.distance} km)</td>
        <td>${p.scores.reliability.toFixed(2)}</td>
        <td>${p.scores.cancel.toFixed(2)}</td>
        <td>${p.scores.experience.toFixed(2)}</td>
        <td class="highlight font-bold">${p.totalScore}</td>
      </tr>
    `;
  }).join("");
  
  logToTerminal("Matchmaker grid updated with real-time scoring parameters.", "system");
}

function calculateDynamicPricing(provider, nlpResult) {
  logToTerminal(`Calculating invoice dynamic quote details for ${provider.name}`, "system");
  
  const baseRate = provider.baseRate;
  const distance = calculateDistance(appState.currentCustomerMarker, provider.coordinates);
  
  // Base distance travel buffer calculation (PKR 50 per km)
  const travelBuffer = Math.round(distance * 50);
  
  // Urgency multiplier
  let surgeMultiplier = nlpResult.urgency === "High" ? 1.3 : 1.0;
  
  // Chaos Stress Multiplier triggers
  if (appState.stressFlags.rushHourSurge) {
    surgeMultiplier = 3.0; // Artificial extreme surge peak
    logToTerminal("Chaos Agent Active: 3.0x extreme surge pricing applied!", "error-log");
  }

  // Base invoice price
  const subtotal = baseRate + travelBuffer;
  const surgeCharge = Math.round(subtotal * (surgeMultiplier - 1));
  const loyaltyDiscount = 200; // customer loyalty rebate code
  
  const finalPrice = Math.max(subtotal + surgeCharge - loyaltyDiscount, baseRate);

  appState.activeInvoice = {
    baseRate,
    travelBuffer,
    surgeCharge,
    surgeMultiplier,
    loyaltyDiscount,
    finalPrice
  };

  // Render receipt items
  dom.invoiceDetails.innerHTML = `
    <div class="inv-line"><span>Base Service Fee (${provider.service})</span><span class="right">PKR ${baseRate}</span></div>
    <div class="inv-line"><span>Distance Travel Buffer (${distance} km)</span><span class="right">PKR ${travelBuffer}</span></div>
    <div class="inv-line"><span>Urgency/Surge Multiplier</span><span class="right" style="color: ${surgeMultiplier > 1 ? 'var(--color-amber)' : 'white'}">${surgeMultiplier.toFixed(1)}x (+PKR ${surgeCharge})</span></div>
    <div class="inv-line"><span>Loyalty Discount Code (K-LOYAL)</span><span class="right" style="color: var(--color-green)">-PKR ${loyaltyDiscount}</span></div>
    <div class="inv-line total-line"><span>Final Estimated Quote</span><span class="right">PKR ${finalPrice}</span></div>
  `;

  // Render Capacity state & Surge levels
  if (appState.stressFlags.rushHourSurge) {
    dom.gaugeCapacityVal.textContent = "94%";
    dom.gaugeCapacityFill.style.width = "94%";
    dom.gaugeCapacityFill.style.background = "var(--color-red)";
    dom.gaugeSurgeVal.textContent = "CRITICAL SURGE";
    dom.gaugeSurgeVal.className = "gauge-val inline-badge red-badge";
  } else {
    // Regular calculations
    const capacityVal = Math.round(30 + Math.random() * 20);
    dom.gaugeCapacityVal.textContent = `${capacityVal}%`;
    dom.gaugeCapacityFill.style.width = `${capacityVal}%`;
    dom.gaugeCapacityFill.style.background = "var(--color-blue)";
    dom.gaugeSurgeVal.textContent = nlpResult.urgency === "High" ? "HIGH DEMAND" : "REGULAR";
    dom.gaugeSurgeVal.className = nlpResult.urgency === "High" ? "gauge-val inline-badge orange-badge" : "gauge-val inline-badge green-badge";
  }

  logToTerminal(`Pricing engine complete: Total PKR ${finalPrice}`, "success-log");
  
  return appState.activeInvoice;
}

// ==========================================================================
// 7. Interactive Lifecycle Controller State Machine
// ==========================================================================

function appendChatBubble(message, sender = "bot") {
  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-message ${sender}-msg`;
  msgDiv.innerHTML = `
    <div class="msg-bubble">${message}</div>
  `;
  dom.customerChatScroller.appendChild(msgDiv);
  dom.customerChatScroller.scrollTop = dom.customerChatScroller.scrollHeight;
}

function appendSystemCard(title, detailsHTML) {
  const msgDiv = document.createElement("div");
  msgDiv.className = "chat-message system-msg";
  msgDiv.innerHTML = `
    <div class="system-card glass">
      <div class="system-card-title">${title}</div>
      <div class="system-card-body">${detailsHTML}</div>
    </div>
  `;
  dom.customerChatScroller.appendChild(msgDiv);
  dom.customerChatScroller.scrollTop = dom.customerChatScroller.scrollHeight;
}

// Global lifecycle flow driver
function transitionLifecycle(nextState) {
  logToTerminal(`Workflow transition: ${appState.lifecycleState} ➡️ ${nextState}`, "system");
  appState.lifecycleState = nextState;
  
  // Sync to database sheets
  logToGoogleSheets("state_transition", {
    sessionState: nextState,
    userId: "cust_islamabad_901",
    providerId: appState.selectedProvider ? appState.selectedProvider.id : "None"
  });

  switch (nextState) {
    case "Idle":
      // Reset state variables
      appState.selectedProvider = null;
      appState.activeInvoice = null;
      
      // Reset UI elements
      dom.customerMapContainer.classList.add("hide");
      dom.customerQuickChips.classList.remove("hide");
      dom.customerRatingOverlay.classList.add("hide");
      
      // Update Provider screen elements
      dom.provStateOffline.classList.remove("hide");
      dom.provStateSearching.classList.add("hide");
      dom.provStateAlert.classList.add("hide");
      dom.provStateActive.classList.add("hide");
      
      dom.provHeaderStatus.textContent = "Offline";
      dom.provHeaderStatus.className = "online-indicator offline";
      dom.stressBtnCancel.disabled = true;
      
      // Reset Leaflet Map
      if (appState.custMarker && appState.map) appState.map.removeLayer(appState.custMarker);
      if (appState.provMarker && appState.map) appState.map.removeLayer(appState.provMarker);
      if (appState.routePolyline && appState.map) appState.map.removeLayer(appState.routePolyline);
      appState.custMarker = null;
      appState.provMarker = null;
      appState.routePolyline = null;
      if (appState.map) {
        appState.map.remove();
        appState.map = null;
      }
      
      break;

    case "Matching":
      // Lock inputs during calculations
      dom.customerQuickChips.classList.add("hide");
      appendChatBubble("AI is scanning closest providers, analyzing on-time schedules, and computing dynamic estimates...", "bot");
      
      // Execute scoring engines
      setTimeout(() => {
        const results = execute7FactorMatching(appState.nlpResult);
        
        if (results.length === 0) {
          transitionLifecycle("SearchFailed");
          return;
        }

        // Fetch winner (non-busy first candidate)
        const winner = results.find(p => !p.isBusy);
        if (!winner) {
          transitionLifecycle("SearchFailed");
          return;
        }

        appState.selectedProvider = winner;
        
        // Dynamic quotes
        const invoice = calculateDynamicPricing(winner, appState.nlpResult);
        
        // Show estimate details to Customer
        appendSystemCard("QUOTE SUMMARY FOUND", `
          <strong>Matched Partner:</strong> ${winner.name} (${winner.experience} exp)<br>
          <strong>Base Service Pay:</strong> PKR ${winner.baseRate}<br>
          <strong>Dynamic Fares Quote:</strong> PKR ${invoice.finalPrice}<br>
          <strong>Reliability Rating:</strong> ⭐ ${winner.rating} (${winner.jobsCompleted} jobs completed)<br>
          <button id="btn-cust-confirm-quote" class="btn-primary full-width" style="margin-top:8px;">Confirm and Dispatch</button>
        `);

        // Attach listener to newly generated button
        document.getElementById("btn-cust-confirm-quote").addEventListener("click", () => {
          appendChatBubble("Booking confirmed! Notifying provider...", "user");
          transitionLifecycle("Offered");
        });
        
      }, 1200);

      break;

    case "SearchFailed":
      appendChatBubble("⚠️ Maazrat! Is waqt sector me tamaam partners busy hain. AI engine search retry kar rha hai...", "bot");
      logToTerminal("No available matching candidates found. Retrying workflow buffers...", "error-log");
      
      showToast("No providers found. Queue retry initiated.", "warning");
      
      setTimeout(() => {
        // Automatically release locking stress triggers to allow visual demo progression
        if (appState.stressFlags.lockAllBusy) {
          appState.stressFlags.lockAllBusy = false;
          dom.stressBtnNoproviders.textContent = "Lock All Providers";
          dom.stressBtnNoproviders.classList.remove("btn-danger");
          dom.stressBtnNoproviders.classList.add("btn-secondary");
          appState.providers.forEach(p => p.isBusy = false);
          logToTerminal("Orchestrator released auto-busy lock to recover simulation.", "success-log");
        }
        
        appendChatBubble("Retrying lookup...", "bot");
        transitionLifecycle("Matching");
      }, 3500);
      break;

    case "Offered":
      // Setup mock partner interface to receive bid
      const p = appState.selectedProvider;
      logToTerminal(`Offering job order bid dispatch notifications to provider: ${p.name}`, "system");
      
      // Update Provider screen elements
      dom.provHeaderAvatar.textContent = p.avatar;
      dom.provHeaderName.textContent = p.name;
      dom.provHeaderStatus.textContent = "Online";
      dom.provHeaderStatus.className = "online-indicator";
      
      dom.provStateOffline.classList.add("hide");
      dom.provStateSearching.classList.add("hide");
      dom.provStateAlert.classList.remove("hide");
      
      // Fill bid fields
      dom.alertCustLoc.textContent = `${appState.nlpResult.location}, Islamabad`;
      dom.alertServiceType.textContent = p.specialization;
      dom.alertEstPay.textContent = `PKR ${appState.activeInvoice.finalPrice}`;
      
      const distance = calculateDistance(appState.currentCustomerMarker, p.coordinates);
      dom.alertDistance.textContent = `${distance} km (${Math.round(distance * 3)} mins travel)`;

      // Alert sound indicator (synthetic mock audio pulse log)
      showToast(`Simulated Twilio Alert to ${p.name} dispatching...`, "info");
      
      // Radial Countdown Timer
      appState.countdownVal = 15;
      dom.alertCountdown.textContent = appState.countdownVal;
      clearInterval(appState.countdownTimer);
      
      appState.countdownTimer = setInterval(() => {
        appState.countdownVal--;
        dom.alertCountdown.textContent = appState.countdownVal;
        
        if (appState.countdownVal <= 0) {
          clearInterval(appState.countdownTimer);
          // Auto decline (simulate timeouts)
          showToast(`Bid alert timed out for ${p.name}. Forwarding bid to runner up...`, "warning");
          logToTerminal(`Offer timed out for provider: ${p.name}`, "error-log");
          declineAndRerouteWorkflow();
        }
      }, 1000);

      break;

    case "Accepted":
      clearInterval(appState.countdownTimer);
      showToast(`${appState.selectedProvider.name} accepted the job request!`, "success");
      
      appendChatBubble(`Shabash! Partner <strong>${appState.selectedProvider.name}</strong> ne request accept kar li hai. Wo apne sector se nikal chuke hain. 🚗`, "bot");
      
      // Display customer GPS tracking map overlay
      dom.customerMapContainer.classList.remove("hide");
      dom.mapEtaVal.textContent = `${Math.round(appState.selectedProvider.distance * 3)} mins`;
      
      // Enable stress triggers
      dom.stressBtnCancel.disabled = false;

      // Transition provider screens
      dom.provStateAlert.classList.add("hide");
      dom.provStateActive.classList.remove("hide");
      
      dom.jobProgressBadge.textContent = "EN-ROUTE TO CUSTOMER";
      dom.jobProgressBadge.className = "inline-badge orange-badge";
      dom.activeClientName.textContent = "Shaikh Sb";
      dom.activeClientPhone.textContent = "+92 300 5550192";
      dom.btnProvAction.textContent = "Arrived at Location";
      
      // Setup dynamic checklists based on service category
      setupServiceChecklist(appState.selectedProvider.service);
      
      // Initialize Leaflet Map focused on Customer & Provider
      initializeLeafletMap();
      
      // Begin simulation loop journey GPS movement
      simulateProviderEnRoute();

      break;

    case "Arrived":
      showToast(`${appState.selectedProvider.name} has arrived at your sector!`, "info");
      appendChatBubble(`🚩 Apka driver/partner <strong>${appState.selectedProvider.name}</strong> pounch chuka hai.`, "bot");
      
      dom.jobProgressBadge.textContent = "ARRIVED & INITIATING";
      dom.jobProgressBadge.className = "inline-badge blue-badge";
      dom.btnProvAction.textContent = "Start Service Task";
      
      // Set checklist arrive item checked
      const items = dom.provChecklistUl.querySelectorAll("input");
      if (items.length > 0) items[0].checked = true;

      break;

    case "InProgress":
      showToast("Service work in progress.", "info");
      appendChatBubble(`🛠️ Kaam shuru ho gya hai. Aap provider checklist progress console me real-time dekh sakte hain!`, "bot");
      
      dom.jobProgressBadge.textContent = "SERVICE IN-PROGRESS";
      dom.jobProgressBadge.className = "inline-badge orange-badge";
      dom.btnProvAction.textContent = "Finish & Complete Job";
      
      // Simulate checklist checklist item progression triggers
      let checkIdx = 1;
      const chkItems = dom.provChecklistUl.querySelectorAll("input");
      
      clearInterval(appState.simJobInterval);
      appState.simJobInterval = setInterval(() => {
        if (checkIdx < chkItems.length) {
          chkItems[checkIdx].checked = true;
          logToTerminal(`Service checklist task completed: Step #${checkIdx}`, "system");
          checkIdx++;
        } else {
          clearInterval(appState.simJobInterval);
        }
      }, 2500);

      break;

    case "Completed":
      clearInterval(appState.simJourneyInterval);
      clearInterval(appState.simJobInterval);
      
      const earnings = appState.activeInvoice.finalPrice;
      appState.selectedProvider.earnings += earnings;
      dom.provEarningsBadge.textContent = `PKR ${appState.selectedProvider.earnings}`;
      
      showToast("Work completed successfully!", "success");
      
      appendChatBubble(`✨ Kaam mukammal ho gya hai! Total bill: <strong>PKR ${earnings}</strong>. Aap is service ko rate kar sakte hain!`, "bot");
      
      // Update spreadsheet sync
      logToGoogleSheets("job_completed", {
        providerId: appState.selectedProvider.id,
        amount: earnings,
        customerRating: null
      });

      // Show rating form overlay to client
      dom.ratingProviderName.textContent = appState.selectedProvider.name;
      resetRatingOverlayStars();
      dom.customerRatingOverlay.classList.remove("hide");
      
      // Return provider back to waiting online radar screen
      dom.provStateActive.classList.add("hide");
      dom.provStateSearching.classList.remove("hide");
      dom.provHeaderStatus.textContent = "Scanning...";
      dom.provHeaderStatus.className = "online-indicator";
      
      dom.stressBtnCancel.disabled = true;

      break;

    default:
      break;
  }
}

// Decline and automatically re-route bid to runner-up provider
function declineAndRerouteWorkflow() {
  clearInterval(appState.countdownTimer);
  logToTerminal("Decline event triggered. Re-routing queue matching algorithms...", "system");
  
  // Set current selected provider busy
  appState.selectedProvider.isBusy = true;
  
  // Re-run matching pipeline
  const runnerUps = execute7FactorMatching(appState.nlpResult);
  const nextRunner = runnerUps.find(p => !p.isBusy);
  
  if (nextRunner) {
    showToast(`Re-routing to runner-up provider: ${nextRunner.name}`, "info");
    appState.selectedProvider = nextRunner;
    
    // Recalculate dynamic invoice quotes
    calculateDynamicPricing(nextRunner, appState.nlpResult);
    
    // Reroute back to offer phase
    transitionLifecycle("Offered");
  } else {
    transitionLifecycle("SearchFailed");
  }
}

// GPS Movement simulation loop
function simulateProviderEnRoute() {
  let progress = 10;
  dom.jobJourneyProgress.style.width = `${progress}%`;
  
  const startGps = cartesianToGps(appState.selectedProvider.coordinates);
  const endGps = cartesianToGps(appState.currentCustomerMarker);
  
  const distance = parseFloat(calculateDistance(appState.currentCustomerMarker, appState.selectedProvider.coordinates));
  let currentDistance = distance;
  
  clearInterval(appState.simJourneyInterval);
  appState.simJourneyInterval = setInterval(() => {
    progress += 20;
    currentDistance = Math.max(0, currentDistance - (distance / 5));
    
    dom.jobJourneyProgress.style.width = `${progress}%`;
    dom.jobHudEta.textContent = `Remaining: ${Math.round(currentDistance * 3)} mins (${currentDistance.toFixed(1)} km)`;
    dom.mapEtaVal.textContent = `${Math.round(currentDistance * 3)} mins`;
    
    // Interpolate Leaflet Marker location
    const ratio = Math.min(1.0, progress / 100);
    const currentLat = startGps[0] + (endGps[0] - startGps[0]) * ratio;
    const currentLng = startGps[1] + (endGps[1] - startGps[1]) * ratio;
    const currentGps = [currentLat, currentLng];

    if (appState.provMarker) {
      appState.provMarker.setLatLng(currentGps);
    }
    if (appState.routePolyline) {
      appState.routePolyline.setLatLngs([currentGps, endGps]);
    }
    if (appState.map) {
      appState.map.panTo(currentGps);
    }

    if (progress >= 100) {
      clearInterval(appState.simJourneyInterval);
      dom.jobJourneyProgress.style.width = "100%";
      
      // Zoom close to destination on arrival
      if (appState.map) {
        appState.map.setView(endGps, 15, { animate: true });
        if (appState.provMarker) {
          appState.provMarker.bindPopup(`<b>${appState.selectedProvider.name}</b><br>Pounch Gye Hain! 🚩`).openPopup();
        }
      }
      
      transitionLifecycle("Arrived");
    }
  }, 2000);
}

// Generate dynamic checklists based on specific categories
function setupServiceChecklist(service) {
  const checklists = {
    "AC Repair": ["Arrive & inspect inverter leakage", "Perform compressor diagnostic test", "Execute gas recharging operations", "Clean workspace area & verify cooling temperature"],
    "Plumber": ["Locate sink pipe leakage points", "Shut off water lines & replace gaskets", "Apply sealing tape & join pipes", "Reopen lines & test for water pressure tightness"],
    "Tutor": ["Setup digital whiteboards/notebooks", "Explain core curriculum concepts", "Review lesson sheet exercise questions", "Discuss student feedback progress"],
    "Car Mechanic": ["Test battery charge voltage status", "Connect diagnostic codes scanner", "Check engine startup parameters", "Verify safe driving conditions"],
    "House Cleaning": ["Dust rooms and clean tables", "Scrub kitchen counters thoroughly", "Vacuum carpets & mop tiles floors", "Disinfect toilets & empty garbage"],
    "Electrician": ["Identify wire panel short circuits", "Replace faulty switches & fuses", "Install ceiling fan boards Safely", "Complete voltage insulation inspections"],
    "Beautician": ["Analyze skin tone features", "Apply base cream cosmetics layers", "Perform facial treatments, hair blowdry", "Verify styling alignment designs"],
    "Driver": ["Verify car tire pressure & engine fluids", "Log starting trip mileage meters", "Drive passenger safely via optimal route", "Confirm safe arrival and park car"],
    "Carpenter/Painter": ["Measure wooden cabinet framing", "Repair hinges and locks alignment", "Sand raw surfaces & polish coating", "Apply paint coats & clean drops"]
  };

  const tasks = checklists[service] || ["Arrive at destination", "Inspect and diagnose requirements", "Execute repair operations", "Clean workspace and finalize"];
  
  dom.provChecklistUl.innerHTML = tasks.map((task, idx) => `
    <li>
      <label>
        <input type="checkbox" id="chk-task-${idx}" disabled>
        <span>${task}</span>
      </label>
    </li>
  `).join("");
}

// Submit Customer rating scores & update active metrics
function submitCustomerRating() {
  const starsContainer = document.querySelector(".stars-row");
  const ratingVal = parseInt(starsContainer.getAttribute("data-selected-rating")) || 5;
  const comment = dom.ratingComment.value.trim();
  
  const p = appState.selectedProvider;
  
  logToTerminal(`Client submitted ⭐ ${ratingVal} rating review for ${p.name}: "${comment || 'No comment'}"`, "success-log");
  
  // Dynamic average rating computation
  const oldSum = p.rating * p.jobsCompleted;
  p.jobsCompleted++;
  p.rating = parseFloat(((oldSum + ratingVal) / p.jobsCompleted).toFixed(2));
  
  // Reset provider's busy status
  p.isBusy = false;

  showToast(`Thank you for rating ${p.name}!`, "success");
  
  // Sync sheet
  logToGoogleSheets("customer_feedback", {
    providerId: p.id,
    newAvgRating: p.rating,
    reviewCount: p.jobsCompleted,
    comment: comment
  });

  transitionLifecycle("Idle");
}

// ==========================================================================
// 8. Dynamic Chaos / Stress Testing Center Controls
// ==========================================================================

// Simulator triggers mid-journey provider cancellations
function triggerMidJobCancellation() {
  if (appState.lifecycleState !== "Accepted" && appState.lifecycleState !== "Arrived") {
    showToast("Stress test only valid when provider is active or en-route.", "error");
    return;
  }

  logToTerminal("⚠️ CRITICAL CHAOS TRIGGERED: Provider cancelled mid-way!", "error-log");
  showToast("Chaos Agent Active: Provider canceled! Instating automatic re-routing...", "error");
  
  clearInterval(appState.simJourneyInterval);
  
  // Block current provider
  const badProvider = appState.selectedProvider;
  badProvider.isBusy = true;
  
  // Apply cancellation rate penalty
  badProvider.cancelRate = Math.min(0.5, badProvider.cancelRate + 0.1);
  
  // Set provider offline screen
  dom.provStateActive.classList.add("hide");
  dom.provStateOffline.classList.remove("hide");
  dom.provHeaderStatus.textContent = "Offline (Penalty)";
  dom.provHeaderStatus.className = "online-indicator offline";
  
  // Append system message notification
  appendChatBubble(`⚠️ Maazrat! App ke provider <strong>${badProvider.name}</strong> ko emergency emergency ki waja se cancel karna para. Kaamwala AI systems automatically apko new best matching provider assign kar rahe hain...`, "bot");

  // Re-run matching pipelines autonomously
  setTimeout(() => {
    const results = execute7FactorMatching(appState.nlpResult);
    const newWinner = results.find(p => !p.isBusy);
    
    if (newWinner) {
      logToTerminal(`Auto-rematch successful: Assigned ${newWinner.name} to job`, "success-log");
      showToast(`Automatically rematched with: ${newWinner.name}`, "success");
      
      appState.selectedProvider = newWinner;
      calculateDynamicPricing(newWinner, appState.nlpResult);
      
      // Auto transition back to acceptance flows directly
      transitionLifecycle("Accepted");
    } else {
      transitionLifecycle("SearchFailed");
    }
  }, 2500);
}

// Peak rush demand spike triggers
function togglePeakRushSurge() {
  appState.stressFlags.rushHourSurge = !appState.stressFlags.rushHourSurge;
  
  if (appState.stressFlags.rushHourSurge) {
    dom.stressBtnRush.textContent = "Disable Surge Peak";
    dom.stressBtnRush.classList.remove("btn-warning");
    dom.stressBtnRush.classList.add("btn-danger");
    logToTerminal("Demand surges spiked! All billing fares subject to 3.0x multiplier rates.", "error-log");
    showToast("Rush hour surge activated! Fares tripled.", "warning");
  } else {
    dom.stressBtnRush.textContent = "Simulate Surge Peak";
    dom.stressBtnRush.classList.remove("btn-danger");
    dom.stressBtnRush.classList.add("btn-warning");
    logToTerminal("Demand surge conditions normalized.", "success-log");
    showToast("Surge peak normalized.", "info");
  }

  // Live recalculate pricing if active
  if (appState.selectedProvider) {
    calculateDynamicPricing(appState.selectedProvider, appState.nlpResult);
  }
}

// Force locks all provider busy states to trigger search failures
function toggleLockAllBusy() {
  appState.stressFlags.lockAllBusy = !appState.stressFlags.lockAllBusy;
  
  if (appState.stressFlags.lockAllBusy) {
    dom.stressBtnNoproviders.textContent = "Unlock Providers";
    dom.stressBtnNoproviders.classList.remove("btn-secondary");
    dom.stressBtnNoproviders.classList.add("btn-danger");
    
    appState.providers.forEach(p => p.isBusy = true);
    logToTerminal("All matching database providers forced to BUSY state.", "error-log");
    showToast("All providers locked! Search will fail.", "warning");
  } else {
    dom.stressBtnNoproviders.textContent = "Lock All Providers";
    dom.stressBtnNoproviders.classList.remove("btn-danger");
    dom.stressBtnNoproviders.classList.add("btn-secondary");
    
    appState.providers.forEach(p => p.isBusy = false);
    logToTerminal("All matching database providers status normalized to AVAILABLE.", "success-log");
    showToast("Providers unlocked.", "info");
  }
}

// Inject extremely complex multi-language Roman Urdu code-switch triggers
function injectComplexSlangQuery() {
  const slangPhrases = [
    "AC bohot kharab chal raha hai cool nahi kar rha, urgent emergency compressor leak ho gya hai fauran plumber nahi AC mechanic bheinjo Islamabad sector G-11 me abhi ke abhi yar!",
    "Bhai kitchen sink leak ho rha pure ghr me pani agya hai flood ban gya hai emergency me plumber bheinjo jaldi f-11 me!",
    "Mera bacha grade 8 me hai math ki board parhai krwani hai immediate tutor chahiye home online sector f-10 me!",
    "Gari start nahi ho rahi motor battery dead lagti hai emergency mechanical jumpstart chahiye fast driver ya mechanic bheinjo sector G-13 me!"
  ];

  const randomSlang = slangPhrases[Math.floor(Math.random() * slangPhrases.length)];
  dom.customerMessageInput.value = randomSlang;
  showToast("Complex slang query injected to input line!", "info");
}

// ==========================================================================
// 9. Event Listeners Initializations
// ==========================================================================

function registerEventListeners() {
  // Send message submit handlers
  dom.btnSendMessage.addEventListener("click", () => {
    const rawMsg = dom.customerMessageInput.value.trim();
    if (!rawMsg) return;
    
    // Clear field
    dom.customerMessageInput.value = "";
    
    // Render Client bubble UI
    appendChatBubble(rawMsg, "user");
    appState.activeCustomerQuery = rawMsg;
    
    // Trigger NLP
    const nlpRes = runMultilingualNLPEngine(rawMsg);
    
    // Check intent
    if (nlpRes.intent === "None") {
      appendChatBubble("⚠️ Maazrat! AI engine apke intent ko sahi se samajh nahi paya. Please clear text me input likhain (jaise 'AC repair', 'leakage', or 'tutor').", "bot");
      return;
    }

    // Transition state machine matching parameters
    transitionLifecycle("Matching");
  });

  // Keyboard enter submits input
  dom.customerMessageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      dom.btnSendMessage.click();
    }
  });

  // Microphones trigger Speech simulation triggers
  dom.btnVoiceInput.addEventListener("click", () => {
    const speechPhrases = [
      "AC leak ho rha hai cooling nahi de raha G-11 me emergency jaldi bheinjo kisi ko!",
      "Kitchen ka tap leak ho rha hai paani beh rha hai F-11 me plumber chahiye jaldi!",
      "Bache ko math physics ki parhai krwani hai teacher bheinjo home tuition G-10 me ya F-10!",
      "Gari stuck ho gyi markaz me engine start nhi ho rha car mechanic bheinjo G-11 me abhi fauran!"
    ];
    const randomSpeech = speechPhrases[Math.floor(Math.random() * speechPhrases.length)];
    
    // Animate vocal transcript simulation
    dom.customerMessageInput.value = "";
    let idx = 0;
    
    // Typewriting transcript animations
    const typingInterval = setInterval(() => {
      if (idx < randomSpeech.length) {
        dom.customerMessageInput.value += randomSpeech[idx];
        idx++;
      } else {
        clearInterval(typingInterval);
        showToast("Voice transcription parsed!", "success");
        setTimeout(() => dom.btnSendMessage.click(), 500);
      }
    }, 30);
  });

  // Chip quick action buttons triggers
  const chipButtons = dom.customerQuickChips.querySelectorAll(".chip-btn");
  chipButtons.forEach(btn => {
    btn.addEventListener("click", function() {
      const q = this.getAttribute("data-query");
      dom.customerMessageInput.value = q;
      dom.btnSendMessage.click();
    });
  });

  // Provider Screen buttons actions
  dom.btnGoOnline.addEventListener("click", () => {
    dom.provStateOffline.classList.add("hide");
    dom.provStateSearching.classList.remove("hide");
    dom.provHeaderStatus.textContent = "Scanning...";
    dom.provHeaderStatus.className = "online-indicator";
    logToTerminal("Provider set status to ONLINE. Running matching scanning listeners.", "system");
  });

  dom.btnGoOffline.addEventListener("click", () => {
    dom.provStateSearching.classList.add("hide");
    dom.provStateOffline.classList.remove("hide");
    dom.provHeaderStatus.textContent = "Offline";
    dom.provHeaderStatus.className = "online-indicator offline";
    logToTerminal("Provider set status to OFFLINE.", "system");
  });

  dom.btnDeclineJob.addEventListener("click", () => {
    showToast("Bid declined.", "warning");
    declineAndRerouteWorkflow();
  });

  dom.btnAcceptJob.addEventListener("click", () => {
    transitionLifecycle("Accepted");
  });

  dom.btnProvAction.addEventListener("click", () => {
    if (appState.lifecycleState === "Accepted") {
      clearInterval(appState.simJourneyInterval);
      transitionLifecycle("Arrived");
    } else if (appState.lifecycleState === "Arrived") {
      transitionLifecycle("InProgress");
    } else if (appState.lifecycleState === "InProgress") {
      transitionLifecycle("Completed");
    }
  });

  // Submit Feedback Review forms
  dom.btnSubmitRating.addEventListener("click", () => {
    submitCustomerRating();
  });

  // Live slider weighting updates
  const sliders = [
    { s: dom.weightDistance, v: dom.valWDistance },
    { s: dom.weightSpecialization, v: dom.valWSpecialization },
    { s: dom.weightReliability, v: dom.valWReliability },
    { s: dom.weightPrice, v: dom.valWPrice },
    { s: dom.weightCancel, v: dom.valWCancel },
    { s: dom.weightRating, v: dom.valWRating },
    { s: dom.weightExperience, v: dom.valWExperience }
  ];
  
  sliders.forEach(pair => {
    pair.s.addEventListener("input", function() {
      pair.v.textContent = parseFloat(this.value).toFixed(2);
      checkWeightsSum();
      // Recalculate match listings live if query query exists
      if (appState.nlpResult.intent !== "None") {
        execute7FactorMatching(appState.nlpResult);
      }
    });
  });

  dom.btnResetWeights.addEventListener("click", () => {
    dom.weightDistance.value = 0.25;
    dom.valWDistance.textContent = "0.25";
    dom.weightSpecialization.value = 0.20;
    dom.valWSpecialization.textContent = "0.20";
    dom.weightReliability.value = 0.15;
    dom.valWReliability.textContent = "0.15";
    dom.weightPrice.value = 0.10;
    dom.valWPrice.textContent = "0.10";
    dom.weightCancel.value = 0.10;
    dom.valWCancel.textContent = "0.10";
    dom.weightRating.value = 0.12;
    dom.valWRating.textContent = "0.12";
    dom.weightExperience.value = 0.08;
    dom.valWExperience.textContent = "0.08";
    
    checkWeightsSum();
    if (appState.nlpResult.intent !== "None") {
      execute7FactorMatching(appState.nlpResult);
    }
    showToast("Match weights restored to system default defaults.", "info");
  });

  // Antigravity Terminal Clears
  dom.btnClearLogs.addEventListener("click", () => {
    dom.consoleTerminal.innerHTML = `<div class="terminal-line system"><span class="prompt">AntigravityOS v2.0:</span> Terminal cleared. Ready.</div>`;
  });

  // Stress tests triggers
  dom.stressBtnCancel.addEventListener("click", () => {
    triggerMidJobCancellation();
  });

  dom.stressBtnRush.addEventListener("click", () => {
    togglePeakRushSurge();
  });

  dom.stressBtnNoproviders.addEventListener("click", () => {
    toggleLockAllBusy();
  });

  dom.stressBtnSlang.addEventListener("click", () => {
    injectComplexSlangQuery();
  });

  // Tab Panel switchers
  dom.tabBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      dom.tabBtns.forEach(tb => tb.classList.remove("active"));
      dom.tabPanels.forEach(tp => tp.classList.remove("active"));
      
      this.classList.add("active");
      const activeTabId = this.getAttribute("data-tab");
      document.getElementById(activeTabId).classList.add("active");
    });
  });

  // Reset core app state fully
  dom.btnResetApp.addEventListener("click", () => {
    clearInterval(appState.countdownTimer);
    clearInterval(appState.simJourneyInterval);
    clearInterval(appState.simJobInterval);
    
    appState.activeCustomerQuery = "";
    appState.selectedProvider = null;
    appState.activeInvoice = null;
    appState.lifecycleState = "Idle";
    
    // Normalize provider datasets states
    appState.providers.forEach(p => {
      p.isBusy = false;
    });

    // Reset stress triggers states
    appState.stressFlags.rushHourSurge = false;
    appState.stressFlags.lockAllBusy = false;
    
    dom.stressBtnRush.textContent = "Simulate Surge Peak";
    dom.stressBtnRush.classList.remove("btn-danger");
    dom.stressBtnRush.classList.add("btn-warning");
    
    dom.stressBtnNoproviders.textContent = "Lock All Providers";
    dom.stressBtnNoproviders.classList.remove("btn-danger");
    dom.stressBtnNoproviders.classList.add("btn-secondary");

    // Reset weights
    dom.btnResetWeights.click();

    // Reset UI view sheets
    dom.customerChatScroller.innerHTML = `
      <div class="chat-message bot-msg">
        <div class="msg-bubble">
          Assalam-o-Alaikum! Main Kaamwala AI Assistant hoon. 🌟
          <br><br>
          Aapko aaj kis kisam ki madad chahiye? Aap Roman Urdu ya English me likh sakte hain ya niche diye gye buttons par click kar sakte hain!
        </div>
      </div>
    `;

    // Empty leaderboard logs
    dom.matchmakingLeaderboardTbody.innerHTML = `
      <tr>
        <td colspan="9" class="text-center">Engine idle. Type or select a quick chip in the Client App.</td>
      </tr>
    `;

    dom.nlpIntent.textContent = "---";
    dom.nlpUrgency.textContent = "---";
    dom.nlpConfidenceVal.textContent = "0%";
    dom.nlpConfidenceBar.style.width = "0%";
    dom.nlpExtractedLocation.textContent = "---";
    dom.nlpRawInput.textContent = '"Waiting for request..."';
    dom.nlpCleanTranslation.textContent = "None";

    dom.invoiceDetails.innerHTML = `
      <div class="inv-line"><span>Base Service Charge</span><span class="right">PKR 0</span></div>
      <div class="inv-line"><span>Distance Travel Buffer</span><span class="right">PKR 0</span></div>
      <div class="inv-line"><span>Urgency/Surge Multiplier</span><span class="right">1.0x</span></div>
      <div class="inv-line total-line"><span>Final Estimated Quote</span><span class="right">PKR 0</span></div>
    `;

    dom.gaugeCapacityVal.textContent = "34%";
    dom.gaugeCapacityFill.style.width = "34%";
    dom.gaugeCapacityFill.style.background = "var(--color-blue)";
    dom.gaugeSurgeVal.textContent = "REGULAR";
    dom.gaugeSurgeVal.className = "gauge-val inline-badge green-badge";

    transitionLifecycle("Idle");
    showToast("Antigravity Engine & Simulators Reset Complete!", "success");
    logToTerminal("System reset successfully back to factory seeds.", "system");
  });
}

// 10. Startup Initialization Engine
function initApp() {
  registerEventListeners();
  initStars();
  checkWeightsSum();
  // Initialize authentication module
  if (typeof initAuth === 'function') initAuth();
  
  // Set current phone clock times dynamically
  const formatTime = () => {
    const d = new Date();
    const hrs = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${hrs}:${mins}`;
  };
  
  const tickTime = formatTime();
  document.getElementById("customer-phone-time").textContent = tickTime;
  document.getElementById("provider-phone-time").textContent = tickTime;
  
  setInterval(() => {
    const timeVal = formatTime();
    document.getElementById("customer-phone-time").textContent = timeVal;
    document.getElementById("provider-phone-time").textContent = timeVal;
  }, 30000);

  logToTerminal("Kaamwala application fully operational.", "success-log");
}

// Start app on DOM loaded
window.addEventListener("DOMContentLoaded", initApp);

// -------------------------
// Authentication Module
// -------------------------
function initAuth() {
  // Elements from index.html
  const authOverlay = document.getElementById('auth-overlay');
  const authTitle = document.getElementById('auth-title');
  const authSubtitle = document.getElementById('auth-subtitle');
  const authError = document.getElementById('auth-error');
  const authNameLabel = document.getElementById('auth-name-label');
  const authNameInput = document.getElementById('auth-name');
  const authEmailInput = document.getElementById('auth-email');
  const authPasswordInput = document.getElementById('auth-password');
  const authSubmitBtn = document.getElementById('btn-auth-submit');
  const authSwitchBtn = document.getElementById('btn-auth-switch');
  const authFooterText = document.getElementById('auth-footer-text');
  const headerAuthStatus = document.getElementById('header-auth-status');
  const headerUserName = document.getElementById('header-user-name');
  const btnLogout = document.getElementById('btn-logout');

  let mode = 'login';

  function setAuthError(msg) {
    if (!authError) return;
    authError.textContent = msg || '';
    authError.classList.toggle('hidden', !msg);
  }

  function setMode(m) {
    mode = m;
    const isLogin = mode === 'login';
    if (authTitle) authTitle.textContent = isLogin ? 'Login to Kaamwala' : 'Create Your Account';
    if (authSubtitle) authSubtitle.textContent = isLogin ? 'Enter your email and password to continue.' : 'Fill in your details to create a new account.';
    if (authSubmitBtn) authSubmitBtn.textContent = isLogin ? 'Login' : 'Sign Up';
    if (authSwitchBtn) authSwitchBtn.textContent = isLogin ? 'Create an account' : 'Already have an account? Login';
    if (authFooterText) authFooterText.textContent = isLogin ? 'New to Kaamwala? Create an account to save your bookings.' : 'Already registered? Login with your email and password.';
    if (authNameLabel) authNameLabel.classList.toggle('hidden', isLogin);
    if (authNameInput) authNameInput.classList.toggle('hidden', isLogin);
    setAuthError('');
  }

  function showAuth() {
    if (authOverlay) authOverlay.classList.remove('hidden');
  }

  function hideAuth() {
    if (authOverlay) authOverlay.classList.add('hidden');
  }

  function setAuthUserFrontend(user) {
    appState.currentUser = user;
    if (headerAuthStatus) headerAuthStatus.classList.remove('hidden');
    if (headerUserName) headerUserName.textContent = user && user.name ? `Hello, ${user.name}` : 'Signed in';
    if (btnLogout) btnLogout.classList.remove('hidden');
    if (user && user.id) localStorage.setItem('kaamwalaUserId', user.id);
    if (user && user.token) localStorage.setItem('kaamwalaToken', user.token);
    hideAuth();
    setAuthError('');
    logToTerminal(`[Auth] Signed in: ${user && user.email}`, 'success-log');
  }

  function clearAuthUserFrontend() {
    appState.currentUser = null;
    if (headerAuthStatus) headerAuthStatus.classList.add('hidden');
    if (headerUserName) headerUserName.textContent = 'Signed in';
    if (btnLogout) btnLogout.classList.add('hidden');
    localStorage.removeItem('kaamwalaUserId');
    localStorage.removeItem('kaamwalaToken');
    showAuth();
  }

  async function doLogin(email, password) {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setAuthUserFrontend(data);
        return true;
      }
      setAuthError(data.error || 'Login failed');
      return false;
    } catch (e) {
      setAuthError('Unable to contact server.');
      logToTerminal(`[Auth] Login error: ${e.message}`, 'error-log');
      return false;
    }
  }

  async function doSignup(name, email, password) {
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setAuthUserFrontend(data);
        return true;
      }
      setAuthError(data.error || 'Signup failed');
      return false;
    } catch (e) {
      setAuthError('Unable to contact server.');
      logToTerminal(`[Auth] Signup error: ${e.message}`, 'error-log');
      return false;
    }
  }

  // Auto attach Authorization header for same-origin /api requests
  try {
    const _origFetch = window.fetch.bind(window);
    window.fetch = async (input, init = {}) => {
      let url = typeof input === 'string' ? input : input.url;
      if (typeof url === 'string' && url.startsWith('/api/')) {
        init = init || {};
        init.headers = init.headers || {};
        const token = localStorage.getItem('kaamwalaToken');
        if (token) init.headers['Authorization'] = `Bearer ${token}`;
      }
      return _origFetch(input, init);
    };
  } catch (e) {
    // ignore if cannot override
  }

  async function tryAutoLogin() {
    const storedId = localStorage.getItem('kaamwalaUserId');
    const token = localStorage.getItem('kaamwalaToken');
    if (!storedId || !token) {
      showAuth();
      return;
    }
    try {
      const res = await fetch(`/api/users/${storedId}`);
      if (res.ok) {
        const u = await res.json();
        u.token = token;
        setAuthUserFrontend(u);
        return;
      }
    } catch (e) {
      logToTerminal(`[Auth] Auto-login failed: ${e.message}`, 'warn');
    }
    showAuth();
  }

  // Wire buttons
  if (authSubmitBtn) {
    authSubmitBtn.addEventListener('click', async () => {
      const email = authEmailInput?.value.trim();
      const password = authPasswordInput?.value.trim();
      const name = authNameInput?.value.trim();
      if (!email || !password || (mode === 'signup' && !name)) {
        setAuthError('Complete required fields.');
        return;
      }
      setAuthError('');
      if (mode === 'login') {
        await doLogin(email, password);
      } else {
        await doSignup(name, email, password);
      }
    });
  }

  if (authSwitchBtn) {
    authSwitchBtn.addEventListener('click', () => {
      setMode(mode === 'login' ? 'signup' : 'login');
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      clearAuthUserFrontend();
    });
  }

  // Initial mode and try restore
  setMode('login');
  tryAutoLogin();
}
