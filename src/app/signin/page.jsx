'use client'

import React, { useEffect, useState } from 'react';
import { Button, Form, Input, FormFeedback, Spinner } from 'reactstrap'
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { object, string } from "yup";
import { useFormik } from 'formik';
import { SIGN_IN } from '@/apollo/client/graphql/mutation/user.mutation';
import { FormValidationMessages } from '@/constants/form-const';
import toast from 'react-hot-toast'
import { useCookies } from 'react-cookie';

export default function SignIn() {

  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [cookie, setCookie] = useCookies(["Remember"]);
  const router = useRouter()

  const schema = object().shape({
    email: string()
      .email(FormValidationMessages.email.INVALID)
      .required(FormValidationMessages.email.REQUIRED),
    password: string()
      .matches(FormValidationMessages.password.PATTERN, FormValidationMessages.password.SPACE_NOT_ALLOWED)
      .min(6, FormValidationMessages.password.MIN_LEN_6)
      .required(FormValidationMessages.password.REQUIRED)
  })

  const [signInMutation] = useMutation(SIGN_IN)

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      email: cookie?.email || "",
      password: ""
    },
    validationSchema: schema,

    onSubmit: (values) => {

      setLoading(true)

      let input = {
        email: values.email,
        password: values.password,
      };


      signInMutation({
        variables: {
          input
        }
      }).then(({ data }) => {
        if (data?.signIn?.token) {
          localStorage.setItem('token', data?.signIn?.token)
          localStorage.setItem('userData', JSON.stringify(data?.signIn?.user))
          if (rememberMe) {
            setCookie("email", JSON.stringify(data?.signIn?.user?.email))
          }
        }
        toast.success('User Sign in successfully')
        router.push('/movies')
      }).catch(error => {
        toast.error(error.message)
      })
        .finally(() => setLoading(false))
    }
  });


  return (
    <div className="bg_red sign_in_wrap background-screen position-relative d-flex align-items-center justify-content-center">
      <div className="sign-in-box">
        <div className="big-title">Sign in</div>
        <Form action="#">
          <div className="mt-40">
            <Input
              placeholder="Email"
              name="email"
              type="email"
              className="form-control bg-input-box"
              autoFocus={false}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.email || ""}
              invalid={
                validation.touched.email && validation.errors.email ? true : false
              }
            />
            {validation.touched.email && validation.errors.email ? (
              <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
            ) : null}
          </div>
          <div className="mt-24 mb-24">
            <Input
              placeholder="Password"
              name="password"
              type="password"
              className="form-control bg-input-box"
              autoFocus={false}
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.password || ""}
              invalid={
                validation.touched.password && validation.errors.password ? true : false
              }
            />
            {validation.touched.password && validation.errors.password ? (
              <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
            ) : null}
          </div>
          <label className="checkbox w-100 text-center d-flex justify-content-center" htmlFor="remember-me">
            <Input
              className="form-check-input"
              type="checkbox"
              name="color"
              onChange={(e) => setRememberMe(e.target.checked)}
              id="remember-me"
            />
            <span className="checkmark"></span>
            <div className="form-check-label text-center text-white">Remember me</div>
          </label>
          <div>
            <button type="submit" className="green-btn mt-27 w-100" onClick={() => validation.handleSubmit()} disabled={loading}>
              {loading ? (<><Spinner size="sm" className="me-2" />Loading...</>) : "Login"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  )

}