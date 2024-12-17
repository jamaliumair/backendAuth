

export default function sendResponse(res,status,msg,error,data) {
        res.status(status).json({
            msg:msg,
            data: data,
            error: error
        })
}
