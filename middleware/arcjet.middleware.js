import aj from "../config/arcjet.js";

const arcjetMiddleware = async(req, res, next) => {
    try{
        const decision = await aj.protect(req, {requested: 1});

        if(decision.isDenied()) {
            if(decision.reason.isRateLimit()) return res.status(429).json({success: false, message: 'Too many requests', error: 'Rate limit exceeded'});
            if(decision.reason.isBot()) return res.status(403).json({success: false, message: 'Forbidden', error: 'Bot detected'});

            return res.status(403).json({
                success: false,
                message: 'Forbidden',
                error: 'Unknown error'
            });
        }
        next();


    } catch(error){
        console.log(`ARCJET middleware error ${error}`);
        next(error);
    }
}
export default arcjetMiddleware;