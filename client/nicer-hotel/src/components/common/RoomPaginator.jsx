import React from 'react'

const RoomPaginator = ({currentPage, totalPages, onPageChange}) => {
    const pageNumbers = Array.from({length : totalPages}, (_, i) => i+1)
  return (
    <nav>
        <ul className='pagination, justify-content-center'>
            {pageNumbers.map((pagenNumber) => (
                <li key={pageNumber}
                className={`page-item ${currentPage === pagenNumber ? "active" : ""}`}>
                    <button className='page-link' onClick={()=>onPageChange(pagenNumber)}>
                        {pagenNumber}
                    </button>
                </li>
            ))}
        </ul>
    </nav>
  )
}

export default RoomPaginator