import React from "react";
import './secondary-button.scss'

interface ISecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    processing?: boolean
    onClick?: (data: any) => any | React.MouseEventHandler<HTMLButtonElement>
}

export default function SecondaryButton(props: ISecondaryButtonProps) {
    return (
        <button
            type={props.type}
            className={
                `secondary-button ${
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