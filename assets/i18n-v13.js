/* EN / IT presentation for the three public-facing rooms.
   Source labels remain in the HTML for accessibility and graceful fallback. */
(() => {
  'use strict';

  const italian = {
    about_role_0: 'Borsista di ricerca estiva',
    about_summary_0: 'Inferenza dei parametri cosmologici da supernovae di tipo Ia, con modelli che includono la covarianza e verifiche di robustezza statistica.',
    about_skill_0: 'Cosmologia · Inferenza bayesiana · Python',
    about_role_1: 'Borsista TEEP Global',
    about_summary_1: 'Studi numerici delle lenti gravitazionali dei fast radio burst e degli ambienti galattici nell’universo primordiale.',
    about_skill_1: 'Astrofisica · Lenti gravitazionali · Metodi numerici',
    about_role_2: 'Tirocinante di ricerca',
    about_summary_2: 'Valutazione computazionale di modelli inflazionari e dei relativi vincoli osservativi.',
    about_skill_2: 'Inflazione · Inferenza parametrica · Calcolo numerico',
    about_role_3: 'Borsista di ricerca estiva',
    about_summary_3: 'Cosmologia della gravità modificata e analisi di sistemi dinamici, integrate da inferenza osservativa.',
    about_skill_3: 'Gravità modificata · Sistemi dinamici · MCMC',
    about_role_4: 'Associato di ricerca',
    about_summary_4: 'Geometria gravitazionale efficace e dinamica inflazionaria in formulazioni dello spazio delle fasi deformato quantisticamente.',
    about_skill_4: 'Relatività generale · Geometria differenziale · Modellazione analitica',
    about_role_5: 'Borsista di ricerca estiva',
    about_summary_5: 'Buchi neri primordiali, onde gravitazionali indotte da scalari e perturbazioni in cosmologie non singolari.',
    about_skill_5: 'Universo primordiale · Onde gravitazionali · Metodi spettrali',
    about_role_6: 'Borsista DS Kothari / Borsista estivo',
    about_summary_6: 'Confronto di modelli cosmologici mediante osservazioni di supernovae e stima bayesiana.',
    about_skill_6: 'Cosmologia osservativa · MCMC · Selezione dei modelli',
    about_role_7: 'Tirocinante di ricerca',
    about_summary_7: 'Formazione nella ricerca spaziale e indagine computazionale di concetti relativi alle missioni.',
    about_skill_7: 'Sistemi spaziali · Metodologia di ricerca',
    about_role_8: 'Tirocinante di ricerca',
    about_summary_8: 'Prime esperienze di ricerca nelle scienze spaziali e nel calcolo scientifico.',
    about_skill_8: 'Scienze spaziali · Calcolo scientifico',
    about_role_9: 'Tirocinante di progettazione e responsabile del progetto',
    about_summary_9: 'Progettazione di ortesi degli arti inferiori guidata da simulazioni, analisi a fatica e ottimizzazione topologica.',
    about_skill_9: 'Elementi finiti · ANSYS · Progettazione strutturale',
    about_role_10: 'Assistente di ricerca e responsabile del gruppo',
    about_summary_10: 'Servizi satellitari, propulsione ibrida e simulazione delle traiettorie orbitali per sistemi spaziali.',
    about_skill_10: 'Meccanica orbitale · Ingegneria dei sistemi · Simulazione',
    about_role_11: 'Assistente di ricerca',
    about_summary_11: 'Modellazione numerica della combustione ammoniaca–idrogeno e della cinetica chimica.',
    about_skill_11: 'CFD · Combustione · Python',
    about_role_12: 'Ricerca per tesi di laurea',
    about_summary_12: 'Progettazione bioispirata di profili alari, aeroacustica e validazione in galleria del vento.',
    about_skill_12: 'CFD · Aeroacustica · Validazione sperimentale',
    about_role_13: 'Progetto di progettazione di sistemi termici',
    about_summary_13: 'Gestione termica di assemblaggi di batterie agli ioni di litio ad alta potenza tramite modelli di scambio termico coniugato.',
    about_skill_13: 'Scambio termico · CFD · Progettazione termica',
    about_label: 'PROFILO',
    about_intro_title: 'Fisica, calcolo e ingegneria.',
    about_intro_1: 'Sono un fisico e ingegnere con sede a Firenze, dove frequento il corso di laurea magistrale in Scienze Fisiche e Astrofisiche presso l’Università di Firenze. Il mio percorso è iniziato con l’ingegneria meccanica e si è sviluppato verso la cosmologia teorica e la fisica numerica.',
    about_intro_2: 'La mia attività comprende modelli dell’universo primordiale, dinamica gravitazionale, dati astrofisici e metodi computazionali. Integro ragionamento analitico, inferenza statistica e simulazione, con attenzione alle ipotesi fisiche e alla stabilità numerica.',
    about_intro_3: 'In parallelo, la mia esperienza ingegneristica comprende fluidodinamica computazionale, analisi strutturale, sistemi termici e applicazioni aerospaziali. Mi interessano i problemi che collegano i modelli matematici a fenomeni fisici verificabili.',
    about_research_label: 'ESPERIENZA',
    about_research_title: 'Incarichi di ricerca',
    about_research_note: 'Esperienze accademiche e di ricerca, comprese le collaborazioni da remoto. Le date provengono dal curriculum vitae.',
    about_engineer_label: 'APPLICAZIONI',
    about_engineer_title: 'Attività ingegneristiche',
    about_engineer_note: 'Incarichi e progetti universitari significativi sono distinti secondo le denominazioni del curriculum.',
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
    about_methods_eng: 'Simulazione ingegneristica',
    about_methods_workflow: 'Flusso di ricerca',
    about_training_label: 'FORMAZIONE CONTINUA',
    about_training_title: 'Formazione complementare',
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
    if (language === 'it') {
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
  document.querySelectorAll('[data-set-lang]').forEach(button => {
    button.addEventListener('click', () => apply(button.dataset.setLang, true));
  });
  apply(readPreference());
})();
