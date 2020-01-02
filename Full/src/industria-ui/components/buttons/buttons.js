currentDocument = document.currentScript.ownerDocument;

class ButtonsElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const template = currentDocument.querySelector('#buttons');
        const instance = template.content.cloneNode(true);

        document.getElementById('buttons-page').appendChild(instance);
    }
}

customElements.define('buttons-element', ButtonsElement);