import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AdminPage from "./photography-service/admin/AdminPage.tsx";
import LoginPage from "./photography-service/admin/LoginPage.tsx";
import PrivateRoute from "./photography-service/admin/PrivateRoute.tsx";
import Home from "./Home.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/admin"
                    element={
                        <PrivateRoute>
                            <AdminPage />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<App />} />
            </Routes>
        </BrowserRouter>
    )
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
