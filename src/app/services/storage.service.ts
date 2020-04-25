import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor() {}

    // Store the value
    async store(storageKey: string, value: any) {
        // const encryptedValue = btoa(escape(JSON.stringify(value)));
        const encryptedValue = JSON.stringify(value);
        await Storage.set({
            key: storageKey,
            value: encryptedValue,
        });
    }

    // Get the value
    async get(storageKey: string) {
        try {
            const result = await Storage.get({ key: storageKey });

            if (result.value) {
                // const storedData = JSON.parse(unescape(atob(result.value)));
                const storedData = JSON.parse(result.value);
                return storedData;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async remove(storageKey: string) {
        await Storage.remove({ key: storageKey });
    }

    // Clear storage
    async clear() {
        await Storage.clear();
    }
}
