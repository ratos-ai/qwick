function showMessage(text, type) {
  const msgDiv = document.getElementById("message")
  if (!msgDiv) return
  msgDiv.textContent = text
  msgDiv.className = type
  msgDiv.style.display = "block"
}

function addFactRow(label = "", value = "") {
  const container = document.getElementById("factsContainer")
  const row = document.createElement("div")
  row.className = "dynamic-row"
  row.innerHTML = `
        <input type="text" placeholder="Название (Высота)" value="${label}" class="fact-label" required>
        <input type="text" placeholder="Значение (5642 м)" value="${value}" class="fact-value" required>
        <button type="button" class="remove-row-btn" onclick="this.parentElement.remove()">✕</button>
    `
  container.appendChild(row)
}

function addSectionRow(heading = "", text = "") {
  const container = document.getElementById("sectionsContainer")
  const row = document.createElement("div")
  row.className = "dynamic-row"
  row.innerHTML = `
        <input type="text" placeholder="Заголовок (История)" value="${heading}" class="section-heading" required>
        <input type="text" placeholder="Текст описания" value="${text}" class="section-text" required>
        <button type="button" class="remove-row-btn" onclick="this.parentElement.remove()">✕</button>
    `
  container.appendChild(row)
}

function serializeDynamicList(
  containerId,
  labelClass,
  valueClass,
  labelKey,
  valueKey,
) {
  const rows = document.querySelectorAll(`#${containerId} .dynamic-row`)
  const result = []
  rows.forEach((row) => {
    const l = row.querySelector(`.${labelClass}`).value.trim()
    const v = row.querySelector(`.${valueClass}`).value.trim()
    if (l && v) {
      result.push({ [labelKey]: l, [valueKey]: v })
    }
  })
  return result
}

async function checkAdminAuth() {
  const isRefreshed = await tryRefreshToken()
  if (!isRefreshed) {
    alert("Доступ запрещен.")
    window.location.href = "/"
    return false
  }

  const res = await apiRequest("/api/auth/me")
  if (res.ok) {
    const user = await res.json()
    if (!user.is_superuser) {
      alert("Доступ запрещен.")
      window.location.href = "/"
      return false
    }
    return true
  }
  return false
}

function initTabs() {
  const btnAttr = document.getElementById("tabBtnAttractions")
  const btnList = document.getElementById("tabBtnList")
  const btnOrders = document.getElementById("tabBtnOrders")

  const secAttr = document.getElementById("sectionAttractions")
  const secList = document.getElementById("sectionList")
  const secOrders = document.getElementById("sectionOrders")

  if (!btnAttr || !btnList || !btnOrders) return

  const hideAll = () => {
    secAttr.style.display = "none"
    secList.style.display = "none"
    secOrders.style.display = "none"

    btnAttr.classList.remove("active")
    btnList.classList.remove("active")
    btnOrders.classList.remove("active")
  }

  btnAttr.addEventListener("click", () => {
    hideAll()
    btnAttr.classList.add("active")
    secAttr.style.display = "block"
  })

  btnList.addEventListener("click", () => {
    hideAll()
    btnList.classList.add("active")
    secList.style.display = "block"
    loadAdminContent()
  })

  btnOrders.addEventListener("click", () => {
    hideAll()
    btnOrders.classList.add("active")
    secOrders.style.display = "block"
    loadAdminOrders()
  })
}

function initItemTypeToggle() {
  const itemTypeSelect = document.getElementById("itemType")
  const priceGroup = document.getElementById("priceGroup")
  const priceInput = document.getElementById("price")

  if (!itemTypeSelect || !priceGroup) return

  itemTypeSelect.addEventListener("change", () => {
    if (itemTypeSelect.value === "tour") {
      priceGroup.style.display = "block"
    } else {
      priceGroup.style.display = "none"
      if (priceInput) priceInput.value = ""
    }
  })
}

async function handleFormSubmit(e) {
  e.preventDefault()
  if (!accessToken) return showMessage("Нет доступа.", "error")

  const fileInput = document.getElementById("imageFile")
  let imageUrl = null

  if (fileInput && fileInput.files.length > 0) {
    const formData = new FormData()
    formData.append("file", fileInput.files[0])
    try {
      const uploadRes = await apiRequest("/api/attractions/upload", {
        method: "POST",
        body: formData,
      })
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json()
        imageUrl = uploadData.image_url
      } else {
        return showMessage("Ошибка загрузки фото", "error")
      }
    } catch (err) {
      return showMessage("Ошибка сети при загрузке", "error")
    }
  }

  const parsedFacts = serializeDynamicList(
    "factsContainer",
    "fact-label",
    "fact-value",
    "label",
    "value",
  )
  const parsedSections = serializeDynamicList(
    "sectionsContainer",
    "section-heading",
    "section-text",
    "heading",
    "text",
  )

  const payload = {
    title: document.getElementById("title").value,
    region: document.getElementById("region").value,
    category: document.getElementById("category").value,
    emoji: document.getElementById("emoji").value,
    short_desc: document.getElementById("short_desc").value,
    meta: document.getElementById("meta").value,
    image_url: imageUrl,
    item_type: document.getElementById("itemType").value,
    price: parseFloat(document.getElementById("price").value) || null,
    facts: parsedFacts,
    sections: parsedSections,
  }

  try {
    const res = await apiRequest("/api/attractions/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.status === 201) {
      showMessage("Успешно добавлено!", "success")
      document.getElementById("addForm").reset()
      document.getElementById("itemType").dispatchEvent(new Event("change"))
    } else {
      const err = await res.json()
      showMessage(`Ошибка: ${JSON.stringify(err.detail)}`, "error")
    }
  } catch (error) {
    showMessage("Ошибка при отправке данных", "error")
  }
}

