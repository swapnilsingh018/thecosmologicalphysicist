/* EN / IT presentation for the three public-facing rooms.
   Source labels remain in the HTML for accessibility and graceful fallback. */
(() => {
  'use strict';

  const italian = {
    skip: 'Vai al contenuto',
    skip_entrance: 'Vai all’ingresso',
    role: 'Fisico e ingegnere',
    enter: 'Entra',
    choose_space: 'Scegli uno spazio.',
    back: '← Indietro',
    public_choice: 'Ricerca pubblica',
    public_detail: 'Lo spazio aperto',
    private_choice: 'Area riservata',
    private_detail: 'Accesso con password',
    language: 'Lingua',
    primary_nav: 'Navigazione principale',
    footer_nav: 'Collegamenti nel piè di pagina',
    nav_home: 'Inizio',
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
    fold_normal: '· forma normale locale',
    feature_summary: 'Un complemento computazionale all’articolo: esplora il punto in cui un minimo metastabile e la sua barriera scompaiono insieme.',
    interactive_atlas: 'Atlante interattivo ↗',
    read_preprint: 'Leggi il preprint ↗',
    work_kicker: '02 / Studi selezionati',
    work_head_a: 'Dieci direzioni.',
    work_head_b: 'Un metodo.',
    work_subtitle: 'Una selezione iniziale. Ogni studio avrà una presentazione visiva e computazionale dedicata.',
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
    work_note: 'Le presentazioni interattive dedicate sono in preparazione. Le schede di ricerca esistenti restano accessibili.',
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
    back_top: 'Torna in alto ↑',
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
    return_entrance: '← Torna all’ingresso'
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
      document.title = document.body.classList.contains('public-v13') ? 'Ricerca pubblica — Swapnil Kumar Singh'
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
