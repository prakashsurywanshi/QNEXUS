import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function TopLoadingBar() {
    const [progress, setProgress] = useState<number | null>(null);

    useEffect(() => {
        let value = 0;
        let raf = 0;

        const start = () => {
            setProgress(8);
            value = 8;
            const tick = () => {
                value = Math.min(value + (100 - value) * 0.08, 90);
                setProgress(value);
                raf = requestAnimationFrame(tick);
            };
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(tick);
        };

        const finish = () => {
            cancelAnimationFrame(raf);
            setProgress(100);
            setTimeout(() => setProgress(null), 200);
        };

        const unsubscribeStart = router.on('start', start);
        const unsubscribeFinish = router.on('finish', finish);

        return () => {
            cancelAnimationFrame(raf);
            unsubscribeStart();
            unsubscribeFinish();
        };
    }, []);

    if (progress === null) return null;

    return (
        <div className="fixed top-0 left-0 z-[100] h-0.5 w-full bg-transparent">
            <div
                className="h-full bg-primary transition-[width] duration-200 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
