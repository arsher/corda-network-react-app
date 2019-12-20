currentDocument = document.currentScript.ownerDocument;

class GridElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const template = currentDocument.querySelector('#grid');
        const instance = template.content.cloneNode(true);

        document.getElementById('grid-page').appendChild(instance);
    }
}

customElements.define('grid-element', GridElement);