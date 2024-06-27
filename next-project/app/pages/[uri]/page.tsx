import { getFormFields } from '@/app/lib/action'
import DynamicForm from '@/components/DynamicForm'
import React from 'react'

const Pages = async (params: any) => {
    const getFormData = await getFormFields(params?.params?.uri);
  return (
    <>
        <div className="container mx-auto">
            <DynamicForm formData={getFormData} params={params.params.uri} /> 
        </div>
    </>
  )
}

export default Pages