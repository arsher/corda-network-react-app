currentDocument = document.currentScript.ownerDocument;

class FormsElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const template = currentDocument.querySelector('#forms');
        const instance = template.content.cloneNode(true);

        document.getElementById('forms-page').appendChild(instance);
    }
}

customElements.define('forms-element', FormsElement);