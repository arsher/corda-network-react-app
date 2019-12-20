import React from 'react';

const TabsNav = () => (
    <ul>
        <li className="tab" rel="identity-service-tab">
            Identity Manager
        </li>
        <li className="tab" rel="network-map-service-tab">
            Network Map
        </li>
        <li className="tab" rel="notary-service-tab">
            Notary
        </li>
        <li className="tab" rel="support-service-tab">
            Support
        </li>
    </ul>
);

export default TabsNav;
