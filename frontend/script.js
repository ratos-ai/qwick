const REGIONS = {
    rso: "Северная Осетия — Алания",
    kbr: "Кабардино-Балкария",
    kchr: "Карачаево-Черкесия",
    stav: "Ставропольский край",
    ing: "Ингушетия",
    che: "Чечня",
    dag: "Дагестан",
}

let attractions = []
let places = []
let tours = []

let accessToken = null
let currentUser = null

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
            logoutUser()
        }
    }

    return response
}

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

async function loadFavoritesFromBackend() {
    if (!accessToken) return
    try {
        const response = await apiRequest("/api/favorites/")
        if (response.ok) {
            const data = await response.json()
            favorites = data.map((fav) => String(fav.item_id))
            saveFavorites(favorites)
            renderAll()
        }
    } catch (error) {
        console.error("Ошибка загрузки избранного:", error)
    }
}

async function updateHeaderUI() {
    const accountBtn = document.getElementById("accountBtn")
    const adminBtn = document.getElementById("adminBtn")

    if (accessToken) {
        try {
            const res = await apiRequest("/api/auth/me")
            if (res.ok) {
                const user = await res.json()

                accountBtn.textContent = `👤 ${user.username}`

                if (user.is_superuser) {
                    adminBtn.style.display = "inline-block"
                } else {
                    adminBtn.style.display = "none"
                }
            }
        } catch (e) {
            console.error("Ошибка загрузки профиля", e)
        }
    } else {
        accountBtn.textContent = "👤 Личный кабинет"
        adminBtn.style.display = "none"
    }
}

async function initAuth() {
    await tryRefreshToken()
    if (accessToken) {
        await loadFavoritesFromBackend()
        await updateHeaderUI()
        renderAccount()
    } else {
        updateHeaderUI()
    }
}

const STORAGE_FAV = "caucasus_favorites"
const STORAGE_ORDERS = "caucasus_orders"
const STORAGE_USER = "caucasus_user"

function loadFavorites() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_FAV)) || []
    } catch {
        return []
    }
}
function saveFavorites(ids) {
    localStorage.setItem(STORAGE_FAV, JSON.stringify(ids))
}

let favorites = loadFavorites()

function getOrders() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_ORDERS)) || []
    } catch {
        return []
    }
}
function saveOrders(orders) {
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders))
}

function findItem(type, id) {
    const list = type === "attraction" ? attractions : places
    return list.find((item) => item.id === id)
}
function findTour(id) {
    return tours.find((t) => t.id === id)
}
function isFavorite(id) {
    return favorites.includes(id)
}

async function toggleFavorite(id, type) {
    const isFav = isFavorite(id)

    if (isFav) {
        favorites = favorites.filter((f) => f !== id)
    } else {
        favorites.push(id)
    }
    saveFavorites(favorites)
    renderAll()

    if (
        location.hash.startsWith("#/attraction/") ||
        location.hash.startsWith("#/place/")
    ) {
        renderRoute()
    }

    if (accessToken) {
        try {
            if (isFav) {
                await apiRequest(`/api/favorites/${id}`, { method: "DELETE" })
            } else {
                await apiRequest("/api/favorites/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        item_id: String(id),
                        item_type: type,
                    }),
                })
            }
        } catch (error) {
            console.error("Ошибка синхронизации избранного:", error)
            if (isFav) favorites.push(id)
            else favorites = favorites.filter((f) => f !== id)

            saveFavorites(favorites)
            renderAll()
            if (
                location.hash.startsWith("#/attraction/") ||
                location.hash.startsWith("#/place/")
            ) {
                renderRoute()
            }
            alert("Не удалось сохранить избранное. Проверьте соединение.")
        }
    }
}

let currentRegion = "all"

function initRegionFilter() {
    const select = document.getElementById("regionSelect")
    select.addEventListener("change", () => {
        currentRegion = select.value
        renderAll()
    })
}
function filterByRegion(items) {
    if (currentRegion === "all") return items
    return items.filter((item) => item.region === currentRegion)
}

