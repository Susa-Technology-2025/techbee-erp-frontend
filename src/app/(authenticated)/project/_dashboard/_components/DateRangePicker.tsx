'use client';

import React from 'react';
import {
    Box,
    Typography,
    Button,
    alpha,
    IconButton,
    Tooltip
} from '@mui/material';
import { CalendarToday, RestartAlt } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { colors, formatDateTime } from '../../_utils/consts';
import dayjs, { Dayjs } from 'dayjs';

interface DateRangePickerProps {
    fromDate: Dayjs | null;
    toDate: Dayjs | null;
    setFromDate: (date: Dayjs | null) => void;
    setToDate: (date: Dayjs | null) => void;
    onApply: () => void;
    onClear: () => void;
    showPicker: boolean;
    setShowPicker: (show: boolean) => void;
    hasCustomDates: boolean;
    window?: {
        from: string;
        to: string;
    };
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    onApply,
    onClear,
    showPicker,
    setShowPicker,
    hasCustomDates,
    window
}) => {
    const formatDate = (date: Dayjs | null): string => {
        if (!date) {
            return '';
        }
        return date.format('YYYY-MM-DD');
    };

    const getDisplayText = () => {
        if (fromDate && toDate) {
            return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
        }
        return '';
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1.5,
            mb: 3,
            position: 'relative'
        }}>
            <Box>
                <Typography variant="h5" sx={{
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 0.25,
                    fontSize: '1.5rem'
                }}>
                    Project Analytics Dashboard
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {!showPicker ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                bgcolor: alpha(colors.primary, 0.08),
                                px: 1.5,
                                py: 0.75,
                                borderRadius: 3,
                                fontSize: 13,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.75,
                                border: `1px solid ${alpha(colors.primary, 0.15)}`,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    bgcolor: alpha(colors.primary, 0.12),
                                    borderColor: alpha(colors.primary, 0.25),
                                }
                            }}
                            onClick={() => setShowPicker(true)}
                        >
                            <CalendarToday sx={{ fontSize: 14, color: colors.primary }} />
                            <Typography variant="body2" sx={{
                                color: colors.primary,
                                fontWeight: 500,
                                fontSize: '0.8125rem'
                            }}>
                                {getDisplayText() || 'Loading dates...'}
                            </Typography>
                        </Box>

                        {/* Reset button - only shown when user has selected custom dates */}
                        {hasCustomDates && (
                            <Tooltip title="Reset to default dates">
                                <IconButton
                                    size="small"
                                    onClick={onClear}
                                    sx={{
                                        bgcolor: alpha(colors.error, 0.08),
                                        '&:hover': {
                                            bgcolor: alpha(colors.error, 0.12),
                                        }
                                    }}
                                >
                                    <RestartAlt sx={{ fontSize: 18, color: colors.error }} />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                ) : (
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <DatePicker
                            label="From Date"
                            value={fromDate}
                            onChange={setFromDate}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    sx: {
                                        width: 135,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1.5,
                                        }
                                    }
                                }
                            }}
                        />
                        <DatePicker
                            label="To Date"
                            value={toDate}
                            onChange={setToDate}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    sx: {
                                        width: 135,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 1.5,
                                        }
                                    }
                                }
                            }}
                        />
                        <Button
                            variant="contained"
                            size="small"
                            onClick={onApply}
                            sx={{
                                borderRadius: 1.5,
                                bgcolor: colors.primary,
                                px: 1.5,
                                py: 0.5,
                                fontSize: '0.8125rem',
                                '&:hover': { bgcolor: '#4F46E5' }
                            }}
                        >
                            Apply
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setShowPicker(false)}
                            sx={{
                                borderRadius: 1.5,
                                px: 1.5,
                                py: 0.5,
                                fontSize: '0.8125rem'
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default DateRangePicker;