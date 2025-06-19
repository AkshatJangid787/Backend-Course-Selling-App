const express = require('express');
const router = express.Router();
const requireAuth = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const {
    createCourse,
    getAllCourses,
    getCoursesById,
    updateCourse,
    deleteCourse,
    purchaseCourse,
    getMyCourses
} = require('../controllers/courseController');


//admin
router.post('/', requireAuth, isAdmin, upload.single('thumbnail'), createCourse);
router.put('/:id', requireAuth, isAdmin,upload.single('thumbnail'), updateCourse);
router.delete('/:id', requireAuth, isAdmin, deleteCourse);

//user
router.post('/purchase/:id', requireAuth, purchaseCourse);
router.get('/my-courses', requireAuth, getMyCourses);

//public
router.get('/', getAllCourses);
router.get('/:id', getCoursesById);


module.exports = router;