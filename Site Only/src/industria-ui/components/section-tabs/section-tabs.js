currentDocument = document.currentScript.ownerDocument;

class SectionTabsElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const template = currentDocument.querySelector('#section-tabs');
        const instance = template.content.cloneNode(true);

        document.getElementById('section-tabs-page').appendChild(instance);
    }
}

customElements.define('section-tabs-element', SectionTabsElement);