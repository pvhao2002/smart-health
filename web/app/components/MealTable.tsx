'use client';
import {useEffect, useState} from 'react';
import apiClient from '@/api/apiClient';
import {API_ENDPOINTS} from '@/constants/api';
import './MealTable.css';

interface Meal {
    id: number;
    name: string;
    category: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
    goal: 'LOSE_WEIGHT' | 'GAIN_WEIGHT' | 'MAINTAIN';
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    description?: string;
    createdAt?: string;
}

export default function MealTable() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [filtered, setFiltered] = useState<Meal[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const loadMeals = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(API_ENDPOINTS.MEALS.ADMIN);
            setMeals(res.data);
            setFiltered(res.data);
        } catch (err) {
            console.error('Error loading meals:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMeals();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value.toLowerCase();
        setSearch(keyword);
        setFiltered(
            meals.filter(
                (m) =>
                    m.name.toLowerCase().includes(keyword) ||
                    m.category.toLowerCase().includes(keyword)
            )
        );
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this meal?')) return;
        await apiClient.delete(`${API_ENDPOINTS.MEALS.ADMIN}/${id}`);
        await loadMeals();
    };

    return (
        <div className="meal-table-wrapper">
            {/* ===== Toolbar ===== */}
            <div className="meal-toolbar">
                <div className="toolbar-left">
                    <h2>🍱 Meal Management</h2>
                    <input
                        type="text"
                        placeholder="Search meal or category..."
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                <button className="add-btn">+ Add Meal</button>
            </div>

            {/* ===== Table ===== */}
            {loading ? (
                <div className="loading">Loading meals...</div>
            ) : (
                <div className="meal-table-container">
                    <table className="meal-table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Meal Name</th>
                            <th>Category</th>
                            <th>Goal</th>
                            <th>Calories (kcal)</th>
                            <th>Protein (g)</th>
                            <th>Carbs (g)</th>
                            <th>Fat (g)</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="no-data text-center">
                                    No meals found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((m, idx) => (
                                <tr key={m.id}>
                                    <td>{idx + 1}</td>
                                    <td>{m.name}</td>
                                    <td>
                      <span className={`badge meal-${m.category.toLowerCase()}`}>
                        {m.category}
                      </span>
                                    </td>
                                    <td>
                      <span className={`badge goal-${m.goal.toLowerCase()}`}>
                        {m.goal}
                      </span>
                                    </td>
                                    <td>{m.calories}</td>
                                    <td>{m.protein ?? '-'}</td>
                                    <td>{m.carbs ?? '-'}</td>
                                    <td>{m.fat ?? '-'}</td>
                                    <td className="desc">
                                        {m.description ? m.description.slice(0, 40) + '...' : '—'}
                                    </td>
                                    <td>
                                        <button className="edit-btn">Edit</button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(m.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
