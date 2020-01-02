currentDocument = document.currentScript.ownerDocument;

class CarouselControlsElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const template = currentDocument.querySelector('#carousel-controls');
        const instance = template.content.cloneNode(true);

        document.getElementById('carousel-controls-page').appendChild(instance);
    }
}

customElements.define('carousel-controls-element', CarouselControlsElement);