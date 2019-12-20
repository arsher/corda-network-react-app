import React from 'react';
import { Route } from 'react-router-dom';
import './Breadcrumb.scss';

const cnfPaths = [
    'about',
    'minutes',
    'governance',
    'participation',
    'policy',
    'trust-root',
];

const Breadcrumbs = () => (
    <Route
        path="*"
        render={(props) => {
            let parts = props.location.pathname.split('/');
            const group = parts[1];
            parts = parts.slice(1, parts.length - 1);

            if (cnfPaths.indexOf(group) !== -1) {
                return (
                    <div className="cnf-path">
                        <span className="path">
                            {parts.map(crumb)}{' '}
                            <i className="mdi mdi-chevron-right"></i>
                            {breadcrumbMap[props.location.pathname]}
                        </span>
                        <a
                            href={`https://github.com/corda-network/corda-network.github.io/blame/master${props.location.pathname}.md`}
                            target="_blank"
                            rel="noopener noreferrer">
                            Document History
                        </a>
                    </div>
                );
            } else {
                return null;
            }
        }}
    />
);

const crumb = (part, partIndex, parts) => {
    const path = ['', ...parts.slice(0, partIndex + 1)].join('/');
    return <span key={path}>{part}</span>;
};

const breadcrumbMap = {
    '/about/concepts': 'Concepts',
    '/about/business-networks': 'Business Networks',
    '/about/businessnetworkstoolkit': 'Business Networks Toolkit',
    '/about/news': 'News',
    '/about/contact': 'Contact',
    '/about/faq': 'FAQ',
    '/minutes/index': 'Minutes and Governance Events of Board Meetings',
    '/minutes/20191206': 'Minutes of the Board Meeting of 6 December 2019',
    '/minutes/event-0001': 'Advisory Governance Event 0001',
    '/minutes/event-0007': 'Mandatory Governance Event 0007',
    '/minutes/event-0008': 'Mandatory Governance Event 0008',
    '/governance/index': 'Corda Network Foundation',
    '/governance/governance-guidelines': 'Guidelines',
    '/governance/articles': 'Articles of Association',
    '/governance/bylaws': 'BY-LAWS',
    '/governance/board-election': 'Transition Board',
    '/governance/events': 'Events',
    '/participation/pre-joining': 'Preparing to Join',
    '/participation/join-directly-or-as-sponsor':
        'Join Directly or as a Sponsor',
    '/participation/network-choice': 'Deciding on the Right Network Choice',
    '/participation/membership-tiers': 'Pricing',
    '/participation/notary-considerations': 'Notary Considerations',
    '/participation/networkparamsschedule': 'Network Parameter Updates',
    '/participation/preprod': 'Corda Pre-Production Network',
    '/participation/index': 'Joining Corda Network',
    '/participation/distinguishedname': "node's X500 name",
    '/participation/legalentity': 'Legal Entity',
    '/policy/admission-criteria': 'Admission Criteria',
    '/policy/anti-trust': 'Anti-Trust',
    '/policy/code-conduct': 'Code of Conduct',
    '/policy/conflict-interest': 'Conflict of Interest',
    '/policy/dispute-resolution': 'Dispute Resolution',
    '/policy/information-classification': 'Information Classification',
    '/policy/network-services': 'Network Services',
    '/policy/notary-services': 'Notary Services',
    '/policy/gdpr': 'Privacy',
    '/policy/security': 'Security',
    '/policy/supplier-management': 'Supplier Management',
    '/policy/acceptable-use': 'Acceptable Use',
    '/policy/access-control': 'Access Control',
    '/policy/backup-restore': 'Backup Restore',
    '/policy/change-management': 'Change Management',
    '/policy/configuration-management': 'Configuration Management',
    '/policy/cryptographic-material': 'Cryptographic Material',
    '/policy/deployment': 'Deployment',
    '/policy/emergency-access': 'Emergency Access',
    '/policy/environments': 'Environments',
    '/policy/incident-response': 'Incident Response',
    '/policy/inventory-management': 'Inventory Management',
    '/policy/organisation-info-security': 'Organisation Info Security',
    '/policy/production-sla': 'Production Sla',
    '/policy/physical-security': 'Physical Security',
    '/policy/updates-patching': 'Updates Patching',
    '/policy/allowable-names': 'Allowable Names',
    '/policy/clock-synchronisation': 'Clock Synchronisation',
    '/policy/event-horizon': 'Event Horizon',
    '/policy/ip-addresses': 'ip addresses',
    '/policy/namespace-ownership': 'Namespace Ownership',
    '/policy/network-params-update': 'Network Parameters Update',
    '/policy/port-ranges': 'Port Ranges',
    '/policy/protocol-definition': 'Protocol Definition',
    '/trust-root/index': 'Trust Root Generation',
    '/trust-root/certificate-policy': 'Certificate Policy',
    '/trust-root/certificate-practices': 'Certificate Practices',
};

export default Breadcrumbs;
