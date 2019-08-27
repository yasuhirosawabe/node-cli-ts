import util from './components/util';

export default new class {
    async sleep(sec: number) {
        console.log(`sleep ${sec}sec...`);
        await util.sleep(sec * 1000);
        console.log('finish');
    }
    async exception() {
        throw Error('exception');
    }
    close() {
        console.log('close');
    }
}