import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';

const safetyRoutes = [
  {
    exact: true,
    path: '/app/safety',
    component: () => <Redirect to="/app/safety/drivers" />
  },
  {
    exact: true,
    path: '/app/safety/drivers',
    component: lazy(() => import('./views/DriverListView'))
  },
  {
    exact: true,
    path: '/app/safety/dashboard',
    component: lazy(() => import('./views/AccidentDashboardView'))
  },
  {
    exact: true,
    path: '/app/safety/accidents',
    component: lazy(() => import('./views/AccidentListView'))
  }
];

export default safetyRoutes;
