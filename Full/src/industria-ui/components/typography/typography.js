let currentDocument = document.currentScript.ownerDocument;

class TypographyElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // const shadowRoot = this.attachShadow({ mode: 'open' });

        const template = currentDocument.querySelector('#typography');
        const instance = template.content.cloneNode(true);

        document.getElementById('typography-page').appendChild(instance);
    }
}

customElements.define('typography-element', TypographyElement);