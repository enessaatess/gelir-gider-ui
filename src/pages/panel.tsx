import axios from "axios";
import React, { useEffect, useState } from "react";
import SpinLoader from "../companents/SpinLoader";
import { Auth } from "../services/auth";
import { Category } from "../services/category";
import { Currency } from "../services/currency";
import { Transection } from "../services/transection";

export default function PanelPage(props: (React.HTMLAttributes<HTMLDivElement> & {setPage:(e:string)=>any})) : JSX.Element
{
    let [activeTab,setActiveTab] = useState<string>("transections");
    async function logout()
    {
        await Auth.logout();
        props.setPage("loading");
    }
    return <>
    <div>
        <div className="card col-md-12 mt-1">
            <div className="card-body d-flex flex-row">
                <h5 className="card-title flex-fill">
                    Gelir Gider Sistemi
                </h5>
                <button className="btn btn-secondary" onClick={logout}>Çıkış Yap</button>
            </div>
        </div>
        <div className="card col-md-12 mt-1">
            <div className="card-body d-flex flex-row">
                <button
                    className={`btn btn-${activeTab=='transections'?'primary':'secondary'}`}
                    onClick={() => setActiveTab('transections')}
                >
                    İşlemler
                </button>
                <button
                    className={`btn btn-${activeTab=='categories'?'primary':'secondary'} ml-md-2`}
                    onClick={() => setActiveTab('categories')}
                >
                    Gelir / Gider Kategorileri
                </button>
                <button
                    className={`btn btn-${activeTab=='report'?'primary':'secondary'} ml-md-2`}
                    onClick={() => setActiveTab('report')}
                >
                    Raporlama
                </button>
            </div>
        </div>
    </div>
    <div className="flex-fill d-flex flex-column p-4">
        {activeTab == 'transections' ? <Transections /> :
        activeTab == 'categories' ? <Categories /> :
        activeTab == 'report' ? <Report /> : null}
    </div>
    </>;
}



function Transections(props: (React.HTMLAttributes<HTMLDivElement>)) : JSX.Element
{
    let [mode,setMode] = useState('list');
    let [data,setData] = useState<{[key: string]: any}>({});
    let view  = null;

    function chMode(str:string)
    {
        setMode(str);
    }

    switch(mode)
    {
        case "list":
            view = <ListTransaction setForm={setData} mode={e => chMode(e)} />;
            break;
        case "create":
            view = <CreateTransaction mode={e => chMode(e)} />;
            break;
        case "update":
            view = <CreateTransaction form={data} mode={e => chMode(e)} />;
            break;
    }

    return <div className="card mx-4 my-4 mb-auto"> {view} </div>
}

