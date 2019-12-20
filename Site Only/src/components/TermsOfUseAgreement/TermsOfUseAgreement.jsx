import React from 'react';
import './TermsOfUseAgreement.scss';
import LoadingOverlay from 'react-loading-overlay';
import { connect } from 'react-redux';
import * as actionTypes from './../../store/actions';
import {
    axiosParticipantRetrievalTokenGET,
    axiosParticipantSignedTermsGET,
    axiosOnboardingTermsGET,
    axiosParticipantPrimaryGET,
} from './../../axios/axios';
import base64 from 'base-64';
import Terms from './../Onboarding/TermsOfUse/Terms/Terms';
import jsPDF from 'jspdf';
import { decode_utf8 } from '../../utils/utils';
import { Link } from 'react-router-dom';

class TermsOfUseAgreement extends React.Component {
    constructor(props) {
        super(props);
        this.props.onStartLoader();
        this.state = {
            termsContent: '',
            signedProductionType: '',
            context: '',
        };
    }

    componentDidMount() {
        const agreementType = this.props.location.state
            ? this.props.location.state.type
            : 'UAT';

        axiosParticipantRetrievalTokenGET()
            .then((response) => {
                axiosParticipantSignedTermsGET(response.data.token)
                    .then((response) => {
                        response.data.map((agreement) => {
                            if (agreement.agreementContext === agreementType) {
                                this.setState({
                                    context: agreement.agreementContext,
                                });
                            }
                        });

                        let productionType;
                        if (agreementType === 'UAT') {
                            productionType = 'preproduction';
                        } else {
                            productionType = 'production';
                        }
                        axiosParticipantPrimaryGET()
                            .then((response) => {
                                console.log(response.data.type);
                                this.props.onSetParticipantType(
                                    response.data.type
                                );
                            })
                            .then(() => {
                                axiosOnboardingTermsGET(
                                    productionType,
                                    this.props.ptr.participantType
                                )
                                    .then((response) => {
                                        this.setState({
                                            termsContent: decode_utf8(
                                                base64
                                                    .decode(
                                                        response.data.content
                                                    )
                                                    .replace(/<u>/g, '_')
                                                    .replace(/<\/u>/g, '_')
                                                    .replace(
                                                        /[\u0080-\uffff]/g,
                                                        ''
                                                    )
                                            ),
                                            signedProductionType: productionType,
                                        });
                                        const headings = Array.from(
                                            document.getElementsByTagName('h3')
                                        );
                                        headings[0].innerText = headings[0].innerText
                                            .toLowerCase()
                                            .replace(
                                                /\b(\w)/g,
                                                (firstLetter) => {
                                                    return firstLetter.toUpperCase();
                                                }
                                            );
                                        this.props.onStopLoader();
                                    })
                                    .catch((err) => {
                                        this.props.onStopLoader();
                                    });
                            });
                    })
                    .catch((err) => {
                        this.props.onStopLoader();
                    });
            })
            .catch((err) => {
                this.props.onStopLoader();
            });
    }

    createPdf(e) {
        e.preventDefault();

        const htmlElement = Array.from(
            document.querySelectorAll('.terms__wrapper')
        );

        let replaceHeader =
            '<h4>' +
            Array.from(htmlElement[0].querySelectorAll('h3'))[0].innerHTML +
            '</h4>';

        Array.from(
            htmlElement[0].querySelectorAll('h3')
        )[0].outerHTML = replaceHeader;

        let doc = new jsPDF('p', 'pt', 'letter');

        let source = htmlElement[0];

        let specialElementHandlers = {
            '.terms__wrapper': function(element, renderer) {
                return true;
            },
        };
        let margins = {
            top: 60,
            bottom: 60,
            left: 30,
            right: 30,
            width: 522,
        };

        doc.fromHTML(
            source,
            margins.left,
            margins.top,
            {
                width: margins.width,
                elementHandlers: specialElementHandlers,
            },

            function(dispose) {
                doc.save('Terms of use');
            },
            margins
        );
    }

    render() {
        return (
            <LoadingOverlay
                active={this.props.loader.isLoading}
                spinner
                text="Loading...">
                <div className="container-fluid bg-ghost-white terms-of-use-agreement">
                    <div className="row">
                        <div className="px-0 col-8 offset-2">
                            <div className="back-btn ">
                                <Link
                                    to={{
                                        pathname: '/dashboard/account',
                                        state: {
                                            type: 'UAT',
                                        },
                                    }}
                                    className="solo-link link-secondary box--flex center--y">
                                    <i className="mdi mdi-chevron-left"></i>
                                    back
                                </Link>
                            </div>

                            <Terms
                                productionType={this.state.signedProductionType}
                                text={this.state.termsContent}
                                downloadAvailable={true}
                                context={this.state.context}
                                name={this.props.ptr.participantType}
                                createPdf={(e) => this.createPdf(e)}
                            />
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        uar: state.uar,
        ptr: state.ptr,
        loader: state.loader,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
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
        onSetParticipantType: (type) =>
            dispatch({
                type: actionTypes.SET_PARTICIPANT_TYPE,
                participantType: type,
            }),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TermsOfUseAgreement);
