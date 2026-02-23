/* ========================================
   PORTFOLIO JS – Josiah Luke Bustos
   Interactivity, animations, smooth scroll
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- MOBILE NAV ----------
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinks.classList.toggle('open');
        });

        // Close mobile nav when a link is clicked
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });
    }

    // ---------- STICKY HEADER ----------
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 60);
        });
    }

    // ---------- ACTIVE NAV LINK (MULTI-PAGE) ----------
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinkEls = document.querySelectorAll('.nav-link');

    navLinkEls.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ---------- SCROLL REVEAL ----------
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---------- SKILL BAR ANIMATION ----------
    const skillFills = document.querySelectorAll('.skill-fill');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillFills.forEach(bar => skillObserver.observe(bar));

    // ---------- COUNTER ANIMATION ----------
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));

    function animateCounter(el, target) {
        let current = 0;
        const duration = 1800;
        const step = Math.ceil(target / (duration / 16));

        function tick() {
            current += step;
            if (current >= target) {
                el.textContent = target;
                return;
            }
            el.textContent = current;
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }



    // ---------- SMOOTH SCROLL (FALLBACK) ----------

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Ignore links that are just "#"
            if (href === '#') return;

            try {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            } catch (error) {
                console.warn('Smooth scroll target not found or invalid:', href);
            }
        });
    });
});

// ---------- PROJECT GALLERY SWITCHER ----------
function changeGalleryImage(src, alt, btn) {
    const mainImg = document.getElementById('galleryMainImg');
    if (mainImg) {
        mainImg.style.opacity = '0';
        setTimeout(() => {
            mainImg.src = src;
            mainImg.alt = alt;
            mainImg.style.opacity = '1';
        }, 200);
    }

    // Update active thumb
    document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
}

// ---------- GITHUB API STATS ----------
(function () {
    const statsContainers = document.querySelectorAll('.github-stats[data-repo]');
    if (!statsContainers.length) return;

    function timeAgo(dateStr) {
        const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
        const intervals = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 }
        ];
        for (const i of intervals) {
            const count = Math.floor(seconds / i.seconds);
            if (count >= 1) return `${count} ${i.label}${count > 1 ? 's' : ''} ago`;
        }
        return 'just now';
    }

    statsContainers.forEach(container => {
        const repo = container.getAttribute('data-repo');
        fetch(`https://api.github.com/repos/${repo}`)
            .then(res => {
                if (!res.ok) throw new Error('GitHub API error');
                return res.json();
            })
            .then(data => {
                const stars = container.querySelector('.gh-stars');
                const forks = container.querySelector('.gh-forks');
                const lang = container.querySelector('.gh-lang');
                const updated = container.querySelector('.gh-updated');

                if (stars) stars.textContent = `${data.stargazers_count} Stars`;
                if (forks) forks.textContent = `${data.forks_count} Forks`;
                if (lang) lang.textContent = data.language || 'N/A';
                if (updated) updated.textContent = `Updated ${timeAgo(data.pushed_at)}`;
            })
            .catch(() => {
                const badges = container.querySelector('.github-stats-badges');
                if (badges) badges.innerHTML = '<span class="gh-badge" style="color:var(--text-muted);">Stats unavailable</span>';
            });
    });
})();
