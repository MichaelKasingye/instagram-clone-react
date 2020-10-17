import React,{useState, useEffect} from 'react'
import './Style/post.css';
import Avatar from "@material-ui/core/Avatar";
import { db } from '../Firebase/firebase';
import firebase from 'firebase';

function Post({postId, user, username, caption, imageUrl }) {
const [comments, setComments] = useState([]);
const [comment, setComment] = useState('');
useEffect(() => {
    let unsubscribe;
    if (postId) {
        unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp','desc')
        // snapshot lisener for comments
        .onSnapshot((snapshot) => {
            setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
        unsubscribe();
    };
    }, [postId]);// variable dependance

    function postComment(event) {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text:comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className="post">

            <div className="post_header">
            <Avatar className="post_avatar" alt={username} src="/static/images/avatar/1.jpg"/>
            <h3>{username}</h3>
            </div>

            <img src={imageUrl} alt=""
            className="post_image"
            />
            <h4 className="post_text"> <strong>{username}:</strong> {caption}</h4>

            
                <div className="post_comments">
                    {
                        comments.map((comment) =>(
                            <p>
                                <strong>{comment.username}: </strong>{comment.text}
                            </p>
                        ))
                    }
                </div>
            {
            user && (
             <form className="post_commentBox">
                <input type="text" className="post_input" placeholder="Add a comment" value={comment} onChange={(e) => setComment(e.target.value)}/>

                <button disabled={!comment}  className="post_button" type="submit" onClick={postComment}>Post</button>
            </form>
            )
            }

        </div>
    )
}

export default Post;
