export default {
  // mutation 只能接收两个参数，第二个是 payload，当要传多个参数时用对象
  updateCount (state, { num, num2 }) {
    console.log(num2)
    state.count = num
  }
}