function CreateTransaction(props: (React.HTMLAttributes<HTMLDivElement> & {mode:(e:string)=>any,form?:{[key: string]: string}})) : JSX.Element
{
    let [data,setData] = useState({
        id:"",
        date:"",
        price:"",
        currency:"",
        category:"",
        description:"",
    });
    let [category,setCategory] = useState<Array<{[key: string]: string}>>([]);
    let [currency,setCurrency] = useState<Array<{[key: string]: string}>>([]);
    let [success,setSuccess] = useState<boolean>(false);
    let [error,setError] = useState<boolean>(false);

    useEffect(function(){
        Category.fetch().then(list => {
            setCategory(list);
        });
        Currency.fetch().then(list => {
            setCurrency(list);
        });
        if(props.form)
        {
            setData({
                id: props.form.id,
                date: props.form.transaction_date,
                price: props.form.total,
                currency: props.form.currency_id,
                category: props.form.category_id,
                description: props.form.description,
            });
        }
    },[]);

    useEffect(()=>{
        if(!props.form)
        {
            if(category.length != 0)
            {
                val("category",category[0].id);
            }
            if(currency.length != 0)
            {
                val("currency",currency[0].id);
            }
        }
    },[category,currency])

    function val(name: "date"|"price"|"currency"|"category"|"description", value?: string) : string
    {
        if(value == undefined)
        {
            return data[name];
        }else{
            setData(e => ({
                ...e,
                [name]: value
            }))
        }
    }
    async function save()
    {
        let status;
        if(typeof data.id != "number")
        {
            status = await Transection.create(data.price,data.date,data.description,data.currency,data.category);
        }else{
            status = await Transection.update(data.id,data.price,data.date,data.description,data.currency,data.category);
        }
        if(status)
        {
            setSuccess(true);
            setError(false);
            props.mode('list')
        }else{
            setSuccess(false);
            setError(true);
        };
    }
    return <>
        <div className="card-body d-flex flex-row">
            <button className="btn btn-success" onClick={() => props.mode('list')}>
                Listeye dön
            </button>
        </div>
        <div className="form-group mx-2 row">
            <div className="col-6">
                <label>İşlem Tarihi</label>
                <input type="date" className="form-control" value={val("date")} onChange={e => val("date",e.target.value)}/>
            </div>
            <div className="col-6">
                <label>Tutar</label>
                <input type="number" className="form-control" value={val("price")} onChange={e => val("price",e.target.value)}/>
            </div>
            <div className="col-6">
                <label>Para birimi</label>
                <select className="form-control" value={val("currency")} onChange={e => val("currency",e.target.value)}>
                    {currency.map(e => <option value={e.id}>{e.name}</option>)}
                </select>
            </div>
            <div className="col-6">
                <label>Kategori</label>
                <select className="form-control" value={val("category")} onChange={e => val("category",e.target.value)}>
                    {category.map(({id,name},key) => <>
                        <option key={key} value={id}>{name}</option>
                    </>)}
                </select>
            </div>
            <div className="col-12">
                <label>Açıklama</label>
                <textarea className="form-control" rows={5}  value={val("description")} onChange={e => val("description",e.target.value)}></textarea>
            </div>
        </div>
        <div className="form-group row">
            {error && <>
                <div className="col-md-12 mt-2">
                    <div className="alert alert-danger" role="alert">
                        Başarısız
                    </div>
                </div>
            </>}
            {success && <>
                <div className="col-md-12 mt-2">
                    <div className="alert alert-success" role="alert">
                        Başarılı
                    </div>
                </div>
            </>}
        </div>
        <div className="card-body text-right">
            <button className="btn btn-primary" onClick={save}>
                Kaydet
            </button>
        </div>
    </>;
}
function Categories(props: (React.HTMLAttributes<HTMLDivElement>)) : JSX.Element
{
    let [mode,setMode] = useState('list');
    let view  = null;

    function chMode(str:string)
    {
        setMode(str);
    }

    switch(mode)
    {
        case "list":
            view = <ListCategories mode={e => chMode(e)} />;
            break;
        case "create":
            view = <CreateCategories mode={e => chMode(e)} />;
            break;
    }

    return <div className="card mx-4 my-4 mb-auto"> {view} </div>
}

