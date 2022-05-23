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
    const itemsPerPage = 14
    const [pageRangeDisplayed, setPageRangeDisplayed] = useState(window.innerWidth > 768 ? 9 : 5)
    const [favoritePosts, setFavoritePosts] = useState<Post[]>([])
    const [currentView, setCurrentView] = useState("all");
    const [selectedQuery, setSelectedQuery] = useState('');
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState("0");
    const [posts, setPosts] = useState<Post[]>([]);
    const [itemOffset, setItemOffset] = useState(0);

    const API_URL = `https://hn.algolia.com/api/v1/search_by_date?query=${selectedQuery}&page=${currentPage}`;


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
            const favedPosts = [...favoritePosts, post]
            setFavoritePosts(favedPosts.sort((objA:Post, objB:Post) => { return Date.parse(objB.created_at) - Date.parse(objA.created_at) }))
            localStorage.setItem('favoritePosts', JSON.stringify(favedPosts))
        } else {
            const favedPosts = favoritePosts.filter((el) => el.author !== post.author && el.story_title !== post.story_title && el.created_at !== post.created_at )
            setFavoritePosts(favedPosts.sort((objA:Post, objB:Post) => { return Date.parse(objB.created_at) - Date.parse(objA.created_at) }))
            localStorage.setItem('favoritePosts', JSON.stringify(favedPosts))
        }
    }


    function handleResize() {
        setPageRangeDisplayed(window.innerWidth > 768 ? 9 : 5)
    }


    // Initialization
    useEffect(function () {
        // Data fetch
        if (currentView === "all") {
            fetchPosts()
        }
        const savedSelectedQuery = localStorage.getItem('selectedQuery') ?? selectedQuery;
        setSelectedQuery(savedSelectedQuery);
        const savedFavoritePosts = JSON.parse(localStorage.getItem('favoritePosts') ?? "[]");
        const sortedSavedFavoritePosts = savedFavoritePosts.sort((objA:Post, objB:Post) => { return Date.parse(objB.created_at) - Date.parse(objA.created_at) })
        setFavoritePosts(sortedSavedFavoritePosts)

        // Handling window resize 
        window.addEventListener("resize", handleResize);
        handleResize()
        return () => window.removeEventListener("resize", handleResize);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    // Handle state changes in 'all' view 
    useEffect(function () {
        if (selectedQuery !=='' && currentView === "all") {
            fetchPosts()
        }
    }, [selectedQuery, currentPage, currentView]) // eslint-disable-line react-hooks/exhaustive-deps


    // Handle state changes in 'faves' view 
    useEffect(function () {
        if (currentView === "faves") {
            const pages = favoritePosts.length > 0 ? Math.ceil(favoritePosts.length / itemsPerPage) : 1

            if (parseInt(currentPage) > pages - 1) {
                setCurrentPage((pages - 1).toString())
            }
            
            const offset = itemsPerPage * (parseInt(currentPage))
            setItemOffset(offset)

            const endOffset = itemOffset + itemsPerPage;
            const items = favoritePosts.slice(itemOffset, endOffset)

            

            setPageCount(pages)
            setPosts(items)

        }
    }, [itemOffset, currentView, currentPage, favoritePosts])


    return (
        <>
            <SwitchView setCurrentView={setCurrentView} />

            {currentView === "all" &&
                <PostFilter queryList={queryList} selectedQuery={selectedQuery} setSelectedQuery={setSelectedQuery} />
            }

            <PostList posts={posts} setFavoritePosts={setFavoritePosts} favoritePosts={favoritePosts} manageFavorites={manageFavorites} />

            {pageCount > 1 &&
                <Pagination setCurrentPage={setCurrentPage} pageCount={pageCount} pageRangeDisplayed={pageRangeDisplayed} />
            }
        </>
    )
}


export default PostListContainer
