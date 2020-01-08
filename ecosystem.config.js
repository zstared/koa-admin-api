module.exports = {
    apps: [{
        name: 'xinhong-admin-api',
        script: './dist/app.js',
        'cwd': '/home/xinhong/koa-admin-api',
        'instances': 'max',
        'exec_mode': 'cluster',
        env: {
            'NODE_ENV': 'production',
        }
    }]
};