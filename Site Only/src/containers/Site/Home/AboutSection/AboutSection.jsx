import React from 'react';
import './AboutSection.scss';
import ReactMarkdown from 'react-markdown';
import { MARKDOWN_SOURCE_BASE_URL } from '../../../../utils/constant.js';
export default class AboutSection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageText: '',
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        fetch(`${MARKDOWN_SOURCE_BASE_URL}/home/about-section/about-section.md`)
            .then((response) => response.text())
            .then((text) => {
                this.setState({
                    pageText: text,
                });
            });
    }

    render() {
        return (
            <div id="about" className="row about-section">
                <div className="col-lg-10 offset-lg-1 col-md-10 offset-md-1 col-sm-12 about-section-content">
                    <ReactMarkdown source={this.state.pageText} />
                </div>
            </div>
        );
    }
}
