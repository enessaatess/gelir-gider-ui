import React from "react";
import SpinLoader from "../companents/SpinLoader";
import { Auth } from "../services/auth";

interface IState {
    name: string;
    surname: string;
    email: string;
    password: string;
    error: string;
    success: string;
}

export default class RegisterPage extends React.Component<React.HTMLAttributes<HTMLDivElement> & {setPage:(e:string) => any},IState> {
    constructor(props: (React.HTMLAttributes<HTMLDivElement> & {setPage: (e: string) => any})){
        super(props);
        this.state = {
            name: "",
            surname: "",
            email: "",
            password: "",
            error: "",
            success: ""
        };
        this.register = this.register.bind(this);
        document.title = "Kayıt Olun";
    }
    componentDidMount(){
        document.title = "Kayıt Olun";
    }
    public val(name: "email"|"password"|"surname"|"name"|"error"|"success", value?: string): string
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
    public async register()
    {
        let data = await Auth.register(this.state.name,this.state.surname,this.state.email,this.state.password);
        if(data){
            this.val("success","true");
            this.val("error","");
        }else{
            this.val("error","true");
            this.val("success","");
        };
    }
    public render()
    {
        return <>
        <div className="card col-md-6 m-auto">
            <div className="card-body">
                <h5 className="card-title">
                    Kayıt Ol
                </h5>
                <div className="form-group row">
                    <div className="col-md-6">
                        <label>İsim</label>
                        <input type="text" className="form-control" value={this.val("name")} onChange={e => this.val("name",e.target.value)}/>
                    </div>
                    <div className="col-md-6">
                        <label>Soyisim</label>
                        <input type="text" className="form-control" value={this.val("surname")} onChange={e => this.val("surname",e.target.value)}/>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-md-6">
                        <label>E-Posta Adresi</label>
                        <input type="email" className="form-control" value={this.val("email")} onChange={e => this.val("email",e.target.value)}/>
                    </div>
                    <div className="col-md-6">
                        <label>Şifreniz</label>
                        <input type="password" className="form-control" value={this.val("password")} onChange={e => this.val("password",e.target.value)}/>
                    </div>
                </div>
                <div className="form-group row">
                    {this.state.error && <>
                        <div className="col-md-12 mt-2">
                            <div className="alert alert-danger" role="alert">
                                Kaydınız Yapılamadı
                            </div>
                        </div>
                    </>}
                    {this.state.success && <>
                        <div className="col-md-12 mt-2">
                            <div className="alert alert-success" role="alert">
                                Kaydınız başarılı bir şekilde yapılmıştır
                            </div>
                        </div>
                    </>}
                </div>
                <div className="form-group row">
                    <div className="col-md-12">
                        <button className="btn btn-primary m-1 mt-3" onClick={this.register}>Kayıt Ol</button>
                        <button className="btn btn-success m-1 mt-3" onClick={e => this.props.setPage("login")}>Giriş Yap</button>
                    </div>
                </div>
            </div>
        </div>
        </>;
    }
}