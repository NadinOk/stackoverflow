

function str_rand() {
    let result       = '';
    let words        = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    let max_position = words.length - 1;
    let position = 0;
    for( let i = 0; i < 10; ++i ) {
        position = Math.floor( Math.random() * max_position );
        result = result + words.substring(position, position + 1);
    }
    return result;

}
module.exports = str_rand