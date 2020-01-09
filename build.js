const fs = require('fs-extra');

const run = async () => {
    await fs.remove('./dist/asset');
    await fs.copy('./src/asset', './dist/asset');
};

run();