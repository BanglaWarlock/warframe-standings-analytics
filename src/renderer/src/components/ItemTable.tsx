import { useState } from 'react'
import { BuyOrder, ItemData } from '../types'
import { FACTIONS } from '../factions'
import StatsModal from './StatsModal'
import BuyersModal from './BuyersModal'

interface ItemTableProps {
    selectedFaction: string
    itemData: ItemData
}

export default function ItemTable({ selectedFaction, itemData }: ItemTableProps): React.JSX.Element {
    const [statsItem, setStatsItem] = useState<string | null>(null)
    const [buyersItem, setBuyersItem] = useState<string | null>(null)

    return (
        <>
            <div className="content-scroll">
                {Object.entries(FACTIONS[selectedFaction]).map(([npc, items]) => (
                    <div key={npc} className="npc-section">
                        <div className="npc-label">{npc.toUpperCase()}</div>
                        <table className="item-table">
                            <thead>
                                <tr>
                                    <th className="col-item">Item</th>
                                    <th className="col-plat">Top Buy (plat)</th>
                                    <th className="col-rank">Rank</th>
                                    <th className="col-buyer">Buyer</th>
                                    <th className="col-actions"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => {
                                    const orders = itemData[item]
                                    const top: BuyOrder | undefined = orders?.[0]
                                    return (
                                        <tr
                                            key={item}
                                            className="item-row clickable"
                                            onClick={() => setBuyersItem(item)}
                                            title="Click to view top buyers"
                                        >
                                            <td className="col-item">{item}</td>
                                            <td className="col-plat">
                                                {orders === undefined ? (
                                                    <span className="val-empty">—</span>
                                                ) : orders.length === 0 ? (
                                                    <span className="val-none">No orders</span>
                                                ) : (
                                                    <span className="val-plat">⬡ {top!.platinum}</span>
                                                )}
                                            </td>
                                            <td className="col-rank">
                                                {top ? (
                                                    <span className="val-rank">
                                                        {top.rank !== '' && top.rank !== undefined ? top.rank : '—'}
                                                    </span>
                                                ) : (
                                                    <span className="val-empty" />
                                                )}
                                            </td>
                                            <td className="col-buyer">
                                                {top ? (
                                                    <span className="val-buyer">{top.user.ingameName}</span>
                                                ) : null}
                                            </td>
                                            <td className="col-actions" onClick={e => e.stopPropagation()}>
                                                <button
                                                    className="btn-stats"
                                                    onClick={() => setStatsItem(item)}
                                                    title="View analytics"
                                                >
                                                    📊
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            {statsItem && (
                <StatsModal
                    itemName={statsItem}
                    onClose={() => setStatsItem(null)}
                />
            )}

            {buyersItem && (
                <BuyersModal
                    itemName={buyersItem}
                    onClose={() => setBuyersItem(null)}
                />
            )}
        </>
    )
}