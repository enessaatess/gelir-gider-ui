import axios from "axios";
import route from "./routes";
export class Auth
{
    public static username : String = "";
    public static usersurname : String = "";
    public static email : String = "";
    public static auth : boolean = false;
    public static async login(email: String, password: String) : Promise<boolean>
    {
        let {data} = await axios.post(route.login,{
            email,
            password
        });
        return data.status == "success";
    };
    public static async register(username: String,usersurname: String,email: String, password: String) : Promise<boolean>
    {
        try{
            await axios.post(route.register,{
                name: username,
                surname: usersurname,
                email,
                password
            });
            return true;
        }catch(i){
            return false;
        }
    };
    public static async fetchUser()
    {
        let {data} = await axios.post(route.userInfo);
        if(data.user)
        {
            Auth.username = data.username;
            Auth.usersurname = data.usersurname;
            Auth.email = data.email;
            Auth.auth = true;
        }else{
            Auth.username = "";
            Auth.usersurname = "";
            Auth.email = "";
            Auth.auth = false;
        }
    };
    public static async logout()
    {
        await axios.post(route.signout);
        this.fetchUser();
    };
}