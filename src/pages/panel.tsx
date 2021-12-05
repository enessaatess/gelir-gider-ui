import React from "react";
import SpinLoader from "../companents/SpinLoader";
import { Auth } from "../services/auth";

interface IState {
    email: string;
    password: string;
    error: string;
    success: string;
}

export default class PanelPage extends React.Component<React.HTMLAttributes<HTMLDivElement> & {setPage:(e:string) => any},IState> {
    constructor(props: (React.HTMLAttributes<HTMLDivElement> & {setPage: (e: string) => any})){
        super(props);
        this.logout = this.logout.bind(this);
    }
    componentDidMount(){
        document.title = "Gelir Gider Kategorileri";
    }
    public set(name: string, value?: string)
    {
        this.setState(e => ({
            ...e,
            [name]: value
        }))
    }
    public logout()
    {
        Auth.logout().then(e => this.props.setPage("loading"));
    }
    public render()
    {
        return <>
            <button className="btn btn-danger m-auto" onClick={this.logout}>Çıkış Yap</button>
        </>;
    }
}