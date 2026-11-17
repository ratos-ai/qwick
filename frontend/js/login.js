document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const errorMsg = document.getElementById("errorMsg")

    errorMsg.style.display = "none"

    const formData = new URLSearchParams()
    formData.append("username", username)
    formData.append("password", password)

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData,
            credentials: "include",
        })

        if (response.ok) {
            window.location.href = "/account.html"
        } else {
            const data = await response.json()
            errorMsg.textContent = data.detail || "Неверный логин или пароль"
            errorMsg.style.display = "block"
        }
    } catch (err) {
        errorMsg.textContent = "Ошибка сети. Попробуйте позже."
        errorMsg.style.display = "block"
    }
})
