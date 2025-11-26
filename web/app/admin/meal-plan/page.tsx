'use client';
import {useEffect, useState} from 'react';
import apiClient from '@/api/apiClient';
import {API_ENDPOINTS} from '@/constants/api';
import './MealPlanTable.css';

type MealKey = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface Meal {
    id: number;
    name: string;
}

interface MealPlan {
    id?: number;
    name: string;
    goal: 'LOSE_WEIGHT' | 'GAIN_WEIGHT' | 'MAINTAIN';
    dayOfWeek: string;
    breakfast?: Meal;
    lunch?: Meal;
    dinner?: Meal;
    snack?: Meal;
    totalCalories?: number;
    totalProtein?: number;
    totalCarbs?: number;
    totalFat?: number;
}

const DAYS = [
    'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY',
    'FRIDAY', 'SATURDAY', 'SUNDAY'
];

// Map ngày sang tiếng Việt
const DAY_LABELS: Record<string, string> = {
    MONDAY: 'Thứ 2',
    TUESDAY: 'Thứ 3',
    WEDNESDAY: 'Thứ 4',
    THURSDAY: 'Thứ 5',
    FRIDAY: 'Thứ 6',
    SATURDAY: 'Thứ 7',
    SUNDAY: 'Chủ nhật',
};

const GOAL_LABELS: Record<string, string> = {
    LOSE_WEIGHT: 'Giảm cân',
    GAIN_WEIGHT: 'Tăng cân',
    MAINTAIN: 'Duy trì'
};

const MEAL_LABELS: Record<MealKey, string> = {
    breakfast: 'Bữa sáng',
    lunch: 'Bữa trưa',
    dinner: 'Bữa tối',
    snack: 'Ăn nhẹ',
};

