import React from "react";
import { Window } from "../../windowing/Window";

interface PropertiesDialogProps {
    item?: string;
}

export function PropertiesDialog({ item = "Item" }: PropertiesDialogProps) {
    return (
        <Window title={`${item} Properties`}>
            <div className="properties-dialog">
                {/* TODO: Implement properties dialog */}
                <div>Properties for {item}</div>
            </div>
        </Window>
    );
}
