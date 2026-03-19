import { useEffect, useState, useRef } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { slug } from '../factions'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Order {
    type: 'buy' | 'sell'
    platinum: number
    rank: number
    user: { ingameName: string; status: string }
}

interface StatsModalProps {
    itemName: string
    onClose: () => void
}

interface Stats {
    topBuyer: string
    topBuyPrice: number
    lowestSell: number
    spread: number
    totalBuyers: number
    totalSellers: number
}

export default function StatsModal({ itemName, onClose }: StatsModalProps): React.JSX.Element {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const overlayRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setLoading(true)
        window.api.fetchItemOrders(slug(itemName)).then((data) => {
            setOrders(data as Order[])
            setLoading(false)
        })
    }, [itemName])

    // Click outside to close
    const handleOverlayClick = (e: React.MouseEvent): void => {
        if (e.target === overlayRef.current) onClose()
    }

    const buyOrders = orders.filter(o => o.type === 'buy')
    const sellOrders = orders.filter(o => o.type === 'sell')

    // Summary stats
    const stats: Stats | null = buyOrders.length > 0 || sellOrders.length > 0 ? {
        topBuyer: buyOrders[0]?.user.ingameName ?? '—',
        topBuyPrice: buyOrders.length > 0 ? Math.max(...buyOrders.map(o => o.platinum)) : 0,
        lowestSell: sellOrders.length > 0 ? Math.min(...sellOrders.map(o => o.platinum)) : 0,
        spread: sellOrders.length > 0 && buyOrders.length > 0
            ? Math.min(...sellOrders.map(o => o.platinum)) - Math.max(...buyOrders.map(o => o.platinum))
            : 0,
        totalBuyers: buyOrders.length,
        totalSellers: sellOrders.length
    } : null

    // Price histogram helper
    const buildPriceHistogram = (orderList: Order[]): { labels: string[], counts: number[] } => {
        const freq: Record<number, number> = {}
        orderList.forEach(o => { freq[o.platinum] = (freq[o.platinum] ?? 0) + 1 })
        const sorted = Object.keys(freq).map(Number).sort((a, b) => a - b)
        return {
            labels: sorted.map(p => `${p}⬡`),
            counts: sorted.map(p => freq[p])
        }
    }

    // Rank distribution helper
    const buildRankChart = (orderList: Order[]): { labels: string[], counts: number[] } => {
        const freq: Record<number, number> = {}
        orderList.forEach(o => { freq[o.rank] = (freq[o.rank] ?? 0) + 1 })
        const sorted = Object.keys(freq).map(Number).sort((a, b) => a - b)
        return {
            labels: sorted.map(r => `Rank ${r}`),
            counts: sorted.map(r => freq[r])
        }
    }

    const buyHist = buildPriceHistogram(buyOrders)
    const sellHist = buildPriceHistogram(sellOrders)
    const rankDist = buildRankChart([...buyOrders, ...sellOrders])

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.raw} orders` } }
        },
        scales: {
            x: { ticks: { color: '#7a7a8a' }, grid: { color: '#2a2d3a' } },
            y: { ticks: { color: '#7a7a8a', stepSize: 1 }, grid: { color: '#2a2d3a' } }
        }
    }

    return (
        <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="modal">
                <div className="modal-header">
                    <span className="modal-title">{itemName}</span>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                {loading ? (
                    <div className="modal-loading">Loading orders…</div>
                ) : !stats ? (
                    <div className="modal-loading">No order data available.</div>
                ) : (
                    <div className="modal-body">
                        {/* Summary Stats */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-label">TOP BUY PRICE</div>
                                <div className="stat-value accent">⬡ {stats.topBuyPrice}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">LOWEST SELL</div>
                                <div className="stat-value accent">⬡ {stats.lowestSell || '—'}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">SPREAD</div>
                                <div className="stat-value">{stats.spread > 0 ? `⬡ ${stats.spread}` : '—'}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">ACTIVE BUYERS</div>
                                <div className="stat-value accent2">{stats.totalBuyers}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">ACTIVE SELLERS</div>
                                <div className="stat-value accent2">{stats.totalSellers}</div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-label">TOP BUYER</div>
                                <div className="stat-value muted">{stats.topBuyer}</div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="charts-grid">
                            {buyHist.labels.length > 0 && (
                                <div className="chart-card">
                                    <div className="chart-title">BUY ORDER PRICES</div>
                                    <Bar
                                        data={{
                                            labels: buyHist.labels,
                                            datasets: [{
                                                data: buyHist.counts,
                                                backgroundColor: '#c89b3c88',
                                                borderColor: '#c89b3c',
                                                borderWidth: 1
                                            }]
                                        }}
                                        options={chartOptions}
                                    />
                                </div>
                            )}
                            {sellHist.labels.length > 0 && (
                                <div className="chart-card">
                                    <div className="chart-title">SELL ORDER PRICES</div>
                                    <Bar
                                        data={{
                                            labels: sellHist.labels,
                                            datasets: [{
                                                data: sellHist.counts,
                                                backgroundColor: '#5ac8fa44',
                                                borderColor: '#5ac8fa',
                                                borderWidth: 1
                                            }]
                                        }}
                                        options={chartOptions}
                                    />
                                </div>
                            )}
                            {rankDist.labels.length > 0 && (
                                <div className="chart-card">
                                    <div className="chart-title">RANK DISTRIBUTION</div>
                                    <Bar
                                        data={{
                                            labels: rankDist.labels,
                                            datasets: [{
                                                data: rankDist.counts,
                                                backgroundColor: '#4caf8444',
                                                borderColor: '#4caf84',
                                                borderWidth: 1
                                            }]
                                        }}
                                        options={chartOptions}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}