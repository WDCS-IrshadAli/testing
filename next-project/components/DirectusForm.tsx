"use client"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from '@/components/ui/textarea'
// import { createDynamicModuleData } from '../lib/strapi'
import { useFormState } from 'react-dom'
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ChevronLeftIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { createModulesForm } from '@/app/lib/directus'

const DirectusForm = ({ formData, params }: any) => {  
      // constants
      const router  = useRouter();      
      let data: any = formData?.data; 
      const URI: string = params;
      const title = URI?.replaceAll("_", " ");
      
      // dynamically creating input fields
      const sortedData: any = data?.sort((a: any, b: any) => a?.meta?.sort - b?.meta?.sort);
      const formElements: any = Object.keys(sortedData).map(
        (fieldName: any, index: number) => {          
          const fieldData = {
            ...data[fieldName]
          };                 

          // input fields
          let inputElement = null;                              
          if (fieldData?.meta?.hidden===true) return;
          switch (fieldData?.meta?.interface) {
            case "input":
              inputElement = (
                <Input
                    className="placeholder:font-normal font-normal"
                    type={
                      fieldData.type === "password"
                        ? "password"
                        : "text"
                    }
                    name={fieldData.field}
                    placeholder={fieldData?.meta?.options?.placeholder ? fieldData?.meta?.options?.placeholder : fieldData.field.charAt(0).toUpperCase()+fieldData.field.slice(1) || ""}
                    required={fieldData?.meta?.required}
                    id={fieldData?.meta?.id}
                    minLength={fieldData?.meta?.options?.min}
                    maxLength={fieldData?.meta?.options?.max}          
                    defaultValue={fieldData?.schema?.default_value ? fieldData?.schema?.default_value : ""}
                    disabled={fieldData?.meta?.readonly}
                  />
                  
              );
              break;

            case "select-dropdown":
              inputElement = (
                  <Select name={fieldData.field} defaultValue={fieldData?.schema?.default_value ? fieldData?.schema?.default_value : ""}>
                    <SelectTrigger id={fieldData?.meta?.id} name={fieldData.field} disabled={fieldData?.meta?.readonly} className="w-full">
                      <SelectValue 
                      placeholder={fieldData?.meta?.options?.placeholder ? fieldData?.meta?.options?.placeholder : `Select ${fieldData.field.charAt(0).toUpperCase()+fieldData.field.slice(1)}` || ""} />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{fieldData?.meta?.translations[0]?.translation ? fieldData?.meta?.translations[0]?.translation : `${fieldData.field.charAt(0).toUpperCase()+fieldData.field.slice(1)}`}</SelectLabel>
                          {fieldData?.meta?.options?.choices?.map((curElem: any, index: number)=>{
                            return (
                                <SelectItem key={index} value={curElem?.value}>{curElem?.text}</SelectItem>    
                            )
                          })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
              );
              break;

            case "input-multiline":
              inputElement = (
                  <Textarea
                    className="placeholder:font-normal font-normal"
                    placeholder={fieldData?.meta?.options?.placeholder ? fieldData?.meta?.options?.placeholder : fieldData.field.charAt(0).toUpperCase()+fieldData.field.slice(1) || ""}
                    required={fieldData?.meta?.required}
                    name={fieldData.field}
                    // minLength={fieldData.minLength}
                    // maxLength={fieldData.maxLength}
                    id={fieldData?.meta?.id}
                    rows={5}
                    defaultValue={fieldData?.schema?.default_value ? fieldData?.schema?.default_value : ""}
                    disabled={fieldData?.meta?.readonly}
                  />
              );
              break;
            
            case "datetime":
                inputElement = (
                    <Input
                      className="placeholder:font-normal font-normal"
                      type={
                        (fieldData.type === "date") ? "date" : (fieldData.type === "time") ? "time" : "datetime-local" 
                      }
                      name={fieldData.field}
                      id={fieldData?.meta?.id}
                      defaultValue={fieldData?.schema?.default_value ? fieldData?.schema?.default_value : ""}
                      required={fieldData?.meta?.required}
                      disabled={fieldData?.meta?.readonly}
                      
                    />
                );
                break;
            
            case "select-radio":
              inputElement = (
                  <RadioGroup 
                    name={fieldData.field}
                    required={fieldData?.meta?.required}
                    id={fieldData?.meta?.id}
                    disabled={fieldData?.meta?.readonly}
                    defaultValue={fieldData?.schema?.default_value ? fieldData?.schema?.default_value : ""}
                  >
                    {
                      fieldData?.meta?.options?.choices?.map((curElem: any, index: number) => {                        
                        return (
                          <div className="flex items-center space-x-2" key={index}>
                            <RadioGroupItem value={curElem?.value} id={`r${fieldData.field+index}`} />
                            <Label htmlFor={`r${fieldData.field+index}`}>{curElem?.text}</Label>
                          </div>
                        )
                      })
                    }
                  </RadioGroup>
              );
              break;

            // case "decimal":
            // case "integer":
            // case "big integer":
            // case "number":
            //   inputElement = (
            //       <Input
            //         className="placeholder:font-normal font-normal"
            //         type="number"
            //         placeholder={fieldData?.placeholder ? fieldData?.placeholder : fieldData.name.charAt(0).toUpperCase()+fieldData.name.slice(1) || ""}
            //         // name={fieldData.name}
            //         name={fieldData.id}
            //         // required={fieldData.validation=="required"}
            //         // defaultValue={formType==="addForm" ? 
            //         // (fieldData.default || "") : (
            //         //   particularData && fieldName in particularData.data.attributes
            //         //       ? particularData.data.attributes[fieldName]
            //         //       : ""
            //         // )}
            //         id={fieldName}
            //         // disabled={formType=="editForm" && !fieldData.editable}
            //         //   onChange={handleChange}
            //       />
            //   );
            //   break;
            
            // case "file":
            //   inputElement = (
            //     <div key={index} className="grid grid-cols-1 w-full max-w-sm items-center gap-2">
            //       <Input
            //         type="file"
            //         id={fieldName}
            //         // accept={fieldData.allowedTypes.join(",")}
            //         // multiple={fieldData.multiple}
            //         // name={fieldData.name}
            //         name={fieldData.id}
            //         required={fieldData.validation=="required"}
            //         // disabled={formType=="editForm" && !fieldData.editable}
            //         // onChange={handleFileChange}
            //       />
            //       </div>
            //   );
            //   break;


            default:
              inputElement = null;
          }

          let gridSize;
          if (fieldData?.meta?.width=="half") {
            gridSize = "px-2 mb-2 sm:col-span-2 col-span-6"
          } else {
            gridSize = "px-2 mb-2 col-span-12"
          }          
    
          // display (returning) input fields
          return (
            fieldData.type !== "relation" && (
              <div className={gridSize}>
                    <div key={index} className={`w-full flex flex-col gap-1`}>
                      {/* LABEL FIELD */}
                      <Label htmlFor={fieldData?.field} className="text-xs text-gray-500">{fieldData?.meta?.translations ? fieldData?.meta?.translations[0].translation : fieldData.field.charAt(0).toUpperCase() + fieldData.field.slice(1)}</Label>
                      {/* INPUT FIELD */}
                      {inputElement}
                      {/* DESCRIPTION FIELD */}
                      {/* {
                        fieldData?.description ?
                        <p className="text-xs italic font-normal text-gray-100 flex">
                          <InfoCircledIcon className="mr-1" />{fieldData?.description}
                        </p>
                        : ""
                      } */}
                    </div>
                </div>
            ));
        }
      );
      
      // form submit using (useFormState)
      const initialState: any = { message: null, error: null, success: null };
      const createFormWithId = createModulesForm.bind(null, URI);
      const [state, dispatch] = useFormState(createFormWithId, initialState);

      // error handling 
      if (state.success === false) {
        toast.error(state.error);
        state.success = null;
        state.error = null;
      } else if (state.success === true) {
        toast.success(state.message);
        state.success = null;
        state.message = null;
      }
    
      return (
        <>
          <div className="py-3 sm:py-6 pb-10 relative">
              <Toaster position="top-right" theme="dark" richColors />
              <h1 className="text-3xl font-semibold px-3 sm:px-6 mb-10">
                <span className="text-sm pe-3"><Link href={`/directus/${params}`}><Button variant={'outline'}><ChevronLeftIcon className="h-4 w-4" /></Button></Link></span>
                Add {title?.charAt(0).toUpperCase() + title.slice(1)} 
              </h1>
              
              <div className="px-3 sm:px-6 mb-10">
      
                {/* FORM  */}
                <form action={dispatch} className="flex flex-col">
                  <div className="grid grid-cols-4">
                    {formElements.map((curElem: any, index: number) => (
                      <React.Fragment key={index}>
                        {curElem}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="grid w-full items-center gap-2 mt-3">
                    <Button type="submit">Submit</Button>
                  </div>        
                </form>

              </div>
          </div>
        </>
      );
}

export default DirectusForm
