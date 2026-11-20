import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Card,
  Grid,
  Typography,
  fade,
  makeStyles
} from '@material-ui/core';
import {
  Calendar as MonthIcon,
  Bell as NewReportIcon,
  BarChart2 as YearIcon
} from 'react-feather';
import Label from 'src/components/Label';

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    padding: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      '&:not(:last-of-type)': {
        borderRight: `1px solid ${theme.palette.divider}`
      }
    },
    [theme.breakpoints.down('sm')]: {
      '&:not(:last-of-type)': {
        borderBottom: `1px solid ${theme.palette.divider}`
      }
    }
  },
  avatarNew: {
    backgroundColor: fade(theme.palette.error.main, 0.12),
    color: theme.palette.error.main,
    height: 48,
    width: 48
  },
  avatarMonth: {
    backgroundColor: fade(theme.palette.warning.main, 0.12),
    color: theme.palette.warning.main,
    height: 48,
    width: 48
  },
  avatarYear: {
    backgroundColor: fade(theme.palette.primary.main, 0.12),
    color: theme.palette.primary.main,
    height: 48,
    width: 48
  }
}));

function Overview({ className, stats, monthLabel, yearBE, ...rest }) {
  const classes = useStyles();
  const safeStats = {
    newCount: stats && typeof stats.newCount === 'number' ? stats.newCount : 0,
    monthCount:
      stats && typeof stats.monthCount === 'number' ? stats.monthCount : 0,
    yearCount:
      stats && typeof stats.yearCount === 'number' ? stats.yearCount : 0
  };

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <Grid container>
        <Grid item xs={12} md={4} className={classes.item}>
          <Box>
            <Typography
              component="h3"
              gutterBottom
              variant="overline"
              color="textSecondary"
            >
              รายงานที่เข้ามาใหม่
            </Typography>
            <Box display="flex" alignItems="center" flexWrap="wrap">
              <Typography variant="h3" color="textPrimary">
                {safeStats.newCount} เคส
              </Typography>
              <Box ml={1.5}>
                <Label color={safeStats.newCount > 0 ? 'error' : 'success'}>
                  {safeStats.newCount > 0
                    ? 'รอ จป. รับทราบ'
                    : 'รับเรื่องครบแล้ว'}
                </Label>
              </Box>
            </Box>
          </Box>
          <Avatar className={classes.avatarNew}>
            <NewReportIcon size={22} />
          </Avatar>
        </Grid>

        <Grid item xs={12} md={4} className={classes.item}>
          <Box>
            <Typography
              component="h3"
              gutterBottom
              variant="overline"
              color="textSecondary"
            >
              รายงานสะสมประจำเดือน ({monthLabel})
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="h3" color="textPrimary">
                {safeStats.monthCount} เคส
              </Typography>
            </Box>
          </Box>
          <Avatar className={classes.avatarMonth}>
            <MonthIcon size={22} />
          </Avatar>
        </Grid>

        <Grid item xs={12} md={4} className={classes.item}>
          <Box>
            <Typography
              component="h3"
              gutterBottom
              variant="overline"
              color="textSecondary"
            >
              รายงานสะสมประจำปี ({yearBE})
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography variant="h3" color="textPrimary">
                {safeStats.yearCount} เคส
              </Typography>
            </Box>
          </Box>
          <Avatar className={classes.avatarYear}>
            <YearIcon size={22} />
          </Avatar>
        </Grid>
      </Grid>
    </Card>
  );
}

Overview.propTypes = {
  className: PropTypes.string,
  stats: PropTypes.shape({
    newCount: PropTypes.number.isRequired,
    monthCount: PropTypes.number.isRequired,
    yearCount: PropTypes.number.isRequired
  }).isRequired,
  monthLabel: PropTypes.string.isRequired,
  yearBE: PropTypes.number.isRequired
};

export default Overview;
