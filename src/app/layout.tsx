import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Cadastre-se | PortalMix Supermercado",
    description: "PortalMix Supermercado. Cadastre-se e escolha como prefere fazer suas compras. Demonstração acadêmica de usabilidade.",
    robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="pt-BR">
            <body>{children}</body>
        </html>
    );
}
