import {createButton} from "../../components/Button";
import {app} from "../..";
import {createText} from "../../components/Text";
import {config} from "../../config";
import {createBackground} from "../../components/Background";

export function home() {
    app.stage.position.set(config.width / 2, config.height / 2);

    drawBackground();
    drawTitle();
    drawButton();
}

function drawBackground() {
    const background = createBackground();
    background.scale.set(config.width / background.height);
    background.position.x = -background.width / 2;
    background.position.y = -background.height / 2;
    app.stage.addChild(background);
}

function drawTitle() {
    const title = createText({text: "Wheel of Wonders", fontSize: 60, fontWeight: 'bold'});
    title.position.y = -50;
    app.stage.addChild(title);
}

function drawButton() {
    const onCLick = () => {
        const link = document.createElement('a');
        link.href = '#/game';
        link.click();
    }

    const button = createButton({text: "Start game", onClick: onCLick});
    button.position.x = -button.width / 2;
    button.position.y = -button.height / 2 + 50;
    app.stage.addChild(button);
}