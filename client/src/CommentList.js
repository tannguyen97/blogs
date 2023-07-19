import React from "react";

const CommentList = ({ comments }) => {

  const renderedComments = Array.isArray(comments) ? comments.map((comment) => {
    return <li key={comment.id}>{comment.content}</li>;
  }) : null;

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
