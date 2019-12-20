import React from 'react';
import './Badge.scss';

const Badge = (props) => {
    return (
        <div className={'label label--' + props.theme}>{props.children}</div>
    );
};

export default Badge;
