'use client';
import React from 'react';
import { apiIngest, apiMetrics } from '../lib/api';

export default function AdminPanel() {
    const [metrics, setMetrics] = React.useState<any>(null);
    const [busy, setBusy] = React.useState(false);

    const refresh = async () => {
        const m = await apiMetrics();
        setMetrics(m);
    };

    const ingest = async () => {
        setBusy(true);
        try {
            await apiIngest();
            await refresh();
        } finally {
            setBusy(false);
        }
    };

    React.useEffect(() => { refresh(); }, []);

    const MetricCard = ({ label, value }: { label: string, value: any }) => (
        <div className="bg-[#3e4f5f] rounded-xl p-4 mb-3 flex justify-between items-center border border-slate-600/30">
            <p className="text-sm font-medium text-slate-200">{label}: <span className="ml-1 text-white font-bold">{value ?? '-'}</span></p>
        </div>
    );

    return (
        <div className="card">
            <h2>Admin</h2>
            <div className="space-y-1">
                <MetricCard label="📄 Total Docs" value={metrics?.total_docs} />
                <MetricCard label="🧩 Total Chunks" value={metrics?.total_chunks} />
                <MetricCard label="🕒 Ret. Latency" value={metrics?.avg_retrieval_latency_ms ? `${metrics.avg_retrieval_latency_ms}ms` : null} />
                <MetricCard label="⚡ Gen. Latency" value={metrics?.avg_generation_latency_ms ? `${metrics.avg_generation_latency_ms}ms` : null} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <button onClick={ingest} disabled={busy} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #111', background: '#fff' }}>
                    📥 {busy ? 'Indexing...' : 'Ingest sample docs'}
                </button>
                <button onClick={refresh} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #111', background: '#fff' }}>🔄 Refresh metrics</button>
            </div>
            
        </div>
    );
}