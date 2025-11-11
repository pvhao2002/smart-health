'use client';
import {useEffect, useState} from 'react';
import apiClient from '@/api/apiClient';
import {API_ENDPOINTS} from '@/constants/api';
import './WorkoutTable.css';

interface WorkoutType {
    id?: number;
    name: string;
    caloriesPerMinute?: number;
    description?: string;
    url?: string;
    level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    goal?: 'LOSE_WEIGHT' | 'GAIN_WEIGHT' | 'MAINTAIN';
}

export default function WorkoutTable() {
    const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
    const [filtered, setFiltered] = useState<WorkoutType[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingWorkout, setEditingWorkout] = useState<WorkoutType | null>(null);
    const [form, setForm] = useState<WorkoutType>({
        name: '',
        caloriesPerMinute: 0,
        level: 'BEGINNER',
        goal: 'LOSE_WEIGHT',
    });
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Load data
    const loadWorkouts = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(API_ENDPOINTS.WORKOUTS.ADMIN);
            setWorkouts(res.data);
            setFiltered(res.data);
        } catch (e) {
            console.error('Error loading workouts', e);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadWorkouts();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.value.toLowerCase();
        setSearch(key);
        setFiltered(
            workouts.filter(
                (w) =>
                    w.name.toLowerCase().includes(key) ||
                    (w.level ?? '').toLowerCase().includes(key)
            )
        );
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this workout type?')) return;
        await apiClient.delete(`${API_ENDPOINTS.WORKOUTS.ADMIN}/${id}`);
        await loadWorkouts();
    };

    const openModal = (w?: WorkoutType) => {
        if (w) {
            setEditingWorkout(w);
            setForm(w);
        } else {
            setEditingWorkout(null);
            setForm({name: '', caloriesPerMinute: 0, level: 'BEGINNER', goal: 'LOSE_WEIGHT'});
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingWorkout(null);
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            alert('Name is required');
            return;
        }
        if (editingWorkout) {
            await apiClient.patch(`${API_ENDPOINTS.WORKOUTS.ADMIN}/${editingWorkout.id}`, form);
        } else {
            await apiClient.post(API_ENDPOINTS.WORKOUTS.ADMIN, form);
        }
        await loadWorkouts();
        closeModal();
    };

    return (
        <div className="workout-table-wrapper">
            <div className="workout-toolbar">
                <div className="toolbar-left">
                    <h2>🏋️ Workout Management</h2>
                    <input
                        placeholder="Search workout or level..."
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                <button className="add-btn" onClick={() => openModal()}>
                    + Add Workout
                </button>
            </div>

            {loading ? (
                <div className="loading">Loading workouts...</div>
            ) : (
                <div className="workout-table-container">
                    <table className="workout-table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Preview</th>
                            <th>Calories/min</th>
                            <th>Level</th>
                            <th>Goal</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="no-data">
                                    No workouts found
                                </td>
                            </tr>
                        ) : (
                            filtered.map((w, i) => (
                                <tr key={w.id}>
                                    <td>{i + 1}</td>
                                    <td>{w.name}</td>
                                    <td>
                                        {w.url ? (
                                            <img
                                                src={`https://img.youtube.com/vi/${extractYouTubeId(w.url)}/hqdefault.jpg`}
                                                alt="thumb"
                                                className="workout-thumb"
                                                onClick={() => setPreviewImage(w.url!)}
                                            />
                                        ) : (
                                            <span className="no-image">—</span>
                                        )}
                                    </td>
                                    <td>{w.caloriesPerMinute ?? '-'}</td>
                                    <td>{w.level}</td>
                                    <td>{w.goal}</td>
                                    <td>
                                        {w.description ? (
                                            <div className="desc-popover-wrapper">
                                                  <span className="desc-short">
                                                    {w.description.slice(0, 40)}
                                                      {w.description.length > 40 && '...'}
                                                  </span>
                                                <div className="desc-popover">
                                                    {w.description}
                                                </div>
                                            </div>
                                        ) : (
                                            '—'
                                        )}
                                    </td>


                                    <td>
                                        <button className="edit-btn" onClick={() => openModal(w)}>
                                            Edit
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(w.id!)}>
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

            {showModal && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingWorkout ? '✏️ Edit Workout' : '➕ Add Workout'}</h3>

                        <div className="form-group">
                            <label>Name</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Calories per minute</label>
                            <input
                                type="number"
                                value={form.caloriesPerMinute ?? ''}
                                onChange={(e) => setForm({...form, caloriesPerMinute: Number(e.target.value)})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Level</label>
                            <select
                                value={form.level}
                                onChange={(e) => setForm({...form, level: e.target.value as WorkoutType['level']})}
                            >
                                <option value="BEGINNER">Beginner</option>
                                <option value="INTERMEDIATE">Intermediate</option>
                                <option value="ADVANCED">Advanced</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Goal</label>
                            <select
                                value={form.goal}
                                onChange={(e) => setForm({...form, goal: e.target.value as WorkoutType['goal']})}
                            >
                                <option value="LOSE_WEIGHT">Lose Weight</option>
                                <option value="GAIN_WEIGHT">Gain Weight</option>
                                <option value="MAINTAIN">Maintain</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={form.description ?? ''}
                                onChange={(e) => setForm({...form, description: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>YouTube Link</label>
                            <input
                                type="text"
                                value={form.url ?? ''}
                                onChange={(e) => setForm({...form, url: e.target.value})}
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                        </div>

                        {form.url && (
                            <iframe
                                className="youtube-preview"
                                src={form.url.replace('watch?v=', 'embed/')}
                                title="YouTube preview"
                                allowFullScreen
                            />
                        )}

                        <div className="modal-actions">
                            <button onClick={handleSubmit} className="save-btn">
                                {editingWorkout ? 'Update' : 'Add'}
                            </button>
                            <button onClick={closeModal} className="cancel-btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {previewImage && (
                <div className="image-preview-backdrop" onClick={() => setPreviewImage(null)}>
                    <iframe
                        src={previewImage}
                        title="Video preview"
                        allowFullScreen
                        className="video-preview"
                    ></iframe>
                </div>
            )}
        </div>
    );
}

/** Helper to get YouTube video id from embed url */
function extractYouTubeId(url: string): string | null {
    const match = url.match(/embed\/([\w-]{11})/);
    return match ? match[1] : null;
}
