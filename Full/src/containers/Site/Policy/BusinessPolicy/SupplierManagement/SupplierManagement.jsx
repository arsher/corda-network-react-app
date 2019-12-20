import React from 'react';
import page from './../../../../../hoc/page/page';
import ReactMarkdown from 'react-markdown';
import Footer from './../../../../../components/Footer/Footer';

class SupplierManagement extends React.Component {

    render() {
        const { pageText } = this.props;
        return (
            <div className="container-fluid">
                <div
                    id="supplier-management"
                    className="row supplier-management">
                    <div className="inner-page supplier-management-content">
                        <ReactMarkdown source={pageText} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default page(SupplierManagement);
