import React from 'react';
import page from './../../../../../hoc/page/page';
import ReactMarkdown from 'react-markdown';
import Footer from './../../../../../components/Footer/Footer';

class InformationClassification extends React.Component {

    render() {
        const { pageText } = this.props;
        return (
            <div className="container-fluid">
                <div
                    id="information-classification"
                    className="row information-classification">
                    <div className="inner-page information-classification-content">
                        <ReactMarkdown source={pageText} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default page(InformationClassification);
