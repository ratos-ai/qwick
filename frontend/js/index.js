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
let favorites = JSON.parse(localStorage.getItem("caucasus_favorites")) || []
let currentRegion = "all"

function saveFavorites(ids) {
    localStorage.setItem("caucasus_favorites", JSON.stringify(ids))
}

function isFavorite(id) {
    return favorites.includes(String(id))
}

function filterByRegion(items) {
    if (currentRegion === "all") return items
    return items.filter((item) => item.region === currentRegion)
}

async function loadData() {
    try {
        if (typeof tryRefreshToken === "function") {
            await tryRefreshToken()
        }

        if (typeof accessToken !== "undefined" && accessToken) {
            const favRes = await apiRequest("/api/favorites/")
            if (favRes.ok) {
                const favData = await favRes.json()
                favorites = favData.map((fav) => String(fav.item_id))
                saveFavorites(favorites)
            }
        }

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
        console.error("Ошибка загрузки данных:", error)
    }
}

function createCard(item) {
    const fav = isFavorite(item.id)
    const card = document.createElement("div")
    card.className = "card"
    const regionName = REGIONS[item.region] || ""

    let imageHtml = `<div class="card-img-placeholder">${item.title.charAt(0).toUpperCase()}</div>`
    if (item.imageUrl) {
        imageHtml = `<img src="${item.imageUrl}" alt="${item.title}" class="card-img-real" />`
    }

    card.innerHTML = `
    ${imageHtml}
    <div class="card-body">
      <div class="card-region">${regionName}</div>
      <div class="card-title">${item.title}</div>
      <div class="card-desc">${item.shortDesc}</div>
      <div class="card-actions">
        <button class="fav-btn ${fav ? "active" : ""}" data-id="${item.id}">
          <svg viewBox="0 0 24 24" fill="${fav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        <span class="details-hint">Подробнее</span>
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

    let imageHtml = `<div class="card-img-placeholder">${tour.title.charAt(0).toUpperCase()}</div>`
    if (tour.imageUrl) {
        imageHtml = `<img src="${tour.imageUrl}" alt="${tour.title}" class="card-img-real" />`
    }

    card.innerHTML = `
    ${imageHtml}
    <div class="card-body">
      <div class="card-region">${regionName}</div>
      <div class="card-title">${tour.title}</div>
      <div class="card-desc">${tour.description}</div>
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
    if (!grid) return
    grid.innerHTML = ""
    if (items.length === 0) {
        grid.innerHTML = `<div class="empty-state">Ничего не найдено</div>`
        return
    }
    items.forEach((item) => grid.appendChild(createCard(item)))
}

