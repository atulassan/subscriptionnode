// controllers/AuthorizationController.js
const AuthorizationService = require('../services/AuthorizationService');

class AuthorizationController { 
    async register(req, res) {
        let result = await AuthorizationService.register(req.body);
        return res.status(result.code).send(result);
    }

    async login(req, res) {
        let result = await AuthorizationService.login(req.body);
        return res.status(result.code).send(result);
    }

    async profile(req, res) {
        let result = await AuthorizationService.getProfile(req.userId);
        return res.status(result.code).send(result);
    }

    async verifyToken(req, res, next) {
        let token = req.headers['authorization'];
        try {
            let decoded = await AuthorizationService.verifyToken(token);
            req.userId = decoded.id;
            req.userRole = decoded.role;  // store role for later checks
            next();
        } catch (err) {
            return res.status(err.code).send({ status: false, message: err.message });
        }
    }

    //  New RBAC middleware
    authorizeRoles(...roles) {
        return (req, res, next) => {
            if (!roles.includes(req.userRole)) {
                return res.status(403).send({ status: false, message: "Access denied: insufficient permissions" });
            }
            next();
        };
    }
    async loginInfo(req, res){
        let result = await AuthorizationService.loginInfo(req.body);
        return res.status(result.code).send(result);
    }
}

module.exports = new AuthorizationController();
