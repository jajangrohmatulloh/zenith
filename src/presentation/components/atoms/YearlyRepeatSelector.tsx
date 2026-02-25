'use client';

import React from 'react';

interface YearlyRepeatSelectorProps {
    month: number;
    onMonthChange: (month: number) => void;
    dayOfMonth: number | 'last';
    onDayOfMonthChange: (day: number | 'last') => void;
}

export const YearlyRepeatSelector = ({
    month,
    onMonthChange,
    dayOfMonth,
    onDayOfMonthChange,
}: YearlyRepeatSelectorProps) => {
    return null;
};
