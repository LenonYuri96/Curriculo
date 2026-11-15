document.addEventListener("DOMContentLoaded", () => {
  // 1. Tema Claro / Escuro
  const themeToggle = document.getElementById("themeToggle");
  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeToggle) {
      const icon = themeToggle.querySelector("i");
      icon.className = theme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-fill";
    }
  };

  const savedTheme = localStorage.getItem("portfolio_theme");
  applyTheme(savedTheme || "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("portfolio_theme", next);
    });
  }

  // Botão Imprimir / Salvar PDF
  const printBtn = document.getElementById("printResumeBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      document
        .querySelectorAll(".reveal-up")
        .forEach((el) => el.classList.add("visible"));
      window.print();
    });
  }

  // 2. Efeito de Digitação no Hero
  const typedEl = document.getElementById("typedText");
  if (typedEl) {
    const phrases = [
      "Desenvolvedor Full Stack (Java, PHP, Python, JS)",
      "Instrutor Técnico SENAI MG • Educação Tecnológica",
      "Técnico em Mecatrônica • Automação & ESP32/IIoT",
      "Especialista em IA & Visão Computacional (YOLOv8)",
    ];
    let pIdx = 0;
    let cIdx = 0;
    let deleting = false;

    const tickType = () => {
      const current = phrases[pIdx];
      typedEl.textContent = current.slice(0, cIdx);
      if (!deleting && cIdx < current.length) {
        cIdx++;
        setTimeout(tickType, 52);
      } else if (!deleting && cIdx === current.length) {
        deleting = true;
        setTimeout(tickType, 1800);
      } else if (deleting && cIdx > 0) {
        cIdx--;
        setTimeout(tickType, 26);
      } else {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(tickType, 350);
      }
    };
    tickType();
  }

  // 3. Partículas no Hero
  const canvas = document.getElementById("heroCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const particles = [];
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const count = window.innerWidth < 768 ? 26 : 50;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        r: Math.random() * 2 + 1,
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34, 211, 238, 0.55)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(167, 139, 250, ${(1 - dist / 120) * 0.25})`;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawParticles);
    };
    drawParticles();
  }

  // 4. Animação ao Rolar + Barra de Progresso + Voltar ao Topo
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document.querySelectorAll(".reveal-up").forEach((el) => observer.observe(el));

  const progressBar = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar && docHeight > 0)
      progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
    if (backToTop) backToTop.classList.toggle("show", scrollTop > 400);
  });
  if (backToTop)
    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );

  document.querySelectorAll("#navbarNav .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const collapse = document.querySelector(".navbar-collapse.show");
      if (collapse) bootstrap.Collapse.getOrCreateInstance(collapse).hide();
    });
  });

  // 5. Filtro dos Projetos Curados
  const filterBtns = document.querySelectorAll("#projectFilters .filter-btn");
  const projectCards = document.querySelectorAll(
    "#curatedProjectsGrid .project-item",
  );
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const cats = card.dataset.category || "";
        card.classList.toggle(
          "d-none",
          !(filter === "all" || cats.includes(filter)),
        );
      });
    });
  });

  // 6. Scanner GitHub Ao Vivo (LenonYuri96 + LYuri26)
  const GITHUB_USERS = ["LenonYuri96", "LYuri26"];
  const CACHE_KEY = "lenon_github_scan_v2";
  const CACHE_TTL_MS = 30 * 60 * 1000;
  const LANG_COLORS = {
    "C++": "#f34b7d",
    C: "#555555",
    Python: "#3572A5",
    PHP: "#4F5D95",
    JavaScript: "#f1e05a",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Java: "#b07219",
    Rust: "#dea584",
    Shell: "#89e051",
    TypeScript: "#3178c6",
  };

  let allScannedRepos = [];
  let activeAccount = "all";
  const reposGrid = document.getElementById("githubReposGrid");
  const reposStatus = document.getElementById("githubReposStatus");
  const searchInput = document.getElementById("repoSearch");
  const sortSelect = document.getElementById("repoSort");
  const refreshBtn = document.getElementById("refreshGithubBtn");

  async function scanAllGitHub(forceRefresh = false) {
    if (!reposGrid || !reposStatus) return;
    if (!forceRefresh) {
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
        if (
          cached &&
          Date.now() - cached.timestamp < CACHE_TTL_MS &&
          Array.isArray(cached.repos)
        ) {
          processScannedData(cached.repos);
          return;
        }
      } catch (_) {}
    }

    reposStatus.classList.remove("d-none");
    reposStatus.innerHTML = `<div class="spinner-border text-accent" role="status"></div><p class="mt-2 small text-muted">Escaneando repositórios de @LenonYuri96 e @LYuri26...</p>`;
    reposGrid.innerHTML = "";

    try {
      const results = await Promise.all(
        GITHUB_USERS.map(async (user) => {
          const res = await fetch(
            `https://api.github.com/users/${user}/repos?per_page=100&sort=updated`,
          );
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const list = await res.json();
          return list
            .filter((r) => !r.fork)
            .map((r) => ({
              name: r.name,
              owner: user,
              description:
                r.description ||
                "Projeto desenvolvido no ecossistema de tecnologia e educação.",
              url: r.html_url,
              homepage:
                r.homepage ||
                (r.has_pages
                  ? `https://${user.toLowerCase()}.github.io/${r.name}/`
                  : ""),
              language: r.language || "Outro",
              stars: r.stargazers_count || 0,
              updated_at: r.updated_at,
              topics: Array.isArray(r.topics) ? r.topics : [],
            }));
        }),
      );
      const merged = results.flat();
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ timestamp: Date.now(), repos: merged }),
      );
      processScannedData(merged);
    } catch (_) {
      reposStatus.innerHTML = `<div class="alert alert-warning d-inline-block"><i class="bi bi-exclamation-triangle me-2"></i>Não foi possível consultar a API do GitHub agora. Tente novamente em instantes.</div>`;
    }
  }

  function processScannedData(repos) {
    allScannedRepos = repos;
    reposStatus.classList.add("d-none");
    const totalReposEl = document.getElementById("statTotalRepos");
    const totalStarsEl = document.getElementById("statTotalStars");
    if (totalReposEl) totalReposEl.textContent = repos.length;
    if (totalStarsEl)
      totalStarsEl.textContent = repos.reduce((sum, r) => sum + r.stars, 0);
    renderLanguageBar(repos);
    renderRepos();
  }

  function renderLanguageBar(repos) {
    const bar = document.getElementById("githubLangBar");
    const legend = document.getElementById("githubLangLegend");
    if (!bar || !legend) return;

    const counts = {};
    let total = 0;
    repos.forEach((r) => {
      if (r.language && r.language !== "Outro") {
        counts[r.language] = (counts[r.language] || 0) + 1;
        total++;
      }
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    bar.innerHTML = "";
    legend.innerHTML = "";
    sorted.forEach(([lang, count]) => {
      const pct = ((count / total) * 100).toFixed(1);
      const color = LANG_COLORS[lang] || "#64748b";
      const seg = document.createElement("div");
      seg.style.width = `${pct}%`;
      seg.style.backgroundColor = color;
      seg.title = `${lang}: ${pct}%`;
      bar.appendChild(seg);

      const item = document.createElement("span");
      item.innerHTML = `<span class="lang-dot" style="background:${color}"></span><strong>${lang}</strong> ${pct}%`;
      legend.appendChild(item);
    });
  }

  function renderRepos() {
    if (!reposGrid) return;
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const sortBy = sortSelect ? sortSelect.value : "updated";

    const filtered = allScannedRepos
      .filter((r) => {
        if (activeAccount !== "all" && r.owner !== activeAccount) return false;
        if (!query) return true;
        return (
          r.name.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.language.toLowerCase().includes(query) ||
          r.topics.some((t) => t.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => {
        if (sortBy === "stars") return b.stars - a.stars;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return new Date(b.updated_at) - new Date(a.updated_at);
      });

    reposGrid.innerHTML = "";
    if (filtered.length === 0) {
      reposGrid.innerHTML = `<div class="col-12 text-center text-muted py-3">Nenhum repositório encontrado.</div>`;
      return;
    }

    filtered.forEach((repo) => {
      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4";
      const card = document.createElement("div");
      card.className = "modern-card repo-card h-100 d-flex flex-column";
      const color = LANG_COLORS[repo.language] || "#64748b";
      const dataFmt = new Date(repo.updated_at).toLocaleDateString("pt-BR");

      const header = document.createElement("div");
      header.className =
        "d-flex justify-content-between align-items-start gap-2 mb-2";
      const title = document.createElement("h4");
      title.className = "mb-0";
      title.textContent = repo.name;
      const ownerBadge = document.createElement("span");
      ownerBadge.className = "mini-tag";
      ownerBadge.textContent = `@${repo.owner}`;
      header.appendChild(title);
      header.appendChild(ownerBadge);

      const desc = document.createElement("p");
      desc.className = "small text-muted mb-3 flex-grow-1";
      desc.textContent = repo.description;

      const meta = document.createElement("div");
      meta.className =
        "d-flex justify-content-between align-items-center small text-muted mb-3";
      meta.innerHTML = `<span><span class="lang-dot" style="background:${color}"></span>${repo.language}</span><span><i class="bi bi-star-fill text-warning me-1"></i>${repo.stars} &nbsp; <i class="bi bi-clock me-1"></i>${dataFmt}</span>`;

      const actions = document.createElement("div");
      actions.className = "d-flex gap-2";
      const btnRepo = document.createElement("a");
      btnRepo.href = repo.url;
      btnRepo.target = "_blank";
      btnRepo.rel = "noopener noreferrer";
      btnRepo.className = "btn btn-sm btn-outline-accent flex-grow-1";
      btnRepo.innerHTML = `<i class="bi bi-github me-1"></i>Código`;
      actions.appendChild(btnRepo);

      if (repo.homepage) {
        const btnDemo = document.createElement("a");
        btnDemo.href = repo.homepage;
        btnDemo.target = "_blank";
        btnDemo.rel = "noopener noreferrer";
        btnDemo.className = "btn btn-sm filter-btn";
        btnDemo.innerHTML = `<i class="bi bi-box-arrow-up-right me-1"></i>Site`;
        actions.appendChild(btnDemo);
      }

      card.appendChild(header);
      card.appendChild(desc);
      card.appendChild(meta);
      card.appendChild(actions);
      col.appendChild(card);
      reposGrid.appendChild(col);
    });
  }

  document.querySelectorAll("[data-account]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll("[data-account]")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeAccount = btn.dataset.account;
      renderRepos();
    });
  });

  if (searchInput) searchInput.addEventListener("input", renderRepos);
  if (sortSelect) sortSelect.addEventListener("change", renderRepos);
  if (refreshBtn)
    refreshBtn.addEventListener("click", () => scanAllGitHub(true));
  scanAllGitHub(false);

  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
