/* Unified EN / IT translations for the complete static portfolio.
   Original English HTML is retained as a no-script fallback. */
(() => {
  'use strict';

  const italian = {
    about_role_0: 'Ricercatore',
    about_summary_0: 'Analisi della dipendenza dei parametri cosmologici dal redshift con dati di supernovae di tipo Ia. Sviluppo di flussi di inferenza bayesiana con covarianza, diagnostica MCMC e verifiche della stabilità dei parametri nei diversi intervalli di redshift.',
    about_skill_0: 'Matrici di covarianza SN Ia · convergenza MCMC · tomografia in redshift',
    about_role_1: 'Tirocinante di ricerca',
    about_summary_1: 'Studio delle lenti gravitazionali dei fast radio burst prodotti da sistemi binari compatti, con inversione numerica del lensing e ritardi di propagazione. Analisi della struttura ad alto redshift nei dati JWST COSMOS-Web.',
    about_skill_1: 'Inversione di lenti binarie · ritardi del potenziale di Fermat · JWST COSMOS-Web',
    about_role_2: 'Tirocinante di ricerca',
    about_summary_2: 'Calcolo degli osservabili inflazionari per modelli a campo singolo e con accoppiamento non minimale, comprendendo trasformazioni di frame, evoluzione slow-roll e scansioni parametriche sui dati ACT e DESI.',
    about_skill_2: 'Trasformazioni Jordan–Einstein · osservabili slow-roll · ACT DR6 / DESI DR2',
    about_role_3: 'Ricercatore',
    about_summary_3: 'Studio delle soluzioni cosmologiche emergenti nella gravità dissipativa f(T). Derivazione delle equazioni dinamiche, analisi degli equilibri nello spazio delle fasi e confronto con dati di supernovae ed espansione.',
    about_skill_3: 'Dinamica dissipativa causale f(T) · stabilità nello spazio delle fasi · vincoli bayesiani',
    about_role_4: 'Associato di ricerca',
    about_summary_4: 'Sviluppo della dinamica gravitazionale e inflazionaria efficace in una geometria dello spazio delle fasi deformata quantisticamente. Studio della metrica indotta, delle equazioni del moto e delle perturbazioni scalari e tensoriali.',
    about_skill_4: 'Geometria hamiltoniana dello spazio delle fasi · dinamica perturbativa · calcolo tensoriale',
    about_role_5: 'Ricercatore',
    about_summary_5: 'Studio della formazione dei buchi neri primordiali e delle onde gravitazionali indotte da scalari in scenari cosmologici di rimbalzo, includendo perturbazioni corrette a loop, non gaussianità e vincoli da pulsar timing.',
    about_skill_5: 'Buchi neri primordiali · spettri di curvatura rinormalizzati · onde gravitazionali indotte',
    about_role_6: 'Ricercatore',
    about_summary_6: 'Confronto tra modelli cosmologici standard e alternativi mediante osservazioni di supernovae. Inferenza bayesiana dei parametri, analisi di convergenza e confronto tra modelli.',
    about_skill_6: 'Inferenza di verosimiglianza SN Ia · diagnostica Monte Carlo · selezione di modelli',
    about_role_7: 'Tirocinante di ricerca',
    about_summary_7: 'Formazione sui metodi della ricerca spaziale e sugli approcci computazionali a problemi di missione nell’ambito del programma Andromeda.',
    about_skill_7: 'Sistemi energetici resistenti alle radiazioni · bilanci orbitali · ambienti spaziali',
    about_role_8: 'Tirocinante di ricerca',
    about_summary_8: 'Attività introduttive di ricerca nelle scienze spaziali e nel calcolo scientifico presso la Space Advancement and Research Cell.',
    about_skill_8: 'Dispersione radio solare · diagnostica del plasma coronale · cascate energetiche MHD',
    about_role_9: 'Tirocinante di progettazione e responsabile del progetto',
    about_summary_9: 'Coordinamento di un progetto di ortesi per gli arti inferiori guidato da simulazioni. Analisi di tensioni strutturali, vita a fatica ed efficienza dei materiali con elementi finiti e ottimizzazione topologica.',
    about_skill_9: 'Tensori di sforzo FEM · previsione della vita a fatica · ottimizzazione topologica',
    about_role_10: 'Assistente di ricerca e responsabile del gruppo',
    about_summary_10: 'Studio della manutenzione autonoma dei satelliti e del riutilizzo dei detriti orbitali. Modellazione di architetture di servizio, concetti di propulsione combinata e trasferimenti orbitali multi-impulso.',
    about_skill_10: 'Ottimizzazione dei trasferimenti orbitali · servizio satellitare · architetture propulsive',
    about_role_11: 'Assistente di ricerca',
    about_summary_11: 'Modellazione della combustione premiscelata ammoniaca–idrogeno, delle velocità di fiamma, dei ritardi di accensione e della cinetica chimica con Python e meccanismi dettagliati.',
    about_skill_11: 'Cinetica dei flussi reagenti · propagazione di fiamma · formazione di NOₓ',
    about_role_12: 'Ricercatore — tesi di laurea',
    about_summary_12: 'Progettazione e analisi di profili alari bioispirati con tubercoli e dentellature, integrando CFD, aeroacustica e validazione in galleria del vento nella tesi di laurea.',
    about_skill_12: 'RANS SST k–ω · aeroacustica FW–H · validazione in galleria del vento',
    about_role_13: 'Ricercatore — sistemi termici computazionali',
    about_summary_13: 'Progettazione di sistemi di gestione termica per batterie agli ioni di litio ad alta potenza, integrando raffreddamento a liquido e materiali a cambiamento di fase con simulazioni di scambio termico coniugato.',
    about_skill_13: 'Scambio termico coniugato · raffreddamento a liquido · materiali a cambiamento di fase',
    about_path_aria: 'Percorso accademico',
    about_path_be: 'Ingegneria meccanica',
    about_path_ms: 'Scienze fisiche e astrofisiche · In corso',
    about_path_phd: 'Direzione di ricerca',
    about_network_label: 'RETE PROFESSIONALE',
    about_network_title: 'Profilo LinkedIn',
    about_network_desc: 'Esperienza di ricerca, attività scientifica e aggiornamenti professionali',
    about_network_visit: 'Apri il profilo LinkedIn',
    about_label: 'PROFILO',
    about_intro_title: 'Cosmologia computazionale. Fisica numerica. Meccanica applicata.',
    about_intro_1: 'Sono un fisico e ingegnere attivo tra cosmologia computazionale, dinamica relativistica e ingegneria basata sulla simulazione. A Firenze frequento il corso MS in Scienze Fisiche e Astrofisiche presso l’Università di Firenze, dopo una laurea in ingegneria meccanica.',
    about_intro_2: 'La mia attività integra sistemi dinamici non lineari, modelli differenzial-geometrici della gravitazione, problemi inversi bayesiani con covarianza e inferenza numerica da osservazioni astrofisiche. Sviluppo metodi computazionali per analizzare modelli fisici, quantificare le incertezze e verificarne la stabilità rispetto ai dati.',
    about_intro_3: 'In ingegneria applico tali metodi alla modellazione dei flussi reagenti, allo scambio termico coniugato, alla meccanica agli elementi finiti e alla simulazione dei sistemi orbitali. Lavoro all’intersezione tra formulazione analitica, implementazione numerica e risultati fisicamente interpretabili.',
    about_email_link: 'Email',
    about_focus_aria: 'Ambiti di attività',
    about_focus_cosmology: 'Cosmologia relativistica',
    about_focus_computation: 'Problemi inversi bayesiani',
    about_focus_engineering: 'Calcolo multifisico',
    about_research_label: 'ESPERIENZA',
    about_research_title: 'Incarichi di ricerca',
    about_engineer_label: 'APPLICAZIONI',
    about_engineer_title: 'Attività ingegneristiche',
    about_education_label: 'FORMAZIONE',
    about_education_title: 'Istruzione',
    about_florence_focus: 'Indirizzo: Astrofisica e Cosmologia',
    about_florence_courses: 'Astrofisica · Cosmologia · Astrofisica relativistica · Machine Learning per fisici',
    about_bms_note: 'Premio di eccellenza nella ricerca',
    about_bms_courses: 'Calcolo avanzato ed equazioni differenziali · Algebra lineare · Analisi di Fourier · Probabilità e statistica · Meccanica quantistica · Astrofisica e scienze spaziali',
    about_methods_label: 'METODI',
    about_methods_title: 'Metodi e strumenti',
    about_methods_programming: 'Programmazione',
    about_methods_inference: 'Inferenza',
    about_methods_physics: 'Calcolo scientifico',
    about_methods_eng: 'Calcolo multifisico',
    about_methods_workflow: 'Flusso di ricerca',
    about_training_label: 'FORMAZIONE CONTINUA',
    about_training_title: 'Formazione complementare',
    about_engagement_label: 'ATTIVITÀ ACCADEMICHE',
    about_engagement_title: 'Attività scientifiche',
    about_engagement_0: 'Membro affiliato; geometria dello spaziotempo e partecipazione alla conferenza sullo spaziotempo del 2024.',
    about_engagement_1: 'Analisi dei tempi di transito di Qatar-1b e delle curve di luce multi-epoca mediante EXOTIC.',
    about_engagement_2: 'Identificazione di candidati asteroidi dai dati Pan-STARRS e Catalina Sky Survey mediante Astrometrica.',
    about_engagement_3: 'Fisiologia in microgravità, relatività e divulgazione scientifica.',
    about_engagement_4: 'Articoli di astrofisica e cosmologia per Virtual Wire e Youth Journal of STEM Research.',
    about_group_theory: 'Cosmologia e fisica teorica',
    about_group_observation: 'Astrofisica e osservazione',
    about_group_engineering: 'Ingegneria e sistemi spaziali',
    about_project_label: 'PORTAFOGLIO DI RICERCA',
    about_project_title: 'Progetti e studi',
    about_project_inflation_act_desi: 'Inflazione e vincoli ACT DR6 / DESI DR2',
    about_project_pbh_sigw_bounce: 'Buchi neri primordiali e onde gravitazionali indotte',
    about_project_emergent_ft_gravity: 'Cosmologia emergente nella gravità dissipativa f(T)',
    about_project_quantum_phase_space: 'Geometria dello spazio delle fasi quantisticamente deformato',
    about_project_running_hubble: 'Costante di Hubble effettiva variabile',
    about_project_spacetime_foundations: 'Fondamenti della geometria dello spaziotempo',
    about_project_frb_lensing: 'Fast radio burst e microlensing binario',
    about_project_superluminous_supernovae: 'Supernovae superluminose come sonde cosmologiche',
    about_project_qatar_1b: 'Analisi delle variazioni nei tempi di transito di Qatar-1b',
    about_project_solar_radio_plasma: 'Radioemissioni solari e plasma coronale',
    about_project_asteroid_search: 'Ricerca e identificazione di candidati asteroidi',
    about_project_ammonia_hydrogen_combustion: 'Combustione ammoniaca–idrogeno ed emissioni',
    about_project_battery_thermal_management: 'Gestione termica delle batterie',
    about_project_bio_inspired_aeroacoustics: 'Aeroacustica bioispirata',
    about_project_deep_space_power: 'Architetture energetiche per lo spazio profondo',
    about_project_satellite_servicing: 'Manutenzione autonoma dei satelliti',
    about_project_orthotic_systems: 'Sistemi ortesici resistenti alla fatica',
    about_training_0: 'Metodi moderni delle ampiezze per teorie di gauge e gravità · ICTP-SAIFR / IFT-UNESP · 2023',
    about_training_1: 'Gravità quantistica perturbativa · University of Massachusetts Amherst · 2023',
    about_training_2: 'Fondamenti di gravità quantistica a loop · Bard College · 2023',
    about_training_3: 'Informazione quantistica tra teoria quantistica e gravità · ETH Zürich · 2023',
    about_training_4: 'Le sfide della gravità quantistica · Virginia Tech · 2023',
    about_training_5: 'Programma di ricerca REYES · University of California, Berkeley · 2023',
    about_training_6: 'Programma di ricerca Research 101 / Andromeda · Deep Space Initiative · 2023',
    about_training_7: 'Telerilevamento satellitare dell’atmosfera · Indian Institute of Remote Sensing · 2022',
    skip: 'Vai al contenuto',
    skip_entrance: 'Vai all’ingresso',
    role: 'Fisico e ingegnere',
    location_florence: 'Firenze, Italia',
    enter: 'Entra',
    choose_space: 'Scegli uno spazio.',
    back: ' Indietro',
    public_choice: 'Ricerca pubblica',
    public_detail: 'Lo spazio aperto',
    private_choice: 'Area riservata',
    private_detail: 'Accesso con password',
    language: 'Lingua',
    primary_nav: 'Navigazione principale',
    footer_nav: 'Collegamenti nel piè di pagina',
    nav_home: 'Inizio',
    nav_publications: 'Pubblicazioni',
    nav_ideas: 'Idee',
    nav_work: 'Ricerca',
    nav_lab: 'Laboratorio',
    nav_papers: 'Pubblicazioni',
    nav_about: 'Profilo',
    nav_contact: 'Contatti',
    menu: 'Menu',
    hero_eyebrow: 'Fisico e ingegnere',
    hero_title_a: 'Dalla teoria',
    hero_title_b: 'alla simulazione.',
    hero_lead: 'Studio sistemi fisici attraverso modelli analitici e metodi numerici, dalla cosmologia fondamentale all’ingegneria applicata.',
    explore_work: 'Esplora la ricerca',
    discuss_project: 'Proponi un progetto',
    portrait_caption: 'Fisica / Ingegneria',
    hero_bottom: 'Teoria · Calcolo · Ingegneria',
    scroll_selected: 'Lavori selezionati ↓',
    feature_kicker: '01 / Ricerca in evidenza',
    feature_heading: 'Un modello da esplorare.',
    open_lab: 'Apri il laboratorio',
    feature_explore: 'Esplora il modello',
    fold_header: 'IL CONFINE DI STABILITÀ',
    fold_parameter: 'PARAMETRO LOCALE',
    fold_normal: '· forma normale locale',
    feature_summary: 'Un complemento computazionale all’articolo: esplora il punto in cui un minimo metastabile e la sua barriera scompaiono insieme.',
    interactive_atlas: 'Atlante interattivo ',
    read_preprint: 'Leggi il preprint ',
    work_kicker: '02 / Studi selezionati',
    work_head_a: 'Dieci direzioni.',
    work_head_b: 'Un metodo.',
    work_subtitle: 'Lavori selezionati tra teoria, astrofisica e ingegneria.',
    filter_aria: 'Filtra la ricerca per ambito',
    filter_all: 'Tutti',
    filter_theory: 'Teoria',
    filter_astro: 'Astrofisica',
    filter_engineering: 'Ingegneria',
    count_all: '10 studi selezionati',
    field_theory: 'Teoria',
    field_astro: 'Astrofisica',
    field_engineering: 'Ingegneria',
    study_01: 'Inflazione · Modello interattivo',
    title_02: 'Inflazione con ACT e DESI',
    study_02: 'Vincoli osservativi',
    title_03: 'Buchi neri primordiali e onde gravitazionali',
    study_03: 'Segnali dell’universo primordiale',
    title_04: 'Geometria dello spazio delle fasi quantisticamente deformato',
    study_04: 'Fondamenti teorici',
    title_05: 'Lensing dei lampi radio veloci',
    study_05: 'Segnali transienti',
    title_06: 'Analisi dei transiti di Qatar-1b',
    study_06: 'Analisi di esopianeti',
    title_07: 'Plasma solare e radioemissioni',
    study_07: 'Spettri e dinamica solare',
    title_08: 'Gestione termica delle batterie',
    study_08: 'Trasmissione del calore e progettazione',
    title_09: 'Combustione ammoniaca–idrogeno',
    study_09: 'Cinetica delle reazioni ed emissioni',
    title_10: 'Sistemi energetici per lo spazio profondo',
    study_10: 'Progettazione di sistemi spaziali',
    work_note: 'Esplora le singole schede di ricerca e i relativi metodi.',
    full_archive: 'Archivio completo della ricerca',
    practice_kicker: '03 / Collaborazioni',
    practice_heading: 'Ricerca con applicazioni concrete.',
    practice_01: 'Modellazione analitica',
    practice_desc_01: 'Equazioni, ipotesi e verifiche di coerenza.',
    practice_02: 'Calcolo scientifico',
    practice_desc_02: 'Studi numerici, simulazioni e interpretazione visiva.',
    practice_03: 'Analisi ingegneristica',
    practice_desc_03: 'Problemi di progettazione termica, meccanica e fisica.',
    contact_kicker: '04 / Collaborazioni',
    contact_title_a: 'Hai un problema',
    contact_title_b: 'da risolvere?',
    contact_desc: 'Sono disponibile per collaborazioni scientifiche, modellazione computazionale e progetti di ingegneria. Partiamo dalla domanda.',
    contact_action: 'Avvia una conversazione',
    return_entry: 'Ingresso',
    availability_unknown: 'Chat pronta',
    availability_connecting: 'Connessione…',
    availability_unavailable: 'Chat non disponibile',
    availability_online: 'Online',
    availability_away: 'Assente',
    availability_offline: 'Offline',
    chat_live: 'Chat dal vivo',
    chat_open: 'Apri chat ',
    chat_open_action: 'Apri chat',
    chat_unavailable: 'Non disponibile',
    visitors_label: 'Visitatori',
    ideas_kicker: 'Appunti / Idee',
    ideas_title: 'Questioni aperte.',
    ideas_note: 'Inflazione e struttura dell’universo primordiale; segnali gravitazionali come sonde cosmologiche; metodi numerici tra teoria e osservazione.',
    ideas_back: 'Torna alla ricerca',
    back_top: 'Torna in alto ',
    private_index: '02 / Su invito',
    private_title_a: 'Area',
    private_title_b: 'riservata.',
    private_subtitle: 'Per collaboratori invitati.',
    email: 'Indirizzo email',
    invited_email: 'Email di invito',
    password: 'Password',
    sign_in: 'Accedi',
    invitation_only: 'Solo su invito',
    forgot_password: 'Password dimenticata?',
    new_password: 'Nuova password',
    new_password_hint: 'Almeno 12 caratteri',
    confirm_password: 'Conferma password',
    save_password: 'Salva la password',
    shared_research: 'Ricerca condivisa',
    sign_out: 'Esci',
    private_access: 'Accesso riservato',
    return_entrance: ' Torna all’ingresso'
  };

  Object.assign(italian, window.SKS_TRANSLATIONS_V28?.data || {});

  const messages = {
    'Private access is being prepared. Invitations are not active yet.': 'L’accesso riservato è in preparazione. Gli inviti non sono ancora attivi.',
    'The private workspace is temporarily unavailable.': 'L’area riservata è temporaneamente non disponibile.',
    'Signing in…': 'Accesso in corso…',
    'Sign-in failed. Check your email and password, or request an invitation.': 'Accesso non riuscito. Controlla email e password oppure richiedi un invito.',
    'Enter your invited email address to request a password reset.': 'Inserisci l’indirizzo email invitato per reimpostare la password.',
    'If the account exists, a password-reset link is on its way.': 'Se l’account esiste, riceverai un link per reimpostare la password.',
    'The reset request could not be sent. Please try later.': 'Impossibile inviare la richiesta. Riprova più tardi.',
    'Use at least 12 characters and make sure both passwords match.': 'Usa almeno 12 caratteri e verifica che le due password coincidano.',
    'Could not update your password. Please request a fresh link.': 'Impossibile aggiornare la password. Richiedi un nuovo link.',
    'Sign-out failed. Please retry.': 'Disconnessione non riuscita. Riprova.',
    'Could not load your projects. Please try signing in again.': 'Impossibile caricare i progetti. Prova ad accedere di nuovo.',
    'Could not load shared files. Please try again.': 'Impossibile caricare i file condivisi. Riprova.',
    'No projects have been shared with this account yet.': 'Non ci sono ancora progetti condivisi con questo account.',
    'No files shared yet.': 'Nessun file condiviso per ora.',
    'Opening your projects…': 'Apertura dei progetti…',
    'This invitation or recovery link may have expired. Request a new link.': 'Questo link potrebbe essere scaduto. Richiedine uno nuovo.',
    'That file could not be opened. Please try again.': 'Impossibile aprire il file. Riprova.'
  };

  const supplementary = window.SKS_TRANSLATIONS_V28 || {};
  const phrases = supplementary.text || {};
  const pageTitles = supplementary.pageTitles || {};
  const originalInline = new WeakMap();
  const originalHref = new WeakMap();

  // Preserve the markup of nested headings, links and MathJax controls; translate
  // only original text nodes. The source language is recoverable without reloads.
  function translateRemainingText() {
    if (!document.body || !document.createTreeWalker) return;
    const scan = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = scan.nextNode())) {
      const parent = node.parentElement;
      if (!parent || parent.closest('[data-i18n], [data-no-translate], [translate="no"], script, style, noscript, textarea, code, pre, svg, math, iframe')) continue;
      if (!originalInline.has(node)) originalInline.set(node, node.nodeValue);
      const original = originalInline.get(node);
      const key = original.replace(/\s+/g, ' ').trim();
      const translated = phrases[key];
      if (language !== 'it' || typeof translated !== 'string') {
        if (node.nodeValue !== original) node.nodeValue = original;
        continue;
      }
      const before = (original.match(/^\s*/) || [''])[0];
      const after = (original.match(/\s*$/) || [''])[0];
      node.nodeValue = before + translated + after;
    }
  }

  function retainLanguageAcrossPages() {
    if (!document.body) return;
    document.querySelectorAll('a[href]').forEach(link => {
      if (!originalHref.has(link)) originalHref.set(link, link.getAttribute('href'));
      const href = originalHref.get(link);
      if (!href || href[0] === '#' || /^(?:mailto:|tel:|data:|javascript:)/i.test(href)) return;
      try {
        const url = new URL(href, location.href);
        if (url.origin !== location.origin) return;
        if (!(/\.html$/i.test(url.pathname) || url.pathname.endsWith('/'))) return;
        if (language === 'it') url.searchParams.set('lang', 'it');
        else url.searchParams.delete('lang');
        link.setAttribute('href', url.pathname + url.search + url.hash);
      } catch { /* A malformed href should not break language controls. */ }
    });
  }

  const originalText = new WeakMap();
  const originalAria = new WeakMap();
  const originalPlaceholders = new WeakMap();
  const root = document.documentElement;
  const storageKey = 'sks-language';
  const initialTitle = document.title;
  const description = document.querySelector('meta[name="description"]');
  const initialDescription = description?.content ?? '';
  let language = 'en';

  const readPreference = () => {
    const urlLanguage = new URLSearchParams(location.search).get('lang');
    if (urlLanguage === 'en' || urlLanguage === 'it') return urlLanguage;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'en' || stored === 'it') return stored;
    } catch { /* The control works without storage. */ }
    return 'en';
  };

  function apply(code, updateAddress = false) {
    language = code === 'it' ? 'it' : 'en';
    root.lang = language;
    document.querySelectorAll('[data-i18n]').forEach(node => {
      if (!originalText.has(node)) originalText.set(node, node.textContent);
      const original = originalText.get(node);
      node.textContent = language === 'it' ? (italian[node.dataset.i18n] ?? original) : original;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(node => {
      if (!originalAria.has(node)) originalAria.set(node, node.getAttribute('aria-label') ?? '');
      node.setAttribute('aria-label', language === 'it' ? (italian[node.dataset.i18nAria] ?? originalAria.get(node)) : originalAria.get(node));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(node => {
      if (!originalPlaceholders.has(node)) originalPlaceholders.set(node, node.placeholder);
      node.placeholder = language === 'it' ? (italian[node.dataset.i18nPlaceholder] ?? originalPlaceholders.get(node)) : originalPlaceholders.get(node);
    });
    document.querySelectorAll('[data-set-lang]').forEach(button => {
      const active = button.dataset.setLang === language;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-active', active);
    });
    translateRemainingText();
    retainLanguageAcrossPages();
    const pageKey = location.pathname.includes('/research/kahler-stability-wall/')
      ? 'research/kahler-stability-wall/index.html'
      : (location.pathname.split('/').pop() || 'index.html');
    if (language === 'it' && pageTitles[pageKey]) {
      document.title = pageTitles[pageKey];
      if (description) description.content = 'Profilo di Swapnil Kumar Singh: ricerca, fisica computazionale e ingegneria.';
    } else if (language === 'it') {
      document.title = document.body.classList.contains('ideas-v16') ? 'Idee — Swapnil Kumar Singh'
        : document.body.classList.contains('about-v27') ? 'Profilo — Swapnil Kumar Singh'
        : document.body.classList.contains('public-v13') ? 'Ricerca pubblica — Swapnil Kumar Singh'
        : document.body.classList.contains('gateway-v12') ? 'Swapnil Kumar Singh — Fisico e ingegnere'
        : 'Area riservata — Swapnil Kumar Singh';
      if (description) description.content = 'Swapnil Kumar Singh — fisico e ingegnere. Ricerca, simulazioni scientifiche e collaborazioni.';
    } else {
      document.title = initialTitle;
      if (description) description.content = initialDescription;
    }
    if (updateAddress) {
      try {
        localStorage.setItem(storageKey, language);
      } catch { /* Optional persistence. */ }
      const url = new URL(location.href);
      if (language === 'en') url.searchParams.delete('lang');
      else url.searchParams.set('lang', 'it');
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
    document.dispatchEvent(new CustomEvent('sks:languagechange', { detail: { language } }));
  }

  window.SKSLanguage = {
    get current() { return language; },
    translate(key, fallback = '') { return language === 'it' ? (italian[key] ?? fallback) : fallback; },
    message(value) { return language === 'it' ? (messages[value] ?? value) : value; },
    apply
  };
  const initialize = () => {
    document.querySelectorAll('[data-set-lang]').forEach(button => {
      button.addEventListener('click', () => apply(button.dataset.setLang, true));
    });
    apply(readPreference());
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
