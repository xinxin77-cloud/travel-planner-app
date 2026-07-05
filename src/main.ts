import './style.css'

type SpotItem = {
  title: string
  url: string
}

type TripStop = {
  id: number
  city: string
  date: string
  isTransit: boolean
  from: string
  to: string
  transitTime: string
  transportMode: string
  vehicleNo: string
  transportLink: string
  mustSee: SpotItem[]
  hotel: string
  hotelLocation: string
  hotelLink: string
  note: string
}

type Trip = {
  userName: string
  title: string
  dates: string
  stops: TripStop[]
}

const STORAGE_KEY = 'travel-book-public-v1'

const defaultTrip: Trip = {
  userName: '七',
  title: '旅行计划书',
  dates: '旅行日期待定',
  stops: [
    {
      id: 1,
      city: '城市 A',
      date: '日期待定',
      isTransit: false,
      from: '',
      to: '',
      transitTime: '',
      transportMode: '',
      vehicleNo: '',
      transportLink: '#',
      mustSee: [
        { title: '必去景点 1', url: '#' },
        { title: '必去景点 2', url: '#' },
        { title: '必去景点 3', url: '#' },
      ],
      hotel: '酒店待定',
      hotelLocation: '住宿区域待定',
      hotelLink: '#',
      note: '这里可以填写简单备注。',
    },
    {
      id: 2,
      city: '城市 B',
      date: '日期待定',
      isTransit: true,
      from: '城市 A',
      to: '城市 B',
      transitTime: '时间待定',
      transportMode: '交通方式待定',
      vehicleNo: '班次待定',
      transportLink: '#',
      mustSee: [
        { title: '必去景点 1', url: '#' },
        { title: '必去景点 2', url: '#' },
        { title: '必去景点 3', url: '#' },
      ],
      hotel: '酒店待定',
      hotelLocation: '住宿区域待定',
      hotelLink: '#',
      note: '这是一个中转示例，可以修改为自己的真实安排。',
    },
    {
      id: 3,
      city: '城市 C',
      date: '日期待定',
      isTransit: true,
      from: '城市 B',
      to: '城市 C',
      transitTime: '时间待定',
      transportMode: '交通方式待定',
      vehicleNo: '班次待定',
      transportLink: '#',
      mustSee: [
        { title: '必去景点 1', url: '#' },
        { title: '必去景点 2', url: '#' },
        { title: '必去景点 3', url: '#' },
      ],
      hotel: '酒店待定',
      hotelLocation: '住宿区域待定',
      hotelLink: '#',
      note: '这里可以填写简单备注。',
    },
    {
      id: 4,
      city: '城市 D',
      date: '日期待定',
      isTransit: true,
      from: '城市 C',
      to: '城市 D',
      transitTime: '时间待定',
      transportMode: '交通方式待定',
      vehicleNo: '班次待定',
      transportLink: '#',
      mustSee: [
        { title: '必去景点 1', url: '#' },
        { title: '必去景点 2', url: '#' },
        { title: '必去景点 3', url: '#' },
      ],
      hotel: '酒店待定',
      hotelLocation: '住宿区域待定',
      hotelLink: '#',
      note: '这里可以填写简单备注。',
    },
  ],
}

let trip: Trip = loadTrip()
let opened = false
let selectedId: number | null = null

function cloneTrip(data: Trip): Trip {
  return JSON.parse(JSON.stringify(data))
}

function loadTrip(): Trip {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) {
    return cloneTrip(defaultTrip)
  }

  try {
    return JSON.parse(saved)
  } catch {
    return cloneTrip(defaultTrip)
  }
}

function saveTrip() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trip))
}

function escapeText(text: string) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function getSelectedStop() {
  return trip.stops.find((stop) => stop.id === selectedId) || null
}

function getNextId() {
  if (trip.stops.length === 0) return 1
  return Math.max(...trip.stops.map((stop) => stop.id)) + 1
}

