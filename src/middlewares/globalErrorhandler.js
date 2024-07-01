 const globalErrorHandler = (err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
      err: err.message
    })
 }

 export default globalErrorHandler;