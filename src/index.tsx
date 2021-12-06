import React from "react";
import {render} from "react-dom";
import "./styles/main.scss";

import SpinLoader from "./companents/SpinLoader";
import LoginPage from "./pages/login";
import { Auth } from "./services/auth";
import RegisterPage from "./pages/register";
import PanelPage from "./pages/panel";

interface IState {
    page: string;
}

export default class PageLoader extends React.Component<React.HTMLAttributes<HTMLDivElement>,IState> {
    constructor(props: React.HTMLAttributes<HTMLDivElement> | Readonly<React.HTMLAttributes<HTMLDivElement>>){
        super(props);
        this.state = {
            page: "loading"
        };
    }
    setPage(page:string){
        this.setState({page});
    }
    componentDidUpdate(){
        if(this.state.page == 'loading')
        {
            this.updateFetch();
        }
    }
    componentDidMount(){
        this.updateFetch();
    }
    async updateFetch()
    {
        await Auth.fetchUser();
        if(Auth.auth)
        {
            this.setPage("panel");
        }else{
            this.setPage("login");
        }
    }
    public render()
    {
        switch(this.state.page)
        {
            case "loading":{
                return <SpinLoader className="m-auto" />
            }
            case "login":{
                return <LoginPage setPage={name => this.setPage(name)} />
            }
            case "register":{
                return <RegisterPage setPage={name => this.setPage(name)} />
            }
            case "panel":{
                return <PanelPage setPage={name => this.setPage(name)} />
            }
        }
    }
}

render(
    <PageLoader />,
    document.querySelector("#root")
)