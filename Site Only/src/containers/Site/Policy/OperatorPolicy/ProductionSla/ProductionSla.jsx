import React from 'react';
import page from './../../../../../hoc/page/page';
import ReactMarkdown from 'react-markdown';
import Footer from './../../../../../components/Footer/Footer';

class ProductionSla extends React.Component {
    render() {
        const { pageText } = this.props;
        return (
            <div className="container-fluid">
                <div id="production-sla" className="row production-sla">
                    <div className="inner-page production-sla-content">
                        <ReactMarkdown source={pageText} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default page(ProductionSla);
