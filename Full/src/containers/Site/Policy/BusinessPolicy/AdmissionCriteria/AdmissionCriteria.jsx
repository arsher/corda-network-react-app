import React from 'react';
import page from './../../../../../hoc/page/page';
import ReactMarkdown from 'react-markdown';
import Footer from './../../../../../components/Footer/Footer';

class AdmissionCriteria extends React.Component {

    render() {
        const { pageText } = this.props;
        return (
            <div className="container-fluid">
                <div id="admission-criteria" className="row admission-criteria">
                    <div className="inner-page admission-criteria-content">
                        <ReactMarkdown source={pageText} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default page(AdmissionCriteria);
