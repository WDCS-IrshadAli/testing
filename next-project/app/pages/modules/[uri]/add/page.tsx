import { getModulesFields } from '@/app/lib/action';
import ModulesDynamicForm from '@/components/ModulesDynamicForm';
import React from 'react'

const Page = async (params: any) => {
    const getFormData = await getModulesFields(params?.params?.uri);
  return (
    <>
        <div className="container mx-auto">
            <ModulesDynamicForm formData={getFormData} params={params.params.uri} /> 
        </div>
    </>
  )
}

export default Page