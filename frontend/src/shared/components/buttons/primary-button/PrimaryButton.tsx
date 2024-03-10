import React from "react";
import './primary-button.scss'

interface IPrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    processing?: boolean
    onClick?: (data: any) => any | React.MouseEventHandler<HTMLButtonElement>
}

export default function PrimaryButton(props: IPrimaryButtonProps) {
    return (
        <button
            type={props.type}
            className={
                `primary-button ${
                    props.processing ? 'opacity-25' : ''
                } ` + (props.className || "")
            }
            disabled={props.processing}
            onClick={props.onClick}
        >
            { props.children }
        </button>
    );
}