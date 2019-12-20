import React from 'react';
import page from './../../../../hoc/page/page';
import ReactMarkdown from 'react-markdown';
import Footer from '../../../../components/Footer/Footer';

class CertificatePolicy extends React.Component {
    render() {
        const { pageText } = this.props;
        return (
            <div className="container-fluid">
                <div id="certificate-policy" className="row certificate-policy">
                    <div className="inner-page certificate-policy-content">
                        <ReactMarkdown source={pageText} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default page(CertificatePolicy);
