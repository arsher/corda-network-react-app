import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from './../../store/actions';
import CreateNodeConfig from './../../components/CreateNodeConfig/CreateNodeConfig';
import DownloadNodeConfig from './../../components/DownloadNodeConfig/DownloadNodeConfig';
import { Redirect } from 'react-router-dom';

class CreateNodeSponsee extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderStep(stepName) {
        switch (stepName) {
            case actionTypes.CREATE_SPONSEE_NODE_CONFIG:
                return <CreateNodeConfig history={this.props.history} />;
            case actionTypes.DOWNLOAD_SPONSEE_NODE_CONFIG:
                return <DownloadNodeConfig history={this.props.history} />;
            default:
                return <Redirect to="/sponsored-participants" />;
        }
    }

    render() {
        return (
            <div className="create-node">
                {this.renderStep(
                    this.props.sponsorCurrentStepReducer.currentStep
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loader: state.loader,
        sponsorCurrentStepReducer: state.sponsorCurrentStepReducer,
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateNodeSponsee);
