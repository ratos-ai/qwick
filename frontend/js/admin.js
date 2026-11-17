function showMessage(text, type) {
    const msgDiv = document.getElementById("message")
    if (!msgDiv) return
    msgDiv.textContent = text
    msgDiv.className = type
    msgDiv.style.display = "block"
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
    const btnOrders = document.getElementById("tabBtnOrders")
    const secAttr = document.getElementById("sectionAttractions")
    const secOrders = document.getElementById("sectionOrders")

    if (!btnAttr || !btnOrders) return

    btnAttr.addEventListener("click", () => {
        btnAttr.classList.add("active")
        btnOrders.classList.remove("active")
        secAttr.style.display = "block"
        secOrders.style.display = "none"
    })

    btnOrders.addEventListener("click", () => {
        btnOrders.classList.add("active")
        btnAttr.classList.remove("active")
        secAttr.style.display = "none"
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

    let parsedFacts = []
    let parsedSections = []
    try {
        parsedFacts = JSON.parse(document.getElementById("facts").value || "[]")
        parsedSections = JSON.parse(
            document.getElementById("sections").value || "[]",
        )
    } catch (err) {
        return showMessage("Ошибка в формате JSON (факты или секции)", "error")
    }

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
            document
                .getElementById("itemType")
                .dispatchEvent(new Event("change"))
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

document.addEventListener("DOMContentLoaded", async () => {
    const isAdmin = await checkAdminAuth()
    if (!isAdmin) return

    initTabs()
    initItemTypeToggle()

    const form = document.getElementById("addForm")
    if (form) {
        form.addEventListener("submit", handleFormSubmit)
    }
})
