export const successCode = (res, data, message) => {
    res.status(200).json({
        statusCode: "200",
        message,
        content: data,
    })
}

export const errCode = (res, data, message) => {
    res.status(400).json({
        statusCode: "400",
        message,
        content: data,
    })
}

export const failCode = (res, message) => {
    res.status(500).json({
        statusCode: "500",
        message,
    })
}