import {createButton} from "../../components/Button";
import {app} from "../..";
import {createText} from "../../components/Text";

export function home() {
    drawTitle();
    drawButton();
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