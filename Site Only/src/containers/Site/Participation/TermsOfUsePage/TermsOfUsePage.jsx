import React from 'react';
import page from './../../../../hoc/page/page';
import ReactMarkdown from 'react-markdown';
import Footer from '../../../../components/Footer/Footer';

class TermsOfUsePage extends React.Component {
    render() {
        const { pageText } = this.props;
        return (
            <div className="container-fluid">
                <div id="terms-of-use-page" className="row terms-of-use-page">
                    <div className="inner-page terms-of-use-page-content">
                        <ReactMarkdown source={pageText} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default page(TermsOfUsePage);
