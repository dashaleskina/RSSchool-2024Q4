export function createButton (className, text, container) {
    const button = document.createElement("button")
    button.className = className;
    button.textContent = text;

    if (container) {
        container.appendChild(button);
    }

    return button;
}

export function createDiv (className, container, text) {
    const div = document.createElement("div")
    div.className = className;
    div.textContent = text;

    if (container) {
        container.appendChild(div);
    }

    return div;
}