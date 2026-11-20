import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Container,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Overview from './Overview';
import AccidentChart from './AccidentChart';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  container: {
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 64,
      paddingRight: 64
    }
  }
}));

const THAI_MONTHS = [
  { value: 0, label: 'มกราคม' },
  { value: 1, label: 'กุมภาพันธ์' },
  { value: 2, label: 'มีนาคม' },
  { value: 3, label: 'เมษายน' },
  { value: 4, label: 'พฤษภาคม' },
  { value: 5, label: 'มิถุนายน' },
  { value: 6, label: 'กรกฎาคม' },
  { value: 7, label: 'สิงหาคม' },
  { value: 8, label: 'กันยายน' },
  { value: 9, label: 'ตุลาคม' },
  { value: 10, label: 'พฤศจิกายน' },
  { value: 11, label: 'ธันวาคม' }
];

// ข้อมูลจำลองสำหรับแสดงผล (เปลี่ยนเป็นข้อมูลจาก API จริงภายหลัง)
const MOCK_CASES = [
  {
    caseNo: 'ACC-202611-004',
    incidentDateTime: '2026-11-19 07:30',
    reportedAt: '2026-11-19 07:45',
    status: 'NEW'
  },
  {
    caseNo: 'ACC-202611-003',
    incidentDateTime: '2026-11-15 18:00',
    reportedAt: '2026-11-18 10:20',
    status: 'ACKNOWLEDGED'
  },
  {
    caseNo: 'ACC-202611-002',
    incidentDateTime: '2026-11-04 09:15',
    reportedAt: '2026-11-04 09:30',
    status: 'ACKNOWLEDGED'
  },
  {
    caseNo: 'ACC-202609-001',
    incidentDateTime: '2026-09-10 14:20',
    reportedAt: '2026-09-10 14:40',
    status: 'ACKNOWLEDGED'
  }
];

function AccidentDashboardView({ cases = MOCK_CASES }) {
  const classes = useStyles();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const kpiStats = useMemo(() => {
    let newCount = 0;
    let monthCount = 0;
    let yearCount = 0;

    (cases || []).forEach(item => {
      if (item.status === 'NEW') {
        newCount += 1;
      }
      const d = new Date(item.incidentDateTime || item.reportedAt);
      if (!Number.isNaN(d.getTime())) {
        if (d.getFullYear() === currentYear) {
          yearCount += 1;
          if (d.getMonth() === currentMonth) {
            monthCount += 1;
          }
        }
      }
    });

    return { newCount, monthCount, yearCount };
  }, [cases, currentYear, currentMonth]);

  return (
    <Page className={classes.root} title="ภาพรวมแดชบอร์ดอุบัติเหตุ">
      <Container maxWidth={false} className={classes.container}>
        <Box mb={3}>
          <Typography variant="overline" color="textSecondary">
            ระบบเจ้าหน้าที่ความปลอดภัย (จป.)
          </Typography>
          <Typography variant="h3" color="textPrimary">
            ภาพรวมสถิติการแจ้งอุบัติเหตุ
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Overview
              stats={kpiStats}
              monthLabel={THAI_MONTHS[currentMonth].label}
              yearBE={currentYear + 543}
            />
          </Grid>
          <Grid item xs={12}>
            <AccidentChart cases={cases} thaiMonths={THAI_MONTHS} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

AccidentDashboardView.propTypes = {
  cases: PropTypes.array
};

export default AccidentDashboardView;