function createCard(item) {
    const fav = isFavorite(item.id)
    const card = document.createElement("div")
    card.className = "card"
    const regionName = REGIONS[item.region] || ""

    const imageHtml = item.imageUrl
        ? `<img src="${item.imageUrl}" alt="${item.title}" class="card-img-real" />`
        : `<div class="card-img">${item.emoji || "📍"}</div>`

    card.innerHTML = `
    ${imageHtml} 
    <div class="card-body">
      <div class="card-region">${regionName}</div>
      <div class="card-category">${item.category}</div>
      <div class="card-title">${item.title}</div>
      <div class="card-desc">${item.shortDesc}</div>
      <div class="card-meta">${item.meta}</div>
      <div class="card-actions">
        <button class="fav-btn ${fav ? "active" : ""}" data-id="${item.id}" title="${fav ? "Убрать из избранного" : "Добавить в избранное"}">
          ${fav ? "❤️" : "🤍"}
        </button>
        <span class="details-hint">Подробнее →</span>
      </div>
    </div>
  `

    card.querySelector(".fav-btn").addEventListener("click", (e) => {
        e.stopPropagation()
        toggleFavorite(item.id, item.type)
    })
    card.addEventListener("click", () => {
        location.hash = `#/${item.type}/${item.id}`
    })
    return card
}

function createTourCard(tour) {
    const card = document.createElement("div")
    card.className = "card"
    const regionName = REGIONS[tour.region] || ""
    const typeLabel = tour.type === "tour" ? "Тур" : "Билет"

    const imageHtml = tour.imageUrl
        ? `<img src="${tour.imageUrl}" alt="${tour.title}" class="card-img-real" />`
        : `<div class="card-img">${tour.type === "tour" ? "🧭" : "🎫"}</div>`

    card.innerHTML = `
    ${imageHtml}
    <div class="card-body">
      <div class="card-region">${regionName}</div>
      <div class="card-category">${typeLabel}</div>
      <div class="card-title">${tour.title}</div>
      <div class="card-desc">${tour.description}</div>
      <div class="card-meta">⏱ ${tour.duration} · ${tour.includes.join(" · ")}</div>
      <div class="card-price">${tour.price.toLocaleString("ru-RU")} ₽</div>
      <div class="card-actions">
        <button class="buy-btn" data-tour-id="${tour.id}">Купить</button>
      </div>
    </div>
  `

    card.querySelector(".buy-btn").addEventListener("click", (e) => {
        e.stopPropagation()
        openOrderModal(tour.id)
    })
    return card
}

function renderGrid(containerId, items) {
    const grid = document.getElementById(containerId)
    grid.innerHTML = ""
    if (items.length === 0) {
        grid.innerHTML = `<div class="empty-state"><span class="icon">🔍</span>Ничего не найдено.</div>`
        return
    }
    items.forEach((item) => grid.appendChild(createCard(item)))
}

function renderTours() {
    const grid = document.getElementById("toursGrid")
    grid.innerHTML = ""
    const filtered = filterByRegion(tours)
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state"><span class="icon">🎫</span>Туров и билетов по этому региону пока нет.</div>`
        return
    }
    filtered.forEach((tour) => grid.appendChild(createTourCard(tour)))
}

function renderFavorites() {
    const grid = document.getElementById("favoritesGrid")
    const empty = document.getElementById("favEmpty")
    grid.querySelectorAll(".card").forEach((c) => c.remove())
    const allItems = [...attractions, ...places]
    const favItems = favorites
        .map((id) => allItems.find((i) => String(i.id) === String(id)))
        .filter(Boolean)
    if (favItems.length === 0) {
        empty.style.display = "block"
    } else {
        empty.style.display = "none"
        favItems.forEach((item) => grid.appendChild(createCard(item)))
    }
    document.getElementById("favCount").textContent = favorites.length
}

function renderAll() {
    renderGrid("attractionsGrid", filterByRegion(attractions))
    renderGrid("placesGrid", filterByRegion(places))
    renderTours()
    renderFavorites()
}

