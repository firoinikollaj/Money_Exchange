import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeLayout from "./layout/HomeLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminRoute from "./components/admin/AdminRoute.jsx"; // assuming location
import AddEditCurrency from "./components/admin/AddEditCurrency.jsx";
import AddEditUser from "./components/admin/AddEditUser.jsx";

import { Toaster } from 'react-hot-toast';


export default function App() {
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />

            <Router>
                <Routes>
                    <Route element={<HomeLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Admin-protected section */}
                        <Route element={<AdminRoute />}>
                            <Route path="/admin" element={<AdminPage />} />
                            <Route path="/admin/currencies/new" element={<AddEditCurrency />} />
                            <Route path="/admin/currencies/:currencyId" element={<AddEditCurrency />} />
                            <Route path="/admin/users/new" element={<AddEditUser />} />
                            <Route path="/admin/users/:userId" element={<AddEditUser />} />
                        </Route>
                    </Route>
                </Routes>

            </Router>
        </>
       
    );
}
