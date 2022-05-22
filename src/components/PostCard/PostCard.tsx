import React from 'react';

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'


TimeAgo.addDefaultLocale(en)

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


function PostCard(props: PostCardProps) {

    const timeAgo = new TimeAgo('en-US')

    function onClickHandler() {
        const action = props.isFavorite ? "unfavorite" : "favorite"
        props.manageFavorites(action, props.post)
    }

    return (
        <div className='post'>
            <p>Author: {props.post.author}</p>
            <p>Title: {props.post.story_title}</p>
            <p>Url: {props.post.story_url}</p>
            <p>Created at: {timeAgo.format(Date.parse(props.post.created_at))}</p>
            <button onClick={onClickHandler}>{props.isFavorite ? "unfavorite" : "favorite"}</button>

            <hr />
        </div>
    );
}


export default PostCard
