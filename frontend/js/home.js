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

function initFeaturedCarousel(grid, items) {
  grid.innerHTML = ""

  const viewport = document.createElement("div")
  viewport.className = "home-featured__viewport"

  const track = document.createElement("div")
  track.className = "home-featured__track"

  items.forEach((item) => {
    track.appendChild(createFeaturedCard(item))
  })

  viewport.appendChild(track)

  const prevButton = document.createElement("button")
  prevButton.className = "home-featured__arrow home-featured__arrow--prev"
  prevButton.type = "button"
  prevButton.setAttribute("aria-label", "Предыдущие карточки")
  prevButton.innerHTML = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" />
  </svg>
`

  const nextButton = document.createElement("button")
  nextButton.className = "home-featured__arrow home-featured__arrow--next"
  nextButton.type = "button"
  nextButton.setAttribute("aria-label", "Следующие карточки")
  nextButton.innerHTML = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 18l6-6-6-6" />
  </svg>
`

  grid.append(prevButton, viewport, nextButton)

  if (items.length <= 1) {
    prevButton.disabled = true
    nextButton.disabled = true
    return
  }

  let isAnimating = false
  let autoplayTimer = null
  let restartTimer = null
  let pointerStartX = 0
  let pointerStartY = 0
  let suppressClick = false

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches

  function getStep() {
    const card = track.querySelector(".home-featured-card")
    if (!card) return 0

    const gap = parseFloat(getComputedStyle(track).gap) || 0
    return card.getBoundingClientRect().width + gap
  }

  function moveNext() {
    if (isAnimating) return

    const step = getStep()
    if (!step) return

    isAnimating = true
    track.style.transition = "transform 700ms ease"
    track.style.transform = `translateX(-${step}px)`

    let finished = false

    function finish() {
      if (finished) return
      finished = true

      track.appendChild(track.firstElementChild)
      track.style.transition = "none"
      track.style.transform = "translateX(0)"
      isAnimating = false
    }

    track.addEventListener("transitionend", function handler(event) {
      if (event.propertyName !== "transform") return
      track.removeEventListener("transitionend", handler)
      finish()
    })

    setTimeout(finish, 800)
  }

  function movePrev() {
    if (isAnimating) return

    const step = getStep()
    if (!step) return

    isAnimating = true

    track.style.transition = "none"
    track.prepend(track.lastElementChild)
    track.style.transform = `translateX(-${step}px)`

    track.offsetHeight

    track.style.transition = "transform 700ms ease"
    track.style.transform = "translateX(0)"

    let finished = false

    function finish() {
      if (finished) return
      finished = true
      isAnimating = false
    }

    track.addEventListener("transitionend", function handler(event) {
      if (event.propertyName !== "transform") return
      track.removeEventListener("transitionend", handler)
      finish()
    })

    setTimeout(finish, 800)
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer)
    clearTimeout(restartTimer)
  }

  function startAutoplay() {
    stopAutoplay()

    if (reducedMotion || document.hidden) return

    autoplayTimer = setInterval(moveNext, 6500)
  }

  function restartAutoplay() {
    stopAutoplay()

    if (reducedMotion) return

    restartTimer = setTimeout(startAutoplay, 2500)
  }

  nextButton.addEventListener("click", () => {
    moveNext()
    restartAutoplay()
  })

  prevButton.addEventListener("click", () => {
    movePrev()
    restartAutoplay()
  })

  viewport.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return

    pointerStartX = event.clientX
    pointerStartY = event.clientY
  })

  viewport.addEventListener("pointerup", (event) => {
    const deltaX = event.clientX - pointerStartX
    const deltaY = event.clientY - pointerStartY

    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
      suppressClick = true

      if (deltaX < 0) {
        moveNext()
      } else {
        movePrev()
      }

      setTimeout(() => {
        suppressClick = false
      }, 350)
    }

    restartAutoplay()
  })

  viewport.addEventListener(
    "click",
    (event) => {
      if (suppressClick) {
        event.preventDefault()
        event.stopPropagation()
      }
    },
    true,
  )

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay()
    } else {
      startAutoplay()
    }
  })

  startAutoplay()
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

  if (allItems.length === 0) {
    grid.innerHTML =
      '<div class="home-featured__empty">Пока нет объектов для отображения.</div>'
    return
  }

  initFeaturedCarousel(grid, allItems)
}

document.addEventListener("DOMContentLoaded", async () => {
  initScrollEffects()
  initMobileMenu()

  await tryRefreshToken()
  await updateHeaderUI()

  await loadFeaturedItems()
})
