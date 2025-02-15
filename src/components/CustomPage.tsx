import React, { ReactNode } from 'react';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { IonContent } from '@ionic/react';

import Alert from './Alert';

interface ComponentProps {
  children?: ReactNode;
}

const CustomPage: React.FC<ComponentProps> = ({ children = [] }: ComponentProps) => {
  
  const theme: any = createTheme({
    palette: {
      primary: {
        main: "#9674FF",
      },
      secondary: {
        main: "#BBD0FF",
      }
    },
    shape: {
      borderRadius: 5,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none', // Set all button text to lowercase
          },
        },
      },
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <IonContent forceOverscroll={false}>
        { children }
        <Alert />
      </IonContent>
    </ThemeProvider>
  )
}

export default CustomPage;