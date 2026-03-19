import { FACTIONS } from '../factions'

interface SidebarProps {
    selectedFaction: string | null
    onFactionSelect: (faction: string) => void
}

export default function Sidebar({ selectedFaction, onFactionSelect }: SidebarProps): React.JSX.Element {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-title">WFM TRACKER</div>
                <div className="sidebar-subtitle">BUY ORDER PRICES</div>
            </div>
            <nav className="faction-list">
                {Object.keys(FACTIONS).map(faction => (
                    <button
                        key={faction}
                        className={`faction-item ${selectedFaction === faction ? 'active' : ''}`}
                        onClick={() => onFactionSelect(faction)}
                    >
                        {faction}
                    </button>
                ))}
            </nav>
        </aside>
    )
}