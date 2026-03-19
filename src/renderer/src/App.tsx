import { useState, useRef } from 'react'
import './App.css'
import { ItemData, LoadingState } from './types'
import { FACTIONS, slug } from './factions'
import Sidebar from './components/Sidebar'
import ItemTable from './components/ItemTable'
import ProgressBar from './components/ProgressBar'
import StatusBar from './components/StatusBar'

export default function App(): React.JSX.Element {
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null)
  const [itemData, setItemData] = useState<ItemData>({})
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [statusMsg, setStatusMsg] = useState('Ready — select a faction to begin.')
  const cancelRef = useRef(false)

  const countItems = (faction: string): number =>
    Object.values(FACTIONS[faction]).reduce((sum, items) => sum + items.length, 0)

  const handleFactionSelect = (faction: string): void => {
    cancelRef.current = true
    setLoadingState('idle')
    setItemData({})
    setProgress({ current: 0, total: 0 })
    setSelectedFaction(faction)
    setStatusMsg(`${faction} — ${countItems(faction)} items. Click 'Load Prices' to fetch.`)
  }

  const loadPrices = async (): Promise<void> => {
    if (!selectedFaction) return
    const allItems = Object.values(FACTIONS[selectedFaction]).flat()
    cancelRef.current = false
    setLoadingState('loading')
    setItemData({})
    setProgress({ current: 0, total: allItems.length })
    setStatusMsg(`Fetching ${allItems.length} items… (rate-limited to 3/sec)`)

    const newData: ItemData = {}

    for (let i = 0; i < allItems.length; i++) {
      if (cancelRef.current) {
        setLoadingState('cancelled')
        setStatusMsg('Cancelled.')
        return
      }

      const itemName = allItems[i]
      try {
        const buyOrders = await window.api.fetchItemPrice(slug(itemName))
        newData[itemName] = buyOrders as import('./types').BuyOrder[]
      } catch {
        newData[itemName] = []
      }

      setProgress({ current: i + 1, total: allItems.length })
      setItemData({ ...newData })
      await new Promise(r => setTimeout(r, 340))
    }

    setLoadingState('done')
    const withOrders = Object.values(newData).filter(v => v.length > 0).length
    setStatusMsg(
      `Done — ${withOrders}/${allItems.length} items have active buy orders. Last updated: ${new Date().toLocaleTimeString()}`
    )
  }

  const cancelLoad = (): void => {
    cancelRef.current = true
    setLoadingState('cancelled')
    setStatusMsg('Cancelled.')
  }

  return (
    <div className="app">
      <Sidebar
        selectedFaction={selectedFaction}
        onFactionSelect={handleFactionSelect}
      />

      <main className="main-panel">
        <div className="panel-header">
          <span className="panel-title">
            {selectedFaction ?? 'Select a faction →'}
          </span>
          <div className="header-actions">
            <button
              className="btn-primary"
              disabled={!selectedFaction || loadingState === 'loading'}
              onClick={loadPrices}
            >
              ▶ Load Prices
            </button>
            <button
              className="btn-secondary"
              disabled={loadingState !== 'loading'}
              onClick={cancelLoad}
            >
              ✕ Cancel
            </button>
          </div>
        </div>

        <ProgressBar current={progress.current} total={progress.total} />

        <div className="content-scroll">
          {!selectedFaction && (
            <div className="empty-state">
              <div className="empty-icon">⬡</div>
              <div className="empty-text">Select a faction from the sidebar</div>
              <div className="empty-sub">to view items and fetch live buy order prices</div>
            </div>
          )}
          {selectedFaction && (
            <ItemTable
              selectedFaction={selectedFaction}
              itemData={itemData}
            />
          )}
        </div>

        <StatusBar message={statusMsg} />
      </main>
    </div>
  )
}