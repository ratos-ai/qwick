// ============================================================
// РЕГИОНЫ
// ============================================================

const REGIONS = {
    rso: "Северная Осетия — Алания",
    kbr: "Кабардино-Балкария",
    kchr: "Карачаево-Черкесия",
    stav: "Ставропольский край",
    ing: "Ингушетия",
    che: "Чечня",
    dag: "Дагестан",
}

// ============================================================
// ДОСТОПРИМЕЧАТЕЛЬНОСТИ (сокращённо — полные данные как в предыдущей версии)
// ============================================================

let attractions = []

// ============================================================
// ЗАВЕДЕНИЯ (сокращённо)
// ============================================================

const places = [
    {
        id: "p1",
        type: "place",
        region: "rso",
        title: "Кафе «Фыдджынтæ»",
        category: "Национальная кухня",
        emoji: "🥧",
        shortDesc: "Легендарное кафе с осетинскими пирогами.",
        meta: "📍 пр. Коста, 178",
        facts: [
            { label: "Кухня", value: "Осетинская" },
            { label: "Чек", value: "400–700 ₽" },
        ],
        sections: [
            {
                heading: "О заведении",
                text: "Работает с советских времён, главное блюдо — фыджын.",
            },
        ],
    },
    {
        id: "p2",
        type: "place",
        region: "rso",
        title: "Ресторан «Къона»",
        category: "Национальная кухня · Музей",
        emoji: "🍽",
        shortDesc: "Ресторан-музей с национальной музыкой.",
        meta: "📍 пр. Коста, 258",
        facts: [
            { label: "Кухня", value: "Осетинская" },
            { label: "Чек", value: "800–1500 ₽" },
        ],
        sections: [
            {
                heading: "Концепция",
                text: "Официанты в национальных костюмах, живая музыка.",
            },
        ],
    },
    {
        id: "p3",
        type: "place",
        region: "rso",
        title: "Ресторан «Жемчужина»",
        category: "Европейская · Грузинская кухня",
        emoji: "💎",
        shortDesc: "Ресторан в курортной зоне Владикавказа.",
        meta: "📍 пр. Коста, 11А",
        facts: [
            { label: "Кухня", value: "Европейская, грузинская" },
            { label: "Чек", value: "1000–2000 ₽" },
        ],
        sections: [
            {
                heading: "Расположение",
                text: "Рядом с мемориалом Славы, вид на Терек.",
            },
        ],
    },
    {
        id: "p4",
        type: "place",
        region: "rso",
        title: "Ресторан «Этно»",
        category: "Национальная кухня",
        emoji: "🍷",
        shortDesc: "Атмосферное заведение с осетинской кухней.",
        meta: "📍 ул. Маяковского, 19",
        facts: [
            { label: "Кухня", value: "Осетинская" },
            { label: "Чек", value: "900–1600 ₽" },
        ],
        sections: [
            {
                heading: "О ресторане",
                text: "Акцент на аутентичность и национальные напитки.",
            },
        ],
    },
    {
        id: "p5",
        type: "place",
        region: "rso",
        title: "Кафе «Старый мост»",
        category: "Национальная кухня",
        emoji: "🌉",
        shortDesc: "Уютное кафе с пирогами и десертом с мороженым.",
        meta: "📍 ул. Пашковского, 2А",
        facts: [
            { label: "Кухня", value: "Осетинская, европейская" },
            { label: "Чек", value: "500–900 ₽" },
        ],
        sections: [
            {
                heading: "О кафе",
                text: "Популярно у местных, удобная остановка в центре.",
            },
        ],
    },
    {
        id: "p6",
        type: "place",
        region: "rso",
        title: "Пекарня на Маркова, 24/2",
        category: "Выпечка · На вынос",
        emoji: "🥖",
        shortDesc: "Свежие осетинские пироги рядом с вокзалом.",
        meta: "📍 ул. Маркова, 24/2",
        facts: [
            { label: "Формат", value: "На вынос" },
            { label: "Чек", value: "200–500 ₽" },
        ],
        sections: [
            {
                heading: "Аутентичная выпечка",
                text: "Пекут по домашним рецептам, часто ещё горячим.",
            },
        ],
    },
    // KBR
    {
        id: "kbrp1",
        type: "place",
        region: "kbr",
        title: "Ресторан «Тамга»",
        category: "Национальная кухня",
        emoji: "🍽",
        shortDesc: "Ресторан этнической кухни в Нальчике.",
        meta: "📍 Нальчик",
        facts: [
            { label: "Кухня", value: "Кабардинская" },
            { label: "Чек", value: "800–1500 ₽" },
        ],
        sections: [
            {
                heading: "Этническая кухня",
                text: "Современная подача кабардинских блюд.",
            },
        ],
    },
    {
        id: "kbrp2",
        type: "place",
        region: "kbr",
        title: "Кафе «Барашка»",
        category: "Национальная кухня",
        emoji: "🐑",
        shortDesc: "Недорогое кафе с хичинами и шашлыком.",
        meta: "📍 Нальчик",
        facts: [
            { label: "Кухня", value: "Национальная" },
            { label: "Чек", value: "300–600 ₽" },
        ],
        sections: [
            {
                heading: "Доступно и вкусно",
                text: "Популярно за хичины и чебуреки.",
            },
        ],
    },
    {
        id: "kbrp3",
        type: "place",
        region: "kbr",
        title: "Ресторан «Дудукуш»",
        category: "Национальная · Авторская кухня",
        emoji: "👨‍🍳",
        shortDesc: "Авторская кабардинская кухня от шеф-повара.",
        meta: "📍 Нальчик",
        facts: [
            { label: "Кухня", value: "Кабардинская, авторская" },
            { label: "Чек", value: "1000–1800 ₽" },
        ],
        sections: [
            {
                heading: "Современная кухня",
                text: "Шеф Илья Крутов сочетает традиции и современные техники.",
            },
        ],
    },
    // KCHR
    {
        id: "kchrp1",
        type: "place",
        region: "kchr",
        title: "Ресторан «Форельное»",
        category: "Рыбная · Европейская кухня",
        emoji: "🐟",
        shortDesc: "Ресторан в Домбае, специализирующийся на форели.",
        meta: "📍 Домбай",
        facts: [
            { label: "Кухня", value: "Рыбная, карачаевская" },
            { label: "Чек", value: "800–1500 ₽" },
        ],
        sections: [
            { heading: "Форель", text: "Свежая форель и местная кухня." },
        ],
    },
    {
        id: "kchrp2",
        type: "place",
        region: "kchr",
        title: "Кафе «Тамара»",
        category: "Кавказская кухня",
        emoji: "🥟",
        shortDesc: "Уютное кафе в Архызе с традиционной кухней.",
        meta: "📍 Архыз",
        facts: [
            { label: "Кухня", value: "Кавказская" },
            { label: "Чек", value: "500–900 ₽" },
        ],
        sections: [
            {
                heading: "Домашняя атмосфера",
                text: "Хычины, шашлыки, приветливый персонал.",
            },
        ],
    },
    {
        id: "kchrp3",
        type: "place",
        region: "kchr",
        title: "Кафе «Таулу»",
        category: "Национальная кухня",
        emoji: "🍖",
        shortDesc: "Блюда на мангале, хинкали и хычины.",
        meta: "📍 Архыз",
        facts: [
            { label: "Кухня", value: "Карачаевская" },
            { label: "Чек", value: "600–1000 ₽" },
        ],
        sections: [
            { heading: "Мангал", text: "Щедрые порции, умеренные цены." },
        ],
    },
    // STAV
    {
        id: "stavp1",
        type: "place",
        region: "stav",
        title: "Ресторан «Золотой мангал»",
        category: "Кавказская кухня",
        emoji: "🍢",
        shortDesc: "Шашлык и кавказские блюда в Кисловодске.",
        meta: "📍 Кисловодск",
        facts: [
            { label: "Кухня", value: "Кавказская" },
            { label: "Чек", value: "800–1500 ₽" },
        ],
        sections: [{ heading: "Шашлык", text: "Большие порции, свежее мясо." }],
    },
    {
        id: "stavp2",
        type: "place",
        region: "stav",
        title: "Кофейня Гукасова",
        category: "Кофейня · Десерты",
        emoji: "☕",
        shortDesc: "Известная кофейня в Пятигорске.",
        meta: "📍 Пятигорск",
        facts: [
            { label: "Тип", value: "Кофейня" },
            { label: "Чек", value: "300–600 ₽" },
        ],
        sections: [
            {
                heading: "Кофе и десерты",
                text: "Популярное место для завтрака.",
            },
        ],
    },
    {
        id: "stavp3",
        type: "place",
        region: "stav",
        title: "Ресторан «Караван-Сарай»",
        category: "Кавказская · Европейская кухня",
        emoji: "🏛",
        shortDesc: "Ресторан в Кисловодске с восточной атмосферой.",
        meta: "📍 Кисловодск",
        facts: [
            { label: "Кухня", value: "Кавказская, европейская" },
            { label: "Чек", value: "800–1500 ₽" },
        ],
        sections: [
            {
                heading: "Атмосфера",
                text: "Восточный интерьер, веранда летом.",
            },
        ],
    },
    // ING
    {
        id: "ingp1",
        type: "place",
        region: "ing",
        title: "Этно-кафе «Обанхой»",
        category: "Национальная кухня",
        emoji: "🍽",
        shortDesc: "Кафе в Магасе с этническим интерьером.",
        meta: "📍 Магас",
        facts: [
            { label: "Кухня", value: "Ингушская" },
            { label: "Чек", value: "500–1000 ₽" },
        ],
        sections: [
            {
                heading: "Этнический колорит",
                text: "Старинные предметы быта, национальные блюда.",
            },
        ],
    },
    {
        id: "ingp2",
        type: "place",
        region: "ing",
        title: "Кафе «Айлам»",
        category: "Национальная кухня",
        emoji: "🥘",
        shortDesc: "Кафе в центре Магаса с доступными ценами.",
        meta: "📍 Магас",
        facts: [
            { label: "Кухня", value: "Ингушская" },
            { label: "Чек", value: "400–800 ₽" },
        ],
        sections: [
            { heading: "Национальная кухня", text: "Ч1апилг, домашние супы." },
        ],
    },
    // CHE
    {
        id: "chep1",
        type: "place",
        region: "che",
        title: "Ресторан «Нашха»",
        category: "Чеченская кухня",
        emoji: "🍲",
        shortDesc: "Аутентичные вайнахские блюда в Грозном.",
        meta: "📍 Грозный",
        facts: [
            { label: "Кухня", value: "Чеченская" },
            { label: "Чек", value: "800–1500 ₽" },
        ],
        sections: [
            {
                heading: "Жижиг-галнаш",
                text: "Главное блюдо, подаётся с томлёным ребром.",
            },
        ],
    },
    {
        id: "chep2",
        type: "place",
        region: "che",
        title: "Grill House Grozny",
        category: "Чеченская · Европейская кухня",
        emoji: "🔥",
        shortDesc: "Ресторан с широким меню и блюдами на гриле.",
        meta: "📍 Грозный",
        facts: [
            { label: "Кухня", value: "Чеченская, европейская" },
            { label: "Чек", value: "1000–2000 ₽" },
        ],
        sections: [
            {
                heading: "Многообразие",
                text: "Национальные блюда и стейки на гриле.",
            },
        ],
    },
    {
        id: "chep3",
        type: "place",
        region: "che",
        title: "Ресторан «Жижиг & Galnash»",
        category: "Чеченская кухня",
        emoji: "🥣",
        shortDesc: "Сетевой ресторан с доступными ценами.",
        meta: "📍 Грозный",
        facts: [
            { label: "Кухня", value: "Чеченская" },
            { label: "Чек", value: "500–1000 ₽" },
        ],
        sections: [
            {
                heading: "Доступно",
                text: "Большие порции, быстрое обслуживание.",
            },
        ],
    },
    // DAG
    {
        id: "dagp1",
        type: "place",
        region: "dag",
        title: "Ресторан «Папаха»",
        category: "Дагестанская кухня",
        emoji: "🍽",
        shortDesc: "Ресторан национальной кухни в Махачкале.",
        meta: "📍 Махачкала",
        facts: [
            { label: "Кухня", value: "Дагестанская" },
            { label: "Чек", value: "1500–2000 ₽" },
        ],
        sections: [
            {
                heading: "Гостеприимство",
                text: "Проект Хабиба Нурмагомедова, хинкал, чуду, курзе.",
            },
        ],
    },
    {
        id: "dagp2",
        type: "place",
        region: "dag",
        title: "Дом дагестанской кухни",
        category: "Дагестанская кухня",
        emoji: "🏠",
        shortDesc: "Уютный ресторан-двор с национальными блюдами.",
        meta: "📍 Махачкала",
        facts: [
            { label: "Кухня", value: "Дагестанская" },
            { label: "Чек", value: "800–1500 ₽" },
        ],
        sections: [
            {
                heading: "Домашняя кухня",
                text: "Хинкал, чуду, курзе, сладости.",
            },
        ],
    },
    {
        id: "dagp3",
        type: "place",
        region: "dag",
        title: "Кафе Hinkal Brothers",
        category: "Дагестанская кухня",
        emoji: "🥟",
        shortDesc: "Специализация на хинкале и доступные цены.",
        meta: "📍 Махачкала",
        facts: [
            { label: "Кухня", value: "Дагестанская" },
            { label: "Чек", value: "500–800 ₽" },
        ],
        sections: [{ heading: "Хинкал", text: "Быстрый и сытный обед." }],
    },
]

