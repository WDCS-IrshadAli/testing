"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"

// import { revalidatePath } from "next/cache";

// fetching all form data
export const getFormFields = async (uri: string) => {
    try {
        let data = await fetch(`${process.env.DIRECTUS_APP_URL}/items/forms?filter[_and][0][key][_eq]=${uri}`, {
            headers: {
                "Authorization": `Bearer ${process.env.TOKEN}`,
            },
            cache: "no-store"
        });
        data = await data.json();        
        return data;
    } catch (err) {
        throw new Error("Error came while fetching forms");
    }
}

// fetching all forms
export const getAllLinks = async () => {
    try {
        let data = await fetch(`${process.env.DIRECTUS_APP_URL}/items/forms`, {
            headers: {
                "Authorization": `Bearer ${process.env.TOKEN}`,
            },
            cache: "no-store"
        });
        data = await data.json();        
        return data;
    } catch (err) {
        throw new Error("Error came while fetching links");
    }
}

// post data api
export const createForm = async (formId: number, prevState: any, formData: FormData) => {
    try {
            const rawFormData = Object.fromEntries(formData.entries());                
            let data: any = {
                data: rawFormData,
                form_id: formId
            }
            data = JSON.stringify(data);
            console.log("ccccccccccccccc", data);
            
            let dynamicFieldsData: any = await fetch(`${process.env.DIRECTUS_APP_URL}/items/inbox`, {
                method:"POST",
                body: data,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.TOKEN}`,
                },
            });        
            
            dynamicFieldsData = await dynamicFieldsData.json()
            console.log("RESPONSE = ", dynamicFieldsData);
            if (dynamicFieldsData.error) {
                return {
                    error: `${dynamicFieldsData?.error?.details?.errors == undefined ? dynamicFieldsData?.error?.message : dynamicFieldsData?.error?.details?.errors[0]?.message}`,
                    success: false
                }    
            }
            return {
                message: `Form submitted successfully`,
                success: true
            }
    } catch (err: any) {
        return {
            error: `Internal Server Error (${err.message})`,
            success: false
        }
    }
}

// -------------------------------------new form--------------------------------------
export const getModulesName = async () => {    
    try {
        let data = await fetch(`${process.env.DIRECTUS_APP_URL}/items/modules`, {
            headers: {
                "Authorization": `Bearer ${process.env.TOKEN}`,
            },
            cache: "no-store"
        });
        data = await data.json();        
        return data;
    } catch (err) {
        throw new Error("Error came while fetching forms");
    }
}

export const getModulesData = async (uri: string, limit: number, searchParams={page: 1}) => {
    let pageNumber = searchParams?.page;
    const page: any = searchParams?.page;
    try {
        if (pageNumber === undefined) {
            pageNumber=1
        } else {
            pageNumber = parseInt(page);
            if (pageNumber < 1) pageNumber = 1;
        }
    } catch (err) {
        pageNumber = 1;
    }
    try {
        let data: any = await fetch(`${process.env.DIRECTUS_APP_URL}/items/modules_data?limit=${limit}&offset=${limit}&page=${pageNumber}&filter[modules_id][name]=${uri}&fields=id,modules_id.*.name,modules_id.*.id&fields[]=values_id.*&fields[]=values_id.form_fields_id.id,values_id.form_fields_id.name`, {
            headers: {
                "Authorization": `Bearer ${process.env.TOKEN}`,
            },
            cache: "no-store"
        });
        let totalDataCount: any = await fetch(`${process.env.DIRECTUS_APP_URL}/items/modules_data?filter[modules_id][name]=${uri}&fields=modules_id.*.name,modules_id.*.id&fields[]=values_id.*&fields[]=values_id.form_fields_id.id,values_id.form_fields_id.name&aggregate[count]=*`, {
            headers: {
                "Authorization": `Bearer ${process.env.TOKEN}`,
            },
            cache: "no-store"
        });
        data = await data.json();        
        totalDataCount = await totalDataCount.json();
        totalDataCount = totalDataCount?.data[0].count;
        const transformedData = data?.data?.map((curElem: any, index: number) => {
            let custom: any = { values_data_id: [] }            
            const valuesData = curElem?.values_id?.map((curElemx: any) => {                
                custom = {
                    ...custom,
                    modules_data_id: curElem?.id,
                    values_data_id: [ ...custom.values_data_id, curElemx?.id ],
                    [curElemx?.form_fields_id?.name]: curElemx.values,
                }
            });            
            return {
                ...curElem,
                tableData: custom
            }
        });     

        return {
            moduleName: data?.data[0]?.modules_id?.label,
            transformedData: transformedData,
            totalDataCount: totalDataCount
        };
    } catch (err) {
        throw new Error("Error came while fetching forms");
    }
}

export const getModulesFields = async (uri: string) => {    
    try {
        let data = await fetch(`${process.env.DIRECTUS_APP_URL}/items/modules?filter[name]=${uri}&fields=id,name,label,form_fields_id.*`, {
            headers: {
                "Authorization": `Bearer ${process.env.TOKEN}`,
            },
            cache: "no-store"
        });
        data = await data.json();        
        return data;
    } catch (err) {
        throw new Error("Error came while fetching forms");
    }
}

export const createModulesForm = async (modulesId: number, uri: string, prevState: any, formData: FormData) => {
    try {
            const rawFormData = Object.fromEntries(formData.entries());      
            // formatting create data          
            let formatedCreateData: any = [];
            Object.keys(rawFormData)?.map((curElem: any) => {
                formatedCreateData = [
                    ...formatedCreateData,
                    { values: rawFormData[curElem], form_fields_id: curElem }
                ]
            })            
            // payload format
            let data: any = {
                modules_id: modulesId,
                values_id: {
                    create: [
                        ...formatedCreateData
                    ]
                }
            }
            data = JSON.stringify(data);
            console.log("PAYLOAD DATA = ", data);
            
            let dynamicFieldsData: any = await fetch(`${process.env.DIRECTUS_APP_URL}/items/modules_data`, {
                method:"POST",
                body: data,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.TOKEN}`,
                },
            });        
            dynamicFieldsData = await dynamicFieldsData.json()
            console.log("RESPONSE DATA = ", dynamicFieldsData);
            if (dynamicFieldsData.error) {
                return {
                    error: `${dynamicFieldsData?.error?.details?.errors == undefined ? dynamicFieldsData?.error?.message : dynamicFieldsData?.error?.details?.errors[0]?.message}`,
                    success: false
                }    
            }            
           
    } catch (err: any) {
        return {
            error: `Internal Server Error (${err.message})`,
            success: false
        }
    }
    revalidatePath(`/pages/modules/contact_us`);
    redirect(`/pages/modules/contact_us`) 
}

export const deleteModulesForm = async (modules_id: any, values_id: any, prevState: any, formData: FormData) => {
    console.log(modules_id, values_id);
    try {
        let formValues = await fetch(`${process.env.DIRECTUS_APP_URL}/items/form_values`, {
            method:"DELETE",
                body: JSON.stringify(values_id),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.TOKEN}`,
                },
                cache: "no-store"
        });
        let modulesData = await fetch(`${process.env.DIRECTUS_APP_URL}/items/modules_data`, {
            method:"DELETE",
                body: JSON.stringify(modules_id),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.TOKEN}`,
                },
                cache: "no-store"
        });
        console.log(formValues?.status, modulesData?.status);
        if (formValues?.status == 204) {
            revalidatePath(`pages/modules/faqs`);
            return {
                success: true,
                message: "Product deleted successfully"
            }
        }
        // data = await data.json();        
        // console.log("RESPONSE DATA = ", data);       
    } catch (err) {
        return {
            success: false,
            error: "Internal Server Error (Error came while deleting product data)"
        }
    }
}