currentDocument = document.currentScript.ownerDocument;

class AboutElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const template = currentDocument.querySelector('#about');
        const instance = template.content.cloneNode(true);

        document.getElementById('about-system-page').appendChild(instance);
    }
}

customElements.define('about-element', AboutElement);