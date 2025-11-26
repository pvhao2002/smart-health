'use client';
import {LogOut, Stethoscope} from 'lucide-react';
import {useRouter} from 'next/navigation';
import './AdminHeader.css';

export default function AdminHeader() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    return (
        <header className="smarthealth-header">
            <div className="header-left">
                <Stethoscope className="header-icon"/>
                <h2>Hệ Thống Quản Lý Sức Khỏe Thông Minh</h2>
            </div>
            <LogOut onClick={handleLogout} className="logout-icon"/>
        </header>
    );
}
