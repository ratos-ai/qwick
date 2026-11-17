let accessToken = null

async function tryRefreshToken() {
    try {
        const response = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
        })
        if (response.ok) {
            const data = await response.json()
            accessToken = data.access_token
            return true
        }
        return false
    } catch (error) {
        return false
    }
}

async function apiRequest(url, options = {}) {
    options.headers = options.headers || {}

    if (accessToken) {
        options.headers["Authorization"] = `Bearer ${accessToken}`
    }
    options.credentials = "include"

    let response = await fetch(url, options)

    if (
        response.status === 401 &&
        url !== "/api/auth/refresh" &&
        url !== "/api/auth/login"
    ) {
        const refreshSuccess = await tryRefreshToken()
        if (refreshSuccess) {
            options.headers["Authorization"] = `Bearer ${accessToken}`
            response = await fetch(url, options)
        } else {
            accessToken = null
            window.location.href = "/login.html"
        }
    }

    return response
}
