import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@material-ui/core';
import { Send as SendIcon } from 'react-feather';

export const ACCIDENT_TOPICS = [
  { code: 'ACC-01', label: '1. รถเฉี่ยวชนกับคู่กรณี (มีผู้บาดเจ็บ)' },
  { code: 'ACC-02', label: '2. รถเฉี่ยวชนกับคู่กรณี (ไม่มีผู้บาดเจ็บ)' },
  {
    code: 'ACC-03',
    label: '3. รถเฉี่ยวชนสิ่งกีดขวาง / ทรัพย์สินโรงงานเสียหาย'
  },
  { code: 'ACC-04', label: '4. รถเสียหลัก / ตกข้างทาง / พลิกคว่ำ' },
  { code: 'ACC-05', label: '5. อุบัติเหตุผู้โดยสารขณะขึ้น-ลงรถ' },
  {
    code: 'ACC-06',
    label: '6. เหตุฉุกเฉินระหว่างเดินรถ (ไฟไหม้ / ยางระเบิด / เบรกขัดข้อง)'
  }
];

const SEVERITY_LEVELS = [
  {
    value: 'MINOR',
    label: 'เล็กน้อย (ทรัพย์สินเสียหายเล็กน้อย / ไม่มีผู้บาดเจ็บ)'
  },
  {
    value: 'MODERATE',
    label: 'ปานกลาง (รถไม่สามารถวิ่งต่อได้ / บาดเจ็บเล็กน้อย)'
  },
  {
    value: 'CRITICAL',
    label: 'รุนแรง (มีผู้บาดเจ็บหนัก / เสียชีวิต / กระทบโรงงาน)'
  }
];

function AccidentCreateModal({ open, onClose, onSubmitCase }) {
  const [formData, setFormData] = useState({
    topicCode: 'ACC-02',
    severity: 'MINOR',
    incidentDateTime: '',
    plateNumber: '',
    driverName: '',
    factoryName: '',
    location: '',
    description: ''
  });

  const handleChange = field => e => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const topicObj = ACCIDENT_TOPICS.find(t => t.code === formData.topicCode);
    onSubmitCase({
      ...formData,
      topicLabel: topicObj ? topicObj.label : formData.topicCode,
      reportedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          แจ้งเหตุอุบัติเหตุฉุกเฉิน (ส่งแจ้งเตือนถึง จป. ทันที)
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
              <TextField
                select
                fullWidth
                required
                variant="outlined"
                label="หัวข้อประเภทอุบัติเหตุ (มาตรฐาน จป.)"
                value={formData.topicCode}
                onChange={handleChange('topicCode')}
              >
                {ACCIDENT_TOPICS.map(t => (
                  <MenuItem key={t.code} value={t.code}>
                    {t.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                select
                fullWidth
                required
                variant="outlined"
                label="ระดับความรุนแรง"
                value={formData.severity}
                onChange={handleChange('severity')}
              >
                {SEVERITY_LEVELS.map(s => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="datetime-local"
                variant="outlined"
                label="วันและเวลาที่เกิดเหตุจริง"
                InputLabelProps={{ shrink: true }}
                value={formData.incidentDateTime}
                onChange={handleChange('incidentDateTime')}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                variant="outlined"
                label="ทะเบียนรถที่เกิดเหตุ"
                placeholder="เช่น 30-1234 ชลบุรี"
                value={formData.plateNumber}
                onChange={handleChange('plateNumber')}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                variant="outlined"
                label="ชื่อพนักงานขับรถ"
                value={formData.driverName}
                onChange={handleChange('driverName')}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                variant="outlined"
                label="โรงงาน / สายงานที่วิ่ง"
                value={formData.factoryName}
                onChange={handleChange('factoryName')}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                variant="outlined"
                label="สถานที่เกิดเหตุ (ถนน / จุดสังเกต)"
                value={formData.location}
                onChange={handleChange('location')}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={3}
                variant="outlined"
                label="รายละเอียดเหตุการณ์เบื้องต้น และการแก้ไขเฉพาะหน้า"
                value={formData.description}
                onChange={handleChange('description')}
              />
            </Grid>
          </Grid>
          <Box mt={1.5}>
            <Typography variant="caption" color="textSecondary">
              * ระบบจะบันทึกเวลาแจ้งเหตุอัตโนมัติ และส่งแจ้งเตือนเข้า LINE /
              Email ของเจ้าหน้าที่ความปลอดภัย (จป.) ทันที
            </Typography>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={onClose}>ยกเลิก</Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            startIcon={<SendIcon size={16} />}
          >
            บันทึกและแจ้ง จป. ทันที
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

AccidentCreateModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmitCase: PropTypes.func.isRequired
};

export default AccidentCreateModal;
