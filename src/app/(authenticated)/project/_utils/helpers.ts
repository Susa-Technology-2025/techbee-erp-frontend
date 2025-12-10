export const getPriorityColor = (priority: string | null) => {
    if (!priority) return '#64748b';
    switch (priority.toLowerCase()) {
        case 'high': return '#dc3545';
        case 'medium': return '#f59e0b';
        case 'low': return '#10b981';
        default: return '#64748b';
    }
};

export const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'completed': return 'success';
        case 'in progress': return 'primary';
        case 'active': return 'success';
        case 'pending': return 'warning';
        case 'draft': return 'default';
        case 'todo': return 'warning';
        case 'done': return 'success';
        case 'stage 1': return 'info';
        default: return 'default';
    }
};

export const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    return new Date(timeString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
};