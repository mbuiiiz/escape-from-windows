import React from "react";
import { Window } from "../../windowing/Window";
import { ExplorerTree } from "./ExplorerTree";
import { FileList } from "./FileList";

export function ExplorerWindow() {
    return (
        <Window title="Explorer">
            <div className="explorer-layout">
                <div className="explorer-sidebar">
                    <ExplorerTree />
                </div>
                <div className="explorer-main">
                    <FileList />
                </div>
            </div>
            {/* TODO: Implement Explorer functionality */}
        </Window>
    );
}
