import React from 'react';
import './Tooltip.scss';

export default class Tooltip extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            displayTooltip: false,
        };
        this.hideTooltip = this.hideTooltip.bind(this);
        this.showTooltip = this.showTooltip.bind(this);
    }

    hideTooltip() {
        this.setState({ displayTooltip: false });
    }

    showTooltip() {
        this.setState({ displayTooltip: true });
    }

    render() {
        let message = this.props.message;
        return (
            <div className="tooltip" onBlur={this.hideTooltip}>
                <div
                    className={
                        this.state.displayTooltip
                            ? 'tooltip-bubble shown'
                            : 'tooltip-bubble'
                    }>
                    <p className="fs-13 m-0 tooltip-message">{message}</p>
                </div>
                <span className="tooltip-trigger" onFocus={this.showTooltip}>
                    {this.props.children}
                </span>
            </div>
        );
    }
}
