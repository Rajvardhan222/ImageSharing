import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { Button } from './ui/button'

function FileUpload({fieldChange,mediaUrl,fileUrl,setFileUrl}) {
    const [file, setFile] = useState([])

    
    const onDrop = useCallback(acceptedFiles => {
        setFile(acceptedFiles)
        fieldChange(acceptedFiles)
        setFileUrl(URL.createObjectURL(acceptedFiles[0]))

      }, [file])
      const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop,
        accept : {
            'image/*':['.png', '.jpg', '.jpeg','svg']
        }
    })
  return (
    <div {...getRootProps()} className=' max-h-72 flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
    <input {...getInputProps()} className='cursor-pointer '/>
    {
     
       (<div className='file_uploader-box'>
                <img 
                src='/assets/icons/file-upload.svg'

                width={96}
                height={77}
                alt='file upload'
                >
                </img>
                <h3 className='base-medium text-light-2 mb-2 mt-6'>
                    Drag photo here
                </h3>

                <p className='text-light-4 small-regular mb-6'>SVG, PNG, JPG</p>

                <Button className='shad-button_dark_4'>
                    Select from Computer
                </Button>
       </div> )
        
    }
  </div>
  )
}

export default FileUpload