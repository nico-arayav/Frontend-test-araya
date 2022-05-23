import React from 'react';

import './PostFilter.css'

interface PostFilterProps {
    setSelectedQuery: React.Dispatch<React.SetStateAction<string>>;
    selectedQuery: string;
    queryList: string[];
}

function PostFilter(props: PostFilterProps) {

    function onChangeHandler(e: React.ChangeEvent<HTMLSelectElement>) {
        localStorage.setItem('selectedQuery', e.currentTarget.value)
        props.setSelectedQuery(e.currentTarget.value)
    }

    return (
        <div className='filter-container'>
            <select className='filter-select' name="filter" id="news-select" onChange={onChangeHandler} value={props.selectedQuery}>
                {props.queryList.map((query, index) => (
                    // Note: CSS capitalization didn't work for options, JS had to be applied
                    <option value={query} key={index}>{query.charAt(0).toUpperCase() + query.slice(1)}</option>
                ))}
            </select>
        </div>
    );
}


export default PostFilter
