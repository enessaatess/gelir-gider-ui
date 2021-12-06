import axios from "axios";
import route from "./routes";

export class Transection
{
    public static async create(total:string,transaction_date:string,description:string,currency_id:string,category_id:string) : Promise<boolean>
    {
        let {data} = await axios.post(route.createTransaction,{
            total,
            transaction_date,
            description,
            currency_id,
            category_id
        });
        if(data.errors)
        {
            return false;
        }else{
            return true;
        }
    };
    public static async update(id:string,total:string,transaction_date:string,description:string,currency_id:string,category_id:string) : Promise<boolean>
    {
        let {data} = await axios.post(route.updateTransaction,{
            id,
            total,
            transaction_date,
            description,
            currency_id,
            category_id
        });
        if(data.errors)
        {
            return false;
        }else{
            return true;
        }
    };
    public static async fetch() : Promise<Array<{[key:string]:string}>>
    {
        let {data} = await axios.post(route.transaction);
        return data;
    };
    public static async delete(id:string)
    {
        await axios.post(route.deleteTransaction,{id});
    };
}

/*


*/