import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import {
  Box,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Typography,
  useTheme
} from '@material-ui/core';

const SHORT_MONTHS = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.'
];

const WEEK_LABELS = [
  'สัปดาห์ที่ 1',
  'สัปดาห์ที่ 2',
  'สัปดาห์ที่ 3',
  'สัปดาห์ที่ 4',
  'สัปดาห์ที่ 5'
];

// ข้อมูลจำลองกรณีเรียกใช้เดี่ยวๆ โดยยังไม่ส่ง props cases เข้ามา
const DEFAULT_CASES = [
  { incidentDateTime: '2026-11-19 07:30', status: 'NEW' },
  { incidentDateTime: '2026-11-15 18:00', status: 'ACKNOWLEDGED' },
  { incidentDateTime: '2026-11-04 09:15', status: 'ACKNOWLEDGED' },
  { incidentDateTime: '2026-10-12 10:00', status: 'ACKNOWLEDGED' },
  { incidentDateTime: '2026-10-22 15:30', status: 'ACKNOWLEDGED' },
  { incidentDateTime: '2026-09-10 14:20', status: 'ACKNOWLEDGED' },
  { incidentDateTime: '2025-11-11 08:45', status: 'ACKNOWLEDGED' },
  { incidentDateTime: '2025-09-05 13:10', status: 'ACKNOWLEDGED' }
];

function AccidentComparisonChart({ cases = DEFAULT_CASES }) {
  const theme = useTheme();
  const [compareMode, setCompareMode] = useState('YEARLY'); // 'YEARLY' | 'MONTHLY'

  const now = new Date();
  const currentYear = now.getFullYear();
  const lastYear = currentYear - 1;
  const currentMonth = now.getMonth(); // 0 - 11

  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const lastMonthYear = lastMonthDate.getFullYear();
  const lastMonthIndex = lastMonthDate.getMonth();

  const chartState = useMemo(() => {
    const safeCases = cases || [];

    if (compareMode === 'MONTHLY') {
      const thisMonthData = [0, 0, 0, 0, 0];
      const lastMonthData = [0, 0, 0, 0, 0];

      safeCases.forEach(item => {
        const d = new Date(item.incidentDateTime || item.reportedAt);
        if (Number.isNaN(d.getTime())) return;

        const weekIdx = Math.min(Math.floor((d.getDate() - 1) / 7), 4);

        if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
          thisMonthData[weekIdx] += 1;
        } else if (
          d.getFullYear() === lastMonthYear &&
          d.getMonth() === lastMonthIndex
        ) {
          lastMonthData[weekIdx] += 1;
        }
      });

      return {
        categories: WEEK_LABELS,
        series: [
          {
            name: `This month (${SHORT_MONTHS[currentMonth]} ${currentYear +
              543})`,
            data: thisMonthData
          },
          {
            name: `Last month (${SHORT_MONTHS[lastMonthIndex]} ${lastMonthYear +
              543})`,
            data: lastMonthData
          }
        ]
      };
    }

    // โหมดเปรียบเทียบรายปี: Last year vs This year (12 เดือน)
    const thisYearData = new Array(12).fill(0);
    const lastYearData = new Array(12).fill(0);

    safeCases.forEach(item => {
      const d = new Date(item.incidentDateTime || item.reportedAt);
      if (Number.isNaN(d.getTime())) return;

      if (d.getFullYear() === currentYear) {
        thisYearData[d.getMonth()] += 1;
      } else if (d.getFullYear() === lastYear) {
        lastYearData[d.getMonth()] += 1;
      }
    });

    return {
      categories: SHORT_MONTHS,
      series: [
        {
          name: `This year (${currentYear + 543})`,
          data: thisYearData
        },
        {
          name: `Last year (${lastYear + 543})`,
          data: lastYearData
        }
      ]
    };
  }, [
    cases,
    compareMode,
    currentYear,
    lastYear,
    currentMonth,
    lastMonthYear,
    lastMonthIndex
  ]);

  const options = {
    chart: {
      background: theme.palette.background.paper,
      toolbar: {
        show: false
      }
    },
    colors: ['#13affe', '#fbab49'],
    dataLabels: {
      enabled: false
    },
    grid: {
      borderColor: theme.palette.divider,
      yaxis: {
        lines: {
          show: false
        }
      }
    },
    legend: {
      show: true,
      labels: {
        colors: theme.palette.text.secondary
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '40%'
      }
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    theme: {
      mode: theme.palette.type
    },
    tooltip: {
      theme: theme.palette.type,
      y: {
        formatter: val => `${val} เคส`
      }
    },
    xaxis: {
      axisBorder: {
        show: true,
        color: theme.palette.divider
      },
      axisTicks: {
        show: true,
        color: theme.palette.divider
      },
      categories: chartState.categories,
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      min: 0,
      forceNiceScale: true,
      axisBorder: {
        show: true,
        color: theme.palette.divider
      },
      axisTicks: {
        show: true,
        color: theme.palette.divider
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        },
        formatter: val => Math.floor(val)
      }
    }
  };

  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          mb={2}
        >
          <Typography variant="h4" color="textPrimary">
            {compareMode === 'YEARLY'
              ? `เปรียบเทียบจำนวนอุบัติเหตุรายปี (${lastYear +
                  543} vs ${currentYear + 543})`
              : `เปรียบเทียบจำนวนอุบัติเหตุรายเดือน (${SHORT_MONTHS[lastMonthIndex]} vs ${SHORT_MONTHS[currentMonth]})`}
          </Typography>
          <TextField
            select
            size="small"
            variant="outlined"
            label="รูปแบบการเทียบ"
            value={compareMode}
            onChange={e => setCompareMode(e.target.value)}
            style={{ minWidth: 210 }}
          >
            <MenuItem value="YEARLY">รายปี (Last year - This year)</MenuItem>
            <MenuItem value="MONTHLY">
              รายเดือน (Last month - This month)
            </MenuItem>
          </TextField>
        </Box>
        <Chart
          options={options}
          series={chartState.series}
          type="bar"
          height="300"
        />
      </CardContent>
    </Card>
  );
}

AccidentComparisonChart.propTypes = {
  cases: PropTypes.array
};

export default AccidentComparisonChart;
