const { createLogger, format, transports } = require('winston');
const moment = require('moment');
require('moment-timezone');
require('dotenv').config(); //.env 설정
const fs = require('fs');

const env = process.env.NODE_ENV || "development";
const { combine, label, printf, timestamp } = format;
const logDir = 'log';
const DATE = moment().format("YYYY-MM-DD");

// Log 출력 포맷 지정
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

// 기본 timestamp 대신 확장 timestamp 사용
const appendTimestamp = format((info, opts) => {
    if (opts.tz)
        info.timestamp = moment().tz(opts.tz).format('YYYY-MM-DD HH:mm:ss.SSS Z');
    return info;
});

// log 폴더가 없으면 만듦
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// 파일 출력 옵션 설정
const transport_file = new transports.File({
    name: 'info-file',
    filename: `${logDir}/${DATE}_remindfeedback.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false, // 압축하지 않음
    colorize: false,
    // level: env === "development" ? "debug" : "info",
    level: 'info',
    showLevel: true,
    json: true,
    format: combine(
        label({ label: 'server-test' }),
        appendTimestamp({ tz: 'Asia/Seoul' }),
        myFormat
    ),
    maxsize: process.env.WINSTON_MAXSIZE, // 단위는 바이트
    maxFiles: process.env.WINSTON_MAXFILES // 자동으로 분리되어 생성되는 파일 개수 or 삭제일
});

// 콘솔 출력 옵션 설정
const transport_console = new (transports.Console)({
    name: 'debug-console',
    colorize: true,
    level: 'debug',
    showLevel: true,
    json: true,
    format: combine(
        label({ label: 'server-test' }),
        appendTimestamp({ tz: 'Asia/Seoul' }),
        myFormat
    )
});

// Logger : 로그를 출력하는 객체
// transports : 여러 개의 설정 전보를 전달하는 속성
let logger = new createLogger({
    transports: [
        transport_file,
        transport_console
    ]
});

module.exports = logger;