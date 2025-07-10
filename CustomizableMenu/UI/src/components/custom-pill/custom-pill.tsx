import { CSSProperties, ReactNode } from "react";
import * as style from "./custom-pill.module.scss";

export const CustomPill = (props: {
    type?: string;
    children?: ReactNode;
    src?: string;
    customStyle?: CSSProperties;
    className?: string;
}) => {
    if (props.type && props.type != "") {
        return (
            <div className={`${style[props.type]} ${style.custom}`}>
                {props.children}
            </div>
        );
    }

    return (
        <div>
            <img src={props.src} alt="badge" style={props.customStyle} />
        </div>
    );
};
