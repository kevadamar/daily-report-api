const router = require('express').Router();

const { absensiController } = require('../controller/absensiController');
const { authController } = require('../controller/authController');
const { reportController } = require('../controller/reportController');
const { roleController } = require('../controller/roleController');
const { userController } = require('../controller/userController');
const {
  authMiddleware,
  specialAccessMiddleware,
} = require('../middleware/authMiddleware');
const { multerMiddleware } = require('../middleware/multerMiddleware');

// AUTH
router.post('/login', authController.login);
router.post('/register', authController.register);

// USER
router.get('/user/profile', authMiddleware, userController.get);
router.patch(
  '/user/update',
  authMiddleware,
  multerMiddleware.single('image'),
  userController.update,
);

// ABSENSI
router.get('/absensi', authMiddleware, absensiController.absenFilter);
router.post('/absensi/:type', authMiddleware, absensiController.absen);

// REPORT
router.get('/report', authMiddleware, reportController.reportFilter);
router.get('/report/:id', authMiddleware, reportController.get);
router.post('/report/:type', authMiddleware, reportController.report);

// ROLE
router.get('/roles', authMiddleware, roleController.getAll);

module.exports = router;
