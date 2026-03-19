interface StatusBarProps {
    message: string
}

export default function StatusBar({ message }: StatusBarProps): React.JSX.Element {
    return (
        <div className="status-bar">{message}</div>
    )
}