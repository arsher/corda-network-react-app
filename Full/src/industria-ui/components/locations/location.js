currentDocument = document.currentScript.ownerDocument;

class LocationsElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const template = currentDocument.querySelector('#locations');
        const instance = template.content.cloneNode(true);

        document.getElementById('locations-page').appendChild(instance);
    }
}

customElements.define('locations-element', LocationsElement);