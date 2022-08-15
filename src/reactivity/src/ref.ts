import { hasChange, isObject } from "../../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl{
    private _value: any;
    public dep: Set<RefImpl>;
    // 缓存没变成响应式的数据
    private _rawValue: any;

    constructor(value) {
        // 如果是对象类型，需要封装成 reactive
        this._rawValue = value;
        this._value = convert(value);
        this.dep = new Set();
    }

    get value() {
        if(isTracking()) {
            // 收集依赖
            trackEffects(this.dep);
        }
        return this._value;
    }

    set value(newValue) {
        // hasChange 发生改变才会收集依赖并且赋值；具体用 Object.is 取反实现
        // 用新值和 之前没发生改变的数据比较
        if (hasChange(newValue, this._rawValue)) {
            this._rawValue = newValue;
            this._value = convert(newValue);
            // 触发依赖
            triggerEffects(this.dep);
        };
    }
}

function convert(value) {
    return isObject(value) ? reactive(value) : value;
}


export function ref(value) {
    return new RefImpl(value)
}
