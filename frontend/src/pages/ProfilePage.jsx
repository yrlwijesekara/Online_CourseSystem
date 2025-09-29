import React, { useEffect, useState } from "react";
import api from "../api.js";
import { StudentProfile } from "../components/StudentProfile.jsx";
import { InstructorProfile } from "../components/InstructorProfile.jsx";
import { Badge } from "../components/ProfileUI/badge.jsx";
// import "../styles/globals.css";
import Navbar from "../components/NavBar.jsx";

export default function UserProfile({navigateTo}) {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log("Fetching user data...");
                const res = await api.get("/auth/profile");
                setCurrentUser(res.data);
                console.log("User data fetched:", res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
    }, []);

    if (!currentUser) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
            <Navbar navigateTo={navigateTo} currentPage="user-profile" />
            <header className="border-b bg-white shadow-sm">

            </header>

            <main className="container mx-auto max-w-7xl px-6 py-10">
                <div className="rounded-2xl bg-white shadow-lg p-8">
                    {currentUser.role === "STUDENT" ? (
                        <StudentProfile userData={currentUser} />
                    ) : (
                        <InstructorProfile userData={currentUser} />
                    )}
                </div>
            </main>
        </div>
    );
}