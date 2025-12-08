"use client"
import { AppBar, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Toolbar, Typography } from "@mui/material";
import { useState } from "react";


export const formatMonth = (date: Date) =>{
    const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`; // "YYYY-MM"
  } // "YYYY-MM"
const formatMonthLabel = (date: Date) =>
  date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

const getDateRange = (monthValue: string) => {
  const [year, month] = monthValue.split("-").map(Number);

  const start = new Date(year, month - 1, 1); // start of month
  const end = new Date(year, month, 0); // last day of month

  const today = new Date();
  // If selected month is current month → cap end date at today

    const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth() + 1;
    
    const effectiveEnd = isCurrentMonth ? today : end;

  return {
    startDate: start.toISOString().split("T")[0],
    endDate: effectiveEnd.toISOString().split("T")[0],
  };
}

export const AppBarHeader = (title: string) => {
    const today = new Date();
    
    const currentMonth = formatMonth(today);
    
    
    // Decide end date: if today is before end of month → use today, else use endOfMonth
    
        const [dateRange, setDateRange] = useState<string>(currentMonth);
      
          const months = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        return {
          value: formatMonth(d), // "YYYY-MM"
          label: formatMonthLabel(d), // "Month YYYY"
        };
      });
        // Format dates for API call
        // const startDate = `${dateRange}-01`;
        // const endDate = `${dateRange}-31`;
      
          const handleDateChange = (event: SelectChangeEvent) => {
            setDateRange(event.target.value);
            const { startDate, endDate } = getDateRange(event.target.value);
        console.log("API range →", startDate, endDate);
          };
    
       const { startDate, endDate } = getDateRange(dateRange);
    
    return(
            <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel id="date-range-label">Period</InputLabel>
            <Select
              labelId="date-range-label"
              value={dateRange}
              label="Period"
              onChange={handleDateChange}
            >
                          {months.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
            </Select>
          </FormControl>
        </Toolbar>
        <Typography sx={{ p: 2 }}>
        Selected Range: {startDate} → {endDate}
      </Typography>
      </AppBar>
    );
}