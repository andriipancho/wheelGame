import {home, game} from "../pages";

const routes = {};
const templates = {};

function route (path, template) {
    if (typeof template === 'function') {
        return routes[path] = template;
    }
    else if (typeof template === 'string') {
        return routes[path] = templates[template];
    } else {
        return null;
    }
}

function template (name, templateFunction) {
    return templates[name] = templateFunction;
}

template('home', () => home());
template('game', ()=> game());

route('/', 'home');
route('/game', 'game');

function resolveRoute(route) {
    try {
        return routes[route];
    } catch (e) {
        throw new Error(`Route ${route} not found`);
    }
}

export function router(evt) {
    const url = window.location.hash.slice(1) || '/';
    const route = resolveRoute(url);

    route();
}

window.addEventListener('load', router);
window.addEventListener('hashchange', router);