const Course = require('../models/Course');
const fs = require('fs');
const path = require('path');
const { courseSchema } = require('../validators/courseValidation');


//admin: create a course
exports.createCourse = async (req, res) => {
  try {
    // Validate using Zod
    const validatedData = courseSchema.parse({
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price)
    });

    const thumbnailPath = req.file?.path || '';

    const course = await Course.create({
      ...validatedData,
      thumbnail: thumbnailPath,
      createdBy: req.user.id
    });

    res.status(201).json({ msg: 'Course created successfully', course });

  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ msg: 'Validation failed', errors: err.errors });
    }
    res.status(500).json({ msg: 'Failed to create course', error: err.message });
  }
};


//admin: update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found' });

    // Validate (allow partial updates)
    const partialSchema = courseSchema.partial();
    const validatedData = partialSchema.parse({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price ? Number(req.body.price) : undefined
    });

    // Delete old thumbnail if new one is uploaded
    if (req.file && course.thumbnail) {
      const oldPath = path.join(__dirname, '..', course.thumbnail);
      fs.unlink(oldPath, (err) => {
        if (err) console.log('Failed to delete old thumbnail:', err.message);
      });

      course.thumbnail = req.file.path;
    }

    // Update fields
    Object.assign(course, validatedData);
    await course.save();

    res.status(200).json({ msg: 'Course updated successfully', course });

  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ msg: 'Validation failed', errors: err.errors });
    }
    res.status(500).json({ msg: 'Error updating course', error: err.message });
  }
};



//admin: delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ msg: 'Course not found to delete' });

    // Delete thumbnail from uploads folder
    if (course.thumbnail) {
      const thumbnailPath = path.join(__dirname, '..', course.thumbnail);
      fs.unlink(thumbnailPath, (err) => {
        if (err) {
          console.log('Failed to delete thumbnail:', err.message);
        }
      });
    }

    res.status(200).json({ msg: 'Course and its thumbnail deleted successfully' });

  } catch (err) {
    res.status(500).json({ msg: 'Failed to delete course', error: err.message });
  }
};

//public: get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}, 'title description price thumbnail').lean();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching courses', error: err.message });
  }
};

//public: get course by Id
exports.getCoursesById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id, 'title description price thumbnail').lean();

    if (!course) return res.status(404).json({ msg: 'Course not found' });

    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching course', error: err.message });
  }
};


//user: purchase course
exports.purchaseCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    // 1. Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // 2. Ensure studentsEnrolled is always an array
    if (!Array.isArray(course.studentsEnrolled)) {
      course.studentsEnrolled = [];
    }

    // 3. Check if user already enrolled
    if (course.studentsEnrolled.includes(userId)) {
      return res.status(400).json({ msg: 'You already purchased this course' });
    }

    // 4. Add user to studentsEnrolled
    course.studentsEnrolled.push(userId);
    await course.save();

    res.status(200).json({ msg: 'Course purchased successfully', course });

  } catch (err) {
    res.status(500).json({ msg: 'Failed to purchase course', error: err.message });
  }
};

//user: my-courses
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ studentsEnrolled: req.user.id });
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching your courses', error: err.message });
  }
};