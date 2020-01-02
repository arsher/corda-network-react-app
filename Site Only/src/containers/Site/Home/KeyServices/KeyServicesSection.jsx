import React from 'react';
import './KeyServicesSection.scss';
import TabsNav from './TabsNav/TabsNav';
import IdentityServiceTab from './IdentityServiceTab/IdentityServiceTab';
import NetworkMapServiceTab from './NetworkMapServiceTab/NetworkMapServiceTab';
import NotaryServiceTab from './NotaryServiceTab/NotaryServiceTab';
import SupportServiceTab from './SupportServiceTab/SupportServiceTab';

export default class KeyServicesSection extends React.Component {
    componentDidMount() {
        const tabs = Array.from(document.getElementsByClassName('tab'));
        const tabContents = Array.from(
            document.getElementsByClassName('tab-content')
        );
        const tabHeadings = Array.from(
            document.getElementsByClassName('tab-heading')
        );
        tabs[0].classList.add('selected');
        tabContents[0].style.display = 'block';

        tabHeadings[0].classList.add('selected');

        tabs.forEach((tab) => {
            const clickedIndex = tabs.indexOf(tab);
            tab.addEventListener('click', (e) => {
                tabs.forEach((tab) => {
                    tab.classList.remove('selected');
                    e.currentTarget.classList.add('selected');
                });
                tabContents.forEach((content) => {
                    content.style.display = 'none';
                });
                tabContents[clickedIndex].style.display = 'block';
            });
        });

        tabHeadings.forEach((tab) => {
            const clickedIndex = tab.getAttribute('rel');
            tab.addEventListener('click', (e) => {
                tabHeadings.forEach((tab) => {
                    tab.classList.remove('selected');
                    e.currentTarget.classList.add('selected');
                });
                tabContents.forEach((content) => {
                    content.style.display = 'none';
                });
                document.getElementById(clickedIndex).style.display = 'block';
            });
        });
    }
    render() {
        return (
            <div className="row">
                <div id="vertical-tab-nav" className="col-10 offset-1">
                    <h1>Key Services</h1>
                    <div className="tabs-nav col-4 pl-0">
                        <TabsNav />
                    </div>
                    <div className="tabs-content col-lg-7 offset-lg-1 col-md-7 offset-md-1 col-sm-12 pr-0 pl-sm-0">
                        <h3 className="tab-heading" rel="identity-service-tab">
                            Identity Manager Service
                        </h3>
                        <IdentityServiceTab />
                        <h3
                            className="tab-heading"
                            rel="network-map-service-tab">
                            Network Map Service
                        </h3>
                        <NetworkMapServiceTab />
                        <h3 className="tab-heading" rel="notary-service-tab">
                            Notary Service
                        </h3>
                        <NotaryServiceTab />
                        <h3 className="tab-heading" rel="support-service-tab">
                            Support Service
                        </h3>
                        <SupportServiceTab />
                    </div>
                </div>
            </div>
        );
    }
}
