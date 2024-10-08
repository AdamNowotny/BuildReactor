import logger from 'common/logger';
import Rx from 'rx';

export interface StorageChangeEvent<T> {
    oldValue: T;
    newValue: T;
}

const BUFFER_SIZE = 1;

export class Storage<T> {
    public onChanged = new Rx.ReplaySubject<StorageChangeEvent<T>>(BUFFER_SIZE);

    public constructor(
        private readonly options: {
            key: string;
            defaultValue?: T;
        },
    ) {}

    public init = async () => {
        logger.info(`${this.options.key}-storage.init`);
        chrome.storage.onChanged.addListener((changes, namespace) => {
            for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
                if (key === this.options.key) {
                    // prettier-ignore
                    logger.info(`${this.options.key}-storage.onChanged`, changes, namespace);
                    this.onChanged.onNext({ oldValue, newValue });
                }
            }
        });
        const result = await this.get();
        this.onChanged.onNext({ oldValue: result, newValue: result });
        return result;
    };

    public set = async (value: T) => {
        logger.log(`${this.options.key}-storage.set`, value);
        await chrome.storage.local.set({ [this.options.key]: value });
    };

    public get = async (): Promise<T> => {
        return new Promise<T>(resolve => {
            chrome.storage.local.get(this.options.key, value => {
                const item = value[this.options.key];
                if (item) {
                    resolve(item);
                } else {
                    resolve(this.options.defaultValue as T);
                }
            });
        });
    };
}
