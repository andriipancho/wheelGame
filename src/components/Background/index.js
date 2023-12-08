import * as PIXI from "pixi.js";

export function createBackground() {
    const container = new PIXI.Container();
    const landscapeTexture = PIXI.Texture.from('/graphics/bg.png');
    const texture = new PIXI.Texture(landscapeTexture, new PIXI.Rectangle(0, 0, 1280, 720));
    const background = new PIXI.Sprite(texture);
    container.addChild(background);

    return container;
}