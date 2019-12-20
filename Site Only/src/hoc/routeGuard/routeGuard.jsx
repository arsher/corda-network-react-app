import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const connector = connect((state) => ({
    isUserAuthorized: state.isUserAuthorized, // say, you keep user profile in redux
}));

export default (WrappedComponent) => {
    return connector(
        class extends Component {
            // static propTypes = {
            //     isUserAuthorized: PropTypes.bool.isRequired,
            // };

            render() {
                const { ...clearedProps } = this.props;
                if (this.props.uar.isUserAuthorized) {
                    return <WrappedComponent {...clearedProps} />;
                } else {
                    return <Redirect to={{ pathname: '/login' }} />;
                }
            }
        }
    );
};
