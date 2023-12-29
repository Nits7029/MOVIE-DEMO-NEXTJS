'use client'

import React, { useState, useEffect } from 'react';
import { Input, FormFeedback, Spinner } from 'reactstrap'
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { object, string, number } from "yup";
import { useFormik } from 'formik';
import { CREATE_MOVIE, UPDATE_MOVIE } from '@/apollo/client/graphql/mutation/movie.mutation';
import { FormValidationMessages } from '@/constants/form-const';
import toast from 'react-hot-toast'
import DropZone from 'react-dropzone'
import { XCircle, Download } from 'react-feather';

const allowedExtensionsImage = [".jpg", ".JPG", ".jpeg", ".JPEG", ".png", ".PNG", ".gif", ".GIF", ".tif", ".TIF", ".tiff", ".TIFF", ".heic", ".HEIC", ".webp", ".WEBP"];

export default function MovieForm({ operation, editData }) {

  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState("");
  const [image, setImage] = useState(editData?.poster || "");

  useEffect(() => {
    if (operation === "edit" && editData?.poster) {
      setImage(editData?.poster)
    }
  }, [operation, editData])

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
        poster: selectedFile ? selectedFile : editData?.poster || ""
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
        .finally(() => {
          setLoading(false)
          setSelectedFile('')
          setImage('')
        })
    }
  });

  const handleCancel = (e) => {
    e.preventDefault()
    validation.resetForm()
    setSelectedFile('')
    setImage('')
    router.push('/movies')
  }

  return (
    <div className="create-movie background-screen position-relative">
      <div className="sign-in-box container ">
        <p className="big-title fs-48 text-start">{operation === "edit" ? "Edit" : "Create a new movie"}</p>
        <div className="drop-img-wrap row">
          <div className="col-xl-5 col-lg-6 col-12">
            {(selectedFile || image) ?
              <div className="drop-img-col text-white position-relative">
                <div className="cursor-pointer x-circle position-absolute">
                  <XCircle size={32} onClick={() => { setSelectedFile(''); setImage('') }} />
                </div>
                <div className="dropzone-img-wrap">
                  <img src={selectedFile ? selectedFile : image ? `/uploads/${image}` : "/assets/Images/movie-list-img.png"} alt="err"
                    className="w-100 img-fluid object-fit-cover" />
                </div>
              </div>
              :
              <DropZone
                accept={{
                  'image/*': allowedExtensionsImage
                }}
                multiple={false}
                disabled={selectedFile ? true : false}
                onDrop={(acceptedFiles) => {
                  const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
                  if (imageFiles?.length) {
                    const file = imageFiles[0];

                    const reader = new FileReader();
                    reader.onload = () => {
                      const base64String = reader.result;
                      setSelectedFile(base64String)
                    };

                    reader.readAsDataURL(file);
                  }
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div className="dropzone dz-clickable cursor-pointer">
                    <div
                      className="dz-message needsclick"
                      {...getRootProps()}
                    >
                      <div className="mb-3 position-absolute dropzone-content-custom">
                        <Download />
                        <h5 className="mt-3">Drop an Image here</h5>
                      </div>
                    </div>
                  </div>
                )}
              </DropZone>
            }
          </div>
          <div className="col-xl-7 col-lg-6 col-12 ">
            <div className="drop-img-content">
              <div className="w-362">
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
                  <button type="reset" className="cancel-btn" onClick={(e) => handleCancel(e)}>Cancel</button>
                </div>
                <div>
                  <button type="submit" className="green-btn" onClick={() => validation.handleSubmit()} disabled={loading}>
                    {loading ? (<><Spinner size="sm" className="me-2" />Loading...</>) : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}