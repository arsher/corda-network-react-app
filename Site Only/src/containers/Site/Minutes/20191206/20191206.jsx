import React from 'react';
import page from './../../../../hoc/page/page';
import ReactMarkdown from 'react-markdown';
import Footer from '../../../../components/Footer/Footer';

class I20191206 extends React.Component {
    render() {
        const { pageText } = this.props;
        return (
            <div className="container-fluid">
                <div id="20191206" className="row">
                    <div className="inner-page">
                        <ReactMarkdown source={pageText} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default page(I20191206);
