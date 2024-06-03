
 const catchAsync =( requestHandler ) => async (req, res, next) => {
    try {
        return await requestHandler(req, res, next)
    } catch (error) {
        next(error)
    }
};

export default catchAsync;