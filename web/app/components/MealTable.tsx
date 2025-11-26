'use client';
import {useEffect, useState} from 'react';
import apiClient from '@/api/apiClient';
import {API_ENDPOINTS} from '@/constants/api';
import './MealTable.css';

interface Meal {
    id?: number;
    name: string;
    category: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
    goal: 'LOSE_WEIGHT' | 'GAIN_MUSCLE' | 'MAINTAIN';
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    description?: string;
    url?: string;
}

export default function MealTable() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [filtered, setFiltered] = useState<Meal[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
    const [form, setForm] = useState<Meal>({
        name: '',
        category: 'BREAKFAST',
        goal: 'LOSE_WEIGHT',
        calories: 0,
    });

    // Load meals
    const loadMeals = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(API_ENDPOINTS.MEALS.ADMIN);
            setMeals(res.data);
            setFiltered(res.data);
        } catch (err) {
            console.error('Lỗi tải danh sách bữa ăn:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMeals();
    }, []);

    // Search
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

    // Delete
    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa bữa ăn này?')) return;
        await apiClient.delete(`${API_ENDPOINTS.MEALS.ADMIN}/${id}`);
        await loadMeals();
    };

    // Open modal
    const openModal = (meal?: Meal) => {
        if (meal) {
            setEditingMeal(meal);
            setForm(meal);
        } else {
            setEditingMeal(null);
            setForm({
                name: '',
                category: 'BREAKFAST',
                goal: 'LOSE_WEIGHT',
                calories: 0,
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingMeal(null);
    };

    // Submit form
    const handleSubmit = async () => {
        try {
            if (!form.name.trim()) {
                alert('Tên bữa ăn không được để trống');
                return;
            }
            if (editingMeal) {
                await apiClient.patch(`${API_ENDPOINTS.MEALS.ADMIN}/${editingMeal.id}`, form);
            } else {
                await apiClient.post(API_ENDPOINTS.MEALS.ADMIN, form);
            }
            await loadMeals();
            closeModal();
        } catch (err) {
            console.error('Lỗi lưu dữ liệu:', err);
            alert('Không thể lưu bữa ăn');
        }
    };

    return (
        <div className="meal-table-wrapper">
            {/* ===== Toolbar ===== */}
            <div className="meal-toolbar">
                <div className="toolbar-left">
                    <h2>🍱 Quản Lý Bữa Ăn</h2>
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc loại bữa ăn..."
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                <button className="add-btn" onClick={() => openModal()}>
                    + Thêm Bữa Ăn
                </button>
            </div>

            {/* ===== Table ===== */}
            {loading ? (
                <div className="loading">Đang tải dữ liệu...</div>
            ) : (
                <div className="meal-table-container">
                    <table className="meal-table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên Bữa Ăn</th>
                            <th>Hình Ảnh</th>
                            <th>Loại Bữa</th>
                            <th>Mục Tiêu</th>
                            <th>Calo</th>
                            <th>Protein</th>
                            <th>Carbs</th>
                            <th>Fat</th>
                            <th>Mô Tả</th>
                            <th>Hành Động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="no-data text-center">
                                    Không tìm thấy dữ liệu.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((m, idx) => (
                                <tr key={m.id}>
                                    <td>{idx + 1}</td>
                                    <td>{m.name}</td>
                                    <td>
                                        {m.url ? (
                                            <img
                                                src={m.url}
                                                alt={m.name}
                                                className="meal-thumb"
                                                onClick={() => setPreviewImage(m.url!)}
                                            />
                                        ) : (
                                            <span className="no-image">—</span>
                                        )}
                                    </td>

                                    {/* Category */}
                                    <td>
                                        {m.category === 'BREAKFAST'
                                            ? 'Bữa sáng'
                                            : m.category === 'LUNCH'
                                                ? 'Bữa trưa'
                                                : m.category === 'DINNER'
                                                    ? 'Bữa tối'
                                                    : 'Ăn nhẹ'}
                                    </td>

                                    {/* Goal */}
                                    <td>
                                        {m.goal === 'LOSE_WEIGHT'
                                            ? 'Giảm cân'
                                            : m.goal === 'GAIN_MUSCLE'
                                                ? 'Tăng cơ'
                                                : 'Duy trì'}
                                    </td>

                                    <td>{m.calories}</td>
                                    <td>{m.protein ?? '-'}</td>
                                    <td>{m.carbs ?? '-'}</td>
                                    <td>{m.fat ?? '-'}</td>
                                    <td>{m.description?.slice(0, 40) ?? '—'}</td>

                                    <td>
                                        <button className="edit-btn" onClick={() => openModal(m)}>
                                            Sửa
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(m.id!)}>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ===== Modal ===== */}
            {showModal && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingMeal ? '✏️ Chỉnh Sửa Bữa Ăn' : '➕ Thêm Bữa Ăn Mới'}</h3>

                        <div className="form-group">
                            <label>Tên bữa ăn</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Loại bữa</label>
                            <select
                                value={form.category}
                                onChange={(e) =>
                                    setForm({...form, category: e.target.value as Meal['category']})
                                }
                            >
                                <option value="BREAKFAST">Bữa sáng</option>
                                <option value="LUNCH">Bữa trưa</option>
                                <option value="DINNER">Bữa tối</option>
                                <option value="SNACK">Ăn nhẹ</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Mục tiêu</label>
                            <select
                                value={form.goal}
                                onChange={(e) =>
                                    setForm({...form, goal: e.target.value as Meal['goal']})
                                }
                            >
                                <option value="LOSE_WEIGHT">Giảm cân</option>
                                <option value="GAIN_MUSCLE">Tăng cơ</option>
                                <option value="MAINTAIN">Duy trì</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Calo</label>
                            <input
                                type="number"
                                value={form.calories}
                                onChange={(e) => setForm({...form, calories: Number(e.target.value)})}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Protein (g)</label>
                                <input
                                    type="number"
                                    value={form.protein ?? ''}
                                    onChange={(e) => setForm({...form, protein: Number(e.target.value)})}
                                />
                            </div>

                            <div className="form-group">
                                <label>Carbs (g)</label>
                                <input
                                    type="number"
                                    value={form.carbs ?? ''}
                                    onChange={(e) => setForm({...form, carbs: Number(e.target.value)})}
                                />
                            </div>

                            <div className="form-group">
                                <label>Fat (g)</label>
                                <input
                                    type="number"
                                    value={form.fat ?? ''}
                                    onChange={(e) => setForm({...form, fat: Number(e.target.value)})}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Mô tả</label>
                            <textarea
                                value={form.description ?? ''}
                                onChange={(e) => setForm({...form, description: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>URL hình ảnh</label>
                            <input
                                type="text"
                                value={form.url ?? ''}
                                onChange={(e) => setForm({...form, url: e.target.value})}
                                placeholder="https://example.com/meal.jpg"
                            />
                            {form.url && (
                                <img src={form.url} alt="preview" className="meal-preview"/>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button onClick={handleSubmit} className="save-btn">
                                {editingMeal ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                            <button onClick={closeModal} className="cancel-btn">
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview */}
            {previewImage && (
                <div className="image-preview-backdrop" onClick={() => setPreviewImage(null)}>
                    <img src={previewImage} alt="Preview" className="image-preview"/>
                </div>
            )}

        </div>
    );
}
