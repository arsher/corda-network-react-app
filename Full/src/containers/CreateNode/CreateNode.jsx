import React, { Component } from 'react';
import './CreateNode.scss';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';
import CreateNodeJoinNetwork from '../../components/CreateNodeJoinNetwork/CreateNodeJoinNetwork';
import CreateNodeConfig from '../../components/CreateNodeConfig/CreateNodeConfig';
import DownloadNodeConfig from '../../components/DownloadNodeConfig/DownloadNodeConfig';
import { Redirect } from 'react-router-dom';

class CreateNode extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderStep(stepName) {
        switch (stepName) {
            case actionTypes.CURRENT_STEP_START_NODE_CREATION:
                return <CreateNodeJoinNetwork history={this.props.history} />;
            case actionTypes.CURRENT_STEP_CREATE_NODE_CONFIG:
                return <CreateNodeConfig />;
            case actionTypes.CURRENT_STEP_DOWNLOAD_NODE_CONFIG:
                return <DownloadNodeConfig />;
            default:
                return <Redirect to="/dashboard" />;
        }
    }

    render() {
        return (
            <div className="create-node">
                {this.renderStep(this.props.cnr.currentStep)}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loader: state.loader,
        cnr: state.cnr,
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateNode);
