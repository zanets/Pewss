import SimController from './SimController.js';


SimController.simulate({
    env: 'workflow',
    generator: 'a',
    scheduler: 'b',
    simulator: 'c',
    platform: 'd',
    argums: '123'
}).then(res => {
    console.error(res);
}).catch(err => {
    console.error('err : '+err);
});
