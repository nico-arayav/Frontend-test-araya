import React from 'react';

import ReactPaginate from 'react-paginate';

import './Pagination.css'


interface PaginationProps {
    pageCount: number
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}


function Pagination(props: PaginationProps) {

    function handlePageChange(selectedObject: any) {
        props.setCurrentPage(selectedObject.selected);
    };

    return (
        <div className='col-12'>
            <ReactPaginate
                pageCount={props.pageCount}
                pageRangeDisplayed={9}
                marginPagesDisplayed={0}
                onPageChange={handlePageChange}
                containerClassName={'pagination-container'}
                previousLinkClassName={'page'}
                breakClassName={'page'}
                nextLinkClassName={'page'}
                pageClassName={'page'}
                disabledClassName={'disabled'}
                activeClassName={'active'}
                previousLabel={'<'}
                nextLabel={'>'}
            />
        </div>
    )
}

export default Pagination
