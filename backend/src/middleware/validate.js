export const validateBody = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        if (error.errors) {
            const formattedErrors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
            return res.status(400).json({
                error: 'Validation Error',
                details: formattedErrors
            });
        }
        return res.status(400).json({ error: error.message || 'Invalid input payload' });
    }
};
