import React from 'react';
import { components } from 'react-select';
const { Placeholder } = components;

const CustomValueContainer = ({ children, ...props }) => {
    return (
        <components.ValueContainer {...props}>
            <Placeholder {...props} isFocused={props.isFocused}>
                {props.selectProps.placeholder}
            </Placeholder>
            {React.Children.map(children, (child) => {
                return child && child.type !== Placeholder ? child : null;
            })}
        </components.ValueContainer>
    );
};

export default CustomValueContainer;
