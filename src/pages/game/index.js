import * as PIXI from "pixi.js";
import {app} from "../..";
import {config} from "../../config";
import {createText} from "../../components/Text";
import {createButton} from "../../components/Button";
import items from "../../shared/data/items";
import {Howl} from 'howler';
import {eventEmitter} from "../../shared/eventEmitter";

const sliceCount = 8;
let balance = 100;
let balanceContainer;
let slicesContainer;
let homeButton;
let startWheelButton;

export function game() {
    eventEmitter.on('handleChangeBalance', redrawBalance)
    window.addEventListener('hashchange', (evt) => {
        eventEmitter.removeAllListeners()
        const url = window.location.hash.slice(1);
        if (url.includes('game')) {
            eventEmitter.on('handleChangeBalance', redrawBalance)
        }
    });

    drawBalance();
    drawHomeButton();
    drawSlices();
    drawCenter();
    drawPointer();
    drawStartWheelButton()
}

function drawBalance() {
    const balanceTextMargin = 20;
    const balanceText = createText({text: `Balance: ${balance}`, fontSize: 40, fontWeight: 'bold'});
    balanceText.position.x = config.width / 2 - balanceText.width / 2 - balanceTextMargin;
    balanceText.position.y = -config.height / 2 + balanceText.height / 2 + balanceTextMargin;
    app.stage.addChild(balanceText);
    balanceContainer = balanceText;
}

function redrawBalance(value) {
    balance += value;
    const balanceTextIndex = app.stage.children.findIndex(item => item._boundsID === balanceContainer._boundsID)
    app.stage.removeChildren(balanceTextIndex, balanceTextIndex + 1)
    drawBalance();
}

function drawHomeButton() {
    const onCLick = () => {
        const link = document.createElement('a');
        link.href = '#';
        link.click();
    }

    const buttonMargin = 20;
    const button = createButton({text: "Home", onClick: onCLick});
    button.position.x = -config.width / 2 + button.width / 2 - buttonMargin;
    button.position.y = -config.height / 2 + buttonMargin;
    app.stage.addChild(button);

    homeButton = button;
}

function drawStartWheelButton() {
    const onCLick = () => {
        startWheelButton.visible = false;
        spinWheel();
    }

    const button = createButton({text: "Press to spin", onClick: onCLick});
    button.position.x = -button.width / 2;
    button.position.y = -button.height / 2;
    app.stage.addChild(button);

    startWheelButton = button;
}

function drawCenter() {
    const centerTexture = PIXI.Texture.from('/graphics/wheelCenter.png'); // Replace with center image
    const centerScale = 0.5; // Adjust scale factor as needed
    const center = new PIXI.Sprite(centerTexture);
    center.anchor.set(0.5);
    center.scale.set(centerScale);
    app.stage.addChild(center);
}

function drawPointer() {
    const pointerTexture = PIXI.Texture.from('/graphics/wheelPointer.png'); // Replace with pointer image
    const pointer = new PIXI.Sprite(pointerTexture);
    pointer.anchor.set(0.5);
    pointer.position.set(0, -300);
    app.stage.addChild(pointer);
}

function drawSlices() {
    const container = new PIXI.Container();
    const sliceTexture = PIXI.Texture.from('/graphics/wheelSlice.png'); // Replace with slice image
    const sliceScale = 0.65; // Adjust scale factor as needed
    const slices = [];
    for (let i = 0; i < sliceCount; i++) {
        const slice = new PIXI.Sprite(sliceTexture);
        slice.anchor.set(0.5);

        // Calculate position based on the slice's angle around the center
        const sliceAngle = (Math.PI * 2 / sliceCount) * i;
        const radius = 150; // Adjust the radius of the wheel
        const sliceX = radius * Math.cos(sliceAngle + Math.PI / sliceCount);
        const sliceY = radius * Math.sin(sliceAngle + Math.PI / sliceCount);

        slice.position.set(sliceX, sliceY);
        slice.rotation = sliceAngle - Math.PI * 1.378; // Rotate slices to position correctly
        slice.scale.set(sliceScale);
        container.addChild(slice);
        slices.push(slice);

        const potentialWinningAmounts = items.map(item => item.amount); // Add amounts for each slice

        // Add text for potential winning amount inside each slice
        const text = createText({text: `${potentialWinningAmounts[i]}`, fontSize: 20})
        text.position.set(sliceX, sliceY);
        text.rotation = sliceAngle + Math.PI * 1.6; // Rotate text to match slice
        container.addChild(text);
        app.stage.addChild(container);

        slicesContainer = container;
    }
}

function spinWheel() {
    homeButton.visible = false;
    const sound = new Howl({src: '/sounds/ding_b.wav', loop: true});
    sound.play();
    const spinDuration = 3000; // Duration of the spin (milliseconds)
    const frameCount = 60; // Number of frames
    const pointerOffset = Math.PI * 3 / 2; // Offset for the pointer's position

    // Define winning slice probabilities and corresponding amounts
    const sliceProbabilities = items.map(item => item.weight); // Add probabilities for each slice
    const sliceAmounts = items.map(item => item.amount); // Add amounts for each slice

    // Calculate the total sum of probabilities
    const totalProbability = sliceProbabilities.reduce((acc, curr) => acc + curr, 0);

    // Calculate weighted probability ranges
    const weightedRanges = [];
    let prevRange = 0;
    for (let i = 0; i < sliceProbabilities.length; i++) {
        const probability = sliceProbabilities[i] / totalProbability;
        const range = prevRange + probability;
        weightedRanges.push(range);
        prevRange = range;
    }

    const randomRotation = Math.random() * Math.PI * 4 + Math.PI * 8; // Random rotation
    const totalRotation = slicesContainer.rotation + randomRotation;

    // Calculate the angle for each frame of the spin
    const step = (totalRotation - slicesContainer.rotation) / frameCount;

    let count = 0;
    const spinInterval = setInterval(() => {
        slicesContainer.rotation += step;
        count++;

        if (count >= frameCount) {
            clearInterval(spinInterval);

            // Calculate the normalized angle within 2π
            let normalizedRotation = slicesContainer.rotation % (Math.PI * 2);
            if (normalizedRotation < 0) {
                normalizedRotation += Math.PI * 2;
            }

            // Calculate the pointer angle considering its top position and the offset
            const pointerAngle = (Math.PI * 2 - normalizedRotation + pointerOffset) % (Math.PI * 2);

            // Calculate the winning slice index based on the pointer's angle
            const sliceAngle = (Math.PI * 2) / sliceCount;
            let winningIndex = Math.floor(pointerAngle / sliceAngle);
            if (winningIndex >= sliceCount) {
                winningIndex = 0; // Ensure the index doesn't exceed the slice count
            }

            // Display the winning amount on the winning slice
            const winningAmount = sliceAmounts[winningIndex];
            eventEmitter.emit('handleChangeBalance', +winningAmount)
            sound.stop();
            new Howl({src: '/sounds/final.wav'}).play();
            drawWinMessage(winningAmount);
        }
    }, spinDuration / frameCount);
}

function drawWinMessage(winAmount) {
    let interval;
    let winText;
    const onCLick = () => {
        if (interval) {
            clearInterval(interval);
        }
        if (!winText) {
            return;
        }
        const winTextIndex = app.stage.children.findIndex(item => item._boundsID === winText._boundsID)
        app.stage.removeChildren(winTextIndex, winTextIndex + 1);
        startWheelButton.visible = true;
        homeButton.visible = true;
    }
    winText = createButton({text: `You won ${winAmount}`, onClick: onCLick});
    winText.position.x = -winText.width / 2;
    winText.position.y = -winText.height / 2;
    app.stage.addChild(winText);

    interval = setTimeout(() => onCLick(), 3000)
}