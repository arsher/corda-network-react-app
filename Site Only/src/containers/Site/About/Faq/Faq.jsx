import React from 'react';
import page from './../../../../hoc/page/page';
import ReactMarkdown from 'react-markdown';
import Footer from '../../../../components/Footer/Footer';

class Faq extends React.Component {
    render() {
        const { pageText } = this.props;
        return (
            <div className="container-fluid">
                <div id="prejoining" className="row faq">
                    <div className="inner-page faq-content">
                        <ReactMarkdown source={pageText} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default page(Faq);
