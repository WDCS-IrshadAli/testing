import { getModulesFields } from '@/app/lib/directus';
import DirectusForm from '@/components/DirectusForm';
import React from 'react'

const AddModules = async ({ params }: any) => {
  const URI: string = params?.modules;  
  const getFormData = await getModulesFields(URI);
  return (
    <>
      <div className="container mx-auto">
        <DirectusForm formData={getFormData} params={URI} /> 
      </div>
    </>
  )
}

export default AddModules