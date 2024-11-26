import React, { useEffect, useState } from "react";
import { GetSyllabus } from "../../../../services";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css"; 
import { MdCloudDownload } from "react-icons/md";


const TraineeSyllabus = () => {
  const [syllabusList, setSyllabusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const response = await GetSyllabus();
        setSyllabusList(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch syllabus data.");
        setLoading(false);
      }
    };

    fetchSyllabus();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center space-x-2">
        <span>Loading syllabus...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        <h2 className="font-semibold">Error: {error}</h2>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Syllabus</h1>
      {syllabusList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-[70%]">
          {syllabusList.map((syllabus) => (
            <div
              key={syllabus._id}
              className="border rounded-md shadow-lg bg-white hover:shadow-xl transition-all duration-300"
            >
             
              <div className="relative h-44 ">
                {syllabus.uploadFile ? (
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <Viewer 
                    
                      fileUrl={syllabus.uploadFile}
                      initialPage={0} 
                      
                      theme={{
                        theme: "light",
                      }}
                      localization={{
                        noDocumentFound: "PDF cannot be loaded",
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        overflow: "hidden"
                        
                      
                      }}
                      
                    />
                  </Worker>
                  
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-red-500 font-medium">No PDF available</p>
                  </div>
                )}
              </div>
              {syllabus.uploadFile && (
                <div className="mt-2 flex bg-gray-100 items-center justify-between px-4">
                   <h2 className="text-lg font-medium text-gray-800 ">
               {syllabus.subjectName}
              </h2>
                  <a
                    href={syllabus.uploadFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-orange-600 hover:underline"
                  >
                    <MdCloudDownload size={40}/>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No syllabus data available.</div>
      )}
    </div>
  );
};

export default TraineeSyllabus;
