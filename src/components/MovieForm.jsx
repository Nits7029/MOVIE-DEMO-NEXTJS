'use client'

import React, { useEffect, useState } from 'react';
import { Button, Form, Input, FormFeedback } from 'reactstrap'
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { object, string, number } from "yup";
import { useFormik } from 'formik';
import { CREATE_MOVIE, UPDATE_MOVIE } from '@/apollo/client/graphql/mutation/movie.mutation';
import { FormValidationMessages } from '@/constants/form-const';
import toast from 'react-hot-toast'
import DropZone from 'react-dropzone'

export default function MovieForm(operation, editData) {

  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [images, setImages] = useState([])
  const router = useRouter()

  const schema = object().shape({
    title: string()
      .required(FormValidationMessages.title.REQUIRED),
    year: number()
      .required(FormValidationMessages.year.REQUIRED)
  })

  const [movieMutation] = useMutation(operation === "edit" ? UPDATE_MOVIE : CREATE_MOVIE)

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      title: editData?.title || "",
      year: editData?.year || ""
    },
    validationSchema: schema,

    onSubmit: (values) => {

      setLoading(true)

      let input = {
        ...(operation === "edit" && {
          _id: editData?._id
        }),
        title: values.title,
        year: values.year,
      };


      movieMutation({
        variables: {
          input
        }
      }).then(({ data }) => {
        if (operation === "edit") {
          toast.success('Movie updated successfully')
        } else {
          toast.success('Movie added successfully')
        }
        router.push('/movies')
      }).catch(error => {
        toast.error(error.message)
      })
        .finally(() => setLoading(false))
    }
  });


  return (
    <div className="create-movie background-screen position-relative">
      <div className="sign-in-box container ">
        <p className="big-title fs-48 text-start">{operation === "edit" ? "Edit" : "Create a new movie"}</p>
        <div className="drop-img-wrap row">
          <div className="col-xl-5 col-lg-6 col-12">
            {/* <div className="drop-img-col">dsds</div> */}
            <DropZone
              accept={{
                'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
              }}
              multiple={false}
              disabled={selectedFiles?.length}
              onDrop={(acceptedFiles) => {
                const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
                const newFiles = imageFiles.map(file => Object.assign(file))
                setSelectedFiles([...selectedFiles, ...newFiles].map(f => f))
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <div className="dropzone dz-clickable cursor-pointer">
                  <div
                    className="dz-message needsclick"
                    {...getRootProps()}
                  >
                    <div className="mb-3 position-absolute dropzone-content-custom">
                      {/* <svg className="mb-3" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clip-path="url(#clip0_3_346)">
                          <path d="M18 15V18H6V15H4V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V15H18ZM17 11L15.59 9.59L13 12.17V4H11V12.17L8.41 9.59L7 11L12 16L17 11Z" fill="white" />
                        </g>
                        <defs>
                          <clipPath id="clip0_3_346">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg> */}
                      {/* <i className="display-4 text-muted ri-upload-cloud-2-fill" /> */}
                      <h5>Drop an Image here</h5>
                    </div>
                  </div>
                </div>
              )}
            </DropZone>
          </div>
          <div className="col-xl-7 col-lg-6 col-12 ">
            <div className="drop-img-content">
              <div className="mt-40 w-362">
                <Input
                  placeholder="Title"
                  type="text"
                  name="title"
                  className="form-control bg-input-box"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.title || ""}
                  invalid={
                    validation.touched.title && validation.errors.title ? true : false
                  }
                />
                {validation.touched.title && validation.errors.title ? (
                  <FormFeedback type="invalid">{validation.errors.title}</FormFeedback>
                ) : null}
              </div>
              <div className="mt-24 w-216">
                <Input
                  placeholder="Publishing year"
                  type="number"
                  name="year"
                  className="form-control bg-input-box w-216"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.year || ""}
                  invalid={
                    validation.touched.year && validation.errors.year ? true : false
                  }
                />
                {validation.touched.year && validation.errors.year ? (
                  <FormFeedback type="invalid">{validation.errors.year}</FormFeedback>
                ) : null}
              </div>
              <div className="w-100 d-flex mt-64">
                <div>
                  <button className="cancel-btn" onClick={() => validation.resetForm()}>Cancel</button>
                </div>
                <div>
                  <button className="green-btn" onClick={() => validation.handleSubmit()}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}