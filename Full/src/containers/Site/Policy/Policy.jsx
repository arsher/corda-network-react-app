import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AdmissionCriteria from './BusinessPolicy/AdmissionCriteria/AdmissionCriteria';
import AntiTrust from './BusinessPolicy/AntiTrust/AntiTrust';
import CodeConduct from './BusinessPolicy/CodeConduct/CodeConduct';
import ConflictInterest from './BusinessPolicy/ConflictInterest/ConflictInterest';
import DisputeResolution from './BusinessPolicy/DisputeResolution/DisputeResolution';
import InformationClassification from './BusinessPolicy/InformationClassification/InformationClassification';
import NetworkServices from './BusinessPolicy/NetworkServices/NetworkServices';
import NotaryServices from './BusinessPolicy/NotaryServices/NotaryServices';
import PrivacyPolicy from './BusinessPolicy/PrivacyPolicy/PrivacyPolicy';
import Security from './BusinessPolicy/Security/Security';
import SupplierManagement from './BusinessPolicy/SupplierManagement/SupplierManagement';
import AcceptableUse from './OperatorPolicy/AcceptableUse/AcceptableUse';
import AccessControl from './OperatorPolicy/AccessControl/AccessControl';
import BackupRestore from './OperatorPolicy/BackupRestore/BackupRestore';
import ChangeManagement from './OperatorPolicy/ChangeManagement/ChangeManagement';
import ConfigurationManagement from './OperatorPolicy/ConfigurationManagement/ConfigurationManagement';
import CryptographicMaterial from './OperatorPolicy/CryptographicMaterial/CryptographicMaterial';
import Deployment from './OperatorPolicy/Deployment/Deployment';
import EmergencyAccess from './OperatorPolicy/EmergencyAccess/EmergencyAccess';
import Environments from './OperatorPolicy/Environments/Environments';
import IncidentResponse from './OperatorPolicy/IncidentResponse/IncidentResponse';
import InventoryManagement from './OperatorPolicy/InventoryManagement/InventoryManagement';
import OrganisationInfoSecurity from './OperatorPolicy/OrganisationInfoSecurity/OrganisationInfoSecurity';
import PhysicalSecurity from './OperatorPolicy/PhysicalSecurity/PhysicalSecurity';
import ProductionSla from './OperatorPolicy/ProductionSla/ProductionSla';
import UpdatesPatching from './OperatorPolicy/UpdatesPatching/UpdatesPatching';
import AllowableNames from './TechnicalPolicy/AllowableNames/AllowableNames';
import ClockSynchronisation from './TechnicalPolicy/ClockSynchronisation/ClockSynchronisation';
import EventHorizon from './TechnicalPolicy/EventHorizon/EventHorizon';
import IpAddresses from './TechnicalPolicy/IpAddresses/IpAddresses';
import NamespaceOwnership from './TechnicalPolicy/NamespaceOwnership/NamespaceOwnership';
import NetworkParamsUpdate from './TechnicalPolicy/NetworkParamsUpdate/NetworkParamsUpdate';
import PortRanges from './TechnicalPolicy/PortRanges/PortRanges';
import ProtocolDefinition from './TechnicalPolicy/ProtocolDefinition/ProtocolDefinition';

export default class Policy extends React.Component {
    render() {
        const { match } = this.props;

        return (
            <Switch>
                <Route
                    path={`${match.url}/admission-criteria`}
                    component={AdmissionCriteria}
                />
                <Route path={`${match.url}/anti-trust`} component={AntiTrust} />
                <Route
                    path={`${match.url}/code-conduct`}
                    component={CodeConduct}
                />
                <Route
                    path={`${match.url}/conflict-interest`}
                    component={ConflictInterest}
                />
                <Route
                    path={`${match.url}/dispute-resolution`}
                    component={DisputeResolution}
                />
                <Route
                    path={`${match.url}/information-classification`}
                    component={InformationClassification}
                />
                <Route
                    path={`${match.url}/network-services`}
                    component={NetworkServices}
                />
                <Route
                    path={`${match.url}/notary-services`}
                    component={NotaryServices}
                />
                <Route path={`${match.url}/gdpr`} component={PrivacyPolicy} />
                <Route path={`${match.url}/security`} component={Security} />
                <Route
                    path={`${match.url}/supplier-management`}
                    component={SupplierManagement}
                />
                <Route
                    path={`${match.url}/acceptable-use`}
                    component={AcceptableUse}
                />
                <Route
                    path={`${match.url}/access-control`}
                    component={AccessControl}
                />
                <Route
                    path={`${match.url}/backup-restore`}
                    component={BackupRestore}
                />
                <Route
                    path={`${match.url}/change-management`}
                    component={ChangeManagement}
                />
                <Route
                    path={`${match.url}/configuration-management`}
                    component={ConfigurationManagement}
                />
                <Route
                    path={`${match.url}/cryptographic-material`}
                    component={CryptographicMaterial}
                />
                <Route
                    path={`${match.url}/deployment`}
                    component={Deployment}
                />
                <Route
                    path={`${match.url}/emergency-access`}
                    component={EmergencyAccess}
                />
                <Route
                    path={`${match.url}/environments`}
                    component={Environments}
                />
                <Route
                    path={`${match.url}/incident-response`}
                    component={IncidentResponse}
                />
                <Route
                    path={`${match.url}/inventory-management`}
                    component={InventoryManagement}
                />
                <Route
                    path={`${match.url}/organisation-info-security`}
                    component={OrganisationInfoSecurity}
                />
                <Route
                    path={`${match.url}/physical-security`}
                    component={PhysicalSecurity}
                />
                <Route
                    path={`${match.url}/production-sla`}
                    component={ProductionSla}
                />
                <Route
                    path={`${match.url}/updates-patching`}
                    component={UpdatesPatching}
                />
                <Route
                    path={`${match.url}/allowable-names`}
                    component={AllowableNames}
                />
                <Route
                    path={`${match.url}/clock-synchronisation`}
                    component={ClockSynchronisation}
                />
                <Route
                    path={`${match.url}/event-horizon`}
                    component={EventHorizon}
                />
                <Route
                    path={`${match.url}/ip-addresses`}
                    component={IpAddresses}
                />
                <Route
                    path={`${match.url}/namespace-ownership`}
                    component={NamespaceOwnership}
                />
                <Route
                    path={`${match.url}/network-params-update`}
                    component={NetworkParamsUpdate}
                />
                <Route
                    path={`${match.url}/port-ranges`}
                    component={PortRanges}
                />
                <Route
                    path={`${match.url}/protocol-definition`}
                    component={ProtocolDefinition}
                />
            </Switch>
        );
    }
}
