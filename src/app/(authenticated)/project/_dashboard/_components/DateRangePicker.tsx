'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    alpha
} from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { colors, formatDateTime } from '../../_utils/consts';
import dayjs, { Dayjs } from 'dayjs';

interface DateRangePickerProps {
    fromDate: Dayjs;
    toDate: Dayjs;
    setFromDate: (date: Dayjs) => void;
    setToDate: (date: Dayjs) => void;
    onApply: () => void;
    showPicker: boolean;
    setShowPicker: (show: boolean) => void;
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
    showPicker,
    setShowPicker,
    window
}) => {
    const formatDate = (date: Dayjs): string => {
        return date.format('YYYY-MM-DD');
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1.5,
            mb: 3
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
                {window && (
                    <Typography variant="body2" sx={{
                        color: 'text.secondary',
                        fontSize: '0.8125rem'
                    }}>
                        {formatDateTime(window.from)} - {formatDateTime(window.to)}
                    </Typography>
                )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {!showPicker ? (
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
                            {formatDate(fromDate)} - {formatDate(toDate)}
                        </Typography>
                    </Box>
                ) : (
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <DatePicker
                            label="From Date"
                            value={fromDate}
                            onChange={(newValue) => newValue && setFromDate(newValue)}
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
                            onChange={(newValue) => newValue && setToDate(newValue)}
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