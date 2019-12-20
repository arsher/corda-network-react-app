import React from 'react';
import page from './../../../../../hoc/page/page';
import ReactMarkdown from 'react-markdown';
import Footer from './../../../../../components/Footer/Footer';

class AccessControl extends React.Component {

    render() {
        const { pageText } = this.props;
        return (
            <div className="container-fluid">
                <div id="access-control" className="row access-control">
                    <div className="inner-page access-control-content">
                        <ReactMarkdown source={pageText} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default page(AccessControl);
