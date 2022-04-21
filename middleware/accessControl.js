module.exports = async (req, res, next)=> {
    // 如不是 admin，則無權限
    switch (req.user.role) {
        case null:
        case 'user':
            console.log('user!!!');
        case 'guest':
            res.customStatus = 400;
            res.customError = { error: 'unauthorized_client', error_description: '無權限！' };
            break;
    }

    next();
}