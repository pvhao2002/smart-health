'use client';
import {useEffect, useState} from 'react';
import apiClient from '@/api/apiClient';
import {API_ENDPOINTS} from '@/constants/api';
import './WorkoutScheduleTable.css';

interface WorkoutType {
    id: number;
    name: string;
    level: string;
}

interface WorkoutSchedule {
    id?: number;
    name: string;
    goal: 'LOSE_WEIGHT' | 'GAIN_WEIGHT' | 'MAINTAIN';
    dayOfWeek: string;
    workout?: WorkoutType;
    isRestDay?: boolean;
}

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

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
            const [workoutRes, schedRes] = await Promise.all([
                apiClient.get(API_ENDPOINTS.WORKOUTS.ADMIN),
                apiClient.get('/admin/plans/workouts'),
            ]);
            setWorkouts(workoutRes.data);
            setSchedules(schedRes.data);
        } catch (e) {
            console.error('Error loading workout schedules', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openModal = (s?: WorkoutSchedule) => {
        if (s) {
            setEditingSchedule(s);
            setForm(s);
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
            const payload = {...form, workoutId: form.workout?.id};
            if (editingSchedule) {
                await apiClient.patch(`/admin/plans/workouts/${editingSchedule.id}`, payload);
            } else {
                await apiClient.post('/admin/plans/workouts', payload);
            }
            await loadData();
            closeModal();
        } catch (e) {
            console.error('Error saving', e);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this schedule?')) return;
        await apiClient.delete(`/admin/plans/workouts/${id}`);
        await loadData();
    };

    return (
        <div className="workoutplan-wrapper">
            <div className="workoutplan-toolbar">
                <h2>🏋️ 7-Day Workout Schedule</h2>
                <button className="add-btn" onClick={() => openModal()}>
                    + Add Schedule
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
                        <th>Workout</th>
                        <th>Rest Day</th>
                        <th>Goal</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {DAYS.map((day, i) => {
                        const s = schedules.find((x) => x.dayOfWeek === day);
                        return (
                            <tr key={day}>
                                <td>{i + 1}</td>
                                <td>{day}</td>
                                <td>{s?.workout?.name ?? '—'}</td>
                                <td>{s?.isRestDay ? '✅ Yes' : '❌ No'}</td>
                                <td>{s?.goal ?? '—'}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => openModal(s)}>
                                        Edit
                                    </button>
                                    {s && (
                                        <button className="delete-btn" onClick={() => handleDelete(s.id!)}>
                                            Delete
                                        </button>
                                    )}
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
                        <h3>{editingSchedule ? '✏️ Edit Schedule' : '➕ Add Schedule'}</h3>

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
                                <option value="GAIN_WEIGHT">Gain Weight</option>
                                <option value="MAINTAIN">Maintain</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Workout</label>
                            <select
                                value={form.workout?.id ?? ''}
                                onChange={(e) => {
                                    const w = workouts.find((x) => x.id === Number(e.target.value));
                                    setForm({...form, workout: w});
                                }}
                                disabled={form.isRestDay}
                            >
                                <option value="">— Select —</option>
                                {workouts.map((w) => (
                                    <option key={w.id} value={w.id}>{w.name}</option>
                                ))}
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
