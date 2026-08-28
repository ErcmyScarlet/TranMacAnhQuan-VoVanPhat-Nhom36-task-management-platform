const VN_OFFSET_MS = 7 * 60 * 60 * 1000;
function startOfTodayVN() {
    const now = new Date();
    const vnNow = new Date(now.getTime() + VN_OFFSET_MS);
    const vnMidnight = Date.UTC(vnNow.getUTCFullYear(), vnNow.getUTCMonth(), vnNow.getUTCDate());
    return new Date(vnMidnight - VN_OFFSET_MS);
}

function nowVN() {
    return new Date();
}
function formatVN(date) {
    return new Date(date).toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

module.exports = { startOfTodayVN, nowVN, formatVN };