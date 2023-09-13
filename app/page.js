import Navigation from "../components/navigation";
import { navigationItems } from "../data/navigation-items"; // see data formatting


export default function Home() {
    return (
        <main className="min-h-screen flex-col items-center justify-between p-24">
            <div className="w-96 m-auto">
                <Navigation menus={navigationItems} />
            </div>
        </main>
    );
}
