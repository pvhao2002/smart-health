'use client';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {Home, Users, UtensilsCrossed, Dumbbell} from 'lucide-react';
import './AdminSidebar.css';
import PageLoader from './PageLoader';

const menuItems = [
    {href: '/admin', label: 'Dashboard', icon: Home},
    {href: '/admin/users', label: 'Quản lý người dùng', icon: Users},
    {href: '/admin/meals', label: 'Quản lý món ăn', icon: UtensilsCrossed},
    {href: '/admin/workouts', label: 'Quản lý bài tập', icon: Dumbbell},
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setLoading(false), 100);
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
            {loading && <PageLoader/>}
            <aside className="admin-sidebar">
                <div className="sidebar-logo">
                    <span className="logo-text">SmartHealth</span>
                    <small>Admin Panel</small>
                </div>

                <nav>
                    <ul>
                        {menuItems.map(({href, label, icon: Icon}) => (
                            <li key={href} className={pathname === href ? 'active' : ''}>
                                <button
                                    className="menu-link"
                                    onClick={() => handleNavigate(href)}
                                >
                                    <Icon className="icon"/>
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
