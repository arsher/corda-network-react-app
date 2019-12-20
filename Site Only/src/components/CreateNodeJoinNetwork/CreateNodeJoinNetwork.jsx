import React, { Component } from 'react';
import './CreateNodeJoinNetwork.scss';
import * as actionTypes from '../../store/actions';
import { connect } from 'react-redux';

class CreateNodeJoinNetwork extends Component {
    handleBackAction() {
        if (
            this.props.cnr.currentStep ===
            actionTypes.NETWORKS_HOW_TO_SET_UP_A_NODE
        ) {
            this.props.onBackToNetworks();
        } else {
            this.props.onBackToSponsoredParticipants();
        }
    }

    render() {
        return (
            <div className="container-fluid create-node-join-network bg-ghost-white">
                <div className="row">
                    <div className="col-8 offset-2">
                        <div
                            className="back"
                            onClick={this.handleBackAction.bind(this)}>
                            <i className="mdi mdi-chevron-left"></i>
                            <button className="btn btn-secondary btn-link">
                                Back
                            </button>
                        </div>
                        <div className="how-to-create-node-container p-30 bg-white">
                            <h1 className="text-center h3">
                                Create a Node and Join the Network
                            </h1>
                            <div className="h-splitter"></div>
                            <p>
                                Now the legal and finance steps are complete,
                                it’s time to deploy a node. These steps should
                                be driven by a technical employee from your
                                organization – please hand over to them at this
                                stage. Once these steps are done, your node will
                                be able to transact on Corda Network.
                            </p>
                            <div className="h-splitter h-splitter--big"></div>
                            <p>
                                Deploying a node will require a number of steps
                                which will vary depending on your technical
                                {/* eslint-disable-next-line */}
                                set-up.{' '}
                                <a href="" className="hovered">
                                    This page
                                </a>{' '}
                                provides the best general overview. This will
                                include:
                            </p>
                            <ol>
                                <li>Creating a node directory</li>
                                <li>Adding files to the node directory</li>
                                <li>Adding CorDapps</li>
                                <li>
                                    Adding the truststore jks file for the
                                    correct environment in you certificates
                                    folder. The password for both is
                                    "trustpass".
                                    <div>
                                        <a
                                            href="https://corda.network/assets/trustroots/preproduction/network-root-truststore.jks"
                                            className="btn btn-download box box--flex--inline center--y center--XxX">
                                            <div className="box box--flex center--y">
                                                <i className="mdi mdi-download"></i>
                                                <div className="template-name">
                                                    Pre-production-network-root-truststore.jks
                                                </div>
                                            </div>
                                            <div className="size">1.2kb</div>
                                        </a>
                                    </div>
                                    <div>
                                        <a
                                            href="https://corda.network/assets/trustroots/production/network-root-truststore.jks"
                                            className="btn btn-download box box--flex--inline center--y center--XxX">
                                            <div className="box box--flex center--y">
                                                <i className="mdi mdi-download"></i>
                                                <div className="template-name">
                                                    Production-network-root-truststore.jks
                                                </div>
                                            </div>
                                            <div className="size">1.2kb</div>
                                        </a>
                                    </div>
                                </li>

                                <li>
                                    Creating system-level services to manage
                                    your node
                                </li>
                                <li>
                                    {/* eslint-disable-next-line */}
                                    Creating the{' '}
                                    <a href="" className="hovered">
                                        node config file
                                    </a>
                                    <ul>
                                        <li>
                                            <span>
                                                You should download a draft node
                                                config file here, as this will
                                                contain the right network URLs
                                                and right legal name.
                                            </span>
                                        </li>
                                        <li>
                                            This doesn't yet contain all the
                                            right fields but it is a good
                                            template to work off
                                        </li>
                                    </ul>
                                </li>
                            </ol>
                            <div className="h-splitter"></div>
                            <h5>Configure the node</h5>
                            <h6>Specifying urls for initial registration</h6>
                            <p>
                                We will aoutomatically configure your config
                                file with the network map urls for the public
                                zones, depending on the network you are joining.
                                Please note if you are joining a SSZ, you need
                                to request your unique networkMapURL from
                                info@corda.network. If you want to keep your
                                node's identity 100% private, you need to take
                                care not to accidentally join a public zone.
                            </p>
                            <div className="h-splitter"></div>
                            <h5>Final steps to joining Corda Network:</h5>
                            <h6>Run the initial registration</h6>
                            <p>
                                Once the node.conf file is configured, the
                                following should br typed to the command line:
                            </p>
                            <div className="code-snippet">
                                <code>
                                    java -jar corda.jar --initial-registration
                                </code>
                            </div>
                            <p className="mt-20">
                                This will send a Certificate Signing Request
                                (with the relevant name and email) to the
                                Identity Service.
                            </p>
                            <p>
                                A message simialr to the below will be printed
                                to the console:
                            </p>
                            <div className="code-snippet">
                                <code>
                                    Legal Name: O=ABC LIMITED, L=New York, C=US
                                </code>
                                <code>Email: john.smith@abc.com</code>
                                <br />
                                <code>Public Key: EC Public Key</code>
                                <code className="pl-60">
                                    X:
                                    adsfg76ag9asg58asg58as5g87asg87s5ag8asg5as8g
                                </code>
                                <code className="pl-60">
                                    X:
                                    adsfg76ag9asg58asg58as5g87asg87s5ag8asg5as8g
                                </code>
                                <br />
                                <code>-----BEGIN CERTIFICATE REQUEST-----</code>
                                <code className="mr-50 break-word">
                                    sdfg7d7ga987g96fdsg9fdg86s85823462lk4j36l436l2n2l346lk243j6l2j436ln462lk7n35472ln2345l7n234ln7243ln67l432nl7n23ln7234l7n3l4723l7n3n75zsdgzsdgs54e6bs5r87d6r8n6drtmsdfg7d7ga987g96fdsg9fdg86s85823462lk4j36l436l2n2l346lk243j6l2j436ln462lk7n35472ln2345l7n234ln7243ln67l432nl7n23ln7234l7n3l4723l7n3n75zsdgzsdgs54e6bs5r87d6r8n6drtmsdfg7d7ga987g96fdsg9fdg86s85823462lk4j36l436l2n2l346lk243j6l2j436ln462lk7n35472ln2345l7n234ln7243ln67l432nl7n23ln7234l7n3l4723l7n3n75zsdgzsdgs54e6bs5r87d6r8n6drtm
                                </code>
                                <code>-----END CERTIFICATE REQUEST-----</code>
                                <code>
                                    Submitting certificate signing request to
                                    Corda certificate signing server.
                                </code>
                                <code>
                                    Succesfully submitted request to Corda
                                    certificate signing server, request ID:
                                    21365lkl236lkjlkjl623623236jl23j6l23j6236236j.
                                </code>
                                <code>
                                    Start polling server for certificate signing
                                    approval.
                                </code>
                            </div>
                            <p className="mt-20">
                                Important: the Request ID given in the above
                                should be noted and kept safe for future
                                reference.
                            </p>
                            <h6>Confirmation</h6>
                            <p>
                                Once approved, a signed node CA certificate will
                                be released by the operator to the node. A node
                                in polling mode will automatically download and
                                install the certificate in its local trust
                                store. It will also automatically generate
                                additional identity and TLS certificates from
                                the node CA certificate, which are required for
                                subsequent operation of the node.
                            </p>
                            <p>
                                At this point, the node will terminate and will
                                need to be restarted. Type "java -jar" into the
                                command line. Once restarted, the node will then
                                proceed to download the network map and discover
                                other nodes within Corda Network. By the end of
                                this process, joiners will be a participant in
                                Corda Network and Corda Network Fondation.
                            </p>

                            <p>
                                Confirming your implementation - Installation
                                and configuration of your Corda applications
                                must be undertaken by the node operator.
                                Instructions to install CorDapps can be found on
                                https://docs.corda.net. Specifics on application
                                usage or installation should be avalable from
                                your CorDapp provider.
                            </p>
                            <p className="mb-40">
                                Business Network Operators should co-ordinate
                                any post-install tests that may involve a small
                                number of low value transactions on the business
                                network to assure themselves of the correct
                                setup of their node. Node operators should
                                co-ordinate with their Business Network Operator
                                in this regard. All node-initiated activity on
                                the network from the point of connection is the
                                responsibility of the node operator.
                            </p>
                            <div className="btn-back">
                                <button
                                    className="btn btn-secondary btn-link"
                                    onClick={this.handleBackAction.bind(this)}>
                                    Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ler: state.ler.legalEntity,
        loader: state.loader,
        csr: state.csr,
        uar: state.uar,
        cnr: state.cnr,
        sponsorCurrentStepReducer: state.sponsorCurrentStepReducer.currentStep,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onGoToCreateNodeConfig: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_CREATE_NODE_CONFIG,
            }),
        onStartLoader: () =>
            dispatch({
                type: actionTypes.START_LOADER,
                isLoading: true,
            }),
        onStopLoader: () =>
            dispatch({
                type: actionTypes.STOP_LOADER,
                isLoading: false,
            }),
        onBackToSponsoredParticipants: () =>
            dispatch({
                type: actionTypes.SHOW_SPONSORED_PARTICIPANTS,
            }),
        onBackToNetworks: () =>
            dispatch({
                type: actionTypes.SHOW_CERTIFICATES,
            }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateNodeJoinNetwork);
