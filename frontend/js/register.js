document
    .getElementById("registerForm")
    .addEventListener("submit", async (e) => {
        e.preventDefault()

        const username = document.getElementById("username").value
        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        const errorMsg = document.getElementById("errorMsg")

        errorMsg.style.display = "none"

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            })

            if (response.ok) {
                window.location.href = "/login.html"
            } else {
                const data = await response.json()
                if (Array.isArray(data.detail)) {
                    errorMsg.textContent =
                        "Неправильный формат пароля (длина от 8 до 100 символов)."
                } else {
                    errorMsg.textContent = data.detail || "Ошибка регистрации."
                }
                errorMsg.style.display = "block"
            }
        } catch (err) {
            errorMsg.textContent = "Ошибка сети. Попробуйте позже."
            errorMsg.style.display = "block"
        }
    })