function addStop() {
  const newStop: TripStop = {
    id: getNextId(),
    city: '新的城市',
    date: '日期待定',
    isTransit: false,
    from: '',
    to: '',
    transitTime: '',
    transportMode: '',
    vehicleNo: '',
    transportLink: '#',
    mustSee: [
      {
        title: '新的必去景点',
        url: '#',
      },
    ],
    hotel: '酒店待定',
    hotelLocation: '住宿区域待定',
    hotelLink: '#',
    note: '这里可以填写简单备注。',
  }

  trip.stops.push(newStop)
  selectedId = newStop.id
  saveTrip()
  render()
}

function deleteSelectedStop() {
  const selectedStop = getSelectedStop()
  if (!selectedStop) return

  const confirmDelete = confirm(`确定要删除「${selectedStop.city}」吗？`)
  if (!confirmDelete) return

  trip.stops = trip.stops.filter((stop) => stop.id !== selectedStop.id)
  selectedId = trip.stops[0]?.id || null
  saveTrip()
  render()
}

function resetTemplate() {
  const confirmReset = confirm('确定恢复公开模板吗？当前修改会被清空。')
  if (!confirmReset) return

  trip = cloneTrip(defaultTrip)
  opened = false
  selectedId = null
  saveTrip()
  render()
}

function render() {
  const app = document.querySelector<HTMLDivElement>('#app')
  if (!app) return

  if (!opened) {
    app.innerHTML = `
      <main class="cover-shell">
        <section class="book-cover">
          <p class="cover-label">TRAVEL BOOK</p>

          <div>
            <label class="field">
              <span>用户名</span>
              <input id="user-name" value="${escapeText(trip.userName)}" />
            </label>

            <h1>${escapeText(trip.userName)}的旅行计划书</h1>

            <label class="field">
              <span>计划标题</span>
              <input id="trip-title" value="${escapeText(trip.title)}" />
            </label>

            <label class="field">
              <span>旅行日期</span>
              <input id="trip-dates" value="${escapeText(trip.dates)}" />
            </label>
          </div>

          <div class="cover-actions">
            <button id="open-book">打开计划书</button>
            <button id="reset-template" class="ghost-btn">恢复模板</button>
          </div>
        </section>
      </main>
    `

    bindCoverEvents()
    return
  }

  const selectedStop = getSelectedStop()

  app.innerHTML = `
    <main class="book-page">
      <section class="book-header">
        <div>
          <p class="small-label">TRAVEL PLAN</p>
          <h1>${escapeText(trip.title)}</h1>
          <p>${escapeText(trip.userName)}的旅行计划｜${escapeText(trip.dates)}</p>
        </div>

        <div class="header-actions">
          <button id="back-cover" class="ghost-btn">返回封面</button>
          <button id="add-stop">添加地点</button>
          <button id="export-pdf">导出 PDF</button>
        </div>
      </section>

      <section class="book-layout">
        <aside class="contents-page">
          <h2>目录</h2>

          ${trip.stops
            .map(
              (stop) => `
                <button class="stop-tab ${selectedId === stop.id ? 'active' : ''}" data-id="${stop.id}">
                  <div>
                    <strong>${escapeText(stop.city)}</strong>
                    <em>${escapeText(stop.date)}</em>
                    ${stop.isTransit ? '<b class="transit-badge">中转日</b>' : ''}
                  </div>
                </button>
              `
            )
            .join('')}
        </aside>

        <section class="detail-page">
          ${
            selectedStop
              ? renderStopEditor(selectedStop)
              : `
                <div class="empty-page">
                  <h2>还没有地点</h2>
                  <p>点击“添加地点”开始创建你的旅行计划。</p>
                </div>
              `
          }
        </section>
      </section>

      <section class="summary-preview a4-preview">
        <div class="summary-title-vertical">
          <span>${escapeText(trip.title)}</span>
        </div>

        <div class="summary-main">
          <div class="summary-head">
            <p>TRAVEL SUMMARY</p>
            <h2>${escapeText(trip.userName)}的旅行计划</h2>
            <span>${escapeText(trip.dates)}</span>
          </div>

          <div class="summary-body">
            <div class="summary-brace">{</div>

            <div class="summary-route">
              ${trip.stops.map((stop, index) => renderSummaryItem(stop, index)).join('')}
            </div>
          </div>
        </div>
      </section>
    </main>
  `

  bindBookEvents()
}

