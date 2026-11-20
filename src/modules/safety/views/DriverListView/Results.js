import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Checkbox,
  Divider,
  InputAdornment,
  MenuItem,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
import Label from 'src/components/Label';

const useStyles = makeStyles((theme) => ({
  root: {},
  queryField: {
    width: 360,
    maxWidth: '100%'
  },
  filterField: {
    minWidth: 200,
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0,
      marginTop: theme.spacing(1.5),
      width: '100%'
    }
  }
}));

function getLicenseStatus(expDateStr) {
  if (!expDateStr) return { label: 'ไม่มีข้อมูล', color: 'warning' };
  const today = new Date();
  const expDate = new Date(expDateStr);
  const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { label: `หมดอายุแล้ว (${expDateStr})`, color: 'error' };
  }
  if (diffDays <= 30) {
    return { label: `ใกล้หมดอายุ (${expDateStr})`, color: 'warning' };
  }
  return { label: expDateStr, color: 'success' };
}

function Results({
  className,
  drivers,
  selectedIds,
  onSelectOne,
  onSelectAll,
  ...rest
}) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [factoryFilter, setFactoryFilter] = useState('ALL');
  const [positFilter, setPositFilter] = useState('ALL');

  const factories = Array.from(
    new Set(drivers.map((d) => d.FACTORY_NAME).filter(Boolean))
  );

  const filteredDrivers = drivers.filter((driver) => {
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      driver.EMPLOYEE_CODE?.toLowerCase().includes(q) ||
      driver.FULL_NAME?.toLowerCase().includes(q) ||
      driver.DRIVER_LC_NO?.toLowerCase().includes(q) ||
      driver.VH_REGIS_PLATE?.toLowerCase().includes(q);

    const matchesFactory =
      factoryFilter === 'ALL' || driver.FACTORY_NAME === factoryFilter;

    const matchesPosit =
      positFilter === 'ALL' || driver.POSIT?.trim() === positFilter;

    return matchesQuery && matchesFactory && matchesPosit;
  });

  const paginatedDrivers = filteredDrivers.slice(
    page * limit,
    page * limit + limit
  );

  const selectedAllSome =
    selectedIds.length > 0 && selectedIds.length < filteredDrivers.length;
  const selectedAll =
    filteredDrivers.length > 0 && selectedIds.length === filteredDrivers.length;

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Box p={2} display="flex" alignItems="center" flexWrap="wrap">
        <TextField
          className={classes.queryField}
          size="small"
          variant="outlined"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          placeholder="ค้นหารหัสพนักงาน, ชื่อ-สกุล, เลขใบขับขี่, ทะเบียนรถ..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SvgIcon fontSize="small" color="action">
                  <SearchIcon />
                </SvgIcon>
              </InputAdornment>
            )
          }}
        />
        <TextField
          select
          size="small"
          variant="outlined"
          label="โรงงานที่สังกัด"
          className={classes.filterField}
          value={factoryFilter}
          onChange={(e) => {
            setFactoryFilter(e.target.value);
            setPage(0);
          }}
        >
          <MenuItem value="ALL">ทุกโรงงานทั้งหมด</MenuItem>
          {factories.map((fac) => (
            <MenuItem key={fac} value={fac}>
              {fac}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          variant="outlined"
          label="ประเภทคนขับ (POSIT)"
          className={classes.filterField}
          value={positFilter}
          onChange={(e) => {
            setPositFilter(e.target.value);
            setPage(0);
          }}
        >
          <MenuItem value="ALL">ทุกประเภทคนขับ</MenuItem>
          <MenuItem value="Driver">Driver (พนักงานขับรถประจำ)</MenuItem>
          <MenuItem value="Driver Subcontract">
            Driver Subcontract (รถร่วม)
          </MenuItem>
          <MenuItem value="Driver Addon">Driver Addon (คนขับเสริม)</MenuItem>
        </TextField>

        <Box flexGrow={1} />
        <Typography variant="body2" color="textSecondary">
          เลือกแล้ว <strong>{selectedIds.length}</strong> /{' '}
          {filteredDrivers.length} คน
        </Typography>
      </Box>

      <Divider />

      <Box minWidth={950} overflow="auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAll}
                  indeterminate={selectedAllSome}
                  onChange={(e) =>
                    onSelectAll(
                      e.target.checked
                        ? filteredDrivers.map((d) => d.EMPLOYEE_CODE)
                        : []
                    )
                  }
                />
              </TableCell>
              <TableCell>รหัส / ชื่อพนักงานขับรถ</TableCell>
              <TableCell>เบอร์โทรศัพท์</TableCell>
              <TableCell>เลขที่ใบขับขี่ (ประเภท)</TableCell>
              <TableCell>วันหมดอายุใบขับขี่</TableCell>
              <TableCell>รถประจำตัว</TableCell>
              <TableCell>โรงงานที่สังกัด</TableCell>
              <TableCell>อัปเดตโดย Admin ล่าสุด</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDrivers.map((driver) => {
              const isSelected = selectedIds.includes(driver.EMPLOYEE_CODE);
              const licenseStatus = getLicenseStatus(driver.DRIVER_LC_EXP);

              return (
                <TableRow
                  hover
                  key={driver.EMPLOYEE_CODE}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isSelected}
                      onChange={() => onSelectOne(driver.EMPLOYEE_CODE)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" color="textPrimary">
                      {driver.FULL_NAME}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      รหัส: {driver.EMPLOYEE_CODE}
                      {driver.POSIT ? ` (${driver.POSIT})` : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>{driver.TEL || '-'}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {driver.DRIVER_LC_NO || '-'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ประเภท: {driver.DRIVER_LC_TYPE || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Label color={licenseStatus.color}>
                      {licenseStatus.label}
                    </Label>
                  </TableCell>
                  <TableCell>{driver.VH_REGIS_PLATE || '-'}</TableCell>
                  <TableCell>{driver.FACTORY_NAME || '-'}</TableCell>
                  <TableCell>
                    <Typography variant="caption" color="textSecondary">
                      {driver.UDATE || '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>

      <TablePagination
        component="div"
        count={filteredDrivers.length}
        page={page}
        rowsPerPage={limit}
        onChangePage={(_, newPage) => setPage(newPage)}
        onChangeRowsPerPage={(e) => {
          setLimit(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50, 100]}
        labelRowsPerPage="แสดงแถว:"
      />
    </Card>
  );
}

Results.propTypes = {
  className: PropTypes.string,
  drivers: PropTypes.array.isRequired,
  selectedIds: PropTypes.array.isRequired,
  onSelectOne: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired
};

export default Results;
