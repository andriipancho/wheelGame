import * as PIXI from "pixi.js";

export const createText = ({text, fontSize = 30, fontWeight = '400'}) => {
    const container = new PIXI.Container();
    const textStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize,
        fontWeight,
        fill: ['#ffffff', '#00ff99'], // gradient
        stroke: '#4a1850',
    });

    const basicText = new PIXI.Text(text, textStyle);
    basicText.anchor.set(0.5);
    container.addChild(basicText);
    return container;
}