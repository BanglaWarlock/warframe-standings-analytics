import { useState } from 'react'
import { FACTIONS } from '../factions'

interface SidebarProps {
    selectedFaction: string | null
    onFactionSelect: (faction: string) => void
}

export default function Sidebar({ selectedFaction, onFactionSelect }: SidebarProps): React.JSX.Element {
    const [search, setSearch] = useState('')

    const filteredFactions = Object.keys(FACTIONS).filter(faction =>
        faction.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-title">WFM TRACKER</div>
                <div className="sidebar-subtitle">BUY ORDER PRICES</div>
            </div>
            <div className="sidebar-search">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search factions..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            <nav className="faction-list">
                {filteredFactions.length === 0 ? (
                    <div className="search-empty">No factions found</div>
                ) : (
                    filteredFactions.map(faction => (
                        <button
                            key={faction}
                            className={`faction-item ${selectedFaction === faction ? 'active' : ''}`}
                            onClick={() => onFactionSelect(faction)}
                        >
                            {faction}
                        </button>
                    ))
                )}
            </nav>
        </aside>
    )
}