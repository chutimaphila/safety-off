import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  AlertTriangle as AlertIcon,
  CheckCircle as AckIcon
} from 'react-feather';
import Page from 'src/components/Page';
import Label from 'src/components/Label';
import AccidentCreateModal from './AccidentCreateModal';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const INITIAL_CASES = [
  {
    caseNo: 'ACC-202611-002',
    topicLabel: '2. รถเฉี่ยวชนกับคู่กรณี (ไม่มีผู้บาดเจ็บ)',
    severity: 'MINOR',
    plateNumber: '30-1234 ชลบุรี',
    driverName: 'นายสมชาย ใจดี',
    factoryName: 'บริษัท อมตะซิตี้ อุตสาหกรรม จำกัด',
    incidentDateTime: '2026-11-19 07:30',
    reportedAt: '2026-11-19 07:45',
    reportedBy: 'OP-สมหญิง',
    status: 'NEW'
  },
  {
    caseNo: 'ACC-202611-001',
    topicLabel: '3. รถเฉี่ยวชนสิ่งกีดขวาง / ทรัพย์สินโรงงานเสียหาย',
    severity: 'MODERATE',
    plateNumber: 'ฮฮ-5678 กรุงเทพมหานคร',
    driverName: 'นายวิชัย รักงาน',
    factoryName: 'บริษัท อีสเทิร์นซีบอร์ด แมนูแฟคเจอริ่ง จำกัด',
    incidentDateTime: '2026-11-15 18:00',
    reportedAt: '2026-11-18 10:20', // ตัวอย่างเคสแจ้งช้าเกิน 24 ชม.
    reportedBy: 'OP-ประเสริฐ',
    status: 'ACKNOWLEDGED'
  }
];

function calculateDelayBadge(incidentStr, reportedStr) {
  const diffHours = Math.round(
    (new Date(reportedStr) - new Date(incidentStr)) / (1000 * 60 * 60)
  );
  if (diffHours > 24) {
    const days = Math.floor(diffHours / 24);
    return { text: `แจ้งช้า ${days} วัน (${diffHours} ชม.)`, color: 'error' };
  }
  return { text: `ทันเวลา (${Math.max(diffHours, 0)} ชม.)`, color: 'success' };
}

function AccidentListView() {
  const classes = useStyles();
  const [cases, setCases] = useState(INITIAL_CASES);
  const [openCreate, setOpenCreate] = useState(false);

  const handleAddCase = newCase => {
    const created = {
      ...newCase,
      caseNo: `ACC-202611-00${cases.length + 1}`,
      reportedBy: 'OP-ผู้ใช้งานปัจจุบัน',
      status: 'NEW'
    };
    setCases(prev => [created, ...prev]);
  };

  const handleAcknowledge = caseNo => {
    setCases(prev =>
      prev.map(c =>
        c.caseNo === caseNo ? { ...c, status: 'ACKNOWLEDGED' } : c
      )
    );
  };

  return (
    <Page className={classes.root} title="ระบบแจ้งและติดตามอุบัติเหตุ">
      <Container maxWidth={false}>
        <Grid container justify="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h3" color="textPrimary">
              ระบบรับแจ้งเหตุอุบัติเหตุ (OP $\rightarrow$ จป.)
            </Typography>
            <Typography variant="body2" color="textSecondary">
              มาตรฐานหัวข้อเดียวกัน พร้อมตรวจสอบความล่าช้าในการรายงาน (SLA 24
              ชม.)
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AlertIcon size={16} />}
              onClick={() => setOpenCreate(true)}
            >
              + OP แจ้งเหตุอุบัติเหตุใหม่
            </Button>
          </Grid>
        </Grid>

        <Box mt={3}>
          <Card>
            <Divider />
            <Box minWidth={1000} overflow="auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>เลขที่เคส</TableCell>
                    <TableCell>หัวข้ออุบัติเหตุ (มาตรฐาน)</TableCell>
                    <TableCell>ทะเบียนรถ / คนขับ</TableCell>
                    <TableCell>เวลาเกิดเหตุ $\rightarrow$ เวลาแจ้ง</TableCell>
                    <TableCell>ความรวดเร็วในการแจ้ง</TableCell>
                    <TableCell>สถานะ จป.</TableCell>
                    <TableCell align="right">ดำเนินการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cases.map(item => {
                    const delayInfo = calculateDelayBadge(
                      item.incidentDateTime,
                      item.reportedAt
                    );

                    return (
                      <TableRow hover key={item.caseNo}>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {item.caseNo}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            แจ้งโดย: {item.reportedBy}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textPrimary">
                            {item.topicLabel}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            โรงงาน: {item.factoryName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.plateNumber}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {item.driverName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" display="block">
                            เกิดเหตุ: {item.incidentDateTime}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            แจ้งเข้าระบบ:{' '}
                            {item.reportedAt.replace('T', ' ').slice(0, 16)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Label color={delayInfo.color}>
                            {delayInfo.text}
                          </Label>
                        </TableCell>
                        <TableCell>
                          {item.status === 'NEW' ? (
                            <Label color="warning">รอ จป. รับทราบ</Label>
                          ) : (
                            <Label color="primary">จป. รับเรื่องแล้ว</Label>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {item.status === 'NEW' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              startIcon={<AckIcon size={14} />}
                              onClick={() => handleAcknowledge(item.caseNo)}
                            >
                              จป. กดรับทราบ
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Card>
        </Box>

        <AccidentCreateModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onSubmitCase={handleAddCase}
        />
      </Container>
    </Page>
  );
}

export default AccidentListView;
