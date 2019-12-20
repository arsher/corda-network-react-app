currentDocument = document.currentScript.ownerDocument;

class CardsElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const template = currentDocument.querySelector('#cards');
        const instance = template.content.cloneNode(true);

        document.getElementById('cards-page').appendChild(instance);
    }
}

customElements.define('cards-element', CardsElement);