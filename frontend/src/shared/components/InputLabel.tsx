import React, { ReactNode } from 'react';

interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    value?: ReactNode | string,
}

export default function InputLabel(props: InputLabelProps) {
    return (
        <label htmlFor={`input-id-${props.htmlFor}`} className={`form-label ` + props.className ? props.className : ""}>
            { props.value ? props.value : props.children }
        </label>
    );
}