function renderTours() {
    const grid = document.getElementById("toursGrid")
    if (!grid) return
    grid.innerHTML = ""
    const filtered = filterByRegion(tours)
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="empty-state">Туров по этому региону пока нет</div>`
        return
    }
    filtered.forEach((tour) => grid.appendChild(createTourCard(tour)))
}

function renderFavorites() {
    const grid = document.getElementById("favoritesGrid")
    const favCount = document.getElementById("favCount")
    if (!grid) return

    grid.innerHTML = ""
    const allItems = [...attractions, ...places]
    const favItems = favorites
        .map((id) => allItems.find((i) => String(i.id) === String(id)))
        .filter(Boolean)

    if (favItems.length === 0) {
        grid.innerHTML = `<div class="empty-state">Вы пока ничего не добавили в избранное</div>`
    } else {
        favItems.forEach((item) => grid.appendChild(createCard(item)))
    }
    if (favCount) favCount.textContent = favorites.length
}

function renderAll() {
    renderGrid("attractionsGrid", filterByRegion(attractions))
    renderGrid("placesGrid", filterByRegion(places))
    renderTours()
    renderFavorites()
}

async function toggleFavorite(id, type) {
    const stringId = String(id)
    const isFav = isFavorite(stringId)

    if (isFav) {
        favorites = favorites.filter((f) => f !== stringId)
    } else {
        favorites.push(stringId)
    }
    saveFavorites(favorites)

    const buttons = document.querySelectorAll(`.fav-btn[data-id="${stringId}"]`)
    buttons.forEach((btn) => {
        if (isFav) {
            btn.classList.remove("active")
            btn.querySelector("svg").setAttribute("fill", "none")
        } else {
            btn.classList.add("active")
            btn.querySelector("svg").setAttribute("fill", "currentColor")
        }
    })

    const heroFav = document.getElementById("heroFav")
    if (heroFav && location.hash.includes(stringId)) {
        if (isFav) {
            heroFav.classList.remove("active")
            heroFav.textContent = "♡"
        } else {
            heroFav.classList.add("active")
            heroFav.textContent = "♥"
        }
    }

    const favCount = document.getElementById("favCount")
    if (favCount) favCount.textContent = favorites.length

    const favPanel = document.getElementById("panel-favorites")
    if (favPanel && favPanel.classList.contains("active")) {
        renderFavorites()
    }

    if (typeof accessToken !== "undefined" && accessToken) {
        try {
            if (isFav) {
                await apiRequest(`/api/favorites/${stringId}`, {
                    method: "DELETE",
                })
            } else {
                await apiRequest("/api/favorites/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        item_id: stringId,
                        item_type: type,
                    }),
                })
            }
        } catch (error) {
            console.error("Ошибка синхронизации избранного:", error)
        }
    }
}

function findItem(type, id) {
    const list = type === "attraction" ? attractions : places
    return list.find((item) => String(item.id) === String(id))
}

function findTour(id) {
    return tours.find((t) => String(t.id) === String(id))
}

function renderDetailPage(type, id) {
    const detailView = document.getElementById("detailView")
    const mainView = document.getElementById("mainView")
    if (!detailView || !mainView) return

    let item
    if (type === "tour") {
        item = findTour(id)
    } else {
        item = findItem(type, id)
    }

    if (!item) {
        detailView.innerHTML = `<a href="#" class="back-btn" id="backBtn">Назад</a><div class="empty-state">Не найдено</div>`
        return
    }

    const fav = isFavorite(item.id)
    const regionName = REGIONS[item.region] || ""
    const imageUrl = item.imageUrl || item.image_url
    const title = item.title
    const category = item.category || "Тур"
    const meta = item.meta || item.duration
    const shortDesc = item.shortDesc || item.description

    let heroImageHtml = `<div class="hero-emoji">${item.emoji || title.charAt(0).toUpperCase()}</div>`
    if (imageUrl) {
        heroImageHtml = `<img src="${imageUrl}" alt="${title}" class="hero-img-real" />`
    }

    const factsHtml = (item.facts || [])
        .map(
            (f) =>
                `<div class="info-item"><div class="info-label">${f.label}</div><div class="info-value">${f.value}</div></div>`,
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
    if (relatedTours.length > 0 && type !== "tour") {
        relatedToursHtml = `
      <h3>Туры и билеты</h3>
      <div class="detail-tours">
        ${relatedTours
            .map(
                (t) => `
          <div class="tour-row">
            <span class="tour-name">${t.title}</span>
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
    <a href="#" class="back-btn" id="backBtn">Назад к списку</a>
    <div class="detail-hero">
      ${heroImageHtml}
      <div class="hero-text">
        <div class="hero-region">${regionName}</div>
        <div class="hero-cat">${category}</div>
        <h2>${title}</h2>
        <div class="hero-meta">${meta}</div>
      </div>
      <button class="hero-fav ${fav ? "active" : ""}" id="heroFav">${fav ? "♥" : "♡"}</button>
    </div>
    <div class="detail-content">
      <p style="font-size:1.1rem; font-weight:500;">${shortDesc}</p>
      ${sectionsHtml}
      ${factsHtml ? `<h3>Кратко</h3><div class="info-grid">${factsHtml}</div>` : ""}
      ${relatedToursHtml}
    </div>
  `

    document.getElementById("backBtn").addEventListener("click", (e) => {
        e.preventDefault()
        location.hash = ""
    })

    document.getElementById("heroFav").addEventListener("click", () => {
        toggleFavorite(item.id, type)
    })

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

    if (!modal || !body) return

    title.textContent = "Оформление заказа"
    const today = new Date().toISOString().split("T")[0]

    body.innerHTML = `
    <div class="order-summary">
      <div class="sum-row"><span>${tour.title}</span></div>
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
            if (typeof accessToken === "undefined" || !accessToken) {
                alert("Необходимо войти в аккаунт")
                window.location.href = "/login.html"
                return
            }

            const date = document.getElementById("orderDate").value
            const qty = Math.max(1, Math.min(20, parseInt(qtyInput.value) || 1))
            const name =
                document.getElementById("orderName").value.trim() || "Гость"
            const contact =
                document.getElementById("orderContact").value.trim() ||
                "Не указан"

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
                    <div class="success-view">
                        <div class="success-icon">✓</div>
                        <h3 class="success-title">Заказ оформлен</h3>
                        <p style="color: var(--stone);">Ждем вас на экскурсии!</p>
                        <div class="receipt-box">
                            <div class="receipt-row"><span>Тур:</span> <b>${tour.title}</b></div>
                            <div class="receipt-row"><span>Дата:</span> <b>${date}</b></div>
                            <div class="receipt-row"><span>Кол-во:</span> <b>${qty} чел.</b></div>
                            <div class="receipt-total"><span>Итого:</span> <span>${payload.total_price.toLocaleString("ru-RU")} ₽</span></div>
                        </div>
                        <a href="/account.html" class="modal-action-btn">Перейти в личный кабинет</a>
                    </div>
                `
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
    const modal = document.getElementById("orderModal")
    if (modal) {
        modal.classList.remove("open")
    }
    currentTourForOrder = null
}

function renderRoute() {
    const mainView = document.getElementById("mainView")
    const detailView = document.getElementById("detailView")
    const hash = location.hash

    if (!mainView || !detailView) return

    const detailMatch = hash.match(/^#\/(attraction|place|tour)\/([a-z0-9]+)$/i)
    if (detailMatch) {
        mainView.style.display = "none"
        detailView.style.display = "block"
        renderDetailPage(detailMatch[1].toLowerCase(), detailMatch[2])
        return
    }

    detailView.style.display = "none"
    mainView.style.display = "block"
}

function initTabs() {
    const tabs = document.querySelectorAll(".tab-btn")
    const panels = {
        attractions: document.getElementById("panel-attractions"),
        places: document.getElementById("panel-places"),
        tours: document.getElementById("panel-tours"),
        favorites: document.getElementById("panel-favorites"),
    }

    if (tabs.length === 0) return

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
            Object.values(panels).forEach((p) => {
                if (p) p.classList.remove("active")
            })
            if (panels[target]) panels[target].classList.add("active")
        })
    })
}

function initRegionFilter() {
    const select = document.getElementById("regionSelect")
    if (select) {
        select.addEventListener("change", () => {
            currentRegion = select.value
            renderAll()
        })
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    initTabs()
    initRegionFilter()

    await loadData()

    if (typeof updateHeaderUI === "function") {
        await updateHeaderUI()
    }

    renderRoute()

    window.addEventListener("hashchange", renderRoute)

    const modalClose = document.getElementById("modalClose")
    const orderModal = document.getElementById("orderModal")

    if (modalClose) modalClose.addEventListener("click", closeModal)
    if (orderModal) {
        orderModal.addEventListener("click", (e) => {
            if (e.target === orderModal) closeModal()
        })
    }
})
