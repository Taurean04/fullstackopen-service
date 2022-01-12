const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
const dummy = blogs => {
	return 1;
};

const totalLikes = blogs => {
	let total = 0;
	blogs.map(blog => total += blog.likes);
	return total;
};

const favoriteBlog = blogs => {
	let maxObj = blogs.reduce((max, obj) => (max.likes > obj.likes) ? max : obj);
	delete maxObj._id;
	delete maxObj.url;
	delete maxObj.__v;
	return maxObj;
};

const mostBlogs = blogs => {
	let most = _.countBy(blogs, 'author');
	let max = Object.keys(most).reduce((a, b) => (most[a] > most[b]) ? a : b);
	return { author: max, blogs: most[max] };
};

const mostLikes = blogs => {
	let favorite_blog = favoriteBlog(blogs);
	const { author, likes } = favorite_blog;
	return { author, likes };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };