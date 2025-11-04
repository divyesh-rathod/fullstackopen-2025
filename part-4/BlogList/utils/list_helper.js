const dummy = () =>  {
    return 1;
};

const totalLikes = (blogs) => {
    let ans = 0;
    if (blogs.length === 0) return ans;
    for (let i = 0; i < blogs.length; i++){
        ans += blogs[i].likes;
    }
    return ans;
}

const favoriteBlog = (blogs) => {
    let ans = {}
    let dummy = 0;
    if (blogs.length === 0) return null;
    for (let i = 0; i < blogs.length; i++){
        if (blogs[i].likes > dummy) {
            dummy = blogs[i].likes;
            ans = { ...blogs[i] };
        }
    }
    return ans;
    

};

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null;
    const countMap = new Map();
    for (const blog of blogs) {
        countMap.set(blog.author, (countMap.get(blog.author) || 0) + 1);
    }
    let topAuther = null;
    let max = 0;

    for (const [auther, count] of countMap) {
        if (count > max) {
            max = count;
            topAuther = auther;
        }
    }
    return {author:topAuther,blogs:max}
    
}


const mostLikes = (blogs) => {
    if (blogs.length === 0) return null;
    let ans = {
        author: null,
        likes: 0,
    }
    for (let i = 0; i < blogs.length; i++){
        if (blogs[i].likes > ans.likes) {
            ans.author = blogs[i].author;
            ans.likes = blogs[i].likes;    
        }
    }
    return ans;
    
}

module.exports = {
  dummy,totalLikes,favoriteBlog,mostBlogs,mostLikes
};
