const  removeAt = array => index => array.splice(index, 1);
const  removeItem = array => item => {
    const i = array.indexOf(item);
    if (i >= 0) {
        return removeAt(array)(i);
    }
    return [];
};


export const  Observable = value => {
    const listeners = [];
    const removeListener = listener => removeItem(listeners)(listener);
    const noop = () => undefined;
    return {
        onChange: callback => {
            listeners.push(callback);
            callback(value, value, noop);
        },
        getValue: () => value,
        setValue: newValue => {
            if (value === newValue) return;
            const oldValue = value;
            value = newValue;
            const safeIterate = [...listeners]; // shallow copy as we might change the listeners array while iterating
            safeIterate.forEach(listener => {
                if (value === newValue) { // pre-ordered listeners might have changed this and thus the callback no longer applies
                    listener(value, oldValue, () => removeListener(listener));
                }
            });
        }
    };
}
