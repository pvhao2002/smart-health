'use client';
import {useEffect, useState} from 'react';
import apiClient from '@/api/apiClient';
import {API_ENDPOINTS} from '@/constants/api';
import './WorkoutScheduleTable.css';

interface WorkoutType {
    id: number;
    name: string;
    level?: string;
    caloriesPerMinute?: number;
}

interface WorkoutSchedule {
    id?: number;
    name: string;
    goal: 'LOSE_WEIGHT' | 'GAIN_WEIGHT' | 'MAINTAIN';
    dayOfWeek: string;
    workouts?: WorkoutType;
    isRestDay?: boolean;
    totalCalories?: number;
}

const DAYS = [
    'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY',
    'FRIDAY', 'SATURDAY', 'SUNDAY'
];

export default function WorkoutScheduleTable() {
    const [schedules, setSchedules] = useState<WorkoutSchedule[]>([]);
    const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<WorkoutSchedule | null>(null);
    const [form, setForm] = useState<WorkoutSchedule>({
        name: '',
        goal: 'LOSE_WEIGHT',
        dayOfWeek: 'MONDAY',
        isRestDay: false,
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const [workoutRes, planRes] = await Promise.all([
                apiClient.get(API_ENDPOINTS.WORKOUTS.ADMIN),
                apiClient.get('/admin/plans/workouts'),
            ]);
            setWorkouts(workoutRes.data);
            setSchedules(planRes.data);
        } catch (e) {
            console.error('Lỗi tải dữ liệu kế hoạch tập luyện', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openModal = (p?: WorkoutSchedule) => {
        if (p) {
            setEditingSchedule(p);
            setForm({...p, workouts: p.workouts});
        } else {
            setEditingSchedule(null);
            setForm({name: '', goal: 'LOSE_WEIGHT', dayOfWeek: 'MONDAY', isRestDay: false});
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSchedule(null);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...form,
                workout: form.workouts,
            };
            if (editingSchedule?.id) {
                await apiClient.patch(`/admin/plans/workouts/${editingSchedule.id}`, payload);
            } else {
                await apiClient.post('/admin/plans/workouts', payload);
            }
            await loadData();
            closeModal();
        } catch (err) {
            console.error('Lỗi lưu kế hoạch', err);
            alert('Không thể lưu kế hoạch tập luyện');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa kế hoạch này?')) return;
        await apiClient.delete(`/admin/plans/workouts/${id}`);
        await loadData();
    };

    // Map ngày sang tiếng Việt
    const DAY_LABELS: Record<string, string> = {
        MONDAY: 'Thứ 2',
        TUESDAY: 'Thứ 3',
        WEDNESDAY: 'Thứ 4',
        THURSDAY: 'Thứ 5',
        FRIDAY: 'Thứ 6',
        SATURDAY: 'Thứ 7',
        SUNDAY: 'Chủ nhật'
    };

    const GOAL_LABELS: Record<string, string> = {
        LOSE_WEIGHT: 'Giảm cân',
        GAIN_WEIGHT: 'Tăng cân',
        MAINTAIN: 'Duy trì'
    };

    return (
        <div className="workoutplan-wrapper">
            <div className="workoutplan-toolbar">
                <h2>🏋️ Kế Hoạch Tập Luyện 7 Ngày</h2>
                <button className="add-btn" onClick={() => openModal()}>
                    + Thêm Kế Hoạch
                </button>
            </div>

            {loading ? (
                <div className="loading">Đang tải...</div>
            ) : (
                <table className="workoutplan-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Ngày</th>
                        <th>Kế hoạch tập luyện</th>
                        <th>Mục tiêu</th>
                        <th>Tổng calo (ước tính)</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>

                    <tbody>
                    {DAYS.map((day, i) => {
                        const dailyPlans = schedules.filter(p => p.dayOfWeek === day);
                        const totalCalories = dailyPlans.reduce((sum, p) =>
                            sum + (p.workouts?.caloriesPerMinute ?? 0), 0);

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

                                                    {p.isRestDay ? (
                                                        <div className="plan-rest">💤 Nghỉ ngơi</div>
                                                    ) : (
                                                        <>
                                                            <div className="plan-workouts">
                                                                {p.workouts
                                                                    ? <span className="workout-chip">{p.workouts.name}</span>
                                                                    : <span>—</span>}
                                                            </div>

                                                            <div className="plan-totals">
                                                                <strong>{Math.round(p?.workouts?.caloriesPerMinute ?? 0)} kcal</strong>
                                                            </div>
                                                        </>
                                                    )}

                                                    <div className="plan-actions-inline">
                                                        <button className="edit-btn" onClick={() => openModal(p)}>Sửa</button>
                                                        <button className="delete-btn" onClick={() => handleDelete(p.id!)}>
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
                                    {dailyPlans.length > 0 ? `${Math.round(totalCalories)} kcal` : '—'}
                                </td>

                                <td>
                                    <button
                                        className="add-btn small"
                                        onClick={() => openModal({
                                            dayOfWeek: day,
                                            name: '',
                                            goal: 'LOSE_WEIGHT',
                                            isRestDay: false
                                        })}
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

            {/* ===== Modal ===== */}
            {showModal && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingSchedule?.id ? '✏️ Chỉnh Sửa Kế Hoạch' : '➕ Thêm Kế Hoạch'}</h3>

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
                                    <option key={d} value={d}>
                                        {DAY_LABELS[d]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Mục tiêu</label>
                            <select
                                value={form.goal}
                                onChange={(e) => setForm({...form, goal: e.target.value as WorkoutSchedule['goal']})}
                            >
                                <option value="LOSE_WEIGHT">Giảm cân</option>
                                <option value="GAIN_WEIGHT">Tăng cân</option>
                                <option value="MAINTAIN">Duy trì</option>
                            </select>
                        </div>

                        <div className="form-group checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={form.isRestDay}
                                    onChange={(e) => setForm({...form, isRestDay: e.target.checked})}
                                />
                                Ngày nghỉ
                            </label>
                        </div>

                        {!form.isRestDay && (
                            <div className="form-group">
                                <label>Bài tập</label>
                                <select
                                    value={form.workouts?.id ? String(form.workouts.id) : ''}
                                    onChange={(e) => {
                                        const selectedId = Number(e.target.value);
                                        const selectedWorkout = workouts.find((w) => w.id === selectedId);
                                        setForm({...form, workouts: selectedWorkout});
                                    }}
                                >
                                    <option value="">— Chọn bài tập —</option>
                                    {workouts.map((w) => (
                                        <option key={w.id} value={String(w.id)}>
                                            {w.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button onClick={handleSubmit} className="save-btn">
                                {editingSchedule ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                            <button onClick={closeModal} className="cancel-btn">Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
