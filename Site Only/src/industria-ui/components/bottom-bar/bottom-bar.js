currentDocument = document.currentScript.ownerDocument;

class BottomBarElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const template = currentDocument.querySelector('#bottom-bar');
        const instance = template.content.cloneNode(true);

        document.getElementById('bottom-bar-page').appendChild(instance);
    }
}

customElements.define('bottom-bar-element', BottomBarElement);