// ============================================================
// ТУРЫ И БИЛЕТЫ
// ============================================================

const tours = [
    // ---------- РСО-АЛАНИЯ ----------
    {
        id: "t-rso-1",
        type: "tour",
        region: "rso",
        title: "Золотое кольцо Осетии: Кармадон + Даргавс + Аланский монастырь",
        attractionId: "a2",
        price: 2700,
        duration: "1 день (10–12 часов)",
        includes: ["Трансфер", "Услуги гида", "Входные билеты"],
        description:
            "Однодневная экскурсия из Владикавказа по трём главным достопримечательностям: Кармадонское ущелье, Город мёртвых Даргавс и Аланский монастырь.",
    },
    {
        id: "t-rso-2",
        type: "tour",
        region: "rso",
        title: "Цейское ущелье: канатка + ледник «Сказка»",
        attractionId: "a3",
        price: 2200,
        duration: "1 день (8–10 часов)",
        includes: ["Трансфер", "Гид", "Билет на канатную дорогу (900 ₽)"],
        description:
            "Поездка в Цейское ущелье с подъёмом по канатной дороге к леднику и свободным временем для прогулки.",
    },
    {
        id: "t-rso-3",
        type: "tour",
        region: "rso",
        title: "Дигорское ущелье и замок Ханаз",
        attractionId: "a6",
        price: 2500,
        duration: "1 день (10 часов)",
        includes: ["Трансфер", "Гид", "Лёгкий треккинг"],
        description:
            "Путешествие в Дигорское ущелье с посещением средневековой крепости Ханаз и национального парка «Алания».",
    },
    {
        id: "t-rso-4",
        type: "tour",
        region: "rso",
        title: "Мидаграбинские водопады (джип-тур)",
        attractionId: "a7",
        price: 3500,
        duration: "1 день (8–9 часов)",
        includes: ["Внедорожник", "Гид", "Пикник"],
        description:
            "Джип-тур к одним из самых высоких водопадов Европы. Включает переезд по грунтовым дорогам и пешую прогулку.",
    },
    {
        id: "t-rso-5",
        type: "ticket",
        region: "rso",
        title: "Канатная дорога в Цейском ущелье (1 подъём)",
        attractionId: "a3",
        price: 900,
        duration: "Разовый билет",
        includes: ["Подъём и спуск"],
        description:
            "Прогулочный билет на канатно-кресельный подъёмник в Цее. Действует в день покупки.",
    },
    {
        id: "t-rso-6",
        type: "ticket",
        region: "rso",
        title: "Вход в Национальный парк «Алания»",
        attractionId: "a8",
        price: 300,
        duration: "Разовый билет",
        includes: ["Вход на территорию парка"],
        description:
            "Экологический сбор за посещение национального парка «Алания» в Дигорском ущелье.",
    },

    // ---------- КАБАРДИНО-БАЛКАРИЯ ----------
    {
        id: "t-kbr-1",
        type: "tour",
        region: "kbr",
        title: "Чегемские водопады + Голубые озёра",
        attractionId: "kbr1",
        price: 2000,
        duration: "1 день (8 часов)",
        includes: ["Трансфер из Нальчика", "Гид"],
        description:
            "Обзорная экскурсия по Чегемскому ущелью с посещением водопадов и Голубых озёр.",
    },
    {
        id: "t-kbr-2",
        type: "tour",
        region: "kbr",
        title: "Эльбрус: подъём на канатной дороге",
        attractionId: "kbr3",
        price: 2700,
        duration: "1 день (10–12 часов)",
        includes: ["Трансфер", "Гид", "Билет на канатную дорогу"],
        description:
            "Поездка в Приэльбрусье с подъёмом по канатной дороге до станции «Мир» (3500 м) или выше.",
    },
    {
        id: "t-kbr-3",
        type: "ticket",
        region: "kbr",
        title: "Канатная дорога на Эльбрус (прогулочный билет)",
        attractionId: "kbr3",
        price: 2700,
        duration: "Разовый билет",
        includes: ["Подъём и спуск (Азау – Мир)"],
        description:
            "Туристический билет на канатную дорогу в Приэльбрусье. Взрослый.",
    },

    // ---------- КАРАЧАЕВО-ЧЕРКЕСИЯ ----------
    {
        id: "t-kchr-1",
        type: "tour",
        region: "kchr",
        title: "Домбай: канатные дороги и Мусса-Ачитара",
        attractionId: "kchr1",
        price: 2400,
        duration: "1 день",
        includes: ["Трансфер", "Гид", "Билет на 1-ю и 2-ю канатки"],
        description:
            "Экскурсия на Домбайскую поляну с подъёмом на гору Мусса-Ачитара (открывается панорама на Эльбрус).",
    },
    {
        id: "t-kchr-2",
        type: "tour",
        region: "kchr",
        title: "Архыз: Софийские озёра и аланские храмы",
        attractionId: "kchr2",
        price: 2300,
        duration: "1 день (10 часов)",
        includes: ["Трансфер", "Гид", "Вход в городище"],
        description:
            "Поездка в Архыз с посещением Нижнеархызского городища и подъёмом к Софийским озёрам (по желанию — канатка).",
    },
    {
        id: "t-kchr-3",
        type: "ticket",
        region: "kchr",
        title: "Канатная дорога «Домбай» (1-я очередь)",
        attractionId: "kchr1",
        price: 1200,
        duration: "Разовый билет",
        includes: ["Подъём и спуск"],
        description:
            "Билет на первую очередь канатной дороги в Домбае. Взрослый.",
    },
    {
        id: "t-kchr-4",
        type: "ticket",
        region: "kchr",
        title: "Канатная дорога «Архыз» (прогулочный)",
        attractionId: "kchr2",
        price: 1000,
        duration: "Разовый билет",
        includes: ["Подъём до смотровой (2240 м)"],
        description:
            "Прогулочный подъём на канатной дороге курорта «Архыз». Взрослый.",
    },

    // ---------- СТАВРОПОЛЬСКИЙ КРАЙ ----------
    {
        id: "t-stav-1",
        type: "tour",
        region: "stav",
        title: "Пятигорск: гора Машук, Провал и места Лермонтова",
        attractionId: "stav1",
        price: 1800,
        duration: "5 часов",
        includes: ["Гид", "Подъём на Машук (электрокары)"],
        description:
            "Обзорная экскурсия по Пятигорску с посещением грота Провал, Эоловой арфы и места дуэли Лермонтова.",
    },
    {
        id: "t-stav-2",
        type: "tour",
        region: "stav",
        title: "Кисловодск: Курортный парк и нарзанная галерея",
        attractionId: "stav2",
        price: 1500,
        duration: "4 часа",
        includes: ["Гид", "Дегустация нарзана"],
        description:
            "Прогулка по Курортному парку с посещением Нарзанной галереи и Долины роз.",
    },
    {
        id: "t-stav-3",
        type: "ticket",
        region: "stav",
        title: "Музей-заповедник М.Ю. Лермонтова (комплексный билет)",
        attractionId: "stav3",
        price: 300,
        duration: "Разовый билет",
        includes: ["Домик Лермонтова", "Литературный музей"],
        description:
            "Входной билет во весь комплекс музея-заповедника. Взрослый.",
    },

    // ---------- ИНГУШЕТИЯ ----------
    {
        id: "t-ing-1",
        type: "tour",
        region: "ing",
        title: "Джейрахское ущелье: Вовнушки + Эрзи + Эгикал",
        attractionId: "ing1",
        price: 3500,
        duration: "1 день (8–10 часов)",
        includes: [
            "Трансфер из Магаса/Грозного",
            "Гид",
            "Входные билеты в заповедник",
        ],
        description:
            "Погружение в историю Ингушетии: древние башенные комплексы, склепы и святилища.",
    },
    {
        id: "t-ing-2",
        type: "ticket",
        region: "ing",
        title: "Вход в заповедник «Эрзи» (Вовнушки)",
        attractionId: "ing2",
        price: 150,
        duration: "Разовый билет",
        includes: ["Экологический сбор"],
        description:
            "Въезд на территорию Джейрахского района и заповедника «Эрзи».",
    },

    // ---------- ЧЕЧНЯ ----------
    {
        id: "t-che-1",
        type: "tour",
        region: "che",
        title: "Грозный: Сердце Чечни + Грозный-Сити",
        attractionId: "che1",
        price: 3500,
        duration: "3–4 часа",
        includes: ["Гид", "Трансфер по городу"],
        description:
            "Обзорная экскурсия по Грозному с посещением мечети «Сердце Чечни» и смотровой площадки «Грозный-Сити».",
    },
    {
        id: "t-che-2",
        type: "tour",
        region: "che",
        title: "Озеро Кезеной-Ам (из Грозного)",
        attractionId: "che2",
        price: 4000,
        duration: "1 день (10–12 часов)",
        includes: ["Трансфер", "Гид", "Обед"],
        description:
            "Поездка к высокогорному озеру Кезеной-Ам на границе с Дагестаном.",
    },
    {
        id: "t-che-3",
        type: "ticket",
        region: "che",
        title: "Смотровая площадка «Грозный-Сити»",
        attractionId: "che1",
        price: 520,
        duration: "Разовый билет",
        includes: ["Подъём на смотровую (140 м)"],
        description:
            "Билет на смотровую площадку одного из небоскрёбов комплекса «Грозный-Сити».",
    },

    // ---------- ДАГЕСТАН ----------
    {
        id: "t-dag-1",
        type: "tour",
        region: "dag",
        title: "Сулакский каньон + Бархан Сарыкум",
        attractionId: "dag1",
        price: 3700,
        duration: "1 день (10–12 часов)",
        includes: [
            "Трансфер из Махачкалы",
            "Гид",
            "Прогулка на катере (опционально)",
        ],
        description:
            "Однодневная экскурсия к самому глубокому каньону Европы с заездом на бархан Сарыкум.",
    },
    {
        id: "t-dag-2",
        type: "tour",
        region: "dag",
        title: "Гуниб и Карадахская теснина",
        attractionId: "dag2",
        price: 4500,
        duration: "1 день (12 часов)",
        includes: ["Внедорожник", "Гид", "Обед"],
        description:
            "Путешествие в исторический Гуниб с посещением крепостных стен и Карадахской теснины.",
    },
    {
        id: "t-dag-3",
        type: "ticket",
        region: "dag",
        title: "Сулакский каньон: смотровая площадка (Дубки)",
        attractionId: "dag1",
        price: 250,
        duration: "Разовый билет",
        includes: ["Вход на смотровую"],
        description:
            "Билет на оборудованную смотровую площадку в посёлке Дубки.",
    },
]

