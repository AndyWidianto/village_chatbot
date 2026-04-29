
interface LoadingProps {
    children: React.ReactNode[] | React.ReactNode;
    loading: boolean;
}
export default function Loading({ children, loading }: LoadingProps) {
    return !loading ? children : <div className="flex items-center justify-center gap-2">
        <div className="rounded-full h-6 w-6 border-3 border-gray-400 border-t-white animate-spin"></div>
        Processing
    </div>
}