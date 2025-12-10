export const mainAPI = "https://project.api.techbee.et/api/projects"
export const colors = {
    primary: '#6366F1',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    purple: '#8B5CF6',
    pink: '#EC4899',
    teal: '#14B8A6',
    indigo: '#4F46E5',
    orange: '#F97316',
    gray: '#6B7280'
};

export const formatCurrency = (amount: number | null): string => {
    if (amount === null || amount === undefined) return 'N/A';
    if (amount >= 1000000) {
        return `ETB ${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
        return `ETB ${(amount / 1000).toFixed(1)}K`;
    }
    return `ETB ${amount.toFixed(0)}`;
};