// ============================================================
// РАБОТА С API И АВТОРИЗАЦИЕЙ
// ============================================================

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

// ============================================================
// ИЗБРАННОЕ
// ============================================================

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

// ============================================================
// ПОЛЬЗОВАТЕЛЬ И ЗАКАЗЫ
// ============================================================

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

// ============================================================
// УТИЛИТЫ
// ============================================================

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

// ============================================================
// ФИЛЬТР ПО РЕГИОНУ
// ============================================================

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

// ============================================================
// РЕНДЕРИНГ КАРТОЧЕК
// ============================================================

function createCard(item) {
    const fav = isFavorite(item.id)
    const card = document.createElement("div")
    card.className = "card"
    const regionName = REGIONS[item.region] || ""

    card.innerHTML = `
    <div class="card-img">${item.emoji || "📍"}</div>
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

    card.innerHTML = `
    <div class="card-img">${tour.type === "tour" ? "🧭" : "🎫"}</div>
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

// ============================================================
// ВКЛАДКИ
// ============================================================

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

// ============================================================
// ДЕТАЛЬНАЯ СТРАНИЦА
// ============================================================

function renderDetailPage(type, id) {
    const item = findItem(type, id)
    const detailView = document.getElementById("detailView")

    if (!item) {
        detailView.innerHTML = `<a href="#" class="back-btn">← Назад</a><div class="empty-state"><span class="icon">🤷</span>Не найдено.</div>`
        return
    }

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

    // Туры/билеты, привязанные к этому месту
    const relatedTours = tours.filter((t) => t.attractionId === item.id)
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
      <div class="hero-emoji">${item.emoji || "📍"}</div>
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

    // Кнопки покупки в блоке туров
    detailView.querySelectorAll(".buy-btn[data-tour-id]").forEach((btn) => {
        btn.addEventListener("click", () => openOrderModal(btn.dataset.tourId))
    })
}

// ============================================================
// МОДАЛЬНОЕ ОКНО ЗАКАЗА
// ============================================================

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

    document.getElementById("confirmOrderBtn").addEventListener("click", () => {
        const date = document.getElementById("orderDate").value
        const qty = Math.max(1, Math.min(20, parseInt(qtyInput.value) || 1))
        const name =
            document.getElementById("orderName").value.trim() || "Гость"
        const contact =
            document.getElementById("orderContact").value.trim() || "—"

        const order = {
            id: "ORD-" + Date.now(),
            tourId: tour.id,
            tourTitle: tour.title,
            region: REGIONS[tour.region],
            date,
            qty,
            total: tour.price * qty,
            name,
            contact,
            createdAt: new Date().toLocaleString("ru-RU"),
            status: "Подтверждён",
        }

        const orders = getOrders()
        orders.unshift(order)
        saveOrders(orders)

        body.innerHTML = `
      <div class="success-msg">
        <span class="big-icon">✅</span>
        <h3 style="color:#0b3b5c; margin-bottom:0.4rem;">Заказ оформлен!</h3>
        <p style="color:#4a5d73;">Номер: <strong>${order.id}</strong></p>
        <p style="color:#4a5d73;">${tour.title} · ${date} · ${qty} чел.</p>
        <p style="color:#c0392b; font-weight:700; font-size:1.2rem;">${order.total.toLocaleString("ru-RU")} ₽</p>
        <button class="back-btn" style="margin-top:1rem;" id="goToAccount">Перейти в личный кабинет</button>
      </div>
    `

        document.getElementById("goToAccount").addEventListener("click", () => {
            closeModal()
            location.hash = "#/account"
        })
        if (location.hash === "#/account") renderAccount()
    })
}

