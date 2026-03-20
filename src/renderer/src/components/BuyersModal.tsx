import { useEffect, useState, useRef } from 'react'
import { slug } from '../factions'

interface BuyOrder {
    platinum: number
    rank: number | string
    user: {
        ingameName: string
        status: string
        reputation: number
    }
}

interface BuyersModalProps {
    itemName: string
    onClose: () => void
}

export default function BuyersModal({ itemName, onClose }: BuyersModalProps): React.JSX.Element {
    const [orders, setOrders] = useState<BuyOrder[]>([])
    const [loading, setLoading] = useState(true)
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
    const overlayRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setLoading(true)
        window.api.fetchItemOrders(slug(itemName)).then((data) => {
            const allOrders = data as (BuyOrder & { type: string })[]
            const buyOrders = allOrders
                .filter(o => o.type === 'buy')
                .sort((a, b) => b.platinum - a.platinum)
                .slice(0, 5)
            setOrders(buyOrders)
            setLoading(false)
        })
    }, [itemName])

    const handleOverlayClick = (e: React.MouseEvent): void => {
        if (e.target === overlayRef.current) onClose()
    }

    const copyMessage = (order: BuyOrder, index: number): void => {
        const message = `/w ${order.user.ingameName} Hi! I want to buy: ${itemName} for ${order.platinum} platinum. (warframe.market)`
        navigator.clipboard.writeText(message)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const statusColor = (status: string): string => {
        if (status === 'ingame') return '#4caf84'
        if (status === 'online') return '#5ac8fa'
        return '#7a7a8a'
    }

    return (
        <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="modal buyers-modal">
                <div className="modal-header">
                    <span className="modal-title">{itemName} — Top Buyers</span>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                {loading ? (
                    <div className="modal-loading">Loading buyers…</div>
                ) : orders.length === 0 ? (
                    <div className="modal-loading">No active buy orders found.</div>
                ) : (
                    <div className="buyers-body">
                        <div className="buyers-hint">
                            Click copy to send a trade message in-game
                        </div>
                        <table className="buyers-table">
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Status</th>
                                    <th>Offering</th>
                                    <th>Rank</th>
                                    <th>Rep</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, i) => (
                                    <tr key={i} className="buyer-row">
                                        <td className="buyer-name">{order.user.ingameName}</td>
                                        <td>
                                            <span
                                                className="buyer-status"
                                                style={{ color: statusColor(order.user.status) }}
                                            >
                                                ● {order.user.status}
                                            </span>
                                        </td>
                                        <td className="buyer-plat">⬡ {order.platinum}</td>
                                        <td className="buyer-rank">
                                            {order.rank !== '' && order.rank !== undefined ? order.rank : '—'}
                                        </td>
                                        <td className="buyer-rep">{order.user.reputation}</td>
                                        <td>
                                            <button
                                                className={`btn-copy ${copiedIndex === i ? 'copied' : ''}`}
                                                onClick={() => copyMessage(order, i)}
                                                title="Copy trade message"
                                            >
                                                {copiedIndex === i ? '✓ Copied!' : '📋 Copy'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="buyers-format">
                            <span className="format-label">FORMAT:</span>
                            <span className="format-text">
                                /w [player] Hi! I want to buy: {itemName} for [plat] platinum. (warframe.market)
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}