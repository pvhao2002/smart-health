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
            console.error('Lỗi khi tải danh sách bài tập', e);
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
        if (!confirm('Bạn có chắc muốn xóa bài tập này?')) return;
        await apiClient.delete(`${API_ENDPOINTS.WORKOUTS.ADMIN}/${id}`);
        await loadWorkouts();
    };

    const openModal = (w?: WorkoutType) => {
        if (w) {
            setEditingWorkout(w);
            setForm(w);
        } else {
            setEditingWorkout(null);
            setForm({
                name: '',
                caloriesPerMinute: 0,
                level: 'BEGINNER',
                goal: 'LOSE_WEIGHT'
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingWorkout(null);
    };

    const handleSubmit = async () => {
        if (!form.name.trim()) {
            alert('Tên bài tập không được để trống');
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
            {/* ===== Toolbar ===== */}
            <div className="workout-toolbar">
                <div className="toolbar-left">
                    <h2>🏋️ Quản Lý Bài Tập</h2>
                    <input
                        placeholder="Tìm kiếm tên hoặc cấp độ bài tập..."
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                <button className="add-btn" onClick={() => openModal()}>
                    + Thêm Bài Tập
                </button>
            </div>

            {loading ? (
                <div className="loading">Đang tải danh sách bài tập...</div>
            ) : (
                <div className="workout-table-container">
                    <table className="workout-table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên bài tập</th>
                            <th>Xem trước</th>
                            <th>Calo/phút</th>
                            <th>Cấp độ</th>
                            <th>Mục tiêu</th>
                            <th>Mô tả</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>

                        <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="no-data">
                                    Không có bài tập nào
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

                                    {/* Level */}
                                    <td>
                                        {w.level === 'BEGINNER'
                                            ? 'Cơ bản'
                                            : w.level === 'INTERMEDIATE'
                                                ? 'Trung bình'
                                                : 'Nâng cao'}
                                    </td>

                                    {/* Goal */}
                                    <td>
                                        {w.goal === 'LOSE_WEIGHT'
                                            ? 'Giảm cân'
                                            : w.goal === 'GAIN_WEIGHT'
                                                ? 'Tăng cân'
                                                : 'Duy trì'}
                                    </td>

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
                                        ) : '—'}
                                    </td>

                                    <td>
                                        <button className="edit-btn" onClick={() => openModal(w)}>
                                            Sửa
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDelete(w.id!)}>
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
                        <h3>{editingWorkout ? '✏️ Chỉnh Sửa Bài Tập' : '➕ Thêm Bài Tập Mới'}</h3>

                        <div className="form-group">
                            <label>Tên bài tập</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Calo</label>
                            <input
                                type="number"
                                value={form.caloriesPerMinute ?? ''}
                                onChange={(e) => setForm({...form, caloriesPerMinute: Number(e.target.value)})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Cấp độ</label>
                            <select
                                value={form.level}
                                onChange={(e) => setForm({...form, level: e.target.value as WorkoutType['level']})}
                            >
                                <option value="BEGINNER">Cơ bản</option>
                                <option value="INTERMEDIATE">Trung bình</option>
                                <option value="ADVANCED">Nâng cao</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Mục tiêu</label>
                            <select
                                value={form.goal}
                                onChange={(e) => setForm({...form, goal: e.target.value as WorkoutType['goal']})}
                            >
                                <option value="LOSE_WEIGHT">Giảm cân</option>
                                <option value="GAIN_WEIGHT">Tăng cân</option>
                                <option value="MAINTAIN">Duy trì</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Mô tả</label>
                            <textarea
                                value={form.description ?? ''}
                                onChange={(e) => setForm({...form, description: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Link YouTube</label>
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
                                {editingWorkout ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                            <button onClick={closeModal} className="cancel-btn">
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Video preview */}
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

/** Helper extract YouTube video ID */
function extractYouTubeId(url: string): string | null {
    const match = url.match(/embed\/([\w-]{11})/);
    return match ? match[1] : null;
}
