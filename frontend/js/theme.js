;(() => {
    const THEME_KEY = "qwick-theme"
    const root = document.documentElement

    const systemPreference = window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null

    let followsSystem = false

    function getInitialTheme() {
        try {
            const savedTheme = localStorage.getItem(THEME_KEY)

            if (savedTheme === "light" || savedTheme === "dark") {
                return savedTheme
            }
        } catch (error) {
            console.warn("Не удалось прочитать настройки темы:", error)
        }

        followsSystem = true

        return systemPreference?.matches ? "dark" : "light"
    }

    function updateThemeButton(theme) {
        const buttons = document.querySelectorAll("[data-theme-toggle]")

        buttons.forEach((button) => {
            const icon = button.querySelector(".theme-toggle__icon")
            const isDark = theme === "dark"

            if (icon) {
                icon.textContent = isDark ? "☀" : "☾"
            }

            button.setAttribute("aria-pressed", String(isDark))

            button.setAttribute(
                "aria-label",
                isDark ? "Включить светлую тему" : "Включить тёмную тему",
            )

            button.title = isDark ? "Светлая тема" : "Тёмная тема"
        })
    }

    function applyTheme(theme) {
        root.dataset.theme = theme

        updateThemeButton(theme)

        const themeColor = document.querySelector('meta[name="theme-color"]')

        if (themeColor) {
            themeColor.setAttribute(
                "content",
                theme === "dark" ? "#0B1220" : "#F7F9FC",
            )
        }
    }

    function saveTheme(theme) {
        followsSystem = false

        try {
            localStorage.setItem(THEME_KEY, theme)
        } catch (error) {
            console.warn("Не удалось сохранить тему:", error)
        }

        applyTheme(theme)
    }

    applyTheme(getInitialTheme())

    document.addEventListener("DOMContentLoaded", () => {
        const buttons = document.querySelectorAll("[data-theme-toggle]")

        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const currentTheme = root.dataset.theme

                const nextTheme = currentTheme === "dark" ? "light" : "dark"

                saveTheme(nextTheme)
            })
        })
    })

    if (systemPreference?.addEventListener) {
        systemPreference.addEventListener("change", (event) => {
            if (followsSystem) {
                applyTheme(event.matches ? "dark" : "light")
            }
        })
    }
})()
