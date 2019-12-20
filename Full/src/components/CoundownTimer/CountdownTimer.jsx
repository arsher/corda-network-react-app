import React, { Component } from 'react';

class CountdownTimer extends Component {
    state = {
        seconds: 60,
    };

    componentDidMount() {
        setInterval(() => {
            if (this.state.seconds !== 0) {
                this.setState({
                    seconds: this.state.seconds - 1,
                });
            }
        }, 1000);
    }

    render() {
        return (
            <span>
                00:
                {this.state.seconds < 10 ? (
                    <span>0{this.state.seconds}</span>
                ) : (
                    this.state.seconds
                )}
            </span>
        );
    }
}

export default CountdownTimer;