async function loadAdminOrders() {
  const tbody = document.getElementById("adminOrdersBody")
  if (!tbody) return

  tbody.innerHTML =
    "<tr><td colspan='7' style='text-align:center;'>Загрузка...</td></tr>"

  try {
    const res = await apiRequest("/api/orders/admin/all")
    if (res.ok) {
      const orders = await res.json()
      if (orders.length === 0) {
        tbody.innerHTML =
          "<tr><td colspan='7' style='text-align:center;'>Заказов нет</td></tr>"
        return
      }
      tbody.innerHTML = orders
        .map(
          (o) => `
                <tr>
                    <td>#${o.id}</td>
                    <td><b>${o.tour_title}</b><br><small style="color:#94A3B8">${o.region}</small></td>
                    <td>${o.name}<br><small style="color:#94A3B8">${o.contact}</small></td>
                    <td>${o.date}<br><small style="color:#94A3B8">${o.quantity} чел.</small></td>
                    <td><b>${o.total_price.toLocaleString("ru-RU")} ₽</b></td>
                    <td><span class="status-badge ${o.is_paid ? "status-paid" : "status-unpaid"}">${o.is_paid ? "Оплачен" : "Ожидает"}</span></td>
                    <td><button class="btn-delete" onclick="deleteAdminOrder(${o.id})">Удалить</button></td>
                </tr>
            `,
        )
        .join("")
    } else {
      tbody.innerHTML =
        "<tr><td colspan='7' style='color:red; text-align:center;'>Ошибка загрузки.</td></tr>"
    }
  } catch (e) {
    tbody.innerHTML =
      "<tr><td colspan='7' style='color:red; text-align:center;'>Ошибка сети.</td></tr>"
  }
}

async function deleteAdminOrder(id) {
  if (!confirm(`Удалить заказ #${id}?`)) return
  try {
    const res = await apiRequest(`/api/orders/admin/${id}`, {
      method: "DELETE",
    })
    if (res.ok) {
      loadAdminOrders()
    } else {
      alert("Ошибка удаления")
    }
  } catch (e) {
    console.error(e)
  }
}

async function loadAdminContent() {
  const tbody = document.getElementById("adminContentBody")
  if (!tbody) return

  tbody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;">Загрузка...</td>
        </tr>
    `

  const typeMap = {
    attraction: "Достопримечательность",
    place: "Заведение",
    tour: "Тур",
  }

  const regionMap = {
    rso: "Северная Осетия",
    kbr: "Кабардино-Балкария",
    kchr: "Карачаево-Черкесия",
    stav: "Ставропольский край",
    ing: "Ингушетия",
    che: "Чечня",
    dag: "Дагестан",
  }

  try {
    const res = await apiRequest("/api/attractions/")

    if (!res.ok) {
      throw new Error("Ошибка загрузки")
    }

    const databaseItems = await res.json()

    const staticItems = [
      ...(window.QWICK_STATIC_ITEMS || []).map((item) => ({
        ...item,
        item_type: "attraction",
        is_static: true,
      })),

      ...(window.QWICK_STATIC_PLACES || []).map((item) => ({
        ...item,
        item_type: "place",
        is_static: true,
      })),

      ...(window.QWICK_STATIC_TOURS || []).map((item) => ({
        ...item,
        item_type: "tour",
        is_static: true,
      })),
    ]

    const allItems = [
      ...databaseItems.map((item) => ({
        ...item,
        is_static: false,
      })),
      ...staticItems,
    ]

    if (allItems.length === 0) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">Объектов нет</td>
                </tr>
            `
      return
    }

    tbody.innerHTML = allItems
      .map((item) => {
        const type = typeMap[item.item_type] || "Объект"
        const region = regionMap[item.region] || item.region || "—"
        const source = item.is_static ? "Статический" : "База данных"

        const action = item.is_static
          ? "<span>—</span>"
          : `<button class="btn-delete" onclick="deleteAdminContent(${item.id})">Удалить</button>`

        return `
                <tr>
                    <td>${item.id}</td>
                    <td>${type}</td>
                    <td><b>${item.title}</b></td>
                    <td>${region}</td>
                    <td>${source}</td>
                    <td>${action}</td>
                </tr>
            `
      })
      .join("")
  } catch (error) {
    console.error(error)
    tbody.innerHTML = `
            <tr>
                <td colspan="6" style="color:red; text-align:center;">
                    Ошибка загрузки объектов
                </td>
            </tr>
        `
  }
}

async function deleteAdminContent(id) {
  if (!confirm(`Вы уверены, что хотите удалить объект #${id}?`)) return
  try {
    const res = await apiRequest(`/api/attractions/${id}`, {
      method: "DELETE",
    })
    if (res.status === 204 || res.ok) {
      loadAdminContent()
    } else {
      alert("Ошибка удаления")
    }
  } catch (e) {
    console.error(e)
    alert("Ошибка сети")
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const isAdmin = await checkAdminAuth()
  if (!isAdmin) return

  initTabs()
  initItemTypeToggle()

  if (document.getElementById("factsContainer").children.length === 0) {
    addFactRow()
  }
  if (document.getElementById("sectionsContainer").children.length === 0) {
    addSectionRow()
  }

  const form = document.getElementById("addForm")
  if (form) {
    form.addEventListener("submit", handleFormSubmit)
  }
})
