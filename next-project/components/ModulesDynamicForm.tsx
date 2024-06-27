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
import { createForm, createModulesForm } from '@/app/lib/action'
import Link from 'next/link'



const ModulesDynamicForm = ({ formData, params}: any) => {  
      const router  = useRouter();      
      
      // dynamic form elements handling
      let data = formData?.data[0]?.form_fields_id;
      let title = formData?.data[0]?.label;
      let modulesId = formData?.data[0]?.id;
      const uri = formData?.data[0]?.name;
      const formElements = Object.keys(data).map(
        (fieldName: any, index: number) => {
          const fieldData = {
            ...data[fieldName]
          };                    
          let inputElement = null;   
                           
          switch (fieldData.type) {
            case "string":
            case "email":
            case "password":
            case "text":
              inputElement = (
                <Input
                    className="placeholder:font-normal font-normal"
                    type={
                      fieldData.type === "password"
                        ? "password"
                        : fieldData.type === "email"
                        ? "email"
                        : "text"
                    }
                    name={fieldData.id}
                    placeholder={fieldData?.placeholder ? fieldData?.placeholder : fieldData.name.charAt(0).toUpperCase()+fieldData.name.slice(1) || ""}
                    // required={fieldData.validation=="required"}
                    id={fieldName}
                    // minLength={fieldData.minLength}
                    // maxLength={fieldData.maxLength}          
                    // defaultValue={formType==="addForm" ? 
                    // (fieldData.default || "") : (
                    //   particularData && fieldName in particularData.data.attributes
                    //       ? particularData.data.attributes[fieldName]
                    //       : ""
                    // )}
                    // disabled={formType=="editForm" && !fieldData.editable}
                    // onChange={handleChange}
                  />
                  
              );
              break;

            // case "enumeration":
            case "select":
              inputElement = (
                  <Select name={fieldData.id}
                //   defaultValue={formType==="addForm" ? 
                    // (fieldData.default || "") : (
                    //   particularData && fieldName in particularData.data.attributes
                    //       ? particularData.data.attributes[fieldName]
                    //       : ""
                    // )}
                    >
                    <SelectTrigger id={fieldName} name={fieldData.id} className="w-full">
                      <SelectValue 
                      placeholder={fieldData?.placeholder ? `${fieldData?.placeholder}` : `Select ${fieldData?.name}`} />
                    </SelectTrigger>
                  
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{`Select ${fieldData?.label}`}</SelectLabel>
                          {Object.keys(fieldData.options).map((key, index)=>{
                            return (
                                <SelectItem key={index} value={fieldData.options[key]}>{fieldData.options[key]}</SelectItem>    
                            )
                          })  
                        }
                      </SelectGroup>
                    </SelectContent>
                  </Select>
              );
              break;

            // case "boolean":
            //   inputElement = (
            //       <RadioGroup id={fieldName} name={fieldName} disabled={formType=="editForm" && !fieldData.editable} required={fieldData.required}
            //       defaultValue={formType==="addForm" ? 
            //       (fieldData.default ? `${fieldData.default}` : "null") : (
            //         particularData && fieldName in particularData.data.attributes
            //           ? `${particularData.data.attributes[fieldName]}`
            //           : "null"
            //       )}>
            //         {/* <div className="flex items-center space-x-2">
            //           <RadioGroupItem value={"null"} id="r1" />
            //           <Label htmlFor="r1">Null</Label>
            //         </div> */}
            //         <div className="flex items-center space-x-2">
            //           <RadioGroupItem value={"true"} id="r2" />
            //           <Label htmlFor="r2">True</Label>
            //         </div>
            //         <div className="flex items-center space-x-2">
            //           <RadioGroupItem value={"false"} id="r3" />
            //           <Label htmlFor="r3">False</Label>
            //         </div>
            //       </RadioGroup>
            //   );
            //   break;

            // case "decimal":
            // case "integer":
            // case "big integer":
            case "number":
              inputElement = (
                  <Input
                    className="placeholder:font-normal font-normal"
                    type="number"
                    placeholder={fieldData?.placeholder ? fieldData?.placeholder : fieldData.name.charAt(0).toUpperCase()+fieldData.name.slice(1) || ""}
                    // name={fieldData.name}
                    name={fieldData.id}
                    // required={fieldData.validation=="required"}
                    // defaultValue={formType==="addForm" ? 
                    // (fieldData.default || "") : (
                    //   particularData && fieldName in particularData.data.attributes
                    //       ? particularData.data.attributes[fieldName]
                    //       : ""
                    // )}
                    id={fieldName}
                    // disabled={formType=="editForm" && !fieldData.editable}
                    //   onChange={handleChange}
                  />
              );
              break;

            case "date":
            // case "datetime":
              inputElement = (
                  <Input
                    className="placeholder:font-normal font-normal"
                    type="date"
                    // name={fieldData.name}
                    name={fieldData.id}
                    required={fieldData.validation=="required"}
                    // defaultValue={formType==="addForm" ? 
                    // (fieldData.default || "") : (
                    //   particularData && fieldName in particularData.data.attributes
                    //       ? particularData.data.attributes[fieldName]
                    //       : ""
                    // )}
                    id={fieldName}
                    // disabled={formType=="editForm" && !fieldData.editable}
                    //   onChange={handleChange}
                  />
              );
              break;

            case "textarea":
            // case "richtext":
              inputElement = (
                  <Textarea
                    className="placeholder:font-normal font-normal"
                    placeholder={fieldData?.placeholder ? fieldData?.placeholder : fieldData.name.charAt(0).toUpperCase()+fieldData.name.slice(1) || ""}
                    required={fieldData.validation=="required"}
                    // name={fieldData.name}
                    name={fieldData.id}
                    // minLength={fieldData.minLength}
                    // maxLength={fieldData.maxLength}
                    // defaultValue={formType==="addForm" ? 
                    // (fieldData.default || "") : (
                    //   particularData && fieldName in particularData.data.attributes
                    //       ? particularData.data.attributes[fieldName]
                    //       : ""
                    // )}
                    id={fieldName}
                    rows={5}
                    // disabled={formType=="editForm" && !fieldData.editable}
                    //  onChange={handleChange}
                  />
              );
              break;

            case "file":
              inputElement = (
                <div key={index} className="grid grid-cols-1 w-full max-w-sm items-center gap-2">
                  <Input
                    type="file"
                    id={fieldName}
                    // accept={fieldData.allowedTypes.join(",")}
                    // multiple={fieldData.multiple}
                    // name={fieldData.name}
                    name={fieldData.id}
                    required={fieldData.validation=="required"}
                    // disabled={formType=="editForm" && !fieldData.editable}
                    // onChange={handleFileChange}
                  />
                  </div>
              );
              break;

            default:
              inputElement = null;
          }

          let gridSize;
          if (fieldData.width=="33") {
            gridSize = "px-2 mb-2 lg:col-span-1 md:col-span-2 col-span-4"
          } else if (fieldData.width=="50") {
            gridSize = "px-2 mb-2 sm:col-span-2 col-span-4"
          } else if (fieldData.width=="67") {
            gridSize = "px-2 mb-2 sm:col-span-3 col-span-4"
          } else {
            gridSize = "px-2 mb-2 col-span-12"
          }

          // let gridCss = `px-2 mb-2 ${gridSize}`;
          console.log(fieldData.name, fieldData.type, fieldData.width);
          console.log(gridSize);
          
    
          return (
            fieldData.type !== "relation" && (
              <div className={gridSize}>
                    <div key={index} className={`w-full flex flex-col gap-1`}>
                      {/* LABEL FIELD */}
                      <Label htmlFor={fieldName} className="text-xs text-gray-500">{fieldData?.label ? fieldData?.label : fieldData.name.charAt(0).toUpperCase() + fieldData.name.slice(1)}</Label>
                      {/* INPUT FIELD */}
                      {inputElement}
                      {/* DESCRIPTION FIELD */}
                      {
                        fieldData?.description ?
                        <p className="text-xs italic font-normal text-gray-100 flex">
                          <InfoCircledIcon className="mr-1" />{fieldData?.description}
                        </p>
                        : ""
                      }
                    </div>
                </div>
            ));
        }
      );

      // form submit handling functions
      const initialState: any = { message: null, error: null, success: null };
      const createFormWithId = createModulesForm.bind(null, modulesId, uri);
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
        setTimeout(() => {
          router.push(`/pages/modules/${params}`)
        }, 1000)
      }
    
      return (
        <>
          <div className="py-3 sm:py-6 pb-10 relative">
              <Toaster position="top-right" theme="dark" richColors />
              <h1 className="text-3xl font-semibold px-3 sm:px-6 mb-10">
                <span className="text-sm pe-3"><Link href={`/pages/modules/${params}`}><Button variant={'outline'}><ChevronLeftIcon className="h-4 w-4" /></Button></Link></span>
                {title?.charAt(0).toUpperCase() + title.slice(1)} Page
              </h1>
              
              <div className="px-3 sm:px-6 mb-10">
              
                {/* FORM  */}
                <form action={dispatch} className="flex flex-col">
                  <div className="grid grid-cols-4">
                  {formElements.map((curElem, index) => (
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

export default ModulesDynamicForm
