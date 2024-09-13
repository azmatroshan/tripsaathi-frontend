import React, { useEffect, useRef, useState } from 'react';
import Footer from "./Footer";

type LayoutProps = {
    childHeader: React.ReactNode;
    childBody: React.ReactNode;
};

export default function Layout({ childHeader, childBody }: LayoutProps) {
    const [mainHeight, setMainHeight] = useState('auto');
    const headerRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateMainHeight = () => {
            const headerHeight = headerRef.current?.offsetHeight || 0;
            const footerHeight = footerRef.current?.offsetHeight || 0;
            const windowHeight = window.innerHeight;
            const newMainHeight = windowHeight - headerHeight - footerHeight;
            setMainHeight(`${newMainHeight}px`);
        };

        updateMainHeight();
        window.addEventListener('resize', updateMainHeight);

        return () => {
            window.removeEventListener('resize', updateMainHeight);
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header ref={headerRef} className="z-10 sticky top-0">
                {childHeader}
            </header>
            <main style={{ minHeight: mainHeight }} className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow-md rounded-lg p-6 h-full">
                    {childBody}
                </div>
            </main>
            <footer ref={footerRef}>
                <Footer />
            </footer>
        </div>
    );
}