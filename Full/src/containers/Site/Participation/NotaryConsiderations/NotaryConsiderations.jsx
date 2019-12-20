import React from 'react';
import page from './../../../../hoc/page/page';
import ReactMarkdown from 'react-markdown';
import Footer from '../../../../components/Footer/Footer';

class NotaryConsiderations extends React.Component {

    render() {
        const { pageText } = this.props;
        return (
            <div className="container-fluid">
                <div
                    id="notary-considerations"
                    className="row notary-considerations">
                    <div className="inner-page notary-considerations-content">
                        <ReactMarkdown source={pageText} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default page(NotaryConsiderations);
