import {app} from "../../index";
import {config} from "../../config";
import {createBackground} from "../../components/Background";

export function layout(component) {
    app.stage.position.set(config.width / 2, config.height / 2);

    drawBackground();
    return component();
}

function drawBackground() {
    const background = createBackground();
    background.scale.set(config.width / background.height);
    background.position.x = -background.width / 2;
    background.position.y = -background.height / 2;
    app.stage.addChild(background);
}