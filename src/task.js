require('babel-register');
const s_face = require('./service/face_recognition/face').default;

const program = require('commander');
program
    .version('0.0.1')
    .option('-m, --module <string>', '模块有:face、')
    .option('-t, --type <string>', 'face类型有:neidi、gangtai、rihan、oumei')
    .option('-p, --pages <number>', 'face爬取页数')
    .parse(process.argv);

const run = async () => {

    process.on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    });

    switch (program.module) {
        case 'face':
            try {
                //     /*爬取明星人脸 */
                //     1	内地明星	nedi		
                //     2	港台明星	gangtai		
                //     3	日韩明星	rihan		
                //     4	欧美明星	oumei		
                const face_types = ['neidi', 'gangtai', 'rihan', 'oumei'];
                const { type, pages } = program;
                const type_id = face_types.findIndex(item => item == type);
                await s_face.initMingXingImg(type_id + 1, pages);
            } catch (e) {
                console.log(e);
            }
            break;
        default:
            break;
    }

};

run();