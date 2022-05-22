import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

import './App.css';


interface PostCardProps {
    post: {
        author: string,
        story_title: string,
        story_url: string,
        created_at: string
    };
}

interface PostFilterProps {
    setQuery: React.Dispatch<React.SetStateAction<string>>;
}

interface PostListProps {
    posts: any[];
}

interface PaginationProps {
    pageCount: number
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

function PostCard(props: PostCardProps) {
    return (
        <div className='post'>
            <p>Author: {props.post.author}</p>
            <p>Title: {props.post.story_title}</p>
            <p>Url: {props.post.story_url}</p>
            <p>Created at: {props.post.created_at}</p>

            <hr />
        </div>
    );
}

function PostFilter(props: PostFilterProps) {

    function onChangeHandler(e: React.ChangeEvent<HTMLSelectElement>) {
        props.setQuery(e.currentTarget.value)
    }

    return (
        <>
            <select name="filter" id="news-select" onChange={onChangeHandler}>
                <option value="angular">Angular</option>
                <option value="react">Reactjs</option>
                <option value="vuejs">Vuejs</option>
            </select>
        </>
    );
}

function PostList(props: PostListProps) {
    return (
        <>
            {props.posts?.length > 0
                ? (
                    <div className='container'>
                        {props.posts.map((post, index) => (
                            <PostCard post={post} key={index} />
                        ))}
                    </div>
                ) : (
                    <h2>No posts found</h2>
                )
            }
        </>
    )
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

function PostListContainer() {

    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState('0');
    const [query, setQuery] = useState('angular');
    const [posts, setPosts] = useState([]);

    const API_URL = `https://hn.algolia.com/api/v1/search_by_date?query=${query}&page=${currentPage}`;

    async function fetchPosts() {
        const response = await fetch(`${API_URL}`);
        const data = await response.json();
        const tempPosts = data.hits.filter(function (obj: any) {
            return (obj.author != null && obj.story_title != null && obj.story_url != null && obj.created_at != null)
        })

        setPageCount(data.nbPages)
        setPosts(tempPosts)
    }

    useEffect(function () {
        fetchPosts()
    }, [query, currentPage]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <PostFilter setQuery={setQuery} />
            <PostList posts={posts} />
            <Pagination setCurrentPage={setCurrentPage} pageCount={pageCount} />
        </>
    )
}

function App() {
    return (
        <>
            <header>
                <h1>HACKER NEWS</h1>
            </header>
            <div className="App">
                <PostListContainer />
            </div>
        </>
    );
}

export default App;
