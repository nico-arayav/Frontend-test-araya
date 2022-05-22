import { useState, useEffect } from 'react';

import SwitchView from '../../components/SwitchView/SwitchView';
import PostFilter from '../../components/PostFilter/PostFilter';
import PostList from '../../components/PostList/PostList';
import Pagination from '../../components/Pagination/Pagination';



type Post = {
    author: string,
    story_title: string,
    story_url: string,
    created_at: string
}


function PostListContainer() {

    const queryList = ['angular', 'reactjs', 'vuejs']
    const itemsPerPage = 10
    const [favoritePosts, setFavoritePosts] = useState<Post[]>([])
    const [currentView, setCurrentView] = useState("all");
    const [selectedQuery, setSelectedQuery] = useState("");
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState("0");
    const [posts, setPosts] = useState<Post[]>([]);
    const [itemOffset, setItemOffset] = useState(0);

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
            const offset = itemsPerPage * (parseInt(currentPage))
            setItemOffset(offset)
        }
    }, [selectedQuery, currentPage, currentView, favoritePosts]) // eslint-disable-line react-hooks/exhaustive-deps


    useEffect(function () {
        const pages = favoritePosts.length > 0 ? Math.ceil(favoritePosts.length / itemsPerPage) : 1
        const endOffset = itemOffset + itemsPerPage;
        const items = favoritePosts.slice(itemOffset, endOffset)

        setPageCount(pages)
        setPosts(items)
    }, [itemOffset, currentView, favoritePosts])


    return (
        <>
            <SwitchView setCurrentView={setCurrentView} />
            {currentView === "all" &&
                <PostFilter queryList={queryList} selectedQuery={selectedQuery} setSelectedQuery={setSelectedQuery} />
            }
            <PostList posts={posts} setFavoritePosts={setFavoritePosts} favoritePosts={favoritePosts} manageFavorites={manageFavorites} />
            <Pagination setCurrentPage={setCurrentPage} pageCount={pageCount} />
        </>
    )
}


export default PostListContainer
