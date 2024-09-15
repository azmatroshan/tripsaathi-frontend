import React from 'react';
import Footer from "./Footer";

type LayoutProps = {
    childHeader: React.ReactNode;
    childBody: React.ReactNode;
};

export default function Layout({ childHeader, childBody }: LayoutProps) {
    

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="z-10 sticky top-0">
                {childHeader}
            </header>
            <main className="flex-grow container mx-auto lg:pl-20 lg:pr-20 sm:pl-8 sm:pr-8 pt-8 pb-8">
                {childBody}
            </main>
            <Footer />
        </div>
    );
}