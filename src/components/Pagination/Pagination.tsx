import React from 'react';

import ReactPaginate from 'react-paginate';


interface PaginationProps {
    pageCount: number
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}


function Pagination(props: PaginationProps) {

    function handlePageChange(selectedObject: any) {
        props.setCurrentPage(selectedObject.selected);
    };

    return (
        <>
            <ReactPaginate
                pageCount={props.pageCount}
                pageRangeDisplayed={9}
                marginPagesDisplayed={0}
                onPageChange={handlePageChange}
                containerClassName={'pagination'}
                previousLinkClassName={'page'}
                breakClassName={'page'}
                nextLinkClassName={'page'}
                pageClassName={'page'}
                disabledClassName={'disabled'}
                activeClassName={'active'}
            />
        </>
    )
}

export default Pagination
