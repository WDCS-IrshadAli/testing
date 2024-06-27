"use server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// get data
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
        // display-template data (via collections api)
        let displayTemplateApi: any = await fetch(`${process.env.DIRECTUS_APP_URL}/collections/${uri}`, {
            headers: {
                "Authorization": `Bearer ${process.env.TOKEN}`,
            },
            cache: "no-store"
        })
        displayTemplateApi = await displayTemplateApi.json();
        const displayTemplate = displayTemplateApi?.data?.meta?.display_template;
        let regex = /{{(.*?)}}/g;
        const extractedValues = [];
        let match;
        while ((match = regex.exec(displayTemplate)) !== null) {
            extractedValues.push(match[1]);
        }
        // console.log("Display Templates Fields Data = ", extractedValues);
        




        // table data (via modules uri)
        let data: any = await fetch(`${process.env.DIRECTUS_APP_URL}/items/${uri}?limit=${limit}&offset=${limit}&page=${pageNumber}&fields=*.*.*`, {
            headers: {
                "Authorization": `Bearer ${process.env.TOKEN}`,
            },
            cache: "no-store"
        });
        let totalDataCount: any = await fetch(`${process.env.DIRECTUS_APP_URL}/items/${uri}?aggregate[count]=*`, {
            headers: {
                "Authorization": `Bearer ${process.env.TOKEN}`,
            },
            cache: "no-store"
        });
        data = await data.json();        
        totalDataCount = await totalDataCount.json();
        totalDataCount = totalDataCount?.data[0].count;     





        // filtering table data according to (display-template) api data 
        const getNestedValue = (obj: any, keys: string[]): any => {
            let result = obj;
            for (const key of keys) {
                if (Array.isArray(result)) {
                    return result.map((item: any) => {
                        return item[key] || null
                    });
                } else if (result && result[key] !== undefined) {
                result = result[key];
              } else {                                 
                return null;
              }
            }
            return result;
          }
          
          
        const filterData = (data: any, templateFields: any): any => {
            return data.map((item: any) => {
              const filteredItem: any = {};
              templateFields?.forEach((field: any) => {
                const keys = field.split('.');
                let value = getNestedValue(item, keys);
                if (value && typeof value === 'object') {   
                    value = JSON.stringify(value);
                }else if (Array.isArray(value)) {
                    value = value.join(',');
                    value = JSON.stringify(value);
                } else if (typeof value === 'function') {
                    value = JSON.stringify(value); // Call the function to get the value if it's a function
                }
                filteredItem[field.split('.').map((word: any) => word.charAt(0).toUpperCase() + word.slice(1)).join('_')] = value;
              });              
              return filteredItem;
            });
        }
          
          
        const filteredData: any = filterData(data?.data, extractedValues);
        // console.log("FILTERED DATA FOR TABLE = ", filteredData);



        

        // filtering (display-template) api data according to react-table cols format
        // Function to get keys in the desired format
        const getKeyFormat = (templateFields: any): any => {
            return templateFields.map((field: any) => {
            const fieldName: any = field.split('.').map((word: any) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const tg = field.split('.').map((word: any) => word.charAt(0).toUpperCase() + word.slice(1)).join('_');            
            return { tableColsName: fieldName, fieldName: tg };
            });
        }
        const keysInFormat: any = getKeyFormat(extractedValues);


        return {
            data: {data: filteredData},
            totalDataCount: totalDataCount,
            dynamicTableFields: keysInFormat
        };
    } catch (err) {
        throw new Error("Error came while fetching forms");
    }
}

// fields collection
export const getModulesFields = async (uri: string) => {    
    try {
        let data = await fetch(`${process.env.DIRECTUS_APP_URL}/fields/${uri}`, {
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

// create data
export const createModulesForm = async (uri: string, prevState: any, formData: FormData) => {
    try {        
            const rawFormData = Object.fromEntries(formData.entries());                  
            let data = JSON.stringify(rawFormData);
            console.log("PAYLOAD DATA = ", data);
            
            let dynamicFieldsData: any = await fetch(`${process.env.DIRECTUS_APP_URL}/items/${uri}`, {
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
            
            if (dynamicFieldsData.errors) {
                return {
                    error: `${dynamicFieldsData?.errors[0]?.message}`,
                    success: false
                }    
            }            
            // return {
            //     message: `Form submitted successfully`,
            //     success: true
            // }
    } catch (err: any) {
        return {
            error: `Internal Server Error (${err.message})`,
            success: false
        }
    }
    revalidatePath(`/directus/${uri}`);
    redirect(`/directus/${uri}`) 
}