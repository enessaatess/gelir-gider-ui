import React from "react";
import SpinLoader from "../companents/SpinLoader";
import { Auth } from "../services/auth";

interface IState {
    email: string;
    password: string;
    error: string;
    success: string;
}

export default class LoginPage extends React.Component<React.HTMLAttributes<HTMLDivElement> & {setPage:(e:string) => any},IState> {
    constructor(props: (React.HTMLAttributes<HTMLDivElement> & {setPage: (e: string) => any})){
        super(props);
        this.state = {
            email: "",
            password: "",
            error: "",
            success: ""
        };
        this.auth = this.auth.bind(this);
    }
    componentDidMount(){
        document.title = "Giriş Yapın";
    }
    public val(name: "email"|"password"|"error"|"success", value?: string): string
    {
        if(value == undefined)
        {
            return  this.state[name];
        }else{
            this.setState(e => ({
                ...e,
                [name]: value
            }))
        }
    }
    public async auth()
    {
        let data = await Auth.login(this.state.email,this.state.password);
        if(data)
        {
            this.val("error","");
            this.val("success","true");
            this.props.setPage("loading");
        }else{
            this.val("error","true");
            this.val("success","");
        }
    }
    public render()
    {
        return <>
        <div className="card col-md-6 m-auto">
            <div className="card-body">
                <h5 className="card-title">
                    Giriş Yap
                </h5>
                <div className="form-group row">
                    <div className="col-md-6">
                        <label>E-Posta Adresiniz</label>
                        <input type="text" className="form-control" value={this.val("email")} onChange={e => this.val("email",e.target.value)}/>
                    </div>
                    <div className="col-md-6">
                        <label>Şifreniz</label>
                        <input type="password" className="form-control" value={this.val("password")} onChange={e => this.val("password",e.target.value)}/>
                    </div>
                    {this.state.error && <>
                        <div className="col-md-12 mt-2">
                            <div className="alert alert-danger" role="alert">
                                Giriş Yapılamadı
                            </div>
                        </div>
                    </>}
                    {this.state.success && <>
                        <div className="col-md-12 mt-2">
                            <div className="alert alert-success" role="alert">
                                Lütfen bekleyin
                            </div>
                        </div>
                    </>}
                    <div className="col-md-12">
                        <button className="btn btn-success m-1 mt-3" onClick={this.auth}>Giriş Yap</button>
                        <button className="btn btn-primary m-1 mt-3" onClick={e => this.props.setPage("register")}>Kayıt Ol</button>
                    </div>
                </div>
            </div>
        </div>
        </>;
    }
}