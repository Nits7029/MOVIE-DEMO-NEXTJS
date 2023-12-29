"use client";

import React, { useLayoutEffect } from 'react'
import { useRouter, redirect } from 'next/navigation';
import { Montserrat } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.css'
import '@/styles/globals.css'
import { ApolloProvider } from '@apollo/client'
import { Toaster } from 'react-hot-toast';
import client from '@/apollo/client/client'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})


export default function RootLayout({ children }) {
  const router = useRouter();
  const publicUrl = ["/signin"];


  useLayoutEffect(() => {
    setTimeout(() => {
      const token = typeof window !== "undefined" && localStorage.getItem("token");
      const isPublic = publicUrl.includes(typeof window !== "undefined" && window.location.pathname);
      if (isPublic && token) {
        router.push("/movies");
      } else if (!isPublic && !token) {
        router.push("/signin");
      }
    }, 100);
  }, [router]);

  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ApolloProvider client={client}>
          {children}
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              className: '',
              duration: 5000,
              style: {
                background: '#363636',
                color: '#fff',
              },

              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
            }}
          />
        </ApolloProvider>
      </body>
    </html>
  )
}
