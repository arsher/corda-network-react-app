import React from 'react';
import LoadingOverlay from 'react-loading-overlay';
import './../../containers/Site/assets/scss/inner-pages.scss';
import { MARKDOWN_SOURCE_BASE_URL } from '../../utils/constant.js';

const page = (WrappedComponent) => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                pageText: '',
                loading: false,
            };
        }

        componentDidMount() {
            window.scrollTo(0, 0);
            this.setState({
                loading: true,
            });

            const url = this.props.match.url;

            fetch(`${MARKDOWN_SOURCE_BASE_URL}${url}.md`)
                .then((response) => response.text())
                .then((text) => {
                    this.setState({
                        pageText: text,
                        loading: false,
                    });
                });
        }

        render() {
            return (
                <LoadingOverlay
                    active={this.state.loading === true}
                    spinner
                    text="Loading...">
                    <WrappedComponent
                        {...this.props}
                        pageText={this.state.pageText}
                    />
                </LoadingOverlay>
            );
        }
    };
};
export default page;
