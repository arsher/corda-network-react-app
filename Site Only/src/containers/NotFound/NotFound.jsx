import './NotFound.scss';
import React, { Component } from 'react';

class NotFound extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="not-found bg-ghost-white box--flex--column center--xy">
                <h1>Something went wrong</h1>
                <a href="/" className="btn btn-primary">
                    Go to home page
                </a>
            </div>
        );
    }
}

export default NotFound;
