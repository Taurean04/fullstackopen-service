const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const helper = require('./test_helper');

beforeEach(async () => {
	await Blog.deleteMany({});
	for(let blog of helper.initialBlogs){
		let blogObject = new Blog(blog);
		await blogObject.save();
	}
}, 300000);

describe('when blogs are being returned', () => {
	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	}, 100000);

	test('id property is defined', async () => {
		const blogs = await helper.blogsInDb();
		expect(blogs[0].id).toBeDefined();
	}, 100000);
});

describe('addition of a blog', () => {
	test('a valid blog can be added', async() => {
		const newBlog = {
			title: 'Christine',
			author: 'Stephen King',
			url: 'https://en.wikipedia.org/wiki/Christine_(novel)',
			likes: 15
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		const titles = await blogsAtEnd.map(b => b.title);
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
		expect(titles).toContain('Christine');
	});

	test('blog without likes property defaults to 0', async () => {
		const newBlog = {
			title: 'Super Heroes',
			author: 'Stephen King',
			url: 'https://en.wikipedia.org/wiki/Super_Heroes'
		};

		const stored = await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		expect(stored.body.likes).toBe(0);
	});

	test('blog without title is not added', async () => {
		const newBlog = {
			author: 'Stephen King',
			url: 'https://en.wikipedia.org/wiki/Christine_(novel)',
			likes: 15
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});

	test('blog without url is not added', async () => {
		const newBlog = {
			title: 'Super Heroes',
			author: 'Stephen King',
			likes: 15
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});
});

describe('deletion of a blog', () => {
	test('succeeds with status code 204 if id is valid', async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToDelete = blogsAtStart[0];

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(204);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(
			helper.initialBlogs.length - 1
		);

		const titles = blogsAtEnd.map(b => b.title);

		expect(titles).not.toContain(blogToDelete.title);
	}, 100000);
});

describe('updating a blog', () => {
	test('succeeds with status code 200 if id is valid', async() => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToUpdate = blogsAtStart[0];
		const blogUpdate = { likes: 15 };

		const updateBlog = await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(blogUpdate)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(updateBlog.body.likes).toBe(blogUpdate.likes);
	});
});

afterAll(() => {
	mongoose.connection.close();
});