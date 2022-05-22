import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

import './App.css';

type Post = {
    author: string,
    story_title: string,
    story_url: string,
    created_at: string
}

interface PostCardProps {
    post: Post;
    setFavoritePosts: React.Dispatch<React.SetStateAction<Post[]>>;
    isFavorite: boolean;
    manageFavorites: Function;
}

interface SwitchViewProps {
    setCurrentView: React.Dispatch<React.SetStateAction<string>>;
}

interface PostFilterProps {
    setSelectedQuery: React.Dispatch<React.SetStateAction<string>>;
    selectedQuery: string;
    queryList: string[];
}

interface PostListProps {
    posts: Post[];
    favoritePosts: Post[];
    setFavoritePosts: React.Dispatch<React.SetStateAction<Post[]>>;
    manageFavorites: Function;
}

interface PaginationProps {
    pageCount: number
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

function SwitchView(props: SwitchViewProps) {

    function onChangeHandler(e: React.FormEvent<HTMLInputElement>) {
        props.setCurrentView((e.target as HTMLInputElement).value);
    }

    return (
        <>
            <div className="switch-field" onChange={onChangeHandler}>
                <input type="radio" id="radio-all" name="view-switch" value="all" defaultChecked />
                <label htmlFor="radio-one">All</label>
                <input type="radio" id="radio-faves" name="view-switch" value="faves" />
                <label htmlFor="radio-two">Faves</label>
            </div>
        </>
    )
}

function PostCard(props: PostCardProps) {

    function onClickHandler() {
        const action = props.isFavorite ? "unfavorite" : "favorite"
        props.manageFavorites(action, props.post)
    }

    return (
        <div className='post'>
            <p>Author: {props.post.author}</p>
            <p>Title: {props.post.story_title}</p>
            <p>Url: {props.post.story_url}</p>
            <p>Created at: {props.post.created_at}</p>
            <button onClick={onClickHandler}>{props.isFavorite ? "unfavorite" : "favorite"}</button>

            <hr />
        </div>
    );
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

function PostList(props: PostListProps) {

    return (
        <>
            {props.posts?.length > 0
                ? (
                    <div className='container'>
                        {props.posts.map((post, index) => (
                            <PostCard
                                post={post}
                                key={index}
                                setFavoritePosts={props.setFavoritePosts}
                                isFavorite={props.favoritePosts.find(el => el.author === post.author && el.story_title === post.story_title) ? true : false}
                                manageFavorites={props.manageFavorites}
                            />
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

    const queryList = ['angular', 'reactjs', 'vuejs']
    const [favoritePosts, setFavoritePosts] = useState<Post[]>([])
    const [currentView, setCurrentView] = useState("all");
    const [selectedQuery, setSelectedQuery] = useState("");
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState('0');
    const [posts, setPosts] = useState<Post[]>([]);

    const API_URL = `https://hn.algolia.com/api/v1/search_by_date?query=${selectedQuery}&page=${currentPage}`;

    useEffect(function () {
        const savedSelectedQuery = localStorage.getItem('selectedQuery') ?? "";
        setSelectedQuery(savedSelectedQuery);
        const savedFavoritePosts = JSON.parse(localStorage.getItem('favoritePosts') || "[]");
        setFavoritePosts(savedFavoritePosts)
    }, [])

    async function fetchPosts() {
        const response = await fetch(`${API_URL}`);
        const data = await response.json();
        const tempPosts = data.hits.filter(function (obj: any) {
            return (obj.author != null && obj.story_title != null && obj.story_url != null && obj.created_at != null)
        })

        setPageCount(data.nbPages)
        setPosts(tempPosts)
    }

    function manageFavorites(action: string, post: Post) {
        if (action === "favorite") {
            setFavoritePosts([...favoritePosts, post])
        } else {
            setFavoritePosts(favoritePosts.filter((el) => el.author !== post.author && el.story_title !== post.story_title))
        }
        localStorage.setItem('favoritePosts', JSON.stringify(favoritePosts))
    }

    useEffect(function () {
        if (selectedQuery && currentView === "all") {
            fetchPosts()
        } else if (currentView === "faves") {
            setPosts(favoritePosts)
        }
    }, [selectedQuery, currentPage, currentView, favoritePosts])

    return (
        <>
            <SwitchView setCurrentView={setCurrentView} />
            <PostFilter queryList={queryList} selectedQuery={selectedQuery} setSelectedQuery={setSelectedQuery} />
            <PostList posts={posts} setFavoritePosts={setFavoritePosts} favoritePosts={favoritePosts} manageFavorites={manageFavorites} />
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
