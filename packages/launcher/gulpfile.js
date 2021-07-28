const del = require('del');
const { src, series, dest } = require('gulp');

const clean = async () => {
    await del('lib/**');
    await del('es/**');
};

const copyLicense = async () => {
    await src('../../LICENSE').pipe(dest('../../packages/launcher'));
};

exports.clean = clean;

exports.default = series(clean, copyLicense);
