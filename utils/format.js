exports.formatTimestamp = function (timestamp) {
    console.log("🚀 ~ file: format.js:2 ~ timestamp:", timestamp);
    const hours = timestamp.getHours().toString().padStart(2, '0');
    const minutes = timestamp.getMinutes().toString().padStart(2, '0');
    const seconds = timestamp.getSeconds().toString().padStart(2, '0');
    const day = timestamp.getDate().toString().padStart(2, '0');
    const month = (timestamp.getMonth() + 1).toString().padStart(2, '0');
    const year = timestamp.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
};