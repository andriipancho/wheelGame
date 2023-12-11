import {router} from "./router/router";
import {assetsMap} from './assetsMap'
import * as PIXI from "pixi.js";
import {config} from "./config";
import {Assets} from "pixi.js";

export const app = new PIXI.Application(config);

const runGame = () => {
    router(''); // start home page
    window.addEventListener('hashchange', router);
}

const graphicsUrls = assetsMap.sprites.map(value => (value.url));
Assets.load(graphicsUrls)
    .then(runGame)