function renderStopEditor(stop: TripStop) {
  return `
    <p class="small-label">EDIT PLAN</p>
    <h2>${escapeText(stop.city)}</h2>

    <div class="edit-grid">
      <label class="field">
        <span>城市 / 地点</span>
        <input class="stop-input" data-key="city" value="${escapeText(stop.city)}" />
      </label>

      <label class="field">
        <span>日期</span>
        <input class="stop-input" data-key="date" value="${escapeText(stop.date)}" />
      </label>
    </div>

    <label class="checkbox-field">
      <input type="checkbox" id="is-transit" ${stop.isTransit ? 'checked' : ''} />
      <span>这是中转日</span>
    </label>

    <div class="transit-box">
      <div class="edit-grid">
        <label class="field">
          <span>出发地</span>
          <input class="stop-input" data-key="from" value="${escapeText(stop.from)}" />
        </label>

        <label class="field">
          <span>目的地</span>
          <input class="stop-input" data-key="to" value="${escapeText(stop.to)}" />
        </label>
      </div>

      <div class="edit-grid">
        <label class="field">
          <span>中转时间</span>
          <input class="stop-input" data-key="transitTime" value="${escapeText(stop.transitTime)}" />
        </label>

        <label class="field">
          <span>交通方式</span>
          <input class="stop-input" data-key="transportMode" value="${escapeText(stop.transportMode)}" />
        </label>
      </div>

      <div class="edit-grid">
        <label class="field">
          <span>航班号 / 车次号</span>
          <input class="stop-input" data-key="vehicleNo" value="${escapeText(stop.vehicleNo)}" />
        </label>

        <label class="field">
          <span>交通链接</span>
          <input class="stop-input" data-key="transportLink" value="${escapeText(stop.transportLink)}" />
        </label>
      </div>

      <p class="link-line">
        <a href="${escapeText(stop.transportLink)}" target="_blank" rel="noreferrer">打开交通链接</a>
      </p>
    </div>

    <div class="section-head">
      <span>必去景点</span>
      <button id="add-spot" class="small-btn">添加景点</button>
    </div>

    <div class="activity-list">
      ${stop.mustSee
        .map(
          (item, index) => `
            <div class="activity-row">
              <input class="spot-title" data-index="${index}" value="${escapeText(item.title)}" placeholder="景点名称" />
              <input class="spot-url" data-index="${index}" value="${escapeText(item.url)}" placeholder="景点链接" />
              <a href="${escapeText(item.url)}" target="_blank" rel="noreferrer">打开</a>
              <button class="delete-spot small-btn" data-index="${index}">删除</button>
            </div>
          `
        )
        .join('')}
    </div>

    <label class="field">
      <span>酒店名称</span>
      <input class="stop-input" data-key="hotel" value="${escapeText(stop.hotel)}" />
    </label>

    <label class="field">
      <span>酒店位置</span>
      <input class="stop-input" data-key="hotelLocation" value="${escapeText(stop.hotelLocation)}" />
    </label>

    <label class="field">
      <span>酒店链接</span>
      <input class="stop-input" data-key="hotelLink" value="${escapeText(stop.hotelLink)}" />
    </label>

    <p class="link-line">
      <a href="${escapeText(stop.hotelLink)}" target="_blank" rel="noreferrer">打开酒店链接</a>
    </p>

    <label class="field">
      <span>备注</span>
      <textarea class="stop-input" data-key="note">${escapeText(stop.note)}</textarea>
    </label>

    <button id="delete-stop" class="danger-btn">删除当前地点</button>
  `
}

function renderSummaryItem(stop: TripStop, index: number) {
  const transitBlock = index > 0 && stop.isTransit ? renderTransitBlock(stop) : ''

  return `
    ${transitBlock}

    <div class="summary-stop-item">
      <div class="summary-city-line">
        <h3>${escapeText(stop.city)}</h3>
        <em>${escapeText(stop.date)}</em>
      </div>

      <div class="summary-detail-line">
        <div class="summary-block">
          <b>必去景点</b>
          <p>${escapeText(stop.mustSee.map((item) => item.title).join(' / '))}</p>
        </div>

        <div class="summary-block">
          <b>酒店</b>
          <p>${escapeText(stop.hotel)}</p>
          <small>${escapeText(stop.hotelLocation)}</small>
        </div>
      </div>
    </div>
  `
}

function renderTransitBlock(stop: TripStop) {
  return `
    <div class="summary-transit-row">
      <div class="summary-transit-label">中转</div>
      <div class="summary-transit-content">
        <strong>${escapeText(stop.from)} → ${escapeText(stop.to)}</strong>
        <span>${escapeText(stop.transitTime)}</span>
        <em>${escapeText(stop.transportMode)} ｜ ${escapeText(stop.vehicleNo)}</em>
      </div>
    </div>
  `
}

function bindCoverEvents() {
  document.querySelector<HTMLInputElement>('#user-name')?.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement
    trip.userName = target.value
    saveTrip()
  })

  document.querySelector<HTMLInputElement>('#trip-title')?.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement
    trip.title = target.value
    saveTrip()
  })

  document.querySelector<HTMLInputElement>('#trip-dates')?.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement
    trip.dates = target.value
    saveTrip()
  })

  document.querySelector('#open-book')?.addEventListener('click', () => {
    opened = true
    selectedId = trip.stops[0]?.id || null
    render()
  })

  document.querySelector('#reset-template')?.addEventListener('click', resetTemplate)
}

function bindBookEvents() {
  document.querySelector('#back-cover')?.addEventListener('click', () => {
    opened = false
    render()
  })

  document.querySelector('#add-stop')?.addEventListener('click', addStop)

  document.querySelector('#export-pdf')?.addEventListener('click', () => {
    window.print()
  })

  document.querySelectorAll<HTMLButtonElement>('.stop-tab').forEach((button) => {
    button.addEventListener('click', () => {
      selectedId = Number(button.dataset.id)
      render()
    })
  })

  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('.stop-input').forEach((input) => {
    input.addEventListener('input', (event) => {
      const stop = getSelectedStop()
      if (!stop) return

      const target = event.target as HTMLInputElement | HTMLTextAreaElement
      const key = target.dataset.key || ''
      const value = target.value

      if (key === 'city') stop.city = value
      if (key === 'date') stop.date = value
      if (key === 'from') stop.from = value
      if (key === 'to') stop.to = value
      if (key === 'transitTime') stop.transitTime = value
      if (key === 'transportMode') stop.transportMode = value
      if (key === 'vehicleNo') stop.vehicleNo = value
      if (key === 'transportLink') stop.transportLink = value
      if (key === 'hotel') stop.hotel = value
      if (key === 'hotelLocation') stop.hotelLocation = value
      if (key === 'hotelLink') stop.hotelLink = value
      if (key === 'note') stop.note = value

      saveTrip()
    })
  })

  document.querySelector<HTMLInputElement>('#is-transit')?.addEventListener('change', (event) => {
    const stop = getSelectedStop()
    if (!stop) return

    const target = event.target as HTMLInputElement
    stop.isTransit = target.checked

    saveTrip()
    render()
  })

  document.querySelector('#add-spot')?.addEventListener('click', () => {
    const stop = getSelectedStop()
    if (!stop) return

    stop.mustSee.push({
      title: '新的必去景点',
      url: '#',
    })

    saveTrip()
    render()
  })

  document.querySelectorAll<HTMLInputElement>('.spot-title').forEach((input) => {
    input.addEventListener('input', (event) => {
      const stop = getSelectedStop()
      if (!stop) return

      const target = event.target as HTMLInputElement
      const index = Number(target.dataset.index)

      stop.mustSee[index].title = target.value
      saveTrip()
    })
  })

  document.querySelectorAll<HTMLInputElement>('.spot-url').forEach((input) => {
    input.addEventListener('input', (event) => {
      const stop = getSelectedStop()
      if (!stop) return

      const target = event.target as HTMLInputElement
      const index = Number(target.dataset.index)

      stop.mustSee[index].url = target.value
      saveTrip()
    })
  })

  document.querySelectorAll<HTMLButtonElement>('.delete-spot').forEach((button) => {
    button.addEventListener('click', () => {
      const stop = getSelectedStop()
      if (!stop) return

      const index = Number(button.dataset.index)
      stop.mustSee.splice(index, 1)

      saveTrip()
      render()
    })
  })

  document.querySelector('#delete-stop')?.addEventListener('click', deleteSelectedStop)
}

render()