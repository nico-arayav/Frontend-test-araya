import React from 'react';


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
        <>
            <select name="filter" id="news-select" onChange={onChangeHandler} value={props.selectedQuery}>
                {props.queryList.map((query, index) => (
                    <option value={query} key={index}>{query}</option>
                ))}
            </select>
        </>
    );
}


export default PostFilter
