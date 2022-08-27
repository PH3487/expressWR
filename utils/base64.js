function toUTF8(base64Str){
    var baseObject = Buffer.from(base64Str, 'base64');
    return baseObject.toString('utf-8')
}
module.exports = {
    toUTF8
}