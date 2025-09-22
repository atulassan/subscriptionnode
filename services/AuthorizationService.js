// services/AuthorizationService.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthorizationService {
    async register(userData) {
        try {
            const { email, name, password, phone } = userData;

            let chk = await db.runQuery(`SELECT * FROM users WHERE email = ?`, [email]);
            if (!chk.status) return { status: false, code: 500, message: "Error on the server." };

            if (chk.result.length > 0) {
                return { status: false, code: 400, message: "User already exists" };
            }

            let hashedPassword = bcrypt.hashSync(password, 8);
            let reqData = {  name, email, password: hashedPassword, phone };

            let insertData = await db.runQuery("INSERT INTO users SET ?", reqData);

            return { status: true, code: 201, message: "User Registered Successfully", data: insertData };
        } catch (error) {
            console.error(error);
            return { status: false, code: 500, message: "Server Error" };
        }
    }

    async login(credentials) {
        try {
            const { email, password } = credentials;

            let chk = await db.runQuery(`SELECT * FROM users WHERE email = ?`, [email]);

            if (!chk.status) return { status: false, code: 500, message: "Error on the server." };
            if (!chk.result.length) return { status: false, code: 404, message: "User not found" };

            let userData = chk.result[0];
            let passwordIsValid = bcrypt.compareSync(password, userData.password);

            if (!passwordIsValid) {
                return { status: false, code: 401, message: "Invalid email or password" };
            }

            let user = { id: userData.id, name: userData.name, email: userData.email, role: userData.role };
            
            console.log(user, process.env.JWT_SECRET)
            let token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: 86400 }); // 24 hrs

            return { status: true, code: 200, message: "Login Successful", token: token, data: { ...user } };
        } catch (error) {
            console.error(error);
            return { status: false, code: 500, message: "Server Error" };
        }
    }

    async getProfile(userId) {
        try {
            let chk = await db.runQuery(`SELECT * FROM users WHERE id = ?`, [userId]);

            if (!chk.status) return { status: false, code: 500, message: "Error on the server." };
            if (!chk.result.length) return { status: false, code: 404, message: "User not found" };

            return { status: true, code: 200, message: "Profile fetched successfully", data: chk.result[0] };
        } catch (error) {
            console.error(error);
            return { status: false, code: 500, message: "Server Error" };
        }
    }

    verifyToken(token) {
        return new Promise((resolve, reject) => {
            if (!token) return reject({ code: 403, message: "No token provided" });

            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) return reject({ code: 500, message: "Failed to authenticate token" });

                resolve(decoded);
            });
        });
    }

    async loginInfo(credentials) {
        //return {status: true, code:200, message: 'login succesfully', data: credentials}   
        const {name, password} = credentials;
        if(name == 'Athavullah' && password == 'Athavullah') {
            return {status: true, code:200, message: 'login succesfully', data: credentials}    
        } else {
            return {status: false, code:200, message: 'Login/Password are incorrect'}  
        }
    }
}

module.exports = new AuthorizationService();