function initTabs() {
    const tabs = document.querySelectorAll(".tab-btn")
    const panels = {
        attractions: document.getElementById("panel-attractions"),
        places: document.getElementById("panel-places"),
        tours: document.getElementById("panel-tours"),
        favorites: document.getElementById("panel-favorites"),
    }

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            if (
                location.hash.startsWith("#/attraction/") ||
                location.hash.startsWith("#/place/")
            ) {
                location.hash = ""
            }
            const target = tab.dataset.tab
            tabs.forEach((t) => t.classList.remove("active"))
            tab.classList.add("active")
            Object.values(panels).forEach((p) => p.classList.remove("active"))
            panels[target].classList.add("active")
            if (target === "favorites") renderFavorites()
            if (target === "tours") renderTours()
        })
    })
}

function renderDetailPage(type, id) {
    const item = findItem(type, id)
    const detailView = document.getElementById("detailView")

    if (!item) {
        detailView.innerHTML = `<a href="#" class="back-btn">← Назад</a><div class="empty-state"><span class="icon">🤷</span>Не найдено.</div>`
        return
    }

    const heroImageHtml = item.imageUrl
        ? `<img src="${item.imageUrl}" alt="${item.title}" class="hero-img-real" />`
        : `<div class="hero-emoji">${item.emoji || "📍"}</div>`

    const fav = isFavorite(item.id)
    const regionName = REGIONS[item.region] || ""

    const factsHtml = (item.facts || [])
        .map(
            (f) => `
    <div class="info-item"><div class="info-label">${f.label}</div><div class="info-value">${f.value}</div></div>
  `,
        )
        .join("")

    const sectionsHtml = (item.sections || [])
        .map((s) => {
            let inner = ""
            if (s.heading) inner += `<h3>${s.heading}</h3>`
            if (s.text) inner += `<p>${s.text}</p>`
            if (s.bullets)
                inner += `<ul>${s.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`
            return inner
        })
        .join("")

    const relatedTours = tours.filter(
        (t) => String(t.attraction_id) === String(item.id),
    )
    let relatedToursHtml = ""
    if (relatedTours.length > 0) {
        relatedToursHtml = `
      <h3>🎫 Туры и билеты по этому месту</h3>
      <div class="detail-tours">
        ${relatedTours
            .map(
                (t) => `
          <div class="tour-row">
            <span class="tour-name">${t.title} <small style="color:#7a8ea3;">(${t.duration})</small></span>
            <span class="tour-price">${t.price.toLocaleString("ru-RU")} ₽</span>
            <button class="buy-btn" data-tour-id="${t.id}">Купить</button>
          </div>
        `,
            )
            .join("")}
      </div>
    `
    }

    detailView.innerHTML = `
    <a href="#" class="back-btn" id="backBtn">← Назад к списку</a>
    <div class="detail-hero">
      ${heroImageHtml}
      <div class="hero-text">
        <div class="hero-region">${regionName}</div>
        <div class="hero-cat">${item.category}</div>
        <h2>${item.title}</h2>
        <div class="hero-meta">${item.meta}</div>
      </div>
      <button class="hero-fav ${fav ? "active" : ""}" id="heroFav">${fav ? "❤️" : "🤍"}</button>
    </div>
    <div class="detail-content">
      <p style="font-size:1.05rem; color:#1e3a55; font-weight:500;">${item.shortDesc}</p>
      ${sectionsHtml}
      ${factsHtml ? `<h3>Кратко</h3><div class="info-grid">${factsHtml}</div>` : ""}
      ${relatedToursHtml}
    </div>
  `

    document.getElementById("backBtn").addEventListener("click", (e) => {
        e.preventDefault()
        history.length > 1 ? history.back() : (location.hash = "")
    })
    document
        .getElementById("heroFav")
        .addEventListener("click", () => toggleFavorite(item.id, item.type))

    detailView.querySelectorAll(".buy-btn[data-tour-id]").forEach((btn) => {
        btn.addEventListener("click", () => openOrderModal(btn.dataset.tourId))
    })
}

let currentTourForOrder = null