function ListTransaction(props: (React.HTMLAttributes<HTMLDivElement> & {setForm:(e:{[key: string]:any})=>any,mode:(e:string)=>any,form?:{[key: string]: string}})) : JSX.Element
{
    let [data,setData] = useState<Array<{[key: string]: any}>>([]);
    useEffect(function(){
        Transection.fetch().then(list => {
            setData(list);
        });
    },[]);
    async function trdelete(id:string)
    {
        await Transection.delete(id);
        Transection.fetch().then(list => {
            setData(list);
        });
    }
    return <>
        <div className="card-body d-flex flex-row">
            <button className="btn btn-success" onClick={() => props.mode('create')}>
                Yeni İşlem Ekle
            </button>
        </div>
        <div className="mx-2 row">
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tutar</th>
                        <th>Kategori Türü</th>
                        <th>Kategori</th>
                        <th style={{width:"1%"}}></th>
                        <th style={{width:"1%"}}></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(e => <>
                        <tr>
                            <td>
                                {e.id}
                            </td>
                            <td>
                                {e.total} {e.currency.name}
                            </td>
                            <td>
                                {e.category.category_select}
                            </td>
                            <td>
                                {e.category.name}
                            </td>
                            <td><button className="btn btn-primary" onClick={() => {props.setForm(e);props.mode('update')}}>Düzenle</button></td>
                            <td><button className="btn btn-primary" onClick={() => trdelete(e.id)}>Sil</button></td>
                        </tr>
                    </>)}
                </tbody>
            </table>
        </div>
    </>
}
function ListCategories(props: (React.HTMLAttributes<HTMLDivElement> & {mode:(e:string)=>any})) : JSX.Element
{
    let [data,setData] = useState<Array<{[key: string]: string}>>([]);
    useEffect(function(){
        Category.fetch().then(list => {
            setData(list);
        });
    },[]);
    return <>
        <div className="card-body d-flex flex-row">
            <button className="btn btn-success" onClick={() => props.mode('create')}>
                Yeni Kategori Ekle
            </button>
        </div>
        <div className="mx-2 row">
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>İsim</th>
                        <th>Tür</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(e => <>
                        <tr>
                            <td>
                                {e.id}
                            </td>
                            <td>
                                {e.name}
                            </td>
                            <td>
                                {e.category_select}
                            </td>
                        </tr>
                    </>)}
                </tbody>
            </table>
        </div>
    </>
}
function CreateCategories(props: (React.HTMLAttributes<HTMLDivElement> & {mode:(e:string)=>any})) : JSX.Element
{
    let [data,setData] = useState({
        name:"",
        category_select:"gelir"
    });
    let [success,setSuccess] = useState<boolean>(false);
    let [error,setError] = useState<boolean>(false);
    function val(name: "name"|"category_select", value?: string) : string
    {
        if(value == undefined)
        {
            return data[name];
        }else{
            setData(e => ({
                ...e,
                [name]: value
            }))
        }
    }
    async function save()
    {
        let status = await Category.create(data.name,data.category_select);
        if(status)
        {
            setSuccess(true);
            setError(false);
        }else{
            setSuccess(false);
            setError(true);
        }
    }
    return <>
        <div className="card-body d-flex flex-row">
            <button className="btn btn-success" onClick={() => props.mode('list')}>
                Listeye dön
            </button>
        </div>
        <div className="form-group mx-2 row">
            <div className="col-6">
                <label>Kategori Adı</label>
                <input type="text" className="form-control" value={val("name")} onChange={e => val("name",e.target.value)}/>
            </div>
            <div className="col-6">
                <label>Kategori Türü</label>
                <select className="form-control" value={val("category_select")} onChange={e => val("category_select",e.target.value)}>
                    <option value="gelir">Gelir</option>
                    <option value="gider">Gider</option>
                </select>
            </div>
        </div>
        <div className="form-group row">
            {error && <>
                <div className="col-md-12 mt-2">
                    <div className="alert alert-danger" role="alert">
                        Başarısız
                    </div>
                </div>
            </>}
            {success && <>
                <div className="col-md-12 mt-2">
                    <div className="alert alert-success" role="alert">
                        Başarılı
                    </div>
                </div>
            </>}
        </div>
        <div className="card-body text-right">
            <button className="btn btn-primary" onClick={save}>
                Kaydet
            </button>
        </div>
    </>;
}
function Report() : JSX.Element
{
    let [startDate,setStartDate] = useState<string>("");
    let [endDate,setEndDate] = useState<string>("");
    let [status,setStatus] = useState<string>("");

    async function report()
    {
        try{
            let {data} = await axios.post("/report",{
                startdate:startDate,
                enddate:endDate
            });
            setStatus(data.result + "TRY");
        }catch(i){

        }
    }

    useEffect(()=>{
        report();
    },[startDate,endDate])

    return <>
        <div className="form-group mx-2 row">
            <div className="col-6">
                <label>Başlangıç Tarihi</label>
                <input type="date" className="form-control" value={startDate} onChange={e => {setStartDate(e.target.value)}}/>
            </div>
            <div className="col-6">
                <label>Bitiş Tarihi</label>
                <input type="date" className="form-control" value={endDate} onChange={e => {setEndDate(e.target.value)}}/>
            </div>
        </div>
        <div className="form-group mx-2 row">
            <div className="col-6">
                <label>iki tarih arasındaki kar-zarar durumu</label>
                <input type="text" className="form-control" value={status} readOnly/>
            </div>
        </div>
    </>;
}