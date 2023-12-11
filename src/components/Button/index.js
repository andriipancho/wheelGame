import * as PIXI from "pixi.js";
import {createText} from "../Text";
import {Howl} from 'howler';

export const createButton = ({text, onClick}) => {
    const padding = 25;
    const container = new PIXI.Container();

    const buttonText = createText({text})
    buttonText.position.x = padding / 2 + buttonText.width / 2;
    buttonText.position.y = padding / 2 + buttonText.height / 2;

    const graphics = new PIXI.Graphics();
    graphics.lineStyle(5, '#ffffff', 1);
    graphics.beginFill('#4a1850');
    graphics.drawRect(container.width / 2 - graphics.width / 2, container.height / 2 - graphics.height / 2, buttonText.width + padding, buttonText.height + padding);
    graphics.endFill();

    container.addChild(graphics);
    container.addChild(buttonText);

    graphics.eventMode = 'static';
    graphics.cursor = 'pointer';
    graphics.on('pointerdown', () => {
        new Howl({src: '/sounds/button.wav'}).play();
        onClick()
    });

    return container;
}