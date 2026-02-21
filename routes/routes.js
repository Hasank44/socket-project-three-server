import userRoute from './userRoute.js';
import conversationRoute from './conversationRoute.js';
import messageRoute from './messageRoute.js'

const routes = [
    { path: '/api/v1/user', handler: userRoute },
    { path: '/api/v1/user', handler: conversationRoute },
    { path: '/api/v1/user', handler: messageRoute },
];

const setRoute = (app) => {
    routes.forEach(({ path, handler }) => app.use(path, handler));
};
export default setRoute;