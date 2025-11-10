'use client';
import {useEffect, useState} from 'react';
import apiClient from '@/api/apiClient';
import {API_ENDPOINTS} from '@/constants/api';
import './UserTable.css';

interface User {
    id: number;
    fullName: string;
    email: string;
    role: string;
    isActive: boolean;
    gender?: string;
    age?: number;
    heightCm?: number;
    weightKg?: number;
    bmi?: number;
    goal?: string;
    activityLevel?: string;
    targetWeightKg?: number;
    createdAt?: string;
    updatedAt?: string;
}

export default function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(API_ENDPOINTS.USERS.BASE);
            setUsers(res.data);
        } catch (err) {
            console.error('Error loading users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <div className="user-table-container">
            <div className="toolbar">
                <h2>👤 User Management</h2>
            </div>

            {loading ? (
                <div className="loading">Loading users...</div>
            ) : (
                <table className="user-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Gender</th>
                        <th>Age</th>
                        <th>Height (cm)</th>
                        <th>Weight (kg)</th>
                        <th>BMI</th>
                        <th>Goal</th>
                        <th>Activity</th>
                        <th>Target Weight</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Created</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={14} className="no-data">
                                No users found.
                            </td>
                        </tr>
                    ) : (
                        users.map((u, idx) => (
                            <tr key={u.id}>
                                <td>{idx + 1}</td>
                                <td>{u.fullName}</td>
                                <td>{u.email}</td>
                                <td>{u.gender ?? '—'}</td>
                                <td>{u.age ?? '—'}</td>
                                <td>{u.heightCm ?? '—'}</td>
                                <td>{u.weightKg ?? '—'}</td>
                                <td>{u.bmi ? u.bmi.toFixed(2) : '—'}</td>
                                <td>{u.goal ?? '—'}</td>
                                <td>{u.activityLevel ?? '—'}</td>
                                <td>{u.targetWeightKg ?? '—'}</td>
                                <td>
                    <span
                        className={`role-badge ${String(u.role)
                            .toLowerCase()
                            .replace(/\W/g, '')}`}
                    >
                      {u.role}
                    </span>
                                </td>
                                <td>
                    <span
                        className={
                            u.isActive ? 'status-active' : 'status-inactive'
                        }
                    >
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                                </td>
                                <td>
                                    {u.createdAt
                                        ? new Date(u.createdAt).toLocaleDateString()
                                        : '—'}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
