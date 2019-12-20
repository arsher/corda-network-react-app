import React, { Fragment } from 'react';
import './Search.scss';
import Footer from './../../components/Footer/Footer';

export default class Search extends React.Component {
    render() {
        return (
            <Fragment>
                <div className="search-results container-fluid">
                    <div className="row bg-white">
                        <div className="col-8 offset-2">
                            <div className="gcse-search"></div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </Fragment>
        );
    }
}
