// routes/auth.js
const express = require('express');
const router = express.Router();
const AuthorizationController = require('../controllers/AuthorizationController');

// Public routes
router.post('/api/v1/register', (req, res) => AuthorizationController.register(req, res));
router.post('/api/v1/login', (req, res) => AuthorizationController.login(req, res));

// Public routes
router.post('/loginInfo', (req, res) => AuthorizationController.loginInfo(req, res));

// Protected route (any logged-in user)
router.get(
    '/api/v1/profile',
    (req, res, next) => AuthorizationController.verifyToken(req, res, next),
    (req, res) => AuthorizationController.profile(req, res)
);

// Protected route (only admin)
router.get(
    '/api/v1/admin-dashboard',
    (req, res, next) => AuthorizationController.verifyToken(req, res, next),
    AuthorizationController.authorizeRoles("admin"),   // RBAC check
    (req, res) => {
        res.send({ status: true, message: "Welcome Admin Dashboard" });
    }
);

// Protected route (admin or manager only)
router.get(
    '/api/v1/reports',
    (req, res, next) => AuthorizationController.verifyToken(req, res, next),
    AuthorizationController.authorizeRoles("admin", "manager"),  // RBAC check
    (req, res) => {
        res.send({ status: true, message: "Reports accessible by admin & manager" });
    }
);

module.exports = router;
