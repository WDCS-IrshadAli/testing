
import { getModulesData, getModulesName } from '@/app/lib/action'
import DynamicTable from '@/components/DynamicTable'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react'

const Modules = async ({ params, searchParams }: any) => {
  
  let uri: any = params.uri;
  const limit = 10;
  const apiData = await getModulesData(uri, limit, searchParams= {page: searchParams?.page});
  const data = apiData?.transformedData;
  const tableData = data?.map((curElem: any) => curElem?.tableData);  
  const fieldsData = Object.keys(tableData[0] ? tableData[0] : []);

  // total count of apiData
  const totalDataCount = apiData?.totalDataCount;
  const totalPage = Math.ceil(totalDataCount/limit); 
  let currentPage = (parseInt(searchParams?.page)==undefined ? 1 : parseInt(searchParams?.page));
  if (isNaN(currentPage)) currentPage=1;

  

  const modulesName: any = await getModulesName();
  
  return (
    <>
        <div className="px-10 pt-5 flex gap-3"> 
        {
          modulesName?.data?.map((curElem: any, index: number) => 
            <Link key={index} href={`/pages/modules/${curElem?.name}`}>
              <Button variant="outline" size="sm" type="button">{curElem?.label}</Button>
            </Link>
          )
        }
            
        </div>
        <div className="px-10 pt-5 flex justify-between">
          <h1 className="text-2xl font-semibold">{apiData?.moduleName} Modules</h1>
          <Link href={`/pages/modules/${uri}/add`}>
            <Button variant="outline" size="sm" type="button">Add</Button>    
          </Link>
        </div>

        <div className="px-10 pt-8">
            <DynamicTable moduleName={uri} modulesData={data} tableData={tableData} fieldsData={fieldsData} totalDataCount={totalDataCount} totalPage={totalPage} currentPage={currentPage} />
        </div>
    </>
  )
}

export default Modules