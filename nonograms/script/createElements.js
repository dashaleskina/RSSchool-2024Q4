export function createButton (className, text ,container) {
    const button = document.createElement("button")
    button.className = className;
    button.textContent = text;

    if (container) {
        container.appendChild(button);
    }

    return button;
}