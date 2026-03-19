interface ProgressBarProps {
    current: number
    total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps): React.JSX.Element {
    const pct = total > 0 ? (current / total) * 100 : 0
    return (
        <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
    )
}