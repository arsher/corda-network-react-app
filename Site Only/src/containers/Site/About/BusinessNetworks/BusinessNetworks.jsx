import React from 'react';
import page from './../../../../hoc/page/page';
import ReactMarkdown from 'react-markdown';
import Footer from '../../../../components/Footer/Footer';

class BusinessNetworks extends React.Component {
    render() {
        let { pageText } = this.props;

        return (
            <div className="container-fluid">
                <div id="business-networks" className="row business-networks">
                    <div className="inner-page business-networks-content">
                        <ReactMarkdown source={pageText} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default page(BusinessNetworks);
