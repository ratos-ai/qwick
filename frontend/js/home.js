const HOME_REGIONS = {
    rso: "Северная Осетия — Алания",
    kbr: "Кабардино-Балкария",
    kchr: "Карачаево-Черкесия",
    stav: "Ставропольский край",
    ing: "Ингушетия",
    che: "Чечня",
    dag: "Дагестан",
}

function createFeaturedCard(item) {
    const type = ["attraction", "place", "tour"].includes(item.item_type)
        ? item.item_type
        : "attraction"

    const card = document.createElement("a")
    card.className = "home-featured-card"
    card.href = `/catalog.html#/${type}/${encodeURIComponent(item.id)}`

    // Image
    const imageContainer = document.createElement("div")
    imageContainer.className = "home-featured-card__image"

    if (item.image_url) {
        const image = document.createElement("img")
        image.src = item.image_url
        image.alt = item.title || "Объект Северного Кавказа"
        image.loading = "lazy"

        image.addEventListener("error", () => {
            image.remove()

            const placeholder = document.createElement("div")
            placeholder.className = "home-featured-card__placeholder"
            placeholder.textContent = "Q"

            imageContainer.appendChild(placeholder)
        })

        imageContainer.appendChild(image)
    } else {
        const placeholder = document.createElement("div")
        placeholder.className = "home-featured-card__placeholder"
        placeholder.textContent = "Q"

        imageContainer.appendChild(placeholder)
    }

    // Card body
    const body = document.createElement("div")
    body.className = "home-featured-card__body"

    const region = document.createElement("span")
    region.className = "home-featured-card__region"
    region.textContent = HOME_REGIONS[item.region] || "Северный Кавказ"

    const title = document.createElement("h3")
    title.className = "home-featured-card__title"
    title.textContent = item.title || "Интересное место"

    const description = document.createElement("p")
    description.className = "home-featured-card__description"
    description.textContent =
        item.short_desc || "Откройте подробную информацию об этом объекте."

    const link = document.createElement("div")
    link.className = "home-featured-card__link"

    const linkText = document.createElement("span")
    linkText.textContent = "Подробнее"

    const arrow = document.createElement("span")
    arrow.textContent = "↗"

    link.append(linkText, arrow)
    body.append(region, title, description, link)
    card.append(imageContainer, body)

    return card
}

async function loadFeaturedItems() {
    const grid = document.getElementById("featuredGrid")

    if (!grid) return

    try {
        const response = await fetch("/api/attractions/")

        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`)
        }

        const data = await response.json()

        const items = data
            .filter((item) => item && item.id && item.title)
            .slice(0, 3)

        grid.innerHTML = ""

        if (items.length === 0) {
            const empty = document.createElement("div")
            empty.className = "home-featured__empty"
            empty.textContent = "Пока нет опубликованных объектов."
            grid.appendChild(empty)
            return
        }

        items.forEach((item) => {
            grid.appendChild(createFeaturedCard(item))
        })
    } catch (error) {
        console.error("Ошибка загрузки объектов на главной:", error)

        grid.innerHTML = ""

        const errorMessage = document.createElement("div")
        errorMessage.className = "home-featured__empty"
        errorMessage.textContent =
            "Не удалось загрузить объекты. Попробуйте открыть каталог."

        grid.appendChild(errorMessage)
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // Common UI
    initScrollEffects()
    initMobileMenu()

    // Restore authentication
    await tryRefreshToken()
    await updateHeaderUI()

    // Dynamic homepage content
    await loadFeaturedItems()
})
