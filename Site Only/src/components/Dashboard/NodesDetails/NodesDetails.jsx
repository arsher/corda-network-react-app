import React from 'react';
import './NodesDetails.scss';

const NodesDetails = () => {
    return (
        <div className="nodes-details bg-white">
            <div className="dsh-header box box--flex center--XxX center--y">
                <div className="heading box--flex center--y">
                    <i className="mdi mdi-file-document-box-outline"></i>
                    <span>Nodes Details</span>
                </div>
            </div>
            <div className="h-splitter"></div>

            <div className="timeline">
                <div className="timeline__step">
                    <div className="info-text">
                        Download and fill out the CSV template bellow. Upload it
                        here once you are done.
                    </div>
                    <button className="btn btn-download box box--flex center--y center--XxX">
                        <div className="box box--flex center--y">
                            <i className="mdi mdi-download"></i>
                            <div className="template-name">
                                Sponsor-template.CSV
                            </div>
                        </div>
                        <div className="size">3.5mb</div>
                    </button>
                </div>
                <div className="timeline__step">
                    <div className="info-text">
                        Upload it below once you are done.
                    </div>
                    <div className="btn btn-upload box--flex--column center--y">
                        <i className="mdi mdi-file-upload-outline"></i>
                        <div className="title">Drag and drop csv to upload</div>
                        <div className="browse">Or browse to choose a file</div>
                    </div>
                </div>
            </div>
            <div className="h-splitter mt-30 mb-30"></div>
            <div className="info-text mb-30 text-center">
                You can review the nodes details in the template you have
                uploaded.
            </div>
            <button className="btn btn-download box box--flex center--y center--XxX">
                <div className="box box--flex center--y">
                    <i className="mdi mdi-download"></i>
                    <div className="template-name">Sponsor-template.CSV</div>
                </div>
                <div className="size">3.5mb</div>
            </button>
        </div>
    );
};

export default NodesDetails;