function openOrderModal(tourId) {
    const tour = findTour(tourId)
    if (!tour) return
    currentTourForOrder = tour

    const modal = document.getElementById("orderModal")
    const body = document.getElementById("modalBody")
    const title = document.getElementById("modalTitle")

    title.textContent =
        tour.type === "tour" ? "Бронирование тура" : "Покупка билета"

    const today = new Date().toISOString().split("T")[0]

    body.innerHTML = `
    <div class="order-summary">
      <div class="sum-row"><span>${tour.title}</span></div>
      <div class="sum-row"><span>${tour.duration}</span></div>
      <div class="sum-row"><span>Цена за 1 чел.</span><strong>${tour.price.toLocaleString("ru-RU")} ₽</strong></div>
      <div class="sum-row total" id="modalTotal"><span>Итого</span><span>${tour.price.toLocaleString("ru-RU")} ₽</span></div>
    </div>
    <label>Дата</label>
    <input type="date" id="orderDate" value="${today}" min="${today}">
    <label>Количество человек</label>
    <input type="number" id="orderQty" value="1" min="1" max="20">
    <label>Ваше имя</label>
    <input type="text" id="orderName" placeholder="Иван" value="">
    <label>Телефон или email</label>
    <input type="text" id="orderContact" placeholder="+7..." value="">
    <button class="confirm-btn" id="confirmOrderBtn">Подтвердить заказ</button>
  `

    modal.classList.add("open")

    const qtyInput = document.getElementById("orderQty")
    const totalEl = document.getElementById("modalTotal")
    qtyInput.addEventListener("input", () => {
        const qty = Math.max(1, Math.min(20, parseInt(qtyInput.value) || 1))
        totalEl.innerHTML = `<span>Итого</span><span>${(tour.price * qty).toLocaleString("ru-RU")} ₽</span>`
    })

    document
        .getElementById("confirmOrderBtn")
        .addEventListener("click", async () => {
            const date = document.getElementById("orderDate").value
            const qty = Math.max(1, Math.min(20, parseInt(qtyInput.value) || 1))
            const name =
                document.getElementById("orderName").value.trim() || "Гость"
            const contact =
                document.getElementById("orderContact").value.trim() || "—"

            const payload = {
                tour_id: String(tour.id),
                tour_title: tour.title,
                region: REGIONS[tour.region],
                date: date,
                quantity: qty,
                total_price: tour.price * qty,
                name: name,
                contact: contact,
                is_paid: false,
            }

            try {
                const res = await apiRequest("/api/orders/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                })

                if (res.status === 201) {
                    body.innerHTML = `
              <div class="success-msg">
                <span class="big-icon">✅</span>
                <h3 style="color:#0b3b5c; margin-bottom:0.4rem;">Заказ оформлен!</h3>
                <p style="color:#4a5d73;">${tour.title} · ${date} · ${qty} чел.</p>
                <p style="color:#c0392b; font-weight:700; font-size:1.2rem;">${payload.total_price.toLocaleString("ru-RU")} ₽</p>
                <button class="back-btn" style="margin-top:1rem;" id="goToAccount">Перейти в личный кабинет</button>
              </div>
            `
                    document
                        .getElementById("goToAccount")
                        .addEventListener("click", () => {
                            closeModal()
                            location.hash = "#/account"
                        })
                } else {
                    alert("Ошибка при создании заказа. Попробуйте позже.")
                }
            } catch (e) {
                console.error(e)
                alert("Ошибка сети")
            }
        })
}

function closeModal() {
    document.getElementById("orderModal").classList.remove("open")
    currentTourForOrder = null
}

async function renderAccount() {
    const content = document.getElementById("accountContent")

    if (!accessToken) {
        content.innerHTML = `
      <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 2px solid #d0dae6; padding-bottom: 0.5rem;">
        <button class="tab-btn active" id="tabLogin" style="box-shadow: none;">Вход</button>
        <button class="tab-btn" id="tabRegister" style="box-shadow: none;">Регистрация</button>
      </div>

      <form class="auth-form" id="loginForm">
        <label>Имя пользователя (username)</label>
        <input type="text" id="loginUsername" required>
        <label>Пароль</label>
        <input type="password" id="loginPassword" required>
        <button class="submit-btn" type="submit">Войти</button>
        <p id="loginError" style="color: #e74c3c; margin-top: 0.5rem; display: none;"></p>
      </form>

      <form class="auth-form" id="registerForm" style="display: none;">
        <label>Имя пользователя (username)</label>
        <input type="text" id="regUsername" required>
        <label>Email</label>
        <input type="email" id="regEmail" required>
        <label>Пароль</label>
        <input type="password" id="regPassword" required>
        <button class="submit-btn" type="submit">Зарегистрироваться</button>
        <p id="regError" style="color: #e74c3c; margin-top: 0.5rem; display: none;"></p>
      </form>
    `

        document.getElementById("tabLogin").addEventListener("click", () => {
            document.getElementById("tabLogin").classList.add("active")
            document.getElementById("tabRegister").classList.remove("active")
            document.getElementById("loginForm").style.display = "block"
            document.getElementById("registerForm").style.display = "none"
        })
        document.getElementById("tabRegister").addEventListener("click", () => {
            document.getElementById("tabRegister").classList.add("active")
            document.getElementById("tabLogin").classList.remove("active")
            document.getElementById("registerForm").style.display = "block"
            document.getElementById("loginForm").style.display = "none"
        })

        document
            .getElementById("loginForm")
            .addEventListener("submit", async (e) => {
                e.preventDefault()
                const username = document.getElementById("loginUsername").value
                const password = document.getElementById("loginPassword").value
                const errorEl = document.getElementById("loginError")

                const formData = new URLSearchParams()
                formData.append("username", username)
                formData.append("password", password)

                try {
                    const response = await fetch("/api/auth/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        body: formData,
                        credentials: "include",
                    })

                    const data = await response.json()

                    if (response.ok) {
                        accessToken = data.access_token
                        await loadFavoritesFromBackend()
                        await updateHeaderUI()
                        renderAccount()
                    } else {
                        errorEl.textContent = data.detail || "Ошибка входа"
                        errorEl.style.display = "block"
                    }
                } catch (err) {
                    errorEl.textContent = "Ошибка сети"
                    errorEl.style.display = "block"
                }
            })

        document
            .getElementById("registerForm")
            .addEventListener("submit", async (e) => {
                e.preventDefault()
                const username = document.getElementById("regUsername").value
                const email = document.getElementById("regEmail").value
                const password = document.getElementById("regPassword").value
                const errorEl = document.getElementById("regError")

                try {
                    const response = await fetch("/api/auth/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username, email, password }),
                    })

                    const data = await response.json()

                    if (response.ok) {
                        document.getElementById("tabLogin").click()
                        document.getElementById("loginUsername").value =
                            username
                        document.getElementById("loginPassword").value =
                            password
                    } else {
                        errorEl.textContent =
                            data.detail || "Ошибка регистрации"
                        errorEl.style.display = "block"
                    }
                } catch (err) {
                    errorEl.textContent = "Ошибка сети"
                    errorEl.style.display = "block"
                }
            })

        return
    }

    let ordersHtml = ""
    try {
        const ordersRes = await apiRequest("/api/orders/")
        const orders = await ordersRes.json()

        if (orders.length === 0) {
            ordersHtml = `<div class="empty-state"><span class="icon">🧾</span>У вас пока нет заказов.</div>`
        } else {
            ordersHtml = orders
                .map(
                    (o) => `
                <div class="order-card">
                    <div class="order-title">${o.tour_title}</div>
                    <div class="order-meta">${o.region} · ${o.date} · ${o.quantity} чел.</div>
                    <div class="order-price">${o.total_price.toLocaleString("ru-RU")} ₽</div>
                    <button class="logout-btn" onclick="deleteOrder(${o.id})" style="margin-top:10px; padding: 5px 10px; font-size: 0.8rem;">Отменить</button>
                </div>
            `,
                )
                .join("")
        }
    } catch (e) {
        console.error(e)
        ordersHtml = `<div class="empty-state"><span class="icon">⚠️</span>Не удалось загрузить заказы.</div>`
    }

    content.innerHTML = `
    <div class="account-header">
      <div>
        <h2>👤 Личный кабинет</h2>
        <p style="color:#27ae60; font-size:0.9rem;">Вы успешно авторизованы</p>
      </div>
      <button class="logout-btn" id="logoutBtn">Выйти</button>
    </div>

    <h3 style="color:#0b3b5c; margin:1.5rem 0 1rem;">🧾 Мои заказы</h3>
    <div class="orders-list">${ordersHtml}</div>

    <h3 style="color:#0b3b5c; margin:2rem 0 1rem;">⭐ Избранное (${favorites.length})</h3>
    <div class="cards-grid" id="accountFavGrid"></div>
  `

    const favGrid = document.getElementById("accountFavGrid")
    const allItems = [...attractions, ...places]

    const favItems = favorites
        .map((id) => allItems.find((i) => String(i.id) === String(id)))
        .filter(Boolean)

    if (favItems.length === 0) {
        favGrid.innerHTML = `<div class="empty-state"><span class="icon">💫</span>Вы пока ничего не добавили в избранное.</div>`
    } else {
        favItems.forEach((item) => favGrid.appendChild(createCard(item)))
    }

    document.getElementById("logoutBtn").addEventListener("click", async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            })
        } catch (e) {
            console.error("Ошибка при выходе", e)
        }

        accessToken = null
        currentUser = null
        favorites = loadFavorites()

        updateHeaderUI()
        renderAll()
        renderAccount()
    })
}

