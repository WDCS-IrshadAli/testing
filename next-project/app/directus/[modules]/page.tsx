import DirectusTable from '@/components/DirectusTable';
import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getModulesData, getModulesFields } from '@/app/lib/directus';

const Page = async ({ params, searchParams }: any) => {

  // table data 
  const LIMIT = 5;
  const URI: any = params.modules;
  const title = params?.modules?.replaceAll("_", " ");
  const SEARCHPARAMS: any = {page: searchParams?.page};
  const apiData = await getModulesData(URI, LIMIT, SEARCHPARAMS);
  const data = apiData?.data;
  const tableData = data?.data;  
  const fieldsData = Object.keys(tableData[0] ? tableData[0] : []);

  // total data count
  const totalDataCount = apiData?.totalDataCount;
  const totalPage = Math.ceil(totalDataCount/LIMIT); 
  let currentPage = (parseInt(searchParams?.page)==undefined ? 1 : parseInt(searchParams?.page));
  if (isNaN(currentPage)) currentPage=1;

  // fields data
  // const fields: any = await getModulesFields(URI);
  let dynamicTableFields: any = apiData?.dynamicTableFields;
  // fields?.data?.map((curElem: any, index: number) => {
  //   if (curElem?.field=="id" || curElem?.field=="sort" || curElem?.field=="date_created" || curElem?.field=="user_created" || curElem?.field=="status" || curElem?.field=="user_updated" || curElem?.field=="date_updated") return;
  //   dynamicTableFields = [
  //     ...dynamicTableFields, {
  //       tableColsName: curElem?.meta?.translations ? curElem?.meta?.translations[0].translation : curElem?.meta?.field,
  //       fieldName:  curElem?.meta?.field
  //     }
  //   ]
  // });
  
  
  
  return (
    <>
        <div className="px-10 pt-5 flex gap-3"> 
        {/* {
          modulesName?.data?.map((curElem: any, index: number) => 
            <Link key={index} href={`/pages/modules/${curElem?.name}`}>
              <Button variant="outline" size="sm" type="button">{curElem?.label}</Button>
            </Link>
          )
        } */}
            
        </div>
        <div className="px-10 pt-5 flex justify-between">
          <h1 className="text-2xl font-semibold">{title?.charAt(0).toUpperCase() + title.slice(1)}</h1>
          <Link href={`/directus/${URI}/add`}>
            <Button variant="outline" size="sm" type="button">Add</Button>    
          </Link>
        </div>

        <div className="px-10 pt-8">
            <DirectusTable moduleName={URI} modulesData={data} tableData={tableData} fieldsData={fieldsData} totalDataCount={totalDataCount} totalPage={totalPage} currentPage={currentPage} dynamicTableFields={dynamicTableFields} />
        </div>
    </>
  )
}

export default Page