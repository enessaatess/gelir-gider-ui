import React from "react";

export default class SpinLoader extends React.Component<React.HTMLAttributes<HTMLDivElement>, {}> {
    public render()
    {
        return <>
            <div className={"text-center d-flex flex-column "+(this.props.className ? this.props.className : "")}>
                <div className="spinner-border m-auto" role="status">
                </div>
                Lütfen Bekleyin
            </div>
        </>;
    }
}