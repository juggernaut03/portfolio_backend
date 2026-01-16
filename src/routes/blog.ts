import { Router } from 'express';
import Blog from '../models/Blog';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// GET /api/blogs - Public: Get all published blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/blogs/admin - Protected: Get all blogs (including unpublished)
router.get('/admin', authenticateAdmin, async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/blogs/:slug - Public: Get single blog by slug
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await Blog.findOne({ slug, published: true });

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.json(blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/blogs - Protected: Create new blog
router.post('/', authenticateAdmin, async (req, res) => {
    try {
        const { title, excerpt, content, coverImage, tags, published } = req.body;

        if (!title || !excerpt || !content) {
            return res.status(400).json({ error: 'Title, excerpt, and content are required' });
        }

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Check if slug already exists
        const existingBlog = await Blog.findOne({ slug });
        if (existingBlog) {
            return res.status(400).json({ error: 'A blog with a similar title already exists' });
        }

        const newBlog = new Blog({
            title,
            slug,
            excerpt,
            content,
            coverImage,
            tags: tags || [],
            published: published || false
        });

        await newBlog.save();
        res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /api/blogs/:id - Protected: Update blog
router.put('/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, excerpt, content, coverImage, tags, published } = req.body;

        const updateData: any = {};
        if (title !== undefined) {
            updateData.title = title;
            // Update slug if title changes
            updateData.slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
        if (excerpt !== undefined) updateData.excerpt = excerpt;
        if (content !== undefined) updateData.content = content;
        if (coverImage !== undefined) updateData.coverImage = coverImage;
        if (tags !== undefined) updateData.tags = tags;
        if (published !== undefined) updateData.published = published;

        const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.json(updatedBlog);
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /api/blogs/:id - Protected: Delete blog
router.delete('/:id', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PATCH /api/blogs/:id/publish - Protected: Toggle publish status
router.patch('/:id/publish', authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { published } = req.body;

        if (typeof published !== 'boolean') {
            return res.status(400).json({ error: 'Published status must be a boolean' });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, { published }, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.json(updatedBlog);
    } catch (error) {
        console.error('Error updating publish status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
