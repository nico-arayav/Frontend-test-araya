import React from 'react';

import PostCard from '../../components/PostCard/PostCard';

import './PostList.css'

type Post = {
    author: string,
    story_title: string,
    story_url: string,
    created_at: string
}

interface PostListProps {
    posts: Post[];
    favoritePosts: Post[];
    setFavoritePosts: React.Dispatch<React.SetStateAction<Post[]>>;
    manageFavorites: Function;
}

function PostList(props: PostListProps) {
    return (
        <>
            {props.posts?.length > 0
                ? (
                    <div className='list-container'>
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
                    null
                )
            }
        </>
    )
}


export default PostList
