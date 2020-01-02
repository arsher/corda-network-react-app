// import React, { Fragment } from 'react';
// import ReactMarkdown from 'react-markdown';
// import Markdown from 'markdown-to-jsx';
// import LoadingOverlay from 'react-loading-overlay';
// import './../../assets/scss/inner-pages.scss';
// import Footer from './../../../../components/Footer/Footer';

// export default class TrustRoot extends React.Component {
//     constructor() {
//         super();

//       this.state = {
//             pageText: '',
//             loading: false,
//         };
//     }

//     componentDidMount() {
//         const proxyurl = 'https://cors-anywhere.herokuapp.com/';
//         const url =
//             'https://gitlab.com/IndustriaTech/corda-network-content/raw/master/trust-root/index.md';

//         fetch(proxyurl + url)
//             .then((r) => r.text())
//             .then((text) => {
//                 this.setState({
//                     pageText: text,
//                 });
//             });
//     }

//     render() {
//         return (
//             <div className="container-fluid">
//                 <div id="trust-root" className="row trust-root">
//                     <div className="inner-page trust-root-content">
//                         <ReactMarkdown source={this.state.pageText} />
//                     </div>
//                 </div>
//                 <Footer />
//             </div>
//         );
//     }
// }

import React from 'react';
import page from './../../../../hoc/page/page';
import ReactMarkdown from 'react-markdown';
import Footer from '../../../../components/Footer/Footer';

class TrustRoot extends React.Component {

    render() {
        const { pageText } = this.props;
        return (
            <div className="container-fluid">
                <div id="trust-root" className="row trust-root">
                    <div className="inner-page trust-root-content">
                        <ReactMarkdown source={pageText} />
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default page(TrustRoot);
