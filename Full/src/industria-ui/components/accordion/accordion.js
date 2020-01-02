currentDocument = document.currentScript.ownerDocument;

class AccordionElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const template = currentDocument.querySelector('#accordion');
        const instance = template.content.cloneNode(true);

        document.getElementById('accordion-page').appendChild(instance);
    }
}

customElements.define('accordion-element', AccordionElement);