{
{
const OWNER = "ThinkTank4n6";
const projects = [
  { repo: "Forensic-Media-Extractor", name: "Forensic Media Extractor", short: "FME", kind: "DFIR",
    blurb: "Extracts every known image and video file from forensic images, with a shared hash store so your unit's known files are flagged across machines.",
    feats: ["E01, raw and dd image formats", "FAT, FAT32, exFAT, NTFS, HFS+ and APFS", "Shared hash store server for the whole lab", "Python 3.11+, runs on Windows workstations"],
    art: "fme", tagline: "Recover and grade every photo and video from forensic images" },
  { repo: "DVR-Forensic-Extractor", name: "DVR Forensic Extractor", short: "DFX", kind: "DFIR",
    status: "Early development build. Tested only on synthetic images, not on real DVR evidence. Do not use it for casework until it has been validated.",
    blurb: "Reads DVR and NVR hard drives and images read-only and carves surveillance video using a signature library you can edit and test.",
    feats: ["Raw, dd, split and E01 images, or a physical drive", "Five carving modes, including DHAV frame chains", "Signature editor with test-on-sample", "Checkpoint and resume, with MD5/SHA-256 for every item"],
    art: "dfx", badge: "Early build", tagline: "Carve surveillance video from DVR and NVR drives" },
  { repo: "eaveluxos", name: "EaveLuxOS", short: "EaveLuxOS", kind: "Home",
    blurb: "The intelligent lighting control platform for Trimlight Edge permanent lights. Runs on an always-on PC at home and replaces the stock app.",
    feats: ["True sunrise and sunset scheduling", "Correct daylight saving time handling", "Uses the official Trimlight API", "Self-hosted: your schedule stays on your network"],
    art: "eaveluxos", extra: ["#patterns", "Community patterns"], tagline: "Smarter scheduling for Trimlight Edge permanent lights" }
];


const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const gh = p => `https://github.com/${OWNER}/${p.repo}`;


// Extra menu entries that aren't downloadable projects. Add new ones here.
const links = [
  { kind: "Home", name: "Community Patterns", href: "home.html#patterns", icon: "patterns", tagline: "Browse and share EaveLuxOS lighting patterns" }
];
const pages = { DFIR: "dfir.html", Home: "home.html" };
const entries = kind => [
  ...projects.filter(p => p.kind === kind).map(p => ({ name: p.name, href: `${pages[kind]}#p-${p.repo}`, icon: p.art, tagline: p.tagline, badge: p.badge })),
  ...links.filter(l => l.kind === kind)
];
const icon = e => `<img src="img/${e.icon}-icon.svg" alt="" width="40" height="40">`;
document.querySelectorAll(".dd").forEach(dd => {
  const kind = dd.dataset.menu, btn = dd.querySelector(".ddb"), m = dd.querySelector(".ddm");
  m.innerHTML = entries(kind).map(e => `<a class="mi" href="${e.href}">${icon(e)}<span><b>${esc(e.name)}</b><small>${esc(e.tagline || "")}</small></span></a>`).join("") +
    `<a class="all" href="${pages[kind]}">All ${kind} projects →</a>`;
  const set = open => { btn.setAttribute("aria-expanded", open); m.hidden = !open; };
  btn.addEventListener("click", e => { e.stopPropagation(); const o = btn.getAttribute("aria-expanded") !== "true";
    document.querySelectorAll(".dd .ddb[aria-expanded=true]").forEach(b => { b.setAttribute("aria-expanded", false); b.nextElementSibling.hidden = true; }); set(o); if (o) m.querySelector("a").focus({ preventScroll: true }); });
  m.addEventListener("click", () => set(false));
  dd.addEventListener("keydown", e => { if (e.key === "Escape") { set(false); btn.focus(); } });
  dd.addEventListener("focusout", e => { if (!dd.contains(e.relatedTarget)) set(false); });
});
document.addEventListener("click", () => document.querySelectorAll(".dd").forEach(dd => { dd.querySelector(".ddb").setAttribute("aria-expanded", false); dd.querySelector(".ddm").hidden = true; }));
document.querySelectorAll("[data-list]").forEach(el => {
  el.innerHTML = entries(el.dataset.list).map(e => `<a class="row" href="${e.href}"><img src="img/${e.icon}-icon.svg" alt="" width="56" height="56"><span class="rt"><b>${esc(e.name)}</b>${e.badge ? `<span class="badge">${esc(e.badge)}</span>` : ""}<small>${esc(e.tagline || "")}</small></span><span class="arr" aria-hidden="true">›</span></a>`).join("");
});

const itemsEl = document.getElementById("items");
const shown = itemsEl ? projects.filter(p => p.kind === itemsEl.dataset.kind) : [];
if (itemsEl) itemsEl.innerHTML = shown.map(p => `
  <article class="item" id="p-${p.repo}">
    <div class="tag"><span>ITEM · <b>${esc(p.short)}</b></span><span>${esc(p.kind)} · MIT</span></div>
    <div class="body">
      <div class="art"><img src="img/${p.art}-banner.svg" alt="${esc(p.name)} logo" width="800" height="340" loading="lazy"></div>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.blurb)}</p>
      ${p.status ? `<p class="warn"><b>Not for casework yet.</b> ${esc(p.status)}</p>` : ""}
      <ul class="feat">${p.feats.map(f => `<li>${esc(f)}</li>`).join("")}</ul>
      <div class="rel" data-rel>Latest release: see GitHub</div>
      <div data-panel></div>
      <div class="btns">
        <a class="btn solid" data-dl href="${gh(p)}/releases/latest">Downloads on GitHub</a>
        <a class="btn" href="${gh(p)}">Source &amp; docs</a>
        <a class="btn" href="${gh(p)}/releases">All releases</a>${p.extra ? `<a class="btn" href="${p.extra[0]}">${esc(p.extra[1])}</a>` : ""}
      </div>
    </div>
  </article>`).join("");

// Pull the newest release from the GitHub API and build a download panel per platform.
// The static buttons above still work if this fails.
const describe = name => {
  const n = name.toLowerCase();
  const arm = /arm64|aarch64/.test(n), x64 = /x86_64|amd64|x64/.test(n);
  if (/sha256|checksum/.test(n)) return { os: "Checksums", label: "SHA-256 checksums", rank: 9 };
  if (/\.deb$/.test(n)) return { os: "Linux", label: `Debian / Ubuntu (.deb) · ${arm ? "ARM64" : "x86-64"}`, rank: arm ? 4 : 3 };
  if (/linux|\.appimage$|\.rpm$/.test(n)) return { os: "Linux", label: `Linux (.tar.gz) · ${arm ? "ARM64 / Raspberry Pi" : "x86-64"}`, rank: arm ? 2 : 1 };
  if (/mac|darwin|osx|\.dmg$|\.pkg$/.test(n)) {
    const intel = /intel/.test(n) || (x64 && !arm);
    return { os: "macOS", label: intel ? "Intel Macs" : "Apple Silicon (M1 and newer)", rank: intel ? 2 : 1 };
  }
  if (/windows|win64|win32|\.exe$|\.msi$/.test(n)) return { os: "Windows", label: /\.exe$|\.msi$/.test(n) ? "Windows installer" : "Windows 10 / 11 (64-bit)", rank: 1 };
  return { os: "Other", label: name, rank: 1 };
};
const ua = navigator.userAgent;
const myOS = /iPhone|iPad|Android/.test(ua) ? "" : /Windows/.test(ua) ? "Windows" : /Mac/.test(ua) ? "macOS" : /Linux|X11/.test(ua) ? "Linux" : "";
const mb = b => b >= 1048576 ? (b/1048576).toFixed(1) + " MB" : Math.max(1, Math.round(b/1024)) + " KB";
if (itemsEl && location.hash.startsWith("#p-")) { const t = document.getElementById(location.hash.slice(1)); if (t) requestAnimationFrame(() => t.scrollIntoView()); }
shown.forEach(async p => {
  const card = document.getElementById("p-" + p.repo);
  try {
    const r = await fetch(`https://api.github.com/repos/${OWNER}/${p.repo}/releases/latest`, { headers: { Accept: "application/vnd.github+json" } });
    if (r.status === 404) { card.querySelector("[data-rel]").textContent = "No release published yet. Get it from the source on GitHub."; const dl = card.querySelector("[data-dl]"); dl.href = gh(p); dl.textContent = "Get the source"; return; }
    if (!r.ok) return;
    const j = await r.json();
    const assets = (j.assets || []).map(x => ({ ...x, d: describe(x.name) }));
    if (!assets.length) return;
    const date = new Date(j.published_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    const order = ["Windows", "macOS", "Linux", "Other"].sort((x, y) => (y === myOS) - (x === myOS));
    const groups = order.map(os => {
      const list = assets.filter(x => x.d.os === os).sort((x, y) => x.d.rank - y.d.rank);
      if (!list.length) return "";
      return `<div class="os${os === myOS ? " mine" : ""}"><h4>${os}${os === myOS ? " <em>your computer</em>" : ""}</h4>
        ${list.map(x => `<a class="file" href="${esc(x.browser_download_url)}"><span>${esc(x.d.label)}</span><small>${esc(x.name)} · ${mb(x.size)}</small></a>`).join("")}</div>`;
    }).join("");
    const sums = assets.find(x => x.d.os === "Checksums");
    card.querySelector("[data-rel]").innerHTML = `Latest release: <code>${esc(j.tag_name)}</code> · ${esc(date)}`;
    card.querySelector("[data-panel]").innerHTML = `<div class="dl">${groups}</div>` +
      (sums ? `<p class="sums">Verify your download against <a href="${esc(sums.browser_download_url)}">${esc(sums.name)}</a>.</p>` : "");
    card.querySelector("[data-dl]").remove();
  } catch (e) { /* offline or rate-limited: keep the fallback link */ }
});


// Community patterns: read the same index.json EaveLuxOS reads, live from GitHub.
const PAT_URL = "https://raw.githubusercontent.com/ThinkTank4n6/eaveluxos-patterns/main/index.json";
const pgrid = document.getElementById("pgrid"), pq = document.getElementById("pq"), ptags = document.getElementById("ptags");
let pats = [], tagOn = "";
const kindName = { show: "Studio show", automation: "Automation" };
const titleCase = t => t.charAt(0).toUpperCase() + t.slice(1);
const drawPats = () => {
  const q = pq.value.trim().toLowerCase();
  const list = pats.filter(x => (!tagOn || x.tags.includes(tagOn)) &&
    (!q || [x.name, x.description, x.author, ...x.tags].join(" ").toLowerCase().includes(q)));
  pgrid.innerHTML = list.length ? list.map(x => {
    const cols = x.colors.length ? x.colors : ["#FFA757"];
    const bulbs = Array.from({ length: 16 }, (_, i) => `<i style="--c:${esc(cols[i % cols.length])};--n:${i}"></i>`).join("");
    return `<article class="pat"><div class="strip" aria-hidden="true"><div class="bulbs">${bulbs}</div></div>
      <div class="pb">${kindName[x.kind] ? `<span class="kind">${kindName[x.kind]}</span>` : ""}<h4>${esc(x.name)}</h4>
      ${x.description ? `<p>${esc(x.description)}</p>` : ""}${x.author ? `<p class="by">by ${esc(x.author)}</p>` : ""}
      ${x.tags.length ? `<div class="tags">${x.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>` : ""}</div></article>`;
  }).join("") : `<p class="pmsg">No patterns match. Try another search, or share one of your own below.</p>`;
};
const drawTags = () => {
  const tags = [...new Set(pats.flatMap(x => x.tags))].sort();
  ptags.innerHTML = [["", "All"], ...tags.map(t => [t, titleCase(t)])].map(([t, l]) =>
    `<button class="chip" type="button" data-t="${esc(t)}" aria-pressed="${t === tagOn}">${esc(l)}</button>`).join("");
};
if (pgrid) {
ptags.addEventListener("click", e => { const b = e.target.closest(".chip"); if (!b) return; tagOn = b.dataset.t; drawTags(); drawPats(); });
pq.addEventListener("input", drawPats);
(async () => {
  try {
    const r = await fetch(PAT_URL, { cache: "no-cache" });
    if (!r.ok) throw 0;
    const j = await r.json();
    pats = (j.patterns || []).filter(x => x && x.id).map(x => ({
      id: String(x.id), kind: x.kind || "pattern", name: String(x.name || x.id), author: String(x.author || ""),
      description: String(x.description || ""), tags: (x.tags || []).map(t => String(t).toLowerCase()).slice(0, 8),
      colors: (x.colors || []).filter(c => /^#[0-9a-f]{6}$/i.test(c)).slice(0, 8)
    })).sort((a, b) => a.name.localeCompare(b.name));
    drawTags(); drawPats();
  } catch (e) {
    pgrid.innerHTML = `<p class="pmsg">The pattern library couldn't be loaded right now. You can browse it on <a href="https://github.com/ThinkTank4n6/eaveluxos-patterns">GitHub</a>.</p>`;
  }
})();
}

document.getElementById("yr").textContent = new Date().getFullYear();
}
}
