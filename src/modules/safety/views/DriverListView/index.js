import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  FileText as PdfIcon,
  Grid as ExcelIcon,
  RefreshCw as RefreshIcon
} from 'react-feather';
import Page from 'src/components/Page';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Results from './Results';
import ExportReportModal from '../../components/ExportReportModal';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  actionBtn: {
    marginLeft: theme.spacing(1)
  }
}));

// ข้อมูลจำลองอ้างอิงฟิลด์จริงจาก kpattgroup_admin.employee_mt + vehicles_data + customer_data
const MOCK_DRIVERS = [
  {
    EMPLOYEE_CODE: 'EMP012',
    FULL_NAME: 'นายสมชาย ใจดี',
    TEL: '081-234-5678',
    DRIVER_LC_NO: '64001234',
    DRIVER_LC_TYPE: 'ท.2',
    DRIVER_LC_EXP: '2027-08-15',
    HEALTHCHECKUP_DATE: '2026-02-10',
    VH_REGIS_PLATE: '30-1234 ชลบุรี',
    FACTORY_NAME: 'บริษัท อมตะซิตี้ อุตสาหกรรม จำกัด',
    UDATE: '2026-11-18 14:30'
  },
  {
    EMPLOYEE_CODE: 'EMP045',
    FULL_NAME: 'นายวิชัย รักงาน',
    TEL: '089-876-5432',
    DRIVER_LC_NO: '62009876',
    DRIVER_LC_TYPE: 'ท.3',
    DRIVER_LC_EXP: '2026-12-05',
    HEALTHCHECKUP_DATE: '2026-01-20',
    VH_REGIS_PLATE: 'ฮฮ-5678 กรุงเทพมหานคร',
    FACTORY_NAME: 'บริษัท อีสเทิร์นซีบอร์ด แมนูแฟคเจอริ่ง จำกัด',
    UDATE: '2026-11-19 09:15'
  },
  {
    EMPLOYEE_CODE: 'EMP089',
    FULL_NAME: 'นายมานะ ขยันยิ่ง',
    TEL: '086-555-4433',
    DRIVER_LC_NO: '60005544',
    DRIVER_LC_TYPE: 'ท.2',
    DRIVER_LC_EXP: '2026-10-01',
    HEALTHCHECKUP_DATE: '2025-11-12',
    VH_REGIS_PLATE: '30-9988 ระยอง',
    FACTORY_NAME: 'บริษัท อมตะซิตี้ อุตสาหกรรม จำกัด',
    UDATE: '2026-11-15 16:45'
  }
];

function DriverListView() {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [drivers, setDrivers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [exportModal, setExportModal] = useState({
    open: false,
    fileType: 'EXCEL'
  });

  const fetchDrivers = useCallback(async () => {
    // TODO: เปลี่ยนเป็น axios.get('/api/safetyofficer/drivers') เมื่อต่อ Backend จริง
    if (isMountedRef.current) {
      setDrivers(MOCK_DRIVERS);
    }
  }, [isMountedRef]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleSelectOne = empCode => {
    setSelectedIds(prev =>
      prev.includes(empCode)
        ? prev.filter(id => id !== empCode)
        : [...prev, empCode]
    );
  };

  const handleConfirmExport = ({ fileType, scope, columns }) => {
    const targetDrivers =
      scope === 'SELECTED'
        ? drivers.filter(d => selectedIds.includes(d.EMPLOYEE_CODE))
        : drivers;

    console.log('กำลังส่งออกรายงาน:', {
      fileType,
      scope,
      columns,
      targetDrivers
    });
    alert(
      `เตรียมส่งออกไฟล์ ${fileType} จำนวน ${targetDrivers.length} รายการ (${columns.length} คอลัมน์)`
    );
  };

  return (
    <Page className={classes.root} title="ข้อมูลพนักงานขับรถ">
      <Container maxWidth={false}>
        <Grid container justify="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h3" color="textPrimary">
              ทะเบียนข้อมูลพนักงานขับรถ
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ข้อมูลซิงค์อัตโนมัติจากฝ่าย Admin (kpattgroup_admin.employee_mt)
            </Typography>
          </Grid>
          <Grid item>
            <Button
              startIcon={<RefreshIcon size={16} />}
              onClick={fetchDrivers}
            >
              ซิงค์ข้อมูลล่าสุด
            </Button>
            <Button
              variant="outlined"
              color="primary"
              className={classes.actionBtn}
              startIcon={<ExcelIcon size={16} />}
              onClick={() => setExportModal({ open: true, fileType: 'EXCEL' })}
            >
              ส่งออก Excel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.actionBtn}
              startIcon={<PdfIcon size={16} />}
              onClick={() => setExportModal({ open: true, fileType: 'PDF' })}
            >
              ส่งออก PDF
            </Button>
          </Grid>
        </Grid>

        <Box mt={3}>
          <Results
            drivers={drivers}
            selectedIds={selectedIds}
            onSelectOne={handleSelectOne}
            onSelectAll={setSelectedIds}
          />
        </Box>

        <ExportReportModal
          open={exportModal.open}
          fileType={exportModal.fileType}
          selectedCount={selectedIds.length}
          totalCount={drivers.length}
          onClose={() => setExportModal(prev => ({ ...prev, open: false }))}
          onConfirmExport={handleConfirmExport}
        />
      </Container>
    </Page>
  );
}

export default DriverListView;
