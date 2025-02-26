import { Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Your page imports */
import Home from './pages/Home';
import DisplayGraph from './pages/DisplayGraph';
import DisplayStats from './pages/DisplayStats';
import Upload from './pages/Upload';
import History from './pages/History';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Your CSS */
import './App.css';



setupIonicReact();

const App: React.FC = () => {

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/** Page routing here */}
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/display/:id/graph">
            <DisplayGraph />
          </Route>
          <Route path="/display/:id/stats">
            <DisplayStats />
          </Route>
          <Route path="/upload">
            <Upload />
          </Route>
          <Route path="/history">
            <History />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
