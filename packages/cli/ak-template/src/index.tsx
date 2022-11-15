import Launcher from 'react-launcher';
import RouterConfig from './config/router.config';

const app = new Launcher({
    routes: RouterConfig,
});

app.start();
