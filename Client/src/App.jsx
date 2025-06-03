import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeLayout from "./layout/HomeLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route element={<HomeLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
            </Routes>
        </Router>
    );
}
