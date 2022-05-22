import { useState, useEffect } from 'react';

import './App.css';

interface PostCardProps {
    post: {
        author: string,
        story_title: string,
        story_url: string,
        created_at: string
    };
}

interface PostListProps {
    posts: any[];
}

const PostCard = (props: PostCardProps) => {
    return (
        <div className='post'>
            <p>Author: {props.post.author}</p>
            <p>Title: {props.post.story_title}</p>
            <p>Url: {props.post.story_url}</p>
            <p>Created at: {props.post.created_at}</p>
            
            <hr />
        </div>
    )
}

function PostList(props: PostListProps) {
    return (
        <>
            {props.posts?.length > 0 
            ?   (
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

function PostListContainer() {

    const currentPage = 0;
    const query = 'angular';
    const [posts, setPosts] = useState([]);

    const API_URL = `https://hn.algolia.com/api/v1/search_by_date?query=${query}&page=${currentPage}`;

    async function fetchPosts() {
        const response = await fetch(`${API_URL}`);
        const data = await response.json();
        const tempPosts = data.hits.filter(function(obj: any) {
            return (obj.author != null && obj.story_title != null && obj.story_url != null && obj.created_at != null)
        })

        setPosts(tempPosts)
    }

    useEffect(function() {
        fetchPosts()
    }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <PostList posts={posts} />
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
