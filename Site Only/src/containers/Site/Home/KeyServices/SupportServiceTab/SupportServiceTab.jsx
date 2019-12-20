import React from 'react';
import ReactMarkdown from 'react-markdown';
import { MARKDOWN_SOURCE_BASE_URL } from '../../../../../utils/constant.js';

export default class SupportServiceTab extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageText: '',
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        fetch(
            `${MARKDOWN_SOURCE_BASE_URL}/home/key-services-section/support-service-tab.md`
        )
            .then((response) => response.text())
            .then((text) => {
                this.setState({
                    pageText: text.replace(/\(\//g, '(/#/'),
                });
            });
    }

    render() {
        return (
            <div id="support-service-tab" className="tab-content">
                <ReactMarkdown source={this.state.pageText} />
            </div>
        );
    }
}
