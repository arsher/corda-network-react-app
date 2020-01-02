import React from 'react';
import ReactMarkdown from 'react-markdown';
import { MARKDOWN_SOURCE_BASE_URL } from '../../../../../utils/constant.js';

export default class NotaryServiceTab extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageText: '',
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        fetch(
            `${MARKDOWN_SOURCE_BASE_URL}/home/key-services-section/notary-service-tab.md`
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
            <div id="notary-service-tab" className="tab-content">
                <ReactMarkdown source={this.state.pageText} />
            </div>
        );
    }
}