function renderRoute() {
    const mainView = document.getElementById("mainView")
    const detailView = document.getElementById("detailView")
    const accountView = document.getElementById("accountView")
    const hash = location.hash

    const detailMatch = hash.match(/^#\/(attraction|place|tour)\/([a-z0-9]+)$/i)
    if (detailMatch) {
        mainView.classList.add("page-hidden")
        accountView.classList.remove("active")
        detailView.classList.add("active")
        renderDetailPage(detailMatch[1].toLowerCase(), detailMatch[2])
        window.scrollTo({ top: 0, behavior: "instant" })
        return
    }

    if (hash === "#/account") {
        mainView.classList.add("page-hidden")
        detailView.classList.remove("active")
        accountView.classList.add("active")
        renderAccount()
        window.scrollTo({ top: 0, behavior: "instant" })
        return
    }

    detailView.classList.remove("active")
    accountView.classList.remove("active")
    mainView.classList.remove("page-hidden")
    if (!document.querySelector(".tab-btn.active")) {
        document
            .querySelector('.tab-btn[data-tab="attractions"]')
            .classList.add("active")
        document.getElementById("panel-attractions").classList.add("active")
    }
}

async function loadAttractions() {
    try {
        const response = await fetch("/api/attractions/")
        if (response.ok) {
            const data = await response.json()

            attractions = data
                .filter((i) => i.item_type === "attraction" || !i.item_type)
                .map((i) => ({
                    ...i,
                    id: String(i.id),
                    type: "attraction",
                    shortDesc: i.short_desc,
                    imageUrl: i.image_url,
                }))

            places = data
                .filter((i) => i.item_type === "place")
                .map((i) => ({
                    ...i,
                    id: String(i.id),
                    type: "place",
                    shortDesc: i.short_desc,
                    imageUrl: i.image_url,
                }))

            tours = data
                .filter((i) => i.item_type === "tour")
                .map((i) => ({
                    ...i,
                    id: String(i.id),
                    type: "tour",
                    price: i.price || 0,
                    duration: "Тур",
                    includes: ["Трансфер", "Гид"],
                    description: i.short_desc,
                    imageUrl: i.image_url,
                }))

            renderAll()
        }
    } catch (error) {
        console.error("Error loading data:", error)
    }
}

async function deleteOrder(orderId) {
    if (!confirm("Вы уверены, что хотите отменить заказ?")) return
    try {
        const res = await apiRequest(`/api/orders/${orderId}`, {
            method: "DELETE",
        })
        if (res.status === 204) {
            renderAccount()
        } else {
            alert("Ошибка при удалении")
        }
    } catch (e) {
        console.error(e)
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    initTabs()
    initRegionFilter()

    await loadAttractions()
    await initAuth()

    renderRoute()
    renderAll()

    window.addEventListener("hashchange", renderRoute)

    document.getElementById("accountBtn").addEventListener("click", () => {
        location.hash = "#/account"
    })

    document.getElementById("modalClose").addEventListener("click", closeModal)
    document.getElementById("orderModal").addEventListener("click", (e) => {
        if (e.target === document.getElementById("orderModal")) closeModal()
    })

    document.getElementById("accountBack").addEventListener("click", () => {
        location.hash = ""
    })
})
