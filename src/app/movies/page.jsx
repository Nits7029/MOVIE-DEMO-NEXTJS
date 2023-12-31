'use client'

import React, { useEffect, useState } from 'react';
import { Spinner } from 'reactstrap'
import { useQuery } from '@apollo/client';
import { GET_MOVIES } from '@/apollo/client/graphql/query/movie.query';
import ReactPaginate from 'react-paginate'
import Link from 'next/link'
import toast from 'react-hot-toast'


export default function MovieList() {

  const [movieData, setMovieData] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [limit, setLimit] = useState(8)
  const [page, setPage] = useState(1)

  const { data, loading, refetch } = useQuery(GET_MOVIES, {
    variables: {
      page: page,
      limit: limit
    },
    fetchPolicy: "cache-and-network"
  })

  useEffect(() => {
    if (data?.getMovies) {
      setMovieData(data?.getMovies?.data)
      setTotalCount(data?.getMovies?.count)
    }
  }, [data])

  const handlePageClick = (event) => {
    setPage(event.selected + 1)
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    toast.success('User Logout successfully')
    window.location.href = "/signin"
  }


  return (
    <>
      {
        loading ?
          <div className="movies-page background-screen" style={{ padding: '0px', margin: '0px', border: 'none', minHeight: '100%' }} >
            <div style={{ padding: '0px', margin: '0px', border: 'none' }}>
              <Spinner style={{ position: "absolute", top: "50%", left: "50%", color: "#fff" }}></Spinner>
            </div>
          </div> :
          <>
            {totalCount > 0 ?
              <div className="movie-list bg-screen position-relative">
                <div className="sign-in-box container movie-list-box">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <p className="big-title fs-48 text-start">My movies</p>
                      <div className="add-circle-icon">
                        <Link href="/movies/create" className="text-decoration-none">
                          <img src="assets/images/add_circle_outline_black_.svg" alt="err" className="" />
                        </Link>
                      </div>
                    </div>
                    <div className="d-flex align-items-center cursor-pointer" onClick={handleLogout}>
                      <p className="text-white fw-700 ">Logout</p>
                      <div className="add-circle-icon">
                        <img src="assets/images/logout_black.svg" alt="err" />
                      </div>
                    </div>
                  </div>
                  <div className="movie-list-col row gy-4 pb-5">
                    {movieData?.length ? movieData?.map(movie => (
                      <div className="col-lg-3 col-md-6 col-12" key={movie?._id}>
                        <Link href={`/movies/update/${movie?._id}`} className="text-decoration-none">
                          <div className="drop-img-col text-white">
                            <div className="drop-img-wrap">
                              <img src={movie?.poster ? `uploads/${movie?.poster}` : "assets/images/movie-list-img.png"} alt="err"
                                className="w-100 img-fluid object-fit-cover" />
                            </div>
                            <div className="drop-img-content">
                              <p className="fs-5 fw-medium">{movie?.title}</p>
                              <p className="fw-light fs-14 mt-2">{movie?.year}</p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))


                      : <></>
                    }

                    <ReactPaginate
                      breakLabel="..."
                      nextLabel="Next"
                      marginPagesDisplayed={1}
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={3}
                      pageCount={Math.ceil(totalCount / limit)}
                      forcePage={page - 1}
                      previousLabel="Prev"
                      renderOnZeroPageCount={null}
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      previousClassName="page-prev-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-next-item"
                      nextLinkClassName="page-link"
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                      containerClassName="pagination"
                      activeClassName="active"
                    />
                  </div>
                </div>
              </div>
              :
              <div className="movies-page background-screen position-relative d-flex align-items-center justify-content-center">
                <div className="sign-in-box">
                  <div className="big-title fs-48">Your movie list is empty</div>
                  <Link href="/movies/create" className="text-decoration-none">
                    <div className="green-btn mt-40">
                      Add a new movie
                  </div>
                  </Link>
                </div>
              </div>}
          </>
      }

    </>
  )

}