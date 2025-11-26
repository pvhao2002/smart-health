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

const genderMap: Record<string, string> = {
    MALE: "Nam",
    FEMALE: "Nữ",
    OTHER: "Khác"
};

const goalMap: Record<string, string> = {
    LOSE_WEIGHT: "Giảm cân",
    MAINTAIN: "Duy trì cân nặng",
    GAIN_MUSCLE: "Tăng cơ",
};

const activityMap: Record<string, string> = {
    SEDENTARY: "Ít vận động",
    LIGHT: "Vận động nhẹ",
    MODERATE: "Vận động vừa",
    ACTIVE: "Vận động nhiều",
    VERY_ACTIVE: "Rất năng động",
};

const roleMap: Record<string, string> = {
    ADMIN: "Quản trị viên",
    USER: "Người dùng",
};

export default function UserTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(API_ENDPOINTS.USERS.BASE);
            setUsers(res.data);
        } catch (err) {
            console.error('Lỗi khi tải danh sách người dùng:', err);
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
                <h2>👤 Quản Lý Người Dùng</h2>
            </div>

            {loading ? (
                <div className="loading">Đang tải danh sách...</div>
            ) : (
                <table className="user-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Họ và Tên</th>
                        <th>Email</th>
                        <th>Giới tính</th>
                        <th>Tuổi</th>
                        <th>Chiều cao (cm)</th>
                        <th>Cân nặng (kg)</th>
                        <th>BMI</th>
                        <th>Mục tiêu</th>
                        <th>Mức độ hoạt động</th>
                        <th>Cân nặng mục tiêu</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={14} className="no-data">
                                Không có người dùng nào.
                            </td>
                        </tr>
                    ) : (
                        users.map((u, idx) => (
                            <tr key={u.id}>
                                <td>{idx + 1}</td>
                                <td>{u.fullName}</td>
                                <td>{u.email}</td>
                                {/* Gender */}
                                <td>{u.gender ? genderMap[u.gender] ?? u.gender : '—'}</td>
                                <td>{u.age ?? '—'}</td>
                                <td>{u.heightCm ?? '—'}</td>
                                <td>{u.weightKg ?? '—'}</td>
                                <td>{u.bmi ? u.bmi.toFixed(2) : '—'}</td>
                                {/* Goal */}
                                <td>{u.goal ? goalMap[u.goal] ?? u.goal : '—'}</td>
                                {/* Activity */}
                                <td>{u.activityLevel ? activityMap[u.activityLevel] ?? u.activityLevel : '—'}</td>

                                <td>{u.targetWeightKg ?? '—'}</td>
                                {/* Role */}
                                <td>
                                    <span className={`role-badge ${u.role.toLowerCase()}`}>
                                        {roleMap[u.role] ?? u.role}
                                    </span>
                                </td>
                                <td>
                                    <span
                                        className={
                                            u.isActive ? 'status-active' : 'status-inactive'
                                        }
                                    >
                                        {u.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                    </span>
                                </td>
                                <td>
                                    {u.createdAt
                                        ? new Date(u.createdAt).toLocaleDateString('vi-VN')
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
