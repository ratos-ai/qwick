let currentAccountTab = "orders"

async function initAccount() {
    const isRefreshed = await tryRefreshToken()
    if (!isRefreshed) {
        window.location.href = "/login.html"
        return
    }

    if (typeof updateHeaderUI === "function") {
        await updateHeaderUI()
    }

    const logoutBtn = document.getElementById("logoutBtn")
    const logoutModal = document.getElementById("logoutModal")
    const confirmLogoutBtn = document.getElementById("confirmLogoutBtn")
    const cancelLogoutBtn = document.getElementById("cancelLogoutBtn")

    if (logoutBtn && logoutModal) {
        logoutBtn.addEventListener("click", () => {
            logoutModal.classList.add("open")
        })
    }

    if (cancelLogoutBtn && logoutModal) {
        cancelLogoutBtn.addEventListener("click", () => {
            logoutModal.classList.remove("open")
        })
    }

    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener("click", logout)
    }

    const tabs = document.querySelectorAll("[data-account-tab]")
    tabs.forEach((tab) => {
        tab.addEventListener("click", (e) => {
            tabs.forEach((t) => t.classList.remove("active"))
            e.currentTarget.classList.add("active")
            currentAccountTab = e.currentTarget.dataset.accountTab
            renderAccount()
        })
    })

    renderAccount()
}

async function logout() {
    try {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        })
    } catch (e) {
        console.error(e)
    }
    window.location.href = "/"
}

async function renderAccount() {
    const content = document.getElementById("accountContent")
    if (!content) return

    content.innerHTML = '<div class="account-loading">Загрузка...</div>'

    if (currentAccountTab === "orders") {
        await renderOrders(content)
    } else if (currentAccountTab === "favorites") {
        await renderFavoritesList(content)
    }
}

async function renderOrders(container) {
    try {
        const res = await apiRequest("/api/orders/")
        if (!res.ok) throw new Error("Ошибка загрузки")

        const orders = await res.json()

        if (orders.length === 0) {
            container.innerHTML =
                '<div class="empty-account">У вас пока нет заказов</div>'
            return
        }

        const html = orders
            .map(
                (o) => `
            <div class="order-card">
                <div class="order-info">
                    <div class="order-title">${o.tour_title}</div>
                    <div class="order-meta">
                        <span>${o.region}</span>
                        <span>${o.date}</span>
                        <span>${o.quantity} чел.</span>
                    </div>
                </div>
                <div class="order-actions">
                    <div class="order-price">${o.total_price.toLocaleString("ru-RU")} ₽</div>
                    <button class="btn-cancel" onclick="cancelOrder(${o.id})">Отменить</button>
                </div>
            </div>
        `,
            )
            .join("")

        container.innerHTML = `<div class="order-card-list">${html}</div>`
    } catch (e) {
        container.innerHTML =
            '<div class="empty-account">Ошибка при загрузке заказов</div>'
    }
}

async function cancelOrder(orderId) {
    if (!confirm("Вы уверены, что хотите отменить заказ?")) return
    try {
        const res = await apiRequest(`/api/orders/${orderId}`, {
            method: "DELETE",
        })
        if (res.ok) {
            renderAccount()
        } else {
            alert("Ошибка при отмене заказа")
        }
    } catch (e) {
        console.error(e)
    }
}

async function renderFavoritesList(container) {
    try {
        const favRes = await apiRequest("/api/favorites/")
        const dataRes = await fetch("/api/attractions/")

        if (!favRes.ok || !dataRes.ok) throw new Error("Ошибка загрузки")

        const favData = await favRes.json()
        const allData = await dataRes.json()

        const favIds = favData.map((f) => String(f.item_id))

        if (favIds.length === 0) {
            container.innerHTML =
                '<div class="empty-account">Вы пока ничего не добавили в избранное</div>'
            return
        }

        const favItems = allData.filter((item) =>
            favIds.includes(String(item.id)),
        )

        const regions = {
            rso: "Северная Осетия — Алания",
            kbr: "Кабардино-Балкария",
            kchr: "Карачаево-Черкесия",
            stav: "Ставропольский край",
            ing: "Ингушетия",
            che: "Чечня",
            dag: "Дагестан",
        }

        const html = favItems
            .map((item) => {
                const type = item.item_type || "attraction"
                return `
                <div class="order-card" style="cursor: pointer;" onclick="window.location.href='/catalog.html#/${type}/${item.id}'">
                    <div class="order-info">
                        <div class="order-title">${item.title}</div>
                        <div class="order-meta">
                            <span>${regions[item.region] || item.region}</span>
                        </div>
                    </div>
                    <div class="order-actions">
                        <button class="btn-cancel" onclick="event.stopPropagation(); removeFavorite('${item.id}')">Удалить</button>
                    </div>
                </div>
            `
            })
            .join("")

        container.innerHTML = `<div class="order-card-list">${html}</div>`
    } catch (e) {
        container.innerHTML =
            '<div class="empty-account">Ошибка при загрузке избранного</div>'
    }
}

async function removeFavorite(id) {
    try {
        const res = await apiRequest(`/api/favorites/${id}`, {
            method: "DELETE",
        })
        if (res.ok) {
            renderAccount()
        }
    } catch (e) {
        console.error(e)
    }
}

document.addEventListener("DOMContentLoaded", initAccount)
