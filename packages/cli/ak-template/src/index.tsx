import Launcher from '@aktiv/launcher';
import RouterConfig from './config/router.config';

const app = new Launcher({
    routes: RouterConfig,
});

app.start();
