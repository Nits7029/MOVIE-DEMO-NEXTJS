"use client";

import { Montserrat } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.css'
import './globals.css'
// import '../../styles/signin.scss'
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
