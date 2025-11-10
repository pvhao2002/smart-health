'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/api/apiClient';
import { API_ENDPOINTS } from '@/constants/api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            try {
                const res = await apiClient.get(API_ENDPOINTS.ADMIN.DASHBOARD);
                setStats(res.data);
            } catch (err) {
                console.error('Error loading dashboard metrics:', err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading || !stats) return <div className="loading">Loading dashboard...</div>;

    return (
        <div className="pharma-dashboard">
            <header className="pharma-header">
                <div>
                    <h2>PharmaCare Dashboard</h2>
                    <p>Updated at {new Date(stats.generatedAt).toLocaleString()}</p>
                </div>
            </header>

            <main className="pharma-content">
                {/* ======= Top Section ======= */}
                <section className="pharma-top">
                    <div className="pharma-stats">
                        <div className="pharma-card success">
                            <h4>Total Revenue</h4>
                            <p>{stats.totalRevenue?.toLocaleString('vi-VN')} ₫</p>
                        </div>
                        <div className="pharma-card">
                            <h4>Total Orders</h4>
                            <p>{stats.totalOrders}</p>
                        </div>
                        <div className="pharma-card warning">
                            <h4>Pending Orders</h4>
                            <p>{stats.pendingOrders}</p>
                        </div>
                        <div className="pharma-card">
                            <h4>Customers</h4>
                            <p>{stats.totalCustomers}</p>
                        </div>
                        <div className="pharma-card secondary">
                            <h4>Products in Stock</h4>
                            <p>{stats.productsInStock}</p>
                        </div>
                    </div>

                    <div className="pharma-chart">
                        <h3>📊 Monthly Revenue Overview</h3>
                        {stats.monthlyGrowth?.length ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stats.monthlyGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="revenue" name="Revenue (₫)" fill="#00ADEF" />
                                    <Bar dataKey="orders" name="Orders" fill="#009688" />
                                    <Bar dataKey="newCustomers" name="New Customers" fill="#F57C00" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="no-data">No data available.</p>
                        )}
                    </div>
                </section>

                {/* ======= Bottom Section ======= */}
                <section className="pharma-bottom">
                    <h3>🔥 Top Selling Products</h3>
                    <div className="pharma-table">
                        <table>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Product</th>
                                <th>Revenue (₫)</th>
                                <th>Sold</th>
                                <th>Orders</th>
                            </tr>
                            </thead>
                            <tbody>
                            {stats.topProducts?.length ? (
                                stats.topProducts.map((p: any, idx: number) => (
                                    <tr key={p.productId}>
                                        <td>{idx + 1}</td>
                                        <td>{p.productName}</td>
                                        <td>{p.totalRevenue.toLocaleString('vi-VN')}</td>
                                        <td>{p.totalQuantitySold}</td>
                                        <td>{p.orderCount}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="no-data">
                                        No top product data found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}
