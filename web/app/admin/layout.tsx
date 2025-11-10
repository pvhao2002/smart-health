'use client';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar, AdminHeader } from '../components';
import '../globals.css';
import './admin.css';

export default function SmartHealthAdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) router.push('/login');
    }, [router]);

    return (
        <div className="smarthealth-admin-layout">
            <AdminSidebar />
            <div className="smarthealth-admin-main">
                <AdminHeader />
                <div className="smarthealth-admin-content">{children}</div>
            </div>
        </div>
    );
}
