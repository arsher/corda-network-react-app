currentDocument = document.currentScript.ownerDocument;

class LogosElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const template = currentDocument.querySelector('#logos');
        const instance = template.content.cloneNode(true);

        document.getElementById('logos-page').appendChild(instance);
    }
}

customElements.define('logos-element', LogosElement);