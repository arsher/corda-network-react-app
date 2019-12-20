currentDocument = document.currentScript.ownerDocument;

class ColorsElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const template = currentDocument.querySelector('#colors');
        const instance = template.content.cloneNode(true);

        document.getElementById('colors-page').appendChild(instance);
    }
}

customElements.define('colors-element', ColorsElement);