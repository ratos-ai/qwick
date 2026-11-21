function initScrollEffects() {
    const nav = document.getElementById("mainNav")
    if (nav) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                nav.classList.add("scrolled")
            } else {
                nav.classList.remove("scrolled")
            }
        })
    }

    const revealElements = document.querySelectorAll(".reveal")
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add("visible")
                        }, i * 50)
                        revealObserver.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.1 },
        )
        revealElements.forEach((el) => revealObserver.observe(el))
    }
}

function initMobileMenu() {
    const toggle = document.querySelector(".nav-toggle")
    const navLinks = document.querySelector(".nav-links")

    if (toggle && navLinks) {
        toggle.addEventListener("click", () => {
            toggle.classList.toggle("active")
            navLinks.classList.toggle("active")
            document.body.classList.toggle("menu-open")
        })
    }
}

async function updateHeaderUI() {
    const accountBtn = document.querySelector(".account-btn")
    const adminBtn = document.getElementById("adminBtn")
    const userNameDisplay = document.getElementById("userNameDisplay")

    if (typeof accessToken !== "undefined" && accessToken) {
        try {
            const res = await apiRequest("/api/auth/me")
            if (res.ok) {
                const user = await res.json()

                if (accountBtn) {
                    accountBtn.textContent = user.username
                }

                if (userNameDisplay) {
                    userNameDisplay.textContent = user.username
                }

                if (adminBtn && user.is_superuser) {
                    adminBtn.style.display = "inline-block"
                }
            }
        } catch (e) {
            console.error("Ошибка загрузки профиля", e)
        }
    } else {
        if (accountBtn) accountBtn.textContent = "Личный кабинет"
        if (adminBtn) adminBtn.style.display = "none"
    }
}
