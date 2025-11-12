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
            console.error('Error loading workout schedules', e);
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
            console.error('Save failed', err);
            alert('Failed to save workout plan');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this workout plan?')) return;
        await apiClient.delete(`/admin/plans/workouts/${id}`);
        await loadData();
    };

    return (
        <div className="workoutplan-wrapper">
            <div className="workoutplan-toolbar">
                <h2>🏋️ 7-Day Workout Plans</h2>
                <button className="add-btn" onClick={() => openModal()}>
                    + Add Workout Plan
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <table className="workoutplan-table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Day</th>
                        <th>Workout Plans</th>
                        <th>Goal</th>
                        <th>Total Calories (est.)</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {DAYS.map((day, i) => {
                        const dailyPlans = schedules.filter(p => p.dayOfWeek === day);
                        const totalCalories = dailyPlans.reduce((sum, p) => sum + (p.workouts?.caloriesPerMinute ?? 0), 0);

                        return (
                            <tr key={day}>
                                <td>{i + 1}</td>
                                <td>{day}</td>
                                <td>
                                    {dailyPlans.length === 0 ? (
                                        <span className="no-data">— No workout plans —</span>
                                    ) : (
                                        <div className="plan-list">
                                            {dailyPlans.map((p) => (
                                                <div key={p.id} className="plan-item">
                                                    <div className="plan-name">{p.name}</div>
                                                    {p.isRestDay ? (
                                                        <div className="plan-rest">💤 Rest Day</div>
                                                    ) : (
                                                        <>
                                                            <div className="plan-workouts">
                                                                {p.workouts
                                                                    ?
                                                                    <span key={p.workouts.id} className="workout-chip">
                                                                            {p.workouts.name}
                                                                        </span>
                                                                    : <span>—</span>}
                                                            </div>
                                                            <div className="plan-totals">
                                                                <strong>{Math.round(p?.workouts?.caloriesPerMinute ?? 0)} kcal</strong>
                                                            </div>
                                                        </>
                                                    )}
                                                    <div className="plan-actions-inline">
                                                        <button className="edit-btn" onClick={() => openModal(p)}>Edit
                                                        </button>
                                                        <button className="delete-btn"
                                                                onClick={() => handleDelete(p.id!)}>Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {dailyPlans.length > 0
                                        ? [...new Set(dailyPlans.map(p => p.goal))].join(', ')
                                        : '—'}
                                </td>
                                <td>{dailyPlans.length > 0 ? `${Math.round(totalCalories)} kcal` : '—'}</td>
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
                                        + Add
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}

            {showModal && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingSchedule?.id ? '✏️ Edit Workout Plan' : '➕ Add Workout Plan'}</h3>

                        <div className="form-group">
                            <label>Name</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Day of Week</label>
                            <select
                                value={form.dayOfWeek}
                                onChange={(e) => setForm({...form, dayOfWeek: e.target.value})}
                            >
                                {DAYS.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Goal</label>
                            <select
                                value={form.goal}
                                onChange={(e) => setForm({...form, goal: e.target.value as WorkoutSchedule['goal']})}
                            >
                                <option value="LOSE_WEIGHT">Lose Weight</option>
                                <option value="GAIN_MUSCLE">Gain Muscle</option>
                                <option value="MAINTAIN">Maintain</option>
                            </select>
                        </div>

                        <div className="form-group checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={form.isRestDay}
                                    onChange={(e) => setForm({...form, isRestDay: e.target.checked})}
                                /> Rest Day
                            </label>
                        </div>

                        {!form.isRestDay && (
                            <div className="form-group">
                                <label>Workout</label>
                                <select
                                    value={form.workouts?.id ? String(form.workouts.id) : ''}
                                    onChange={(e) => {
                                        const selectedId = Number(e.target.value);
                                        const selectedWorkout = workouts.find((w) => w.id === selectedId);
                                        setForm({...form, workouts: selectedWorkout});
                                    }}
                                >
                                    <option value="">— Select —</option>
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
                                {editingSchedule ? 'Update' : 'Add'}
                            </button>
                            <button onClick={closeModal} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
