'use client';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {Activity, CalendarDays, ClipboardList, Home, Users} from 'lucide-react';
import './AdminSidebar.css';
import PageLoader from './PageLoader';

const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/appointments', label: 'Appointments', icon: CalendarDays },
    { href: '/admin/reports', label: 'Reports', icon: ClipboardList },
    { href: '/admin/analytics', label: 'Analytics', icon: Activity },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setLoading(false), 50);
        return () => clearTimeout(timeout);
    }, [pathname]);

    const handleNavigate = (href: string) => {
        if (href !== pathname) {
            setLoading(true);
            router.push(href);
        }
    };

    return (
        <>
            {loading && <PageLoader />}
            <aside className="smarthealth-sidebar">
                <div className="sidebar-logo">
                    <span className="logo-text">SmartHealth</span>
                    <small>Admin Panel</small>
                </div>

                <nav>
                    <ul>
                        {menuItems.map(({ href, label, icon: Icon }) => (
                            <li key={href} className={pathname === href ? 'active' : ''}>
                                <button className="menu-link" onClick={() => handleNavigate(href)}>
                                    <Icon className="icon" />
                                    <span>{label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
}
