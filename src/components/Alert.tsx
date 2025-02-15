import React, { Fragment, useState } from 'react';
import { Alert as MUIAlert, Stack, Snackbar } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectAlertState } from '../store/slices/ui';

interface ComponentProps {

}

const Alert: React.FC<ComponentProps> = (props: ComponentProps) => {
  const alerts = useSelector(selectAlertState);

  return (
    <Fragment>
      <Stack spacing={3} sx={{ maxWidth: "100%" }}>
        {
          alerts.map((alert: any, index: number) => (
            <Snackbar
              open={true}
              key={index}
              transitionDuration={300}
              sx={{ position: 'fixed !important', bottom: '10px !important' }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <MUIAlert severity={alert.alertType} sx={{ width: '100%' }}>
                {alert.msg}
              </MUIAlert>
            </Snackbar>
          ))
        }
      </Stack>
    </Fragment>
  )
}

export default Alert;