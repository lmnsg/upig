export const delay = (second, cb) => setTimeout(cb, second * 1000)

/**
 * 不可枚举
 * @param prop
 * @param target
 * @param value
 */
export function def(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: true,
    configurable: true,
    enumerable: false
  })
}
