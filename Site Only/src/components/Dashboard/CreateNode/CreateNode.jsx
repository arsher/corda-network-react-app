import React, { Component } from 'react';
import './CreateNode.scss';

class CreateNode extends Component {
    render() {
        return (
            <div className="create-node-box bg-white">
                <div className="create-node-box__header box--flex center--y">
                    <i className="mdi mdi-clipboard-alert-outline"></i>
                    <span>First You Need to Create a Node</span>
                </div>
                <div className="create-node-box__main">
                    <p>
                        Press below to start the technical onboarding steps -
                        including initiating your CSR (Certificate Signing
                        Request).
                    </p>
                    <button className="btn btn-secondary mt-24 px-30">
                        Create a Node and Join the Network
                    </button>
                </div>
            </div>
        );
    }
}

export default CreateNode;
