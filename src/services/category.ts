import axios from "axios";
import route from "./routes";

export class Category
{
    public static async create(name: String, category_select: String) : Promise<boolean>
    {
        let {data} = await axios.post(route.createCategory,{
            name,
            category_select
        });
        if(data.errors)
        {
            return false;
        }else return data.status == "success";
    };
    public static async fetch() : Promise<Array<{[key:string]:string}>>
    {
        let {data} = await axios.post(route.categories);
        return data;
    };
}