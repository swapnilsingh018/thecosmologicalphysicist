/* Inner Observatory — only the interface lives here.
   Authentication, permissions and downloads are enforced by Supabase. */

const $ = (id) => document.getElementById(id);
const config = window.INNER_OBSERVATORY_CONFIG || {};
const loginForm = $("loginForm");
const loginButton = $("loginButton");
const emailInput = $("researchID");
const passwordInput = $("researchPassword");
const resetButton = $("resetButton");
const passwordForm = $("passwordForm");
const passwordButton = $("passwordButton");
const projectList = $("projectList");
const statusArea = $("portalStatus");
const viewIds = ["loginView", "passwordView", "workspaceView"];
const linkFlow = new URLSearchParams(location.hash.slice(1)).get("type")
  || new URLSearchParams(location.search).get("type");
let passwordFlow = linkFlow === "invite" || linkFlow === "recovery";
let client;
let refreshNumber = 0;
let lastStatusMessage = "";

function setStatus(message, isError = false) {
  lastStatusMessage = message;
  statusArea.textContent = window.SKSLanguage?.message(message) ?? message;
  statusArea.classList.toggle("is-error", isError);
}

document.addEventListener('sks:languagechange', () => {
  statusArea.textContent = window.SKSLanguage?.message(lastStatusMessage) ?? lastStatusMessage;
});

function showView(id) {
  for (const viewId of viewIds) $(viewId).hidden = viewId !== id;
}

function isConfigured() {
  try {
    const url = new URL(config.supabaseUrl);
    return url.protocol === "https:"
      && typeof config.supabasePublishableKey === "string"
      && !config.supabasePublishableKey.startsWith("sb_secret_")
      && config.supabasePublishableKey.trim().length > 15
      && config.bucket === "inner-observatory";
  } catch {
    return false;
  }
}

function enableLogin() {
  emailInput.disabled = false;
  passwordInput.disabled = false;
  loginButton.disabled = false;
  resetButton.disabled = false;
}

function make(tag, className, value) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (value !== undefined) element.textContent = window.SKSLanguage?.message(value) ?? value;
  return element;
}

async function downloadFile(file, button) {
  button.disabled = true;
  const label = button.textContent;
  button.textContent = "PREPARING…";
  try {
    // The storage.objects RLS policy checks membership on every request.
    const { data, error } = await client.storage
      .from(config.bucket)
      .createSignedUrl(file.storage_path, 60);
    if (error || !data?.signedUrl) throw error || new Error("No download URL");
    // Created only after a user click; URLs expire after 60 seconds.
    location.assign(data.signedUrl);
  } catch {
    setStatus("That file could not be opened. Please try again.", true);
  } finally {
    button.textContent = label;
    button.disabled = false;
  }
}

function renderProjects(projects, files) {
  projectList.replaceChildren();
  if (!projects.length) {
    projectList.append(make(
      "p",
      "workspace-empty",
      "No projects have been shared with this account yet."
    ));
    return;
  }

  const filesByProject = new Map();
  for (const file of files) {
    if (!filesByProject.has(file.project_id)) filesByProject.set(file.project_id, []);
    filesByProject.get(file.project_id).push(file);
  }

  for (const project of projects) {
    const section = make("section", "shared-project");
    const heading = make("h3", "", project.title);
    section.append(heading);
    if (project.description) section.append(make("p", "", project.description));

    const sharedFiles = filesByProject.get(project.id) || [];
    if (!sharedFiles.length) {
      section.append(make("p", "workspace-empty", "No files shared yet."));
    } else {
      const list = make("ul", "project-files");
      for (const file of sharedFiles) {
        const item = make("li");
        item.append(make("span", "file-name", file.display_name));
        const button = make("button", "", "OPEN ↗");
        button.type = "button";
        button.setAttribute("aria-label", "Open " + file.display_name);
        button.addEventListener("click", () => downloadFile(file, button));
        item.append(button);
        list.append(item);
      }
      section.append(list);
    }
    projectList.append(section);
  }
}