function closeModal() {
    document.getElementById("orderModal").classList.remove("open")
    currentTourForOrder = null
}

// ============================================================
// ЛИЧНЫЙ КАБИНЕТ И АВТОРИЗАЦИЯ
// ============================================================

function renderAccount() {
    const content = document.getElementById("accountContent")

    if (!accessToken) {
        content.innerHTML = `
      <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; border-bottom: 2px solid #d0dae6; padding-bottom: 0.5rem;">
        <button class="tab-btn active" id="tabLogin" style="box-shadow: none;">Вход</button>
        <button class="tab-btn" id="tabRegister" style="box-shadow: none;">Регистрация</button>
      </div>

      <!-- Форма входа -->
      <form class="auth-form" id="loginForm">
        <label>Имя пользователя (username)</label>
        <input type="text" id="loginUsername" required>
        <label>Пароль</label>
        <input type="password" id="loginPassword" required>
        <button class="submit-btn" type="submit">Войти</button>
        <p id="loginError" style="color: #e74c3c; margin-top: 0.5rem; display: none;"></p>
      </form>

      <!-- Форма регистрации (скрыта по умолчанию) -->
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

    const orders = getOrders()

    let ordersHtml = ""
    if (orders.length === 0) {
        ordersHtml = `<div class="empty-state"><span class="icon">🧾</span>У вас пока нет заказов.</div>`
    } else {
        ordersHtml = orders
            .map(
                (o) => `
      <div class="order-card">
        <div class="order-title">${o.tourTitle}</div>
        <div class="order-meta">${o.region} · ${o.date} · ${o.qty} чел.</div>
        <div class="order-price">${o.total.toLocaleString("ru-RU")} ₽</div>
      </div>
    `,
            )
            .join("")
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
  `

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

// ============================================================
// РОУТЕР
// ============================================================

function renderRoute() {
    const mainView = document.getElementById("mainView")
    const detailView = document.getElementById("detailView")
    const accountView = document.getElementById("accountView")
    const hash = location.hash

    const detailMatch = hash.match(/^#\/(attraction|place)\/([a-z0-9]+)$/i)
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

// ============================================================
// ЗАПУСК
// ============================================================

async function loadAttractions() {
    try {
        const response = await fetch("/api/attractions/")
        if (response.ok) {
            const data = await response.json()
            attractions = data.map((item) => ({
                ...item,
                id: String(item.id),
                type: "attraction",
                shortDesc: item.short_desc,
            }))

            renderAll()
        }
    } catch (error) {
        console.error("Error loading attractions:", error)
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