export default function MealPlanTable() {
    const [plans, setPlans] = useState<MealPlan[]>([]);
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null);

    const [form, setForm] = useState<MealPlan>({
        name: '',
        goal: 'LOSE_WEIGHT',
        dayOfWeek: 'MONDAY',
    });

    // Load data
    const loadData = async () => {
        setLoading(true);
        try {
            const [mealRes, planRes] = await Promise.all([
                apiClient.get(API_ENDPOINTS.MEALS.ADMIN),
                apiClient.get('/admin/plans/meals'),
            ]);
            setMeals(mealRes.data);
            setPlans(planRes.data);
        } catch (e) {
            console.error('Lỗi tải kế hoạch bữa ăn', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openModal = (p?: MealPlan) => {
        if (p) {
            setEditingPlan(p);
            setForm({...p});
        } else {
            setEditingPlan(null);
            setForm({name: '', goal: 'LOSE_WEIGHT', dayOfWeek: 'MONDAY'});
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPlan(null);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...form,
                breakfastId: form.breakfast?.id,
                lunchId: form.lunch?.id,
                dinnerId: form.dinner?.id,
                snackId: form.snack?.id,
            };

            if (editingPlan?.id) {
                await apiClient.patch(`/admin/plans/meals/${editingPlan.id}`, payload);
            } else {
                await apiClient.post('/admin/plans/meals', payload);
            }

            await loadData();
            closeModal();
        } catch (err) {
            console.error('Lỗi lưu kế hoạch', err);
            alert('Không thể lưu kế hoạch bữa ăn');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa kế hoạch này?')) return;
        await apiClient.delete(`/admin/plans/meals/${id}`);
        await loadData();
    };

    return (
        <div className="mealplan-wrapper">
            <div className="mealplan-toolbar">
                <h2>🥗 Kế Hoạch Bữa Ăn Trong Tuần</h2>
                <button className="add-btn" onClick={() => openModal()}>
                    + Thêm Kế Hoạch
                </button>
            </div>

            {loading ? (
                <div className="loading">Đang tải...</div>
            ) : (
                <table className="mealplan-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Ngày</th>
                        <th>Kế hoạch bữa ăn</th>
                        <th>Mục tiêu</th>
                        <th>
                            Tổng (kcal / P / C / F)
                            <span className="info-icon">ℹ
                              <div className="info-popup">
                                <strong>Giải thích các chỉ số:</strong><br/>
                                • <b>P</b> = Protein (Chất đạm)<br/>
                                • <b>C</b> = Carbs (Tinh bột / chất bột đường)<br/>
                                • <b>F</b> = Fat (Chất béo)
                              </div>
                            </span>
                        </th>

                        <th>Hành động</th>
                    </tr>
                    </thead>

                    <tbody>
                    {DAYS.map((day, i) => {
                        const dailyPlans = plans.filter(p => p.dayOfWeek === day);

                        const totalCalories = dailyPlans.reduce((sum, p) => sum + (p.totalCalories ?? 0), 0);
                        const totalProtein = dailyPlans.reduce((sum, p) => sum + (p.totalProtein ?? 0), 0);
                        const totalCarbs = dailyPlans.reduce((sum, p) => sum + (p.totalCarbs ?? 0), 0);
                        const totalFat = dailyPlans.reduce((sum, p) => sum + (p.totalFat ?? 0), 0);

                        return (
                            <tr key={day}>
                                <td>{i + 1}</td>
                                <td>{DAY_LABELS[day]}</td>

                                <td>
                                    {dailyPlans.length === 0 ? (
                                        <span className="no-data">— Chưa có kế hoạch —</span>
                                    ) : (
                                        <div className="plan-list">
                                            {dailyPlans.map((p) => (
                                                <div key={p.id} className="plan-item">
                                                    <div className="plan-name">{p.name}</div>

                                                    <div className="plan-meals">
                                                        <span>🍳 {p.breakfast?.name ?? '—'}</span> ·
                                                        <span> 🍚 {p.lunch?.name ?? '—'}</span> ·
                                                        <span> 🍝 {p.dinner?.name ?? '—'}</span> ·
                                                        <span> 🍎 {p.snack?.name ?? '—'}</span>
                                                    </div>

                                                    <div className="plan-totals">
                                                        <strong>{Math.round(p.totalCalories ?? 0)} kcal</strong>{' '}
                                                        | P:{Math.round(p.totalProtein ?? 0)}g ·
                                                        C:{Math.round(p.totalCarbs ?? 0)}g ·
                                                        F:{Math.round(p.totalFat ?? 0)}g
                                                    </div>

                                                    <div className="plan-actions-inline">
                                                        <button className="edit-btn" onClick={() => openModal(p)}>Sửa
                                                        </button>
                                                        <button className="delete-btn"
                                                                onClick={() => handleDelete(p.id!)}>
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </td>

                                <td>
                                    {dailyPlans.length > 0
                                        ? [...new Set(dailyPlans.map(p => GOAL_LABELS[p.goal]))].join(', ')
                                        : '—'}
                                </td>

                                <td>
                                    {dailyPlans.length > 0 ? (
                                        <div className="day-total">
                                            <strong>{Math.round(totalCalories)} kcal</strong><br/>
                                            P:{Math.round(totalProtein)}g · C:{Math.round(totalCarbs)}g ·
                                            F:{Math.round(totalFat)}g
                                        </div>
                                    ) : '—'}
                                </td>

                                <td>
                                    <button
                                        className="add-btn small"
                                        onClick={() => openModal({dayOfWeek: day, name: '', goal: 'LOSE_WEIGHT'})}
                                    >
                                        + Thêm
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingPlan?.id ? '✏️ Chỉnh Sửa Kế Hoạch' : '➕ Thêm Kế Hoạch'}</h3>

                        <div className="form-group">
                            <label>Tên kế hoạch</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Ngày</label>
                            <select
                                value={form.dayOfWeek}
                                onChange={(e) => setForm({...form, dayOfWeek: e.target.value})}
                            >
                                {DAYS.map((d) => (
                                    <option key={d} value={d}>{DAY_LABELS[d]}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Mục tiêu</label>
                            <select
                                value={form.goal}
                                onChange={(e) => setForm({...form, goal: e.target.value as MealPlan['goal']})}
                            >
                                <option value="LOSE_WEIGHT">Giảm cân</option>
                                <option value="GAIN_WEIGHT">Tăng cân</option>
                                <option value="MAINTAIN">Duy trì</option>
                            </select>
                        </div>

                        {/* Danh sách bữa ăn */}
                        {(['breakfast', 'lunch', 'dinner', 'snack'] as MealKey[]).map((mealType) => (
                            <div className="form-group" key={mealType}>
                                <label>{MEAL_LABELS[mealType]}</label>
                                <select
                                    value={(form[mealType] as Meal | undefined)?.id ?? ''}
                                    onChange={(e) => {
                                        const m = meals.find((x) => x.id === Number(e.target.value));
                                        setForm({...form, [mealType]: m});
                                    }}
                                >
                                    <option value="">— Chọn —</option>
                                    {meals.map((m) => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                        ))}

                        <div className="modal-actions">
                            <button onClick={handleSubmit} className="save-btn">
                                {editingPlan ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                            <button type="button" onClick={closeModal} className="cancel-btn">Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