async function refreshSession() {
  const current = ++refreshNumber;
  const { data: sessionData, error: sessionError } = await client.auth.getSession();
  if (current !== refreshNumber) return;

  if (sessionError || !sessionData.session) {
    showView("loginView");
    if (linkFlow && passwordFlow) {
      setStatus("This invitation or recovery link may have expired. Request a new link.", true);
    } else if (!statusArea.classList.contains("is-error")) {
      setStatus("");
    }
    return;
  }

  if (passwordFlow) {
    showView("passwordView");
    setStatus("");
    return;
  }

  showView("workspaceView");
  $("accountEmail").textContent = sessionData.session.user.email || "Research collaborator";
  setStatus("");
  projectList.replaceChildren(make("p", "workspace-empty", "Opening your projects…"));

  const { data: projects, error: projectsError } = await client
    .from("research_projects")
    .select("id,title,description")
    .order("title", { ascending: true });
  if (current !== refreshNumber) return;
  if (projectsError) {
    projectList.replaceChildren();
    setStatus("Could not load your projects. Please try signing in again.", true);
    return;
  }
  if (!projects?.length) {
    renderProjects([], []);
    return;
  }

  const { data: files, error: filesError } = await client
    .from("project_files")
    .select("id,project_id,display_name,storage_path")
    .in("project_id", projects.map((project) => project.id))
    .order("display_name", { ascending: true });
  if (current !== refreshNumber) return;
  if (filesError) {
    projectList.replaceChildren();
    setStatus("Could not load shared files. Please try again.", true);
    return;
  }
  renderProjects(projects, files || []);
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!client) return;
  loginButton.disabled = true;
  setStatus("Signing in…");
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  try {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    passwordInput.value = "";
    await refreshSession();
  } catch {
    passwordInput.value = "";
    setStatus("Sign-in failed. Check your email and password, or request an invitation.", true);
  } finally {
    loginButton.disabled = false;
  }
});

resetButton.addEventListener("click", async () => {
  if (!client) return;
  const email = emailInput.value.trim();
  if (!email || !emailInput.checkValidity()) {
    setStatus("Enter your invited email address to request a password reset.", true);
    emailInput.focus();
    return;
  }
  resetButton.disabled = true;
  try {
    const redirectTo = new URL("private.html", location.href).href.split("#")[0];
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) throw error;
    setStatus("If the account exists, a password-reset link is on its way.");
  } catch {
    setStatus("The reset request could not be sent. Please try later.", true);
  } finally {
    resetButton.disabled = false;
  }
});

passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!client) return;
  const next = $("newPassword").value;
  const confirm = $("confirmPassword").value;
  if (next.length < 12 || next !== confirm) {
    setStatus("Use at least 12 characters and make sure both passwords match.", true);
    return;
  }
  passwordButton.disabled = true;
  try {
    const { error } = await client.auth.updateUser({ password: next });
    if (error) throw error;
    passwordForm.reset();
    passwordFlow = false;
    await refreshSession();
  } catch {
    setStatus("Could not update your password. Please request a fresh link.", true);
  } finally {
    passwordButton.disabled = false;
  }
});

$("signOutButton").addEventListener("click", async () => {
  if (!client) return;
  const button = $("signOutButton");
  button.disabled = true;
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    projectList.replaceChildren();
    ++refreshNumber;
    showView("loginView");
    setStatus("");
  } catch {
    setStatus("Sign-out failed. Please retry.", true);
  } finally {
    button.disabled = false;
  }
});

async function initialize() {
  if (!isConfigured()) {
    setStatus("Private access is being prepared. Invitations are not active yet.");
    return;
  }
  try {
    // Auth is provided by Supabase; there are no passwords or secret keys in this site.
    const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    client = createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
    });
    enableLogin();
    client.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") passwordFlow = true;
      // Leave the callback promptly; session and DB calls run separately.
      setTimeout(() => { void refreshSession(); }, 0);
    });
    await refreshSession();
  } catch {
    setStatus("The private workspace is temporarily unavailable.", true);
  }
}

void initialize();
