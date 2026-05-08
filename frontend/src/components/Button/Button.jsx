import React from "react";
import "./Button.css";

const Button = ({
    children,
    onClick,
    style,
    ...props
}) => {
    return (
        <button
            className={"button-comp"}
            onClick={onClick}
            style={{
                ...style,
            }}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
