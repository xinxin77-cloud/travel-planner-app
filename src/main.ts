import './style.css'

type DayPlan = {
  day: string
  date: string
  city: string
  title: string
  items: string
  note: string
}

type Trip = {
  title: string
  dates: string
  route: string
  days: DayPlan[]
}

const defaultTrip: Trip = {
  title: '欧洲十日旅行计划',
  dates: '2026.07.30 - 2026.08.09',
  route: '上海 → 米兰 → 尼斯 → 巴塞罗那 → 马德里 → 米兰',
  days: [
    {
      day: 'Day 1',
      date: '7月30日',
      city: '米兰',
      title: '抵达米兰',
      items: '抵达米兰\n入住酒店\n晚上轻松看米兰大教堂外观',
      note: '第一天不要安排太满，以休息为主。',
    },
    {
      day: 'Day 2',
      date: '7月31日',
      city: '米兰',
      title: '米兰市区游',
      items: '米兰大教堂\n埃马努埃莱二世长廊\n斯福尔扎城堡',
      note: '这一天适合慢慢逛，不要太赶。',
    },
    {
      day: 'Day 3',
      date: '8月1日',
      city: '尼斯',
      title: '米兰前往尼斯',
      items: '乘火车或巴士前往尼斯\n入住酒店\n晚上逛尼斯老城',
      note: '这一天主要是交通日。',
    },
  ],
}

const STORAGE_KEY = 'travel-planner-trip'

function loadTrip(): Trip {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return defaultTrip

  try {
    return JSON.parse(saved)
  } catch {
    return defaultTrip
  }
}

let trip: Trip = loadTrip()

function saveTrip() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trip))
}

function render() {
  const app = document.querySelector<HTMLDivElement>('#app')
  if (!app) return

  app.innerHTML = `
    <main class="page">
      <section class="hero">
        <p class="eyebrow">TRAVEL PLANNER</p>

        <label class="field">
          <span>旅行标题</span>
          <input id="trip-title" value="${trip.title}" />
        </label>

        <label class="field">
          <span>旅行日期</span>
          <input id="trip-dates" value="${trip.dates}" />
        </label>

        <label class="field">
          <span>旅行路线</span>
          <input id="trip-route" value="${trip.route}" />
        </label>

        <div class="hero-actions">
          <button id="add-day">+ 添加一天</button>
          <button id="reset-trip" class="secondary">恢复默认</button>
        </div>
      </section>

      <section class="section">
        <h2>每日行程</h2>
        <div class="days">
          ${trip.days
            .map(
              (day, index) => `
                <article class="day-card">
                  <div class="day-header">
                    <strong>${day.day}</strong>
                    <button class="delete-day" data-index="${index}">删除</button>
                  </div>

                  <div class="form-grid">
                    <label class="field">
                      <span>日期</span>
                      <input class="day-input" data-index="${index}" data-key="date" value="${day.date}" />
                    </label>

                    <label class="field">
                      <span>城市</span>
                      <input class="day-input" data-index="${index}" data-key="city" value="${day.city}" />
                    </label>
                  </div>

                  <label class="field">
                    <span>当天标题</span>
                    <input class="day-input" data-index="${index}" data-key="title" value="${day.title}" />
                  </label>

                  <label class="field">
                    <span>行程内容，一行一个安排</span>
                    <textarea class="day-input" data-index="${index}" data-key="items">${day.items}</textarea>
                  </label>

                  <label class="field">
                    <span>备注</span>
                    <textarea class="day-input note" data-index="${index}" data-key="note">${day.note}</textarea>
                  </label>

                  <div class="preview">
                    <p>${day.date}｜${day.city}</p>
                    <h3>${day.title}</h3>
                    <ul>
                      ${day.items
                        .split('\n')
                        .filter(Boolean)
                        .map((item) => `<li>${item}</li>`)
                        .join('')}
                    </ul>
                    <small>${day.note}</small>
                  </div>
                </article>
              `
            )
            .join('')}
        </div>
      </section>
    </main>
  `

  bindEvents()
}

function bindEvents() {
  const titleInput = document.querySelector<HTMLInputElement>('#trip-title')
  const datesInput = document.querySelector<HTMLInputElement>('#trip-dates')
  const routeInput = document.querySelector<HTMLInputElement>('#trip-route')

  titleInput?.addEventListener('input', (event) => {
    trip.title = (event.target as HTMLInputElement).value
    saveTrip()
  })

  datesInput?.addEventListener('input', (event) => {
    trip.dates = (event.target as HTMLInputElement).value
    saveTrip()
  })

  routeInput?.addEventListener('input', (event) => {
    trip.route = (event.target as HTMLInputElement).value
    saveTrip()
  })

  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('.day-input').forEach((input) => {
    input.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement
      const index = Number(target.dataset.index)
      const key = target.dataset.key as keyof DayPlan

      trip.days[index][key] = target.value
      saveTrip()
      render()
    })
  })

  document.querySelectorAll<HTMLButtonElement>('.delete-day').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.index)
      trip.days.splice(index, 1)
      refreshDayNumbers()
      saveTrip()
      render()
    })
  })

  document.querySelector<HTMLButtonElement>('#add-day')?.addEventListener('click', () => {
    const nextNumber = trip.days.length + 1

    trip.days.push({
      day: `Day ${nextNumber}`,
      date: '',
      city: '',
      title: '新的行程',
      items: '新的安排',
      note: '',
    })

    saveTrip()
    render()
  })

  document.querySelector<HTMLButtonElement>('#reset-trip')?.addEventListener('click', () => {
    const confirmReset = confirm('确定要恢复默认内容吗？你现在编辑的内容会被清空。')
    if (!confirmReset) return

    trip = structuredClone(defaultTrip)
    saveTrip()
    render()
  })
}

function refreshDayNumbers() {
  trip.days = trip.days.map((day, index) => ({
    ...day,
    day: `Day ${index + 1}`,
  }))
}

render()