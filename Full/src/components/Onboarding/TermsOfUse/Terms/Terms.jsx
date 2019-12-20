import React from 'react';
import './Terms.scss';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import {
    axiosParticipantRetrievalTokenGET,
    axiosTermsOfUsePdfDownload,
} from '../../../../axios/axios';
import { handleApiError } from '../../../../utils/utils';

const Terms = (props) => {
    const downloadPdf = () => {
        axiosParticipantRetrievalTokenGET()
            .then((response) => {
                console.log(response.data.token);
                const name = props.ptr === 'SPONSOR' ? 'tou_sponsor' : 'tou';
                axiosTermsOfUsePdfDownload(
                    response.data.token,
                    props.context,
                    name
                )
                    .then((response) => {
                        const pdfFile = new Blob([response.data], {
                            type: 'application/pdf',
                        });
                        const fileURL = URL.createObjectURL(pdfFile);
                        window.open(fileURL);
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => {
                console.log(err);
                handleApiError(err);
            });
    };

    return (
        <div className="terms">
            <div className="terms__wrapper">
                <ReactMarkdown source={props.text} />
                {props.downloadAvailable && (
                    <a
                        onClick={() => downloadPdf()}
                        className="btn btn-secondary download-pdf">
                        Download PDF
                    </a>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        ptr: state.ptr.participantType,
    };
};

export default connect(mapStateToProps, null)(Terms);
