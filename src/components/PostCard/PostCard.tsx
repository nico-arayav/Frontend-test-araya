import React from 'react';

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

import favorited from "../../assets/iconmonstr-favorite-1.png"
import unfavorited from "../../assets/iconmonstr-favorite-2.png"

import './PostCard.css';

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

    function onFavoriteClickHandler(e: React.FormEvent<HTMLImageElement>) {
        e.stopPropagation()
        const action = props.isFavorite ? "unfavorite" : "favorite"
        props.manageFavorites(action, props.post)
    }

    function onCardClickHandler() {
        window.open(props.post.story_url, "_blank")
    }

    return (
        <div className='card-container col-6'>
            <div className='post-card' onClick={onCardClickHandler} >
                <div className='desc center'>
                    <p className='time-author'>{timeAgo.format(Date.parse(props.post.created_at))} by {props.post.author}</p>
                    <p className='title'>{props.post.story_title}</p>
                </div>
                <div className='favorite center'>
                    <img src={props.isFavorite ? favorited : unfavorited} alt="favorite" onClick={onFavoriteClickHandler} />
                </div>
            </div>
        </div>
    );
}


export default PostCard
