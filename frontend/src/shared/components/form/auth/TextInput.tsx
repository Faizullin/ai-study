import React, { useEffect, useRef, ChangeEvent } from "react";

interface ITextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    processing?: boolean
    isFocused?: boolean
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function TextInput(props: ITextInputProps) {

    return (
        <div className="flex flex-col items-start">
            <input
                type={props.type}
                id={props.id || `input-id-${props.name}`}
                name={props.name}
                value={props.value}
                placeholder={props.placeholder}
                className={`form-control ${props.className ? props.className : ""}`}
                onChange={(e) => props.onChange(e)}
            />
        </div>
    );
}