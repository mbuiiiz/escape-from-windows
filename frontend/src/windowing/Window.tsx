import React from "react";
import { WindowFrame } from "./WindowFrame";
import type { WindowProps } from "./windowTypes";

export function Window(props: WindowProps) {
    return (
        <WindowFrame {...props}>
            {props.children}
            {/* TODO: Implement window content area */}
        </WindowFrame>
    );
}
