import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography
} from '@material-ui/core';
import { Download as DownloadIcon } from 'react-feather';

export const DRIVER_EXPORT_COLUMNS = [
  { key: 'EMPLOYEE_CODE', label: 'รหัสพนักงาน', defaultChecked: true },
  { key: 'FULL_NAME', label: 'ชื่อ-นามสกุล (ไทย)', defaultChecked: true },
  {
    key: 'ENGLISH_FULL_NAME',
    label: 'ชื่อ-นามสกุล (อังกฤษ)',
    defaultChecked: false
  },
  { key: 'DEPT', label: 'แผนก (DEPT)', defaultChecked: false },
  { key: 'POSIT', label: 'ตำแหน่ง (POSIT)', defaultChecked: false },
  { key: 'TEL', label: 'เบอร์โทรศัพท์', defaultChecked: true },
  { key: 'REGISTOR', label: 'วันที่เริ่มงาน', defaultChecked: false },
  { key: 'DRIVER_LC_NO', label: 'เลขที่ใบขับขี่', defaultChecked: true },
  { key: 'DRIVER_LC_TYPE', label: 'ประเภทใบขับขี่', defaultChecked: true },
  { key: 'DRIVER_LC_ISSUE', label: 'วันออกใบขับขี่', defaultChecked: false },
  {
    key: 'DRIVER_LC_ISSUE_LOCA',
    label: 'สถานที่ออกใบขับขี่',
    defaultChecked: false
  },
  { key: 'DRIVER_LC_EXP', label: 'วันหมดอายุใบขับขี่', defaultChecked: true },
  {
    key: 'HEALTHCHECKUP_DATE',
    label: 'วันที่ตรวจสุขภาพล่าสุด',
    defaultChecked: true
  },
  { key: 'VH_REGIS_PLATE', label: 'ทะเบียนรถประจำ', defaultChecked: true },
  {
    key: 'VH_REGIS_PROVINCE',
    label: 'จังหวัดป้ายทะเบียน',
    defaultChecked: false
  },
  {
    key: 'FACTORY_NAME',
    label: 'โรงงาน/ลูกค้าที่สังกัด',
    defaultChecked: true
  },
  {
    key: 'FULL_ADDRESS',
    label: 'ที่อยู่ตามทะเบียนบ้าน',
    defaultChecked: false
  },
  { key: 'UDATE', label: 'อัปเดตข้อมูลล่าสุด', defaultChecked: false }
];

function ExportReportModal({
  open,
  onClose,
  fileType, // 'EXCEL' | 'PDF'
  selectedCount,
  totalCount,
  onConfirmExport
}) {
  const [scope, setScope] = useState('SELECTED');
  const [selectedCols, setSelectedCols] = useState([]);

  useEffect(() => {
    if (open) {
      setScope(selectedCount > 0 ? 'SELECTED' : 'ALL');
      setSelectedCols(
        DRIVER_EXPORT_COLUMNS.filter(c => c.defaultChecked).map(c => c.key)
      );
    }
  }, [open, selectedCount]);

  const handleToggleColumn = key => {
    setSelectedCols(prev =>
      prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
    );
  };

  const handleSelectAllCols = () => {
    if (selectedCols.length === DRIVER_EXPORT_COLUMNS.length) {
      setSelectedCols([]);
    } else {
      setSelectedCols(DRIVER_EXPORT_COLUMNS.map(c => c.key));
    }
  };

  const handleSubmit = () => {
    onConfirmExport({
      fileType,
      scope,
      columns: selectedCols
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        ส่งออกรายงานข้อมูลพนักงานขับรถ (
        {fileType === 'EXCEL' ? 'Excel .xlsx' : 'PDF .pdf'})
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box mb={3}>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              1. เลือกขอบเขตข้อมูลที่ต้องการส่งออก
            </FormLabel>
            <RadioGroup value={scope} onChange={e => setScope(e.target.value)}>
              <FormControlLabel
                value="SELECTED"
                disabled={selectedCount === 0}
                control={<Radio color="primary" />}
                label={`ส่งออกเฉพาะรายชื่อที่ติ๊กเลือก (${selectedCount} คน)`}
              />
              <FormControlLabel
                value="ALL"
                control={<Radio color="primary" />}
                label={`ส่งออกข้อมูลทั้งหมดตามตัวกรองปัจจุบัน (${totalCount} คน)`}
              />
            </RadioGroup>
          </FormControl>
        </Box>

        <Divider />

        <Box mt={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <FormLabel component="legend">
              2. เลือกคอลัมน์ข้อมูล ({selectedCols.length}/
              {DRIVER_EXPORT_COLUMNS.length})
            </FormLabel>
            <Button size="small" color="primary" onClick={handleSelectAllCols}>
              {selectedCols.length === DRIVER_EXPORT_COLUMNS.length
                ? 'ล้างการเลือกทั้งหมด'
                : 'เลือกทุกคอลัมน์'}
            </Button>
          </Box>
          <FormGroup>
            <Grid container>
              {DRIVER_EXPORT_COLUMNS.map(col => (
                <Grid item xs={12} sm={6} key={col.key}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={selectedCols.includes(col.key)}
                        onChange={() => handleToggleColumn(col.key)}
                      />
                    }
                    label={<Typography variant="body2">{col.label}</Typography>}
                  />
                </Grid>
              ))}
            </Grid>
          </FormGroup>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose}>ยกเลิก</Button>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedCols.length === 0}
          onClick={handleSubmit}
          startIcon={<DownloadIcon size={16} />}
        >
          ดาวน์โหลดไฟล์ {fileType}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ExportReportModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fileType: PropTypes.oneOf(['EXCEL', 'PDF']).isRequired,
  selectedCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onConfirmExport: PropTypes.func.isRequired
};

export default ExportReportModal;
