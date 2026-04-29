


interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}
export function Button({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
    return (
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onClick}>
            {children}
        </button>
    )
}

export function ButtonPrimary({ onClick, children }: ButtonProps) {
    return (
        <button className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-md w-full" onClick={onClick}>
            {children}
        </button>
    )
}

export function ButtonSecondary({ onClick, children }: ButtonProps) {
    return (
        <button className="bg-secondary hover:bg-secondary-hover text-white font-bold py-2 px-4 rounded-md w-full" onClick={onClick}>
            {children}
        </button>
    )
}

export function ButtonDanger({ onClick, children }: ButtonProps) {
    return (
        <button className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-600/10 text-red-500 font-bold py-2 px-4 rounded-md w-full" onClick={onClick}>
            {children}
        </button>
    )
}