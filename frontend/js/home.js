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
  const type = item.item_type || item.type || "attraction"

  const card = document.createElement("a")
  card.className = "home-featured-card"
  card.href = `/catalog.html#/${type}/${encodeURIComponent(item.id)}`

  const imageContainer = document.createElement("div")
  imageContainer.className = "home-featured-card__image"

  const imageUrl = item.image_url || item.imageUrl || ""

  if (imageUrl) {
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = item.title || "Qwick"
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
    item.short_desc ||
    item.shortDesc ||
    item.description ||
    "Откройте подробную информацию об этом объекте."

  const link = document.createElement("div")
  link.className = "home-featured-card__link"

  const linkText = document.createElement("span")
  linkText.textContent = type === "tour" ? "Смотреть тур" : "Подробнее"

  const arrow = document.createElement("span")
  arrow.textContent = "↗"

  link.append(linkText, arrow)
  body.append(region, title, description, link)
  card.append(imageContainer, body)

  return card
}

function getStaticHomeItems() {
  const attractions = (window.QWICK_STATIC_ITEMS || []).map((item) => ({
    ...item,
    item_type: "attraction",
  }))

  const places = (window.QWICK_STATIC_PLACES || []).map((item) => ({
    ...item,
    item_type: "place",
  }))

  const tours = (window.QWICK_STATIC_TOURS || []).map((item) => ({
    ...item,
    item_type: "tour",
  }))

  return [...attractions, ...places, ...tours]
}

async function loadFeaturedItems() {
  const grid = document.getElementById("featuredGrid")
  if (!grid) return

  let backendItems = []

  try {
    const response = await fetch("/api/attractions/")

    if (response.ok) {
      backendItems = await response.json()
    }
  } catch (error) {
    console.error("Ошибка загрузки объектов:", error)
  }

  const staticItems = getStaticHomeItems()

  const allItems = [...backendItems, ...staticItems]
    .filter((item) => item && item.id && item.title)
    .filter((item, index, array) => {
      const key = `${item.item_type || item.type}-${item.id}`
      return (
        array.findIndex(
          (other) => `${other.item_type || other.type}-${other.id}` === key,
        ) === index
      )
    })

  grid.innerHTML = ""

  if (allItems.length === 0) {
    grid.innerHTML =
      '<div class="home-featured__empty">Пока нет объектов для отображения.</div>'
    return
  }

  const track = document.createElement("div")
  track.className = "home-featured__track"

  allItems.forEach((item) => {
    track.appendChild(createFeaturedCard(item))
  })

  allItems.forEach((item) => {
    const clone = createFeaturedCard(item)
    clone.setAttribute("aria-hidden", "true")
    clone.tabIndex = -1
    clone.querySelectorAll("a, button").forEach((element) => {
      element.tabIndex = -1
    })
    track.appendChild(clone)
  })

  grid.appendChild(track)
}

document.addEventListener("DOMContentLoaded", async () => {
  initScrollEffects()
  initMobileMenu()

  await tryRefreshToken()
  await updateHeaderUI()

  await loadFeaturedItems()
})
