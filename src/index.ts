#!/usr/bin/env node

// https://www.npmjs.com/package/source-map-support
import 'source-map-support/register';
import app from './app';
import { cac } from 'cac';
const cli = cac();

function wrap<T>(fn: { (args?: T): Promise<any> }) {
    return (args) => fn(args).catch((err) => {
        console.error(err);
        process.exit(1);
    });
}

cli.command('sleep <sec>', '指定した秒数スリープします。').action(wrap(async (sec: number) => {
    await app.sleep(sec);
}));

cli.command('exception', '例外を意図的に発生させます。').action(wrap(async () => {
    await app.exception();
}));

cli.command('').action(() => {
    cli.outputHelp();
});

cli.help();
cli.name = 'node-cli';
cli.version('0.0.1');
cli.parse();