import AppNavbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export function Layout() {
    return (
        <>
            <AppNavbar />
            <main>
                <Outlet />
            </main>
        </>
    )
}