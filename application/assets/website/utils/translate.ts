import Translator from 'bazinga-translator';
global.Translator = Translator;

// @ts-ignore
await import(/* webpackIgnore: true */ "/translations");

export function translate(key: string, ...params: any): string {
    return Translator.trans(key, ...params) || key;
}

export function translatePlural(key: string, amount: number, ...params: any): string {
    return Translator.transChoice(key, amount, { num: amount }, ...params);
}
