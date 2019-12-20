import React from 'react';
import page from './../../../../../hoc/page/page';
import ReactMarkdown from 'react-markdown';
import Footer from './../../../../../components/Footer/Footer';

class NamespaceOwnership extends React.Component {

    render() {
        const { pageText } = this.props;
        return (
            <div className="container-fluid">
                <div
                    id="namespace-ownership"
                    className="row namespace-ownership">
                    <div className="inner-page namespace-ownership-content">
                        <ReactMarkdown source={pageText} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default page(NamespaceOwnership);
