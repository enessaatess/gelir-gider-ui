import axios from "axios";
import route from "./routes";

export class Currency
{
    public static async fetch() : Promise<Array<{[key:string]:string}>>
    {
        let {data} = await axios.post(route.currency);
        return data;
    };
}