const authService = require('./service');
const { registerSchema, loginSchema } = require('./validation');

const register =  async (req,res,next) => {
    try {
        const data  = registerSchema.parse(req.body);
        const result  =  await authService.register(data);
        res.json(result);
        
    } catch (error) {
        next(error);
    }
}

const login = async (req,res,next) => {
    try {
        const data = loginSchema.parse(req.body);
        const result = await authService.login(data);
        res.json(result);
        
